'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import NavBreadcrumb from "../NavBreadcrumb"
import { getSalesData } from "@/src/services/admin/dashboard";
import { formatAmount } from "@/src/utils/client_functions";
import Pagination from "@/src/components/admin/Pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PageLoader from "@/src/components/website/PageLoader";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

const decideCard = (brand: string) => {
    switch (brand) {
        case 'mastercard':
            return `${appUrl}/assets/img/card-1.png`;
        case 'visa':
            return `${appUrl}/assets/img/card-2.png`;
        default:
            return `${appUrl}/assets/img/card-5.png`;
    }
}

const decideBadge = (status: string) => {
    switch (status) {
        case 'success':
            return 'bg-success text-success';
        case 'failed':
            return 'bg-danger text-danger';
        default:
            return 'bg-info text-info';
    }
}

const formatCourses = (transaction: any) => {
    const courses: string[] = [];
    transaction.carts.forEach((cart: any) => {
        cart.cartItems.forEach((item: any) => {
            if (item.course) {
                courses.push(item.course.title);
            }
        });   
    });
    return courses.join(', ');
}

const EarningPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [salesThisMonth, setSalesThisMonth] = useState<number>(0);
    const[totalSales, setTotalSales] = useState<number>(0);
    const[numberOfSales, setNumberOfSales] = useState<number>(0);
    const [saleHistory, setSaleHistory] = useState<Array<any>>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalEntries, setTotalEntries] = useState(0);

    const { replace } = useRouter();
    const pathName = usePathname();

    const pageSize = 20; // Items per page

    const searchParams = useSearchParams()
    const currentPage = Number(searchParams.get('page')) || 1;

    // 2. Function to update the URL
    const handleUrlChange = (name: string, value: string | number) => {
        const params = new URLSearchParams(searchParams);
        
        if (value) {
            params.set(name, value.toString().trim());
        } else {
            params.delete(name);
        }

        replace(`${pathName}?${params.toString()}`);
    };

    useEffect(() => {
        const fetchSalesData = async () => {
            setLoading(true);

            try {
                const result = await getSalesData(currentPage, pageSize);
                setSalesThisMonth(result.salesThisMonth);
                setTotalSales(result.totalSalesAmount);
                setNumberOfSales(result.salesInNumber);
                if (result.transactionHistory && 'data' in result.transactionHistory && Array.isArray(result.transactionHistory.data)) {
                    setSaleHistory(result.transactionHistory.data);
                } else {
                    console.error('Unexpected transactionHistory format:', result.transactionHistory);
                }
                if (Array.isArray(result.transactionHistory) && result.transactionHistory.length > 0) {
                    console.error('Unexpected transactionHistory format:', result.transactionHistory);
                } else if ('pagination' in result.transactionHistory) {
                    setTotalPages(result.transactionHistory.pagination.totalPages);
                    setTotalEntries(result.transactionHistory.pagination.totalCount);
                }
            }
            catch (error) {
                console.error('Error fetching sales data:', error);
            }
            finally {
                setLoading(false);
            }
        }

        fetchSalesData();
    }, [currentPage, pageSize]);

    return (
        <div className="col-lg-9 col-md-12 col-sm-12">
            <NavBreadcrumb page="Earnings" />
            
            <div className="row gy-3 mb-4">
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                    <div className="card rounded-3 border px-3 py-4">
                        <div className="d-flex align-items-center gap-3">
                            <div className="square--60 circle bg-light-green fs-3">
                                <i className="bi bi-coin text-green" />
                            </div>
                            <div className="d-flex flex-column gap-1">
                                <h2 className="fw-semibold m-0">{formatAmount(salesThisMonth)}</h2>
                                <span className="text-muted">Sales This Month</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                    <div className="card rounded-3 border px-3 py-4">
                        <div className="d-flex align-items-center gap-3">
                            <div className="square--60 circle bg-light-red fs-3">
                                <i className="bi bi-wallet2 text-red" />
                            </div>
                            <div className="d-flex flex-column gap-1">
                                <h2 className="fw-semibold m-0">{numberOfSales}</h2>
                                <span className="text-muted">Number of Sales</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                    <div className="card rounded-3 border px-3 py-4">
                        <div className="d-flex align-items-center gap-3">
                            <div className="square--60 circle bg-light-main fs-3">
                                <i className="bi bi-piggy-bank text-main" />
                            </div>
                            <div className="d-flex flex-column gap-1">
                                <h2 className="fw-semibold m-0">{formatAmount(totalSales)}</h2>
                                <span className="text-muted">Sales Overall</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="card border bg-transparent rounded-3">
                        <div className="card-header border-bottom">
                            <div className="d-flex align-items-center justify-content-between w-100">
                                <h4 className="mb-2 mb-sm-0">Recent Courses Sold</h4>
                            </div>
                        </div>
                        
                        <div className="card-body">
                            {loading ? <PageLoader /> : (
                                <>
                                    <div className="table-responsive border-0 rounded-3">
                                        {!saleHistory.length && (
                                            <div className="text-center p-5">
                                                <img
                                                    src={`${appUrl}/assets/img/empty.svg`}
                                                    alt="Empty State"
                                                    className="img-fluid mb-4"
                                                    style={{ maxWidth: 260, opacity: "0.9" }}
                                                />
                                                <h4 className="fw-bold">No course has been sold yet</h4>
                                            </div>
                                        )}

                                        { saleHistory.length > 0 && (
                                            <table className="table align-middle p-4 mb-0">
                                                <thead className="table-dark">
                                                    <tr>
                                                        <th scope="col" className="border-0 rounded-start">
                                                            Course Name
                                                        </th>
                                                        <th scope="col" className="border-0">
                                                            Payment Method
                                                        </th>
                                                        <th scope="col" className="border-0">
                                                            Amount
                                                        </th>
                                                        <th scope="col" className="border-0">
                                                            Status
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {saleHistory.map((sale) => (
                                                        <tr key={sale.id}>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <h6 className="mb-0 fw-semibold ms-2 table-responsive-title">
                                                                        <a href="#">{formatCourses(sale)}</a>
                                                                    </h6>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <img src={decideCard(sale.cardBrand.toLowerCase())} className="w-12" alt="" />
                                                                <span className="ms-2">****{sale.last4Digits}</span>
                                                            </td>
                                                            <td>
                                                                <span className="text-muted-2">{ formatAmount(sale.amount) }</span>
                                                            </td>
                                                            <td>
                                                                <span className={`badge bg-opacity-10 ${decideBadge(sale.status)}`}>
                                                                    {sale.status.toUpperCase()}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )) }
                                                </tbody>
                                            </table>
                                        )}
                                    </div>

                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        totalEntries={totalEntries}
                                        pageSize={pageSize}
                                        onPageChange={(page) => handleUrlChange('page', page)}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default EarningPage