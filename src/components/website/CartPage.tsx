'use client';

import { useCart } from "@/src/providers/CartProvider";
import PageLoader from "./PageLoader";
import { formatAmount } from "@/src/utils/client_functions";

const CartPage = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const { cartCourses, totalFees, removeFromCart, isLoaded, clearCart } = useCart();

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
                                                        <span className="wish_price theme-cl">{ formatAmount(course.originalFee) }</span>
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
                                                Discount<strong>- { formatAmount(0) }</strong>
                                            </li>
                                        </ul>
                                        <div className="flex_cart">
                                            <div className="flex_cart_1">Total Cost</div>
                                            <div className="flex_cart_2">{ formatAmount(totalFees) }</div>
                                        </div>
                                        <button type="button" className="btn btn-main w-100">
                                            Proceed To Checkout
                                        </button>
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