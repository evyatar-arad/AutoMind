import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { VehicleProvider } from "@/contexts/VehicleContext";
import { ToastProvider } from "@/components/ui/toast";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AutoMind — Car Lifecycle Management",
  description:
    "Comprehensive car lifecycle management: service history, AI diagnostics, market value tracking, and garage marketplace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <VehicleProvider>
            <ToastProvider>
              <div className="flex h-screen overflow-hidden bg-background">
                <Sidebar />
                <main className="flex-1 overflow-y-auto bg-background">
                  {children}
                </main>
              </div>
            </ToastProvider>
          </VehicleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
