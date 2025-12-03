import Link from "next/link";
import Navbar from "../components/website/Navbar"

const appUrl = process.env.APP_URL;

const PageNotFound = () => {
    return (
        <div id="main-wrapper">
            <section className="error-wrap">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-10">
                            <div className="text-center">
                                <img src={`${appUrl}/assets/img/404.png`} className="img-fluid" alt="404 page" />
                                <p>
                                    Sorry! We are unable to locate the page or resource you are trying to get. Please check for the right URL or page and try again.
                                </p>
                                <Link className="btn btn-main px-4" href="/">
                                    Back To Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
export default PageNotFound