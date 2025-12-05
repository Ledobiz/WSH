import Footer from "@/src/components/website/Footer"
import HeroBanner from "@/src/components/website/HeroBanner"
import Loading from "@/src/components/website/loading"
import Navbar from "@/src/components/website/Navbar"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Wishlist - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const Wishlist = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    return (
        <Suspense fallback={<Loading />}>
            <div id="main-wrapper">
                <Navbar />
                <HeroBanner page="Wishlist" />

                <section>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 col-lg-12">
                                <div className="table-responsive">
                                    <table className="table table-striped wishlist">
                                        <tbody>
                                            <tr>
                                                <th scope="row">
                                                    <a href="#" className="remove_cart">
                                                        <i className="ti-close" />
                                                    </a>
                                                </th>
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
                                                    The Computer Science of Human Decisions
                                                    <span className="tb_date text-muted">18 july 2020</span>
                                                </th>
                                                <td>
                                                    <span className="wish_price theme-cl">$149.00</span>
                                                </td>
                                                <td>
                                                    <span className="badge bg-green rounded-pill">In Stock</span>
                                                </td>
                                                <td>
                                                    <a href="#" className="btn btn-main">
                                                        Add To Cart
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <a href="#" className="remove_cart">
                                                        <i className="ti-close" />
                                                    </a>
                                                </th>
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
                                                    The Computer Science of Human Decisions
                                                    <span className="tb_date text-muted">15 july 2020</span>
                                                </th>
                                                <td>
                                                    <span className="wish_price theme-cl">$129.00</span>
                                                </td>
                                                <td>
                                                    <span className="badge bg-green rounded-pill">In Stock</span>
                                                </td>
                                                <td>
                                                    <a href="#" className="btn btn-main">
                                                        Add To Cart
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <a href="#" className="remove_cart">
                                                        <i className="ti-close" />
                                                    </a>
                                                </th>
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
                                                    The Computer Science of Human Decisions
                                                    <span className="tb_date text-muted">13 july 2020</span>
                                                </th>
                                                <td>
                                                    <span className="wish_price theme-cl">$125.00</span>
                                                </td>
                                                <td>
                                                    <span className="badge bg-red rounded-pill">
                                                        Out of Stock
                                                    </span>
                                                </td>
                                                <td>
                                                    <a href="#" className="btn btn-red">
                                                        Remove
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <a href="#" className="remove_cart">
                                                        <i className="ti-close" />
                                                    </a>
                                                </th>
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
                                                    The Computer Science of Human Decisions
                                                    <span className="tb_date text-muted">12 july 2020</span>
                                                </th>
                                                <td>
                                                    <span className="wish_price theme-cl">$179.00</span>
                                                </td>
                                                <td>
                                                    <span className="badge bg-green rounded-pill">In Stock</span>
                                                </td>
                                                <td>
                                                    <a href="#" className="btn btn-main">
                                                        Add To Cart
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <a href="#" className="remove_cart">
                                                        <i className="ti-close" />
                                                    </a>
                                                </th>
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
                                                    The Computer Science of Human Decisions
                                                    <span className="tb_date text-muted">11 july 2020</span>
                                                </th>
                                                <td>
                                                    <span className="wish_price theme-cl">$180.00</span>
                                                </td>
                                                <td>
                                                    <span className="badge bg-green rounded-pill">In Stock</span>
                                                </td>
                                                <td>
                                                    <a href="#" className="btn btn-main">
                                                        Add To Cart
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
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
export default Wishlist