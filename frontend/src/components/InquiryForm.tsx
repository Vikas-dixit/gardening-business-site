"use client";

import { FormEvent, useState } from "react";
import { createInquiry } from "@/lib/api";

type InquiryFormProps = {
  productId?: number;
};

export function InquiryForm({ productId }: InquiryFormProps) {
  const [status, setStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setIsSubmitting(true);
    setStatus("");

    try {
      await createInquiry({
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        phone: String(data.get("phone") || ""),
        message: String(data.get("message") || ""),
        product_id: productId
      });
      form.reset();
      setStatus("Thanks! Your inquiry has been submitted.");
    } catch {
      setStatus("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card" style={{ maxWidth: "500px" }}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input className="input" id="name" name="name" required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input className="input" id="email" name="email" type="email" required />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input className="input" id="phone" name="phone" />
      </div>
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea className="textarea" id="message" name="message" rows={4} required />
      </div>
      <button className="btn" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Inquiry"}
      </button>
      {status ? <p style={{ marginTop: "0.8rem" }}>{status}</p> : null}
    </form>
  );
}
