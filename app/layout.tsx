import { ThemeProvider } from "@/components/app/ThemeProvider";
import Header from "../components/app/Navbar";

interface RootLayoutProps {
  children: React.ReactNode;
}

import "./globals.css";

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en">
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
