import Script from "next/script";
import "./globals.css";
import Loading from "../components/website/loading";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="author" content="www.ledobiz.com" />
        <link href="assets/css/styles.css" rel="stylesheet" />
        <link href="assets/css/colors.css" rel="stylesheet" />
        <link rel="icon" type="image/svg+xml" href="assets/img/logo-icon.png"></link>
      </head>
      <body>
        <Loading />

        {children}

        <Script src="assets/js/jquery.min.js"></Script>
        <Script src="assets/js/popper.min.js"></Script>
        <Script src="assets/js/bootstrap.min.js"></Script>
        <Script src="assets/js/select2.min.js"></Script>
        <Script src="assets/js/slick.js"></Script>
        <Script src="assets/js/jquery.counterup.min.js"></Script>
        <Script src="assets/js/counterup.min.js"></Script>
        <Script src="assets/js/custom.js"></Script>
      </body>
    </html>
  );
}
