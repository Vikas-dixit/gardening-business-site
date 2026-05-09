import Link from "next/link";
import { Product } from "@/lib/api";
import { AddToCartButton } from "@/components/AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>
        <strong>Price:</strong> Rs. {product.price.toFixed(2)}
      </p>
      <p>
        <strong>Stock:</strong> {product.stock}
      </p>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Link className="btn" href={`/products/${product.id}`}>
          View Details
        </Link>
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}
