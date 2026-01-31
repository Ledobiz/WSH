'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCart } from "@/src/providers/CartProvider";
import PageLoader from "./PageLoader";
import { formatAmount } from "@/src/utils/client_functions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/providers/AuthProvider";
import { cartUrl, loginUrl, thankYouUrl } from "@/src/utils/url";
import { toast } from "react-toastify";
import ButtonLoader from "../admin/ButtonLoader";
import { verifyFlutterwaveTransaction, verifyPaystackTransaction } from "@/src/services/website/cart";
import Paystack from '@paystack/inline-js';

const CartPage = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const { cartCourses, totalFees, removeFromCart, isLoaded, clearCart } = useCart();
    const { user } = useAuth();
    const [flutterwavePaymentInProcess, setFlutterwavePaymentInProcess] = useState(false);
    const [paystackPaymentInProcess, setPaystackPaymentInProcess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://checkout.flutterwave.com/v3.js";
        script.async = true;
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        }
    }, []);

    const makePaymentWithFlutterwave = async () => {
        if (!user || user.role != 'student') {
            toast.info('Please log in to proceed to checkout');
            router.push(`${loginUrl}?return=${cartUrl}`);
            return;
        }

        setFlutterwavePaymentInProcess(true);

        const txRef = `wsh_${new Date().getTime()}${Math.floor(Math.random() * 1000000)}`;

        if (typeof window !== 'undefined' && (window as any).FlutterwaveCheckout) {
            const modal = (window as any).FlutterwaveCheckout({
                public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
                tx_ref: txRef,
                amount: totalFees,
                currency: 'NGN',
                payment_options: 'card, ussd, banktransfer, opay, applepay, googlepay',
                meta: {
                    consumer_id: user.id,
                    consumer_email: user.email,
                },
                customer: {
                    email: user.email,
                    phone_number: user.phone || '',
                    name: user.name,
                },
                customizations: {
                    title: 'Women Skills Hub Online Course Payment',
                    description: 'Life changing courses for financial independence',
                    logo: 'https://res.cloudinary.com/asifatkazeem/image/upload/v1766900704/mkk11iymqwpcrkvcmq7o.jpg',
                },
                callback: async function (payment: any) {
                    const response = await verifyFlutterwaveTransaction(payment.transaction_id, user.id);

                    modal.close();
                    setFlutterwavePaymentInProcess(false);

                    if (response.success) {
                        localStorage.setItem('payments-done', 'yes');
                        toast.success('Payment successful! You have been enrolled in the course(s).');
                        router.push(thankYouUrl);
                    }
                    else {
                        toast.error(response.message || 'Payment verification failed. Please contact support.');
                    }
                },
                onclose: function (incomplete: boolean) {
                    if (incomplete === true) {
                        // Record event in analytics
                        setFlutterwavePaymentInProcess(false);
                        toast.error('Payment process was not completed. You may try again.');
                    }
                    modal.close();
                },
            });
        } else {
            toast.error('Payment gateway is not available. Please try again later.');
            setFlutterwavePaymentInProcess(false);
        }
    }

    const makePaymentWithPaystack = async () => {
        if (!user || user.role != 'student') {
            toast.info('Please log in to proceed to checkout');
            router.push(`${loginUrl}?return=${cartUrl}`);
            return;
        }

        setPaystackPaymentInProcess(true);

        const paystackReference = `wsh_${new Date().getTime()}${Math.floor(Math.random() * 1000000)}`;
        
        const paystack = new Paystack();
        paystack.checkout({
            key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
            email: user.email,
            amount: totalFees * 100,
            onSuccess: async (transaction: any) => {
                setPaystackPaymentInProcess(false);

                const response = await verifyPaystackTransaction(paystackReference, user.id);
                if (response.success) {
                    localStorage.setItem('payments-done', 'yes');
                    toast.success('Payment successful! You have been enrolled in the course(s).');
                    router.push(thankYouUrl);
                } else {
                    toast.error(response.message || 'Payment verification failed. Please contact support.');
                }
            },
            onLoad: (response: any) => {
                console.log("onLoad: ", response);
            },
            onCancel: () => {
                toast.error('Payment process was not completed. You may try again.');
                setPaystackPaymentInProcess(false);
            },
            onError: (error: any) => {
                console.log("Error: ", error.message);
                toast.error('Something went wrong. Payment process was not completed, you may try again.');
                setPaystackPaymentInProcess(false);
            }
        });
    }

    return (
        <section>
            <div className="container">
                {!isLoaded ? <PageLoader /> : (
                    cartCourses.length === 0 ? (
                        <div className="text-center p-5">
                            <img
                                src={`${appUrl}/assets/img/empty.svg`}
                                alt="Empty State"
                                className="img-fluid mb-4"
                                style={{ maxWidth: 260, opacity: "0.9" }}
                            />
                            <h4 className="fw-bold">Cart is empty</h4>
                            <p className="text-muted mb-4">
                                You have no course in your cart. Browse courses and add them to your cart to see them here.
                            </p>
                        </div>
                    ) : (
                        <div className="row">
                            <div className="col-lg-8 col-md-12">
                                <div className="table-responsive">
                                    <table className="table add_to_cart">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Title</th>
                                                <th scope="col">Price</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartCourses.map((course, index) => (
                                                <tr key={course.id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div className="tb_course_thumb">
                                                            <img
                                                                src={course.thumbnail}
                                                                className="img-fluid"
                                                                alt={course.title}
                                                            />
                                                        </div>
                                                    </td>
                                                    <th>
                                                        {course.title}
                                                    </th>
                                                    <td>
                                                        <span className="wish_price theme-cl">{ formatAmount(course.discountedFee) }</span>
                                                    </td>
                                                    <td>
                                                        <button onClick={() => removeFromCart(course.id)} className="btn btn-remove">
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* COUPON CODE */}
                                <div className="checkout-coupon d-flex align-items-center justify-content-between flex-wrap gap-2 mt-3">
                                    {/* <div className="checkout_coupon_flex">
                                        <form className="form-inline d-flex align-items-center justify-content-start gap-2">
                                            <input
                                                className="form-control w-50"
                                                type="search"
                                                placeholder="Coupon Code"
                                            />
                                            <button type="button" className="btn btn-main">
                                                Apply Coupon
                                            </button>
                                        </form>
                                    </div> */}
                                    <div className="ckt_last">
                                        <form className="form-inline d-flex align-items-center justify-content-start gap-2">
                                            <button onClick={clearCart} type="button" className="btn btn-danger">
                                                Empty cart
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-12">
                                <div className="cart_totals checkout">
                                    <h4>Billing Summary</h4>
                                    <div className="cart-wrap">
                                        <ul className="cart_list">
                                            <li>
                                                Sub Total<strong>{ formatAmount(totalFees) }</strong>
                                            </li>
                                            <li>
                                                Discount<strong> { formatAmount(0) }</strong>
                                            </li>
                                        </ul>
                                        <div className="flex_cart">
                                            <div className="flex_cart_1">Total Cost</div>
                                            <div className="flex_cart_2">{ formatAmount(totalFees) }</div>
                                        </div>

                                        <p className="mt-3 mb-0">Please select any of the options below to complete your payment</p>

                                        <div className="d-flex gap-3 flex-wrap mt-4">
                                            {/* <button 
                                                onClick={makePaymentWithPaystack} 
                                                disabled={paystackPaymentInProcess} 
                                                type="button" 
                                                className={paystackPaymentInProcess ? 'btn btn-main' : ''}
                                                style={paystackPaymentInProcess ? {} : { padding: '0', background: 'none' }}
                                            >
                                                {paystackPaymentInProcess ? <ButtonLoader color="#6a1b9a" /> : (
                                                    <img src={`${appUrl}/assets/img/paystack.png`} alt="Pay With Paystack" width={170} height={60} />
                                                )}
                                            </button> */}

                                            <button 
                                                onClick={makePaymentWithFlutterwave} 
                                                disabled={flutterwavePaymentInProcess} 
                                                type="button" 
                                                className={flutterwavePaymentInProcess ? 'btn btn-main' : ''}
                                                style={flutterwavePaymentInProcess ? {} : { padding: '0', background: 'none' }}
                                            >
                                                {flutterwavePaymentInProcess ? <ButtonLoader color="#6a1b9a" /> : (
                                                    <img src={`${appUrl}/assets/img/flutterwave.png`} alt="Pay With Flutterwave" width={170} height={60} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
        </section>
    )
}
export default CartPage