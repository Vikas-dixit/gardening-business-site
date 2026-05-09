# Gardening Business Website

Green-themed full-stack website for a gardening business using:
- Frontend: Next.js (App Router, TypeScript)
- Backend: FastAPI
- Database: SQLite

## Project Structure

- `frontend/` - customer-facing storefront UI
- `backend/` - REST API and SQLite data layer

## Features (MVP)

- Home, Products, Product Detail, About, Contact pages
- Product catalog with category and search filters
- Inquiry-first ordering flow (no payment gateway yet)
- Cart with quantity controls
- Checkout with Cash on Delivery (COD)
- Backend APIs for products, categories, and inquiries
- Seed script with starter catalog data

## Backend Setup

1. Create virtual environment and install dependencies:
   - `cd backend`
   - `python -m venv .venv`
   - Windows PowerShell: `.venv\Scripts\Activate.ps1`
   - `pip install -r requirements.txt`
2. Seed initial data:
   - `set PYTHONPATH=.`
   - `python scripts/seed.py`
3. Run API:
   - `set PYTHONPATH=.`
   - `uvicorn app.main:app --reload --port 8000`

## Frontend Setup

1. Install dependencies:
   - `cd frontend`
   - `npm install`
2. Configure env:
   - copy `.env.example` to `.env.local`
3. Run app:
   - `npm run dev`
4. Open:
   - [http://localhost:3000](http://localhost:3000)

## API Endpoints

- `GET /health`
- `GET /categories`
- `GET /products?category_id=&search=`
- `GET /products/{product_id}`
- `POST /inquiries`
- `POST /orders/cod`
- `GET /orders/{order_id}`
- `GET /orders/search?email=&phone=`

Example inquiry payload:

```json
{
  "name": "Aditi",
  "email": "aditi@example.com",
  "phone": "9876543210",
  "message": "Need 20 terracotta pots",
  "product_id": 3
}
```

Example COD order payload:

```json
{
  "customer_name": "Aditi",
  "customer_email": "aditi@example.com",
  "customer_phone": "9876543210",
  "delivery_address": "Flat 4B, Green Residency, Pune",
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 3, "quantity": 1 }
  ]
}
```

## Tests

- Backend: `cd backend && pytest`
- Frontend: `cd frontend && npm run test`

## Deployment (Vercel + Render)

### 1) Deploy Backend to Render

This repo includes `render.yaml` and `backend/Dockerfile` for backend deployment.

1. Push this project to GitHub.
2. In Render, create a new Blueprint service from the repo (Render will read `render.yaml`).
3. Set env vars in Render backend service:
   - `DATABASE_URL=sqlite:///./data/app.db`
   - `FRONTEND_URL=<your-vercel-frontend-url>`
4. Deploy and copy the backend URL, for example:
   - `https://gardening-backend.onrender.com`
5. Seed data once (Render shell):
   - `python scripts/seed.py`

### 2) Deploy Frontend to Vercel

1. Import the same GitHub repo into Vercel.
2. Set **Root Directory** to `frontend`.
3. Add environment variable:
   - `NEXT_PUBLIC_API_BASE_URL=<your-render-backend-url>`
4. Deploy and open your Vercel URL.

### 3) Final CORS setup

After frontend is live, update backend env on Render:
- `FRONTEND_URL=<your-vercel-frontend-url>`

Redeploy backend after changing env vars.

### 4) Verify production

1. Open frontend home/products pages.
2. Add products to cart and place a COD order.
3. Open order confirmation and track orders page.
4. Hit backend health endpoint:
   - `<backend-url>/health`

## Production Notes

- SQLite works for demo/small usage, but Render filesystem can be ephemeral depending on plan.
- For reliable production persistence and concurrency, move to Postgres and set:
  - `DATABASE_URL=postgresql+psycopg://...`
- Current SQLAlchemy setup already supports non-SQLite URLs.
