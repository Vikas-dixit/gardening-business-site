import Link from "next/link";
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 3);

  return (
    <div>
      <section className="card" style={{ marginBottom: "1rem", background: "var(--green-100)" }}>
        <h1>Grow Better with Green Haven Gardening</h1>
        <p>
          We provide trusted gardening equipment, flowers, pots, soil supplies, and accessories to help your garden thrive.
        </p>
        <Link className="btn" href="/products">
          Explore Products
        </Link>
      </section>

      <section>
        <h2 className="section-title">Featured Products</h2>
        <div className="card-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
