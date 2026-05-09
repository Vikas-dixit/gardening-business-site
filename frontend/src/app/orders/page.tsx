"use client";

import { FormEvent, useState } from "react";
import { Order, searchOrders } from "@/lib/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();

    if (!email && !phone) {
      setMessage("Please enter email or phone.");
      setOrders([]);
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const response = await searchOrders({ email: email || undefined, phone: phone || undefined });
      setOrders(response);
      if (response.length === 0) {
        setMessage("No orders found.");
      }
    } catch {
      setMessage("Unable to fetch orders right now.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="section-title">Track Your Orders</h1>
      <form onSubmit={onSearch} className="card">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="input" />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" className="input" />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Searching..." : "Search Orders"}
        </button>
      </form>

      {message ? <p style={{ marginTop: "1rem" }}>{message}</p> : null}

      {orders.length > 0 ? (
        <div style={{ marginTop: "1rem" }}>
          {orders.map((order) => (
            <article key={order.id} className="card" style={{ marginBottom: "0.8rem" }}>
              <p>
                <strong>Order:</strong> #{order.id}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Total:</strong> Rs. {order.total_amount.toFixed(2)}
              </p>
              <ul>
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.product_id}-${item.quantity}`}>
                    {(item.product_name || `Product #${item.product_id}`)} x {item.quantity} - Rs.{" "}
                    {item.line_total.toFixed(2)}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
