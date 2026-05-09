"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { createCodOrder } from "@/lib/api";

export function CodCheckoutForm() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (items.length === 0) {
      setStatus("Cart is empty.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    setSubmitting(true);
    setStatus("");
    try {
      const response = await createCodOrder({
        customer_name: String(formData.get("customer_name") || ""),
        customer_email: String(formData.get("customer_email") || ""),
        customer_phone: String(formData.get("customer_phone") || ""),
        delivery_address: String(formData.get("delivery_address") || ""),
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      });
      clearCart();
      setStatus(`Order #${response.id} placed successfully.`);
      event.currentTarget.reset();
      router.push(`/orders/confirmation/${response.id}`);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Unable to place order. Please review stock or try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card" style={{ marginTop: "1rem" }}>
      <h2 className="section-title">Checkout (Cash on Delivery)</h2>
      <p>
        <strong>Order Total:</strong> Rs. {totalAmount.toFixed(2)}
      </p>
      <div className="form-group">
        <label htmlFor="customer_name">Full Name</label>
        <input id="customer_name" name="customer_name" className="input" required />
      </div>
      <div className="form-group">
        <label htmlFor="customer_email">Email</label>
        <input id="customer_email" name="customer_email" type="email" className="input" required />
      </div>
      <div className="form-group">
        <label htmlFor="customer_phone">Phone</label>
        <input id="customer_phone" name="customer_phone" className="input" required />
      </div>
      <div className="form-group">
        <label htmlFor="delivery_address">Delivery Address</label>
        <textarea id="delivery_address" name="delivery_address" className="textarea" rows={3} required />
      </div>
      <button className="btn" type="submit" disabled={submitting}>
        {submitting ? "Placing Order..." : "Place COD Order"}
      </button>
      {status ? <p style={{ marginTop: "0.75rem" }}>{status}</p> : null}
    </form>
  );
}
