export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  category_id: number;
  price: number;
  image_url?: string | null;
  stock: number;
};

export type InquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  product_id?: number;
};

export type CartItemPayload = {
  product_id: number;
  quantity: number;
};

export type CodOrderPayload = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  items: CartItemPayload[];
};

export type OrderItem = {
  product_id: number;
  product_name?: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
};

export type Order = {
  id: number;
  status: string;
  payment_method: string;
  total_amount: number;
  created_at?: string | null;
  items: OrderItem[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`API request failed for ${path}`);
  }

  return response.json() as Promise<T>;
}

export function getProducts(params?: { category?: number; search?: string }) {
  const query = new URLSearchParams();
  if (params?.category) query.set("category_id", String(params.category));
  if (params?.search) query.set("search", params.search);
  const qs = query.toString();
  return fetchJson<Product[]>(`/products${qs ? `?${qs}` : ""}`);
}

export function getProductById(id: number) {
  return fetchJson<Product>(`/products/${id}`);
}

export function getCategories() {
  return fetchJson<Category[]>("/categories");
}

export function createInquiry(payload: InquiryPayload) {
  return fetchJson<{ id: number; status: string }>("/inquiries", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function createCodOrder(payload: CodOrderPayload) {
  return fetchJson<{ id: number; status: string; total_amount: number }>("/orders/cod", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getOrderById(orderId: number) {
  return fetchJson<Order>(`/orders/${orderId}`);
}

export function searchOrders(params: { email?: string; phone?: string }) {
  const query = new URLSearchParams();
  if (params.email) query.set("email", params.email);
  if (params.phone) query.set("phone", params.phone);
  return fetchJson<Order[]>(`/orders/search?${query.toString()}`);
}
