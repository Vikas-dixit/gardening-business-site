"use client";

import { CodCheckoutForm } from "@/components/CodCheckoutForm";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalAmount } = useCart();

  return (
    <div>
      <h1 className="section-title">Your Cart</h1>
      {items.length === 0 ? (
        <div className="card">Your cart is empty. Add products to place a COD order.</div>
      ) : (
        <>
          <div className="card">
            {items.map((item) => (
              <div
                key={item.product_id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.4fr 0.8fr 0.8fr 0.8fr",
                  gap: "0.5rem",
                  alignItems: "center",
                  marginBottom: "0.7rem"
                }}
              >
                <span>{item.name}</span>
                <span>Rs. {item.price.toFixed(2)}</span>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  className="input"
                  onChange={(event) => updateQuantity(item.product_id, Number(event.target.value))}
                />
                <button className="btn" type="button" onClick={() => removeFromCart(item.product_id)}>
                  Remove
                </button>
              </div>
            ))}
            <p>
              <strong>Total:</strong> Rs. {totalAmount.toFixed(2)}
            </p>
          </div>
          <CodCheckoutForm />
        </>
      )}
    </div>
  );
}
