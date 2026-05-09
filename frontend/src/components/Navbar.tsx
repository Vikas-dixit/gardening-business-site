"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/orders", label: "Track Orders" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function Navbar() {
  const { itemCount } = useCart();
  return (
    <header
      style={{
        backgroundColor: "var(--green-900)",
        color: "var(--text-light)",
        padding: "0.9rem 2rem"
      }}
    >
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontWeight: 700 }}>
          Green Haven Gardening
        </Link>
        <div style={{ display: "flex", gap: "1rem" }}>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <Link href="/cart">Cart ({itemCount})</Link>
        </div>
      </nav>
    </header>
  );
}
