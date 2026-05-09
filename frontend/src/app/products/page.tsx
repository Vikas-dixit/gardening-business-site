import Link from "next/link";
import { getCategories, getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

type ProductsPageProps = {
  searchParams?: Promise<{ category?: string; search?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = (await searchParams) || {};
  const categoryId = params.category ? Number(params.category) : undefined;
  const search = params.search || "";
  const [products, categories] = await Promise.all([
    getProducts({ category: categoryId, search: search || undefined }),
    getCategories()
  ]);

  return (
    <div>
      <h1 className="section-title">Products</h1>
      <form method="GET" className="card" style={{ marginBottom: "1rem" }}>
        <div className="form-group">
          <label htmlFor="search">Search</label>
          <input className="input" id="search" name="search" defaultValue={search} />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select className="select" id="category" name="category" defaultValue={categoryId ?? ""}>
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button className="btn" type="submit">
          Apply Filters
        </button>
        <Link href="/products" style={{ marginLeft: "0.8rem" }}>
          Reset
        </Link>
      </form>
      <div className="card-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
