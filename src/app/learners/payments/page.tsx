'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import Navbar from "@/src/components/dashboard/Navbar";
import NavBreadcrumb from "@/src/components/dashboard/NavBreadcrumb";
import Sidebar from "@/src/components/dashboard/Sidebar";
import Footer from "@/src/components/website/Footer";
import Loading from "@/src/components/website/loading";
import PageLoader from "@/src/components/website/PageLoader";
import { useAuth } from "@/src/providers/AuthProvider";
import { paymentHistory } from "@/src/services/student/payment";
import { formatAmount, formatDate } from "@/src/utils/client_functions";
import { Suspense, useEffect, useState } from "react";

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

const ProfilePage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [payments, setPayments] = useState<any[]>([]);

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const response = await paymentHistory(user?.id)

                if (response && response.success) {
                    setPayments(response.transactions);
                }
            } 
            catch (error) {
                console.log('Error fetching payment history', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchPaymentHistory();
    }, [user]);

    return (
        <>    
            <Navbar />

            <section
                className="bg-cover p-0"
                style={{ background: `url(${appUrl}/assets/img/student-bg.jpg)no-repeat` }}
                data-overlay={4}
            >
                <div className="container-fluid px-0">
                    <div className="ht-250" />
                </div>
            </section>

            <section className="pt-4">
                <div className="container">
                    <div className="row gx-xl-5">
                        <Sidebar />

                        <div className="col-lg-9 col-md-12 col-sm-12">
                            <NavBreadcrumb page="Payment History" />
                            
                            <Suspense fallback={<Loading />}>
                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="card bg-transparent border rounded-3">
                                            <div className="card-header bg-transparent border-bottom">
                                                <h4 className="mb-2 mb-sm-0">Payment history</h4>
                                            </div>
                                            <div className="card-body">
                                                <div className="table-responsive border-0">
                                                    {loading ? <PageLoader /> : (
                                                        !payments.length ?
                                                            <div className="text-center p-5">
                                                                <img
                                                                    src={`${appUrl}/assets/img/empty.svg`}
                                                                    alt="Empty State"
                                                                    className="img-fluid mb-4"
                                                                    style={{ maxWidth: 260, opacity: "0.9" }}
                                                                />
                                                                <h4 className="fw-bold">No payments found</h4>
                                                                <p className="text-muted mb-4">
                                                                    You have not made any payments yet.
                                                                </p>
                                                            </div>
                                                        :
                                                        <table className="table align-middle p-4 mb-0">
                                                            <thead className="table-dark">
                                                                <tr>
                                                                    <th scope="col" className="border-0 rounded-start">
                                                                        Date
                                                                    </th>
                                                                    <th scope="col" className="border-0">
                                                                        Course Name
                                                                    </th>
                                                                    <th scope="col" className="border-0">
                                                                        Payment Method
                                                                    </th>
                                                                    <th scope="col" className="border-0">
                                                                        Status
                                                                    </th>
                                                                    <th scope="col" className="border-0">
                                                                        Total
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {payments.map((transaction, index) => (
                                                                    <tr key={transaction.id}>
                                                                        <td>{ formatDate(transaction.createdAt) }</td>
                                                                        <td>
                                                                            <h6 className="mt-2 mt-lg-0 mb-0">
                                                                                <a href="#">{formatCourses(transaction)}</a>
                                                                            </h6>
                                                                        </td>
                                                                        <td>
                                                                            <img src={decideCard(transaction.cardBrand.toLowerCase())} className="w-12" alt="" />
                                                                            <span className="ms-2">****{transaction.last4Digits}</span>
                                                                        </td>
                                                                        <td>
                                                                            <span className={`badge bg-opacity-10 ${decideBadge(transaction.status)}`}>
                                                                                {transaction.status.toUpperCase()}
                                                                            </span>
                                                                        </td>
                                                                        <td>{ formatAmount(transaction.amount) }</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Suspense>
                        </div>
                    </div>
                </div>
            </section>
            
            <Footer />
        </>
    )
}
export default ProfilePage