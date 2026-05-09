"use client";

import { useCart } from "@/components/CartProvider";
import { Product } from "@/lib/api";

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <button className="btn" type="button" onClick={() => addToCart(product, 1)}>
      Add to Cart
    </button>
  );
}
