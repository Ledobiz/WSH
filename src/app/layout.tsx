import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/src/providers/AuthProvider";
import { ToastContainer } from 'react-toastify';
import { SidebarProvider } from "@/src/providers/StudentSidebarProvider";

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
        <link rel="icon" type="image/svg+xml" href={`${appUrl}/assets/img/wsh-logo-light.jpeg`}></link>
      </head>
      <body>
        <AuthProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
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
      </body>
    </html>
  );
}
