import { Toaster } from "sonner";
import "./globals.css";
import QueryProvider from "@/providers/queryProvider";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-background text-text">
        <QueryProvider>
          <div className="flex flex-1 flex-col ">{children}</div>
          <Footer />
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
