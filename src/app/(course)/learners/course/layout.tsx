import "../../../globals.css";

import { Toaster } from "@/src/components/ui/toaster";
import { Toaster as Sonner } from "@/src/components/ui/sonner";
import { TooltipProvider } from "@/src/components/ui/tooltip";

import { CartProvider } from "@/src/providers/CartProvider";
import { AuthProvider } from "@/src/providers/AuthProvider";
import { SidebarProvider } from "@/src/providers/StudentSidebarProvider";

const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
const wshLogo = `${appUrl}/assets/img/wsh-logo-light.jpeg`;

const CourseLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <head>
        <meta name="author" content="www.womenskillshub.com" />
        <link rel="icon" type="image/svg+xml" href={wshLogo}></link>
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@WSH" />
        <meta name="twitter:image" content={wshLogo} />
        <meta property="og:title" content="Dashboard" />
        <meta name="twitter:title" content="Dashboard" />
        <meta property="og:description" content="Empowering women with practical, income-generating skills. Learn baking, mixology, paper crafts and more at your own pace." />
        <meta name="twitter:description" content="Empowering women with practical, income-generating skills. Learn baking, mixology, paper crafts and more at your own pace." />
        <meta property="og:image" content={wshLogo} />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <SidebarProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />

                {children}
              </TooltipProvider>
            </SidebarProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
export default CourseLayout