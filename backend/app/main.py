import os

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.db import Base, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Gardening API", version="1.0.0")

frontend_url = os.getenv("FRONTEND_URL", "*")
allow_origins = (
    [origin.strip() for origin in frontend_url.split(",") if origin.strip()]
    if frontend_url != "*"
    else ["*"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/categories", response_model=list[schemas.CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return crud.get_categories(db)


@app.get("/products", response_model=list[schemas.ProductOut])
def list_products(
    category_id: int | None = Query(default=None),
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return crud.get_products(db, category_id=category_id, search=search)


@app.get("/products/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = crud.get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@app.post("/inquiries", response_model=schemas.InquiryOut, status_code=201)
def create_inquiry(payload: schemas.InquiryCreate, db: Session = Depends(get_db)):
    if payload.product_id:
        product = crud.get_product_by_id(db, payload.product_id)
        if not product:
            raise HTTPException(status_code=400, detail="Invalid product_id")

    inquiry = crud.create_inquiry(db, payload)
    return {"id": inquiry.id, "status": "submitted", "created_at": inquiry.created_at}


@app.post("/orders/cod", response_model=schemas.OrderOut, status_code=201)
def create_cod_order(payload: schemas.OrderCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_cod_order(db, payload)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@app.get("/orders/{order_id}", response_model=schemas.OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = crud.get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@app.get("/orders/search", response_model=list[schemas.OrderOut])
def search_orders(
    email: str | None = Query(default=None),
    phone: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    if not email and not phone:
        raise HTTPException(status_code=400, detail="email or phone is required")
    return crud.search_orders(db, email=email, phone=phone)
