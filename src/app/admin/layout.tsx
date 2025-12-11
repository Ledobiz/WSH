import Script from "next/script";
import "../globals.css";
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from "@/src/providers/AuthProvider";
import Navbar from "@/src/components/admin/Navbar";
import Sidebar from "@/src/components/admin/Sidebar";
import Footer from "@/src/components/website/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="author" content="www.ledobiz.com" />
                <link href={`${appUrl}/assets/css/styles.css`} rel="stylesheet" />
                <link href={`${appUrl}/assets/css/colors.css`} rel="stylesheet" />
                <link rel="icon" type="image/svg+xml" href={`${appUrl}/assets/img/logo-icon.png`} />
            </head>
            <body>
                <AuthProvider>
                    <div id="main-wrapper">
                        <Navbar />

                        <section className="bg-gredient p-0">
                            <div className="container-fluid px-0">
                                <div className="ht-200"></div>
                            </div>
                        </section>

                        <section className="pt-4">
                            <div className="container">
                                <div className="row gx-xl-5">
                                    <Sidebar />
                                    {children}
                                </div>
                            </div>
                        </section>
            
                        <Footer />
                    </div>    
                </AuthProvider>
                <ToastContainer style={{padding: 0}} className="p-0 m-0" />

                <Script src={`${appUrl}/assets/js/jquery.min.js`}></Script>
                <Script src={`${appUrl}/assets/js/popper.min.js`}></Script>
                <Script src={`${appUrl}/assets/js/bootstrap.min.js`}></Script>
                <Script src={`${appUrl}/assets/js/select2.min.js`}></Script>
                <Script src={`${appUrl}/assets/js/slick.js`}></Script>
                <Script src={`${appUrl}/assets/js/jquery.counterup.min.js`}></Script>
                <Script src={`${appUrl}/assets/js/counterup.min.js`}></Script>
                <Script src={`${appUrl}/assets/js/custom.js`}></Script>
                <Script src={`${appUrl}/assets/js/course-creation.js`}></Script>
            </body>
        </html>
    );
}
