import Link from "next/link";

interface HerobannerProps {
    page: string;
}

const HeroBanner = ({page}: HerobannerProps) => {
    return (
        <section className="bg-light page-title">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 col-md-12">
                        <div className="breadcrumb m-0">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb simple">
                                    <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">{page}</li>
                                </ol>
                            </nav>
                        </div>
                        <div className="pageTitle-wrap">
                            <h1 className="text-dark">{page}</h1>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default HeroBanner