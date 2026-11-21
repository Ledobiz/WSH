'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { requireAdmin } from "@/src/lib/auth-guard";
import { Prisma } from "@prisma/client";
import prisma from "@/src/lib/prisma";
import { paginateQuery } from "@/src/utils/pagination";

/*
 * Revenue basis for analytics
 * ---------------------------
 * Revenue is measured in naira from the course prices on the cart linked to each
 * successful payment (Transaction -> Cart.transactionReference -> CartItem.price).
 * CartItem.price is the course's NGN price captured when it was added to the cart, so
 * payments made in any currency are counted in naira without exchange-rate conversion.
 *
 * Known limitations:
 *  - Coupon discounts are not persisted, so coupon purchases count at list price.
 *  - Payments with no linked cart (e.g. manual/app) cannot be priced and are excluded
 *    from revenue; they are reported separately as `unpricedPayments`.
 *
 * Months/years are evaluated in Lagos time (createdAt is stored as UTC).
 */
const LAGOS_CREATED_AT = Prisma.sql`(("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE 'Africa/Lagos')`;

// Successful, non-deleted payments with their Lagos-local timestamp and naira value.
// `revenue` is NULL (and `courses` 0) when the payment has no linked cart items.
const pricedPaymentsCte = Prisma.sql`
    WITH paid AS (
        SELECT t.id, t.reference, ${LAGOS_CREATED_AT} AS local_at
        FROM "Transaction" t
        WHERE t.status = 'success' AND t."deletedAt" IS NULL
    ),
    priced AS (
        SELECT p.id, p.local_at,
               SUM(ci.price) AS revenue,
               COUNT(ci.id) AS courses
        FROM paid p
        LEFT JOIN "Cart" c ON c."transactionReference" = p.reference
        LEFT JOIN "CartItem" ci ON ci."cartId" = c.id
        GROUP BY p.id, p.local_at
    )
`;

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const currentLagosYearMonth = () => {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Africa/Lagos", year: "numeric", month: "numeric" })
        .formatToParts(new Date());
    return {
        year: Number(parts.find((p) => p.type === "year")?.value),
        month: Number(parts.find((p) => p.type === "month")?.value),
    };
};

export const getMonthlyRevenue = async (year?: number) => {
    await requireAdmin();
    const { year: currentYear } = currentLagosYearMonth();
    const selectedYear = Number.isInteger(year) && year! >= 2000 && year! <= currentYear + 1 ? year! : currentYear;

    const emptyMonths = MONTH_LABELS.map((label, i) => ({ month: i + 1, label, revenue: 0, payments: 0, courses: 0 }));

    try {
        const [rows, yearRows] = await Promise.all([
            prisma.$queryRaw<{ month: number; revenue: number; payments: number; courses: number; unpriced: number }[]>(Prisma.sql`
                ${pricedPaymentsCte}
                SELECT EXTRACT(MONTH FROM local_at)::int AS month,
                       COALESCE(SUM(revenue), 0)::float8 AS revenue,
                       COUNT(*) FILTER (WHERE revenue IS NOT NULL)::int AS payments,
                       COALESCE(SUM(courses), 0)::int AS courses,
                       COUNT(*) FILTER (WHERE revenue IS NULL)::int AS unpriced
                FROM priced
                WHERE local_at >= make_timestamp(${selectedYear}::int, 1, 1, 0, 0, 0)
                  AND local_at <  make_timestamp(${selectedYear + 1}::int, 1, 1, 0, 0, 0)
                GROUP BY 1
            `),
            prisma.$queryRaw<{ year: number }[]>(Prisma.sql`
                SELECT DISTINCT EXTRACT(YEAR FROM ${LAGOS_CREATED_AT})::int AS year
                FROM "Transaction"
                WHERE status = 'success' AND "deletedAt" IS NULL
                ORDER BY year DESC
            `),
        ]);

        const months = emptyMonths.map((m) => {
            const row = rows.find((r) => r.month === m.month);
            return row ? { ...m, revenue: Number(row.revenue), payments: row.payments, courses: row.courses } : m;
        });

        const years = yearRows.map((r) => r.year);
        if (!years.includes(currentYear)) years.unshift(currentYear);

        return {
            success: true,
            year: selectedYear,
            years,
            months,
            totals: {
                revenue: months.reduce((sum, m) => sum + m.revenue, 0),
                payments: months.reduce((sum, m) => sum + m.payments, 0),
                courses: months.reduce((sum, m) => sum + m.courses, 0),
            },
            unpricedPayments: rows.reduce((sum, r) => sum + r.unpriced, 0),
        };
    } catch (error) {
        console.log("Error fetching monthly revenue:", error);
        return {
            success: false,
            year: selectedYear,
            years: [currentYear],
            months: emptyMonths,
            totals: { revenue: 0, payments: 0, courses: 0 },
            unpricedPayments: 0,
        };
    }
}

export const getRevenueSummary = async () => {
    await requireAdmin();
    const { year, month } = currentLagosYearMonth();

    try {
        const [row] = await prisma.$queryRaw<{ total: number; this_month: number; payments: number; unpriced: number }[]>(Prisma.sql`
            ${pricedPaymentsCte}
            SELECT COALESCE(SUM(revenue), 0)::float8 AS total,
                   COALESCE(SUM(revenue) FILTER (
                       WHERE local_at >= make_timestamp(${year}::int, ${month}::int, 1, 0, 0, 0)
                         AND local_at <  make_timestamp(${year}::int, ${month}::int, 1, 0, 0, 0) + INTERVAL '1 month'
                   ), 0)::float8 AS this_month,
                   COUNT(*)::int AS payments,
                   COUNT(*) FILTER (WHERE revenue IS NULL)::int AS unpriced
            FROM priced
        `);

        return {
            totalRevenue: Number(row?.total ?? 0),
            revenueThisMonth: Number(row?.this_month ?? 0),
            successfulPayments: row?.payments ?? 0,
            unpricedPayments: row?.unpriced ?? 0,
        };
    } catch (error) {
        console.log("Error fetching revenue summary:", error);
        return { totalRevenue: 0, revenueThisMonth: 0, successfulPayments: 0, unpricedPayments: 0 };
    }
}

export const getDashboardData = async () => {
    await requireAdmin();
    try {
        const totalCourses = await prisma.course.count();
        const newReviews = await prisma.studentReview.count({
            where: {
                isReviewed: false
            }
        });
        const enrolledStudents = await prisma.student.count();

        // Get top 10 selling courses. Criterias are: by number of students enrolled
        const topSalesCourses = await prisma.course.findMany({
            where: { deletedAt: null },
            orderBy: {
                students: { _count: 'desc' }
            },
            take: 10,
            select: {
                id: true,
                title: true,
                slug: true,
                thumbnail: true,
                discountedFee: true,
                _count: {
                    select: { students: true }
                }
            }
        });

        const topSalesWithTotals = topSalesCourses.map((c) => ({
            ...c,
            totalSalePrice: (c._count?.students ?? 0) * c.discountedFee
        }));

        return {
            totalCourses,
            newReviews,
            enrolledStudents,
            topSalesCourses: topSalesWithTotals
        }
    } catch (error) {
        console.log("Error fetching dashboard data:", error);
        return {
            totalCourses: 0,
            newReviews: 0,
            enrolledStudents: 0,
            topSalesCourses: []
        };
    }
}

export const getSalesData = async (page: number = 1, pageSize: number = 20) => {
    await requireAdmin();
    try {
        const totalSale = await prisma.transaction.aggregate({
            _sum: {
                amount: true
            }
        });

        const salesInNumber = await prisma.transaction.count();

        // Total sale this month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const salesThisMonth = await prisma.transaction.aggregate({
            _sum: {
                amount: true
            },
            where: {
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            }
        });

        const transactionHistory = await paginateQuery<any>({
            page,
            pageSize,
            dataQuery: ({ skip, take }) => prisma.transaction.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take,
                include: {
                    carts: {
                        include: {
                            cartItems: {
                                include: {
                                    course: true
                                }
                            }
                        }
                    }
                }
            }),
            countQuery: () => prisma.transaction.count()
        });

        return {
            totalSalesAmount: totalSale._sum.amount || 0,
            salesThisMonth: salesThisMonth._sum.amount || 0,
            salesInNumber: salesInNumber,
            transactionHistory,
        };
    }
    catch (error) {
        console.log("Error fetching sales data:", error);
        return {
            totalSalesAmount: 0,
            salesThisMonth: 0,
            salesInNumber: 0,
            transactionHistory: [],
            pagination: {},
        };
    }
}