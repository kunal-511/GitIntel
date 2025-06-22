import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "GitIntel",
  description: "Analyze and compare open source projects instantly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-neutral-950 text-neutral-100 dark:bg-neutral-950 dark:text-neutral-100 min-h-screen flex flex-col">
        <AuthProvider>
          <ThemeProvider>
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
