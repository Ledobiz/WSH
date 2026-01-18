'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import NavBreadcrumb from "../NavBreadcrumb"
import Loading from "@/src/components/website/loading"
import { getDashboardData } from "@/src/services/admin/dashboard";
import { formatAmount } from "@/src/utils/client_functions";
import { Suspense, useEffect, useState } from "react"
import PageLoader from "../../website/PageLoader";

const AdminDashboard = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const [loading, setLoading] = useState<boolean>(false);
    const [totalCourses, setTotalCourses] = useState<number>(0);
    const [newReviews, setNewReviews] = useState<number>(0);
    const [enrolledStudents, setEnrolledStudents] = useState<number>(0);
    const [topSalesCourses, setTopSalesCourses] = useState<Array<any>>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const result = await getDashboardData();
                console.log('Dashboard data:', result);
                setTotalCourses(result.totalCourses);
                setNewReviews(result.newReviews);
                setEnrolledStudents(result.enrolledStudents);
                setTopSalesCourses(result.topSalesCourses);
            } 
            catch (error) {
                console.error('Error fetching dashboard data:', error);
            } 
            finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="col-lg-9 col-md-12 col-sm-12">
            <NavBreadcrumb page="Dashboard" />
            
            <Suspense fallback={<Loading />}>
                <div className="row gy-3 mb-4">
                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                        <div className="card rounded-3 border px-3 py-4">
                            <div className="d-flex align-items-center gap-3">
                                <div className="square--60 circle bg-light-green fs-3">
                                    <i className="bi bi-laptop text-green" />
                                </div>
                                <div className="d-flex flex-column gap-1">
                                    <h2 className="fw-semibold m-0">{totalCourses}</h2>
                                    <span className="text-muted">Total Courses</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                        <div className="card rounded-3 border px-3 py-4">
                            <div className="d-flex align-items-center gap-3">
                                <div className="square--60 circle bg-light-red fs-3">
                                    <i className="fas fa-user-graduate text-red" />
                                </div>
                                <div className="d-flex flex-column gap-1">
                                    <h2 className="fw-semibold m-0">{enrolledStudents}</h2>
                                    <span className="text-muted">Total Enrolments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                        <div className="card rounded-3 border px-3 py-4">
                            <div className="d-flex align-items-center gap-3">
                                <div className="square--60 circle bg-light-main fs-3">
                                    <i className="bi bi-gem text-main" />
                                </div>
                                <div className="d-flex flex-column gap-1">
                                    <h2 className="fw-semibold m-0">{newReviews}</h2>
                                    <span className="text-muted">New Reviews</span>
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
                                    <h4 className="mb-2 mb-sm-0">Recent 10 Selling Courses</h4>
                                    <a href="#" className="btns text-muted mb-0">
                                        View All
                                    </a>
                                </div>
                            </div>
                            <div className="card-body">
                                { loading ? <PageLoader /> :
                                    <div className="table-responsive border-0 rounded-3">
                                        {!topSalesCourses.length && (
                                            <div className="text-center p-5">
                                                <img
                                                    src={`${appUrl}/assets/img/empty.svg`}
                                                    alt="Empty State"
                                                    className="img-fluid mb-4"
                                                    style={{ maxWidth: 260, opacity: "0.9" }}
                                                />
                                                <h4 className="fw-bold">No Payments Received Yet</h4>
                                            </div>
                                        )}

                                        {topSalesCourses.length > 0 && (
                                            <table className="table align-middle p-4 mb-0">
                                                <thead className="table-dark">
                                                    <tr>
                                                        <th scope="col" className="border-0 rounded-start">Course Name</th>
                                                        <th scope="col" className="border-0">Selling</th>
                                                        <th scope="col" className="border-0">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {topSalesCourses.map((sale) => (
                                                        <tr key={sale.id}>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div className="w-15">
                                                                        <img
                                                                            src={ sale.thumbnail }
                                                                            className="img-fluid rounded"
                                                                            alt={ sale.title }
                                                                        />
                                                                    </div>
                                                                    <h6 className="mb-0 fw-semibold ms-2 table-responsive-title">
                                                                        <a href="#">{ sale.title }</a>
                                                                    </h6>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className="text-muted-2">{ sale._count?.students ?? 0 }</span>
                                                            </td>
                                                            <td>
                                                                <span className="text-muted-2">{ formatAmount(sale.totalSalePrice) }</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </Suspense>
        </div>
    )
}
export default AdminDashboard