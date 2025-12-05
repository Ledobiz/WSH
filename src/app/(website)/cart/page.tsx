import Footer from "@/src/components/website/Footer"
import HeroBanner from "@/src/components/website/HeroBanner"
import Loading from "@/src/components/website/loading"
import Navbar from "@/src/components/website/Navbar"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Cart - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const Cart = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    return (
        <Suspense fallback={<Loading />}>
            <div id="main-wrapper">
                <Navbar />
                <HeroBanner page="Cart" />

                <section>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 col-md-12">
                                <div className="table-responsive">
                                    <table className="table add_to_cart">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Title</th>
                                                <th scope="col">Price</th>
                                                <th scope="col">Quantity</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className="tb_course_thumb">
                                                        <img
                                                            src={`${appUrl}/assets/img/courses-1.jpg`}
                                                            className="img-fluid"
                                                            alt=""
                                                        />
                                                    </div>
                                                </td>
                                                <th>
                                                    Besic Web Design
                                                    <span className="tb_date text-muted">18 july 2020</span>
                                                </th>
                                                <td>
                                                    <span className="wish_price theme-cl">$149.00</span>
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control qty"
                                                        step={1}
                                                        defaultValue={1}
                                                        title="Qty"
                                                        size={4}
                                                        placeholder=""
                                                        inputMode="numeric"
                                                    />
                                                </td>
                                                <td>
                                                    <a href="#" className="btn btn-remove">
                                                        Remove
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="tb_course_thumb">
                                                        <img
                                                            src={`${appUrl}/assets/img/courses-2.jpg`}
                                                            className="img-fluid"
                                                            alt=""
                                                        />
                                                    </div>
                                                </td>
                                                <th>
                                                    Advance Java Script
                                                    <span className="tb_date text-muted">15 july 2020</span>
                                                </th>
                                                <td>
                                                    <span className="wish_price theme-cl">$129.00</span>
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control qty"
                                                        step={1}
                                                        defaultValue={1}
                                                        title="Qty"
                                                        size={4}
                                                        placeholder=""
                                                        inputMode="numeric"
                                                    />
                                                </td>
                                                <td>
                                                    <a href="#" className="btn btn-remove">
                                                        Remove
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="tb_course_thumb">
                                                        <img
                                                            src={`${appUrl}/assets/img/courses-3.jpg`}
                                                            className="img-fluid"
                                                            alt=""
                                                        />
                                                    </div>
                                                </td>
                                                <th>
                                                    The Computer Science
                                                    <span className="tb_date text-muted">13 july 2020</span>
                                                </th>
                                                <td>
                                                    <span className="wish_price theme-cl">$125.00</span>
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control qty"
                                                        step={1}
                                                        defaultValue={1}
                                                        title="Qty"
                                                        size={4}
                                                        placeholder=""
                                                        inputMode="numeric"
                                                    />
                                                </td>
                                                <td>
                                                    <a href="#" className="btn btn-remove">
                                                        Remove
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="tb_course_thumb">
                                                        <img
                                                            src={`${appUrl}/assets/img/courses-4.jpg`}
                                                            className="img-fluid"
                                                            alt=""
                                                        />
                                                    </div>
                                                </td>
                                                <th>
                                                    Business Analysis
                                                    <span className="tb_date text-muted">12 july 2020</span>
                                                </th>
                                                <td>
                                                    <span className="wish_price theme-cl">$179.00</span>
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control qty"
                                                        step={1}
                                                        defaultValue={1}
                                                        title="Qty"
                                                        size={4}
                                                        placeholder=""
                                                        inputMode="numeric"
                                                    />
                                                </td>
                                                <td>
                                                    <a href="#" className="btn btn-remove">
                                                        Remove
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="tb_course_thumb">
                                                        <img
                                                            src={`${appUrl}/assets/img/courses-5.jpg`}
                                                            className="img-fluid"
                                                            alt=""
                                                        />
                                                    </div>
                                                </td>
                                                <th>
                                                    The Computer Highnext
                                                    <span className="tb_date text-muted">11 july 2020</span>
                                                </th>
                                                <td>
                                                    <span className="wish_price theme-cl">$180.00</span>
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control qty"
                                                        step={1}
                                                        defaultValue={1}
                                                        title="Qty"
                                                        size={4}
                                                        placeholder=""
                                                        inputMode="numeric"
                                                    />
                                                </td>
                                                <td>
                                                    <a href="#" className="btn btn-remove">
                                                        Remove
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                
                                
                                <div className="checkout-coupon d-flex align-items-center justify-content-between flex-wrap gap-2 mt-3">
                                    <div className="checkout_coupon_flex">
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
                                    </div>
                                    <div className="ckt_last">
                                        <form className="form-inline d-flex align-items-center justify-content-start gap-2">
                                            <button type="button" className="btn btn-dark">
                                                Empty cart
                                            </button>
                                            <button type="button" className="btn btn-main disabled">
                                                Update Cart
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
                                                Base price<strong>$140.00</strong>
                                            </li>
                                            <li>
                                                Discount<strong>$10.00</strong>
                                            </li>
                                            <li>
                                                CGST<strong>$10.00</strong>
                                            </li>
                                            <li>
                                                SGST<strong>$10.00</strong>
                                            </li>
                                        </ul>
                                        <div className="flex_cart">
                                            <div className="flex_cart_1">Total Cost</div>
                                            <div className="flex_cart_2">$170.00</div>
                                        </div>
                                        <button type="button" className="btn btn-main w-100">
                                            Proceed To Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </Suspense>
    )
}
export default Cart