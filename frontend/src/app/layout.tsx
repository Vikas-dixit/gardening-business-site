import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Green Haven Gardening",
  description: "Gardening equipment, flowers, pots, and more."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <main className="page-container">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
