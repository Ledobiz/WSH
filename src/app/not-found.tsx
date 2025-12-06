import Link from "next/link";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

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
                                    Sorry, the page you are looking for could not be found. It's just an accident that was not intentional.
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