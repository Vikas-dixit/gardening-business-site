import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/api";

type ConfirmationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { id } = await params;
  const orderId = Number(id);
  if (Number.isNaN(orderId)) {
    notFound();
  }

  try {
    const order = await getOrderById(orderId);
    return (
      <div className="card">
        <h1 className="section-title">Order Confirmed</h1>
        <p>
          Your COD order <strong>#{order.id}</strong> has been placed.
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Total:</strong> Rs. {order.total_amount.toFixed(2)}
        </p>
        <h2>Items</h2>
        <ul>
          {order.items.map((item) => (
            <li key={`${item.product_id}-${item.quantity}`}>
              {(item.product_name || `Product #${item.product_id}`)} x {item.quantity} - Rs.{" "}
              {item.line_total.toFixed(2)}
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem" }}>
          <Link className="btn" href="/products">
            Continue Shopping
          </Link>
          <Link className="btn" href="/orders">
            Track Orders
          </Link>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
