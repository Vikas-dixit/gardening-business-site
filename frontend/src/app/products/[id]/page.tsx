import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { InquiryForm } from "@/components/InquiryForm";
import { getProductById } from "@/lib/api";

type ProductDetailsProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailsPage({ params }: ProductDetailsProps) {
  const { id } = await params;
  const productId = Number(id);
  if (Number.isNaN(productId)) {
    notFound();
  }

  try {
    const product = await getProductById(productId);
    return (
      <div>
        <h1 className="section-title">{product.name}</h1>
        <article className="card" style={{ marginBottom: "1rem" }}>
          <p>{product.description}</p>
          <p>
            <strong>Price:</strong> Rs. {product.price.toFixed(2)}
          </p>
          <p>
            <strong>Available stock:</strong> {product.stock}
          </p>
          <AddToCartButton product={product} />
        </article>
        <h2 className="section-title">Interested in this product?</h2>
        <InquiryForm productId={product.id} />
      </div>
    );
  } catch {
    notFound();
  }
}
