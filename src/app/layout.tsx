import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/src/providers/AuthProvider";
import { Toaster } from "@/src/components/ui/toaster";
import { Toaster as Sonner } from "@/src/components/ui/sonner";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import { CartProvider } from "@/src/providers/CartProvider";
import FacebookPixel from "@/src/components/Metadata/FacebookPixel";
import TiktokPixel from "@/src/components/Metadata/TiktokPixel";
import ScrollToTop from "@/src/components/website/ScrollToTop";
import SupportWidget from "@/src/components/support/SupportWidget";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	const appUrl = process.env.NEXT_PUBLIC_APP_URL;

	return (
		<html lang="en">
			<head>
				<meta name="author" content="www.womenskillshub.com" />
				<link rel="icon" type="image/svg+xml" href={`${appUrl}/assets/img/wsh-logo-light.jpeg`}></link>
				
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@WSH" />
				<meta name="twitter:image" content={`${appUrl}/assets/img/wsh-logo-light.jpeg`} />
				<meta property="og:title" content="Women Skills Hub - Master New Skills With Expert-Led Courses" />
				<meta name="twitter:title" content="Women Skills Hub - Master New Skills With Expert-Led Courses" />
				<meta property="og:description" content="Empowering women with practical, income-generating skills. Learn baking, mixology, paper crafts and more at your own pace." />
				<meta name="twitter:description" content="Empowering women with practical, income-generating skills. Learn baking, mixology, paper crafts and more at your own pace." />
				<meta property="og:image" content={`${appUrl}/assets/img/wsh-logo-light.jpeg`} />
			</head>
			<body>
				<AuthProvider>
					<CartProvider>
						<TooltipProvider>
							<Toaster />
							<Sonner />
							<ToastContainer position="top-right" autoClose={4000} newestOnTop theme="colored" />


							{children}

							<SupportWidget />
							<ScrollToTop />
						</TooltipProvider>
					</CartProvider>
				</AuthProvider>

				<FacebookPixel />
        		<TiktokPixel />
			</body>
		</html>
	);
}
