from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class CategoryOut(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class ProductOut(BaseModel):
    id: int
    name: str
    description: str
    category_id: int
    price: float
    image_url: str | None = None
    stock: int

    model_config = ConfigDict(from_attributes=True)


class InquiryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=40)
    message: str = Field(min_length=5, max_length=2000)
    product_id: int | None = None


class InquiryOut(BaseModel):
    id: int
    status: str
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(ge=1, le=1000)


class OrderCreate(BaseModel):
    customer_name: str = Field(min_length=1, max_length=120)
    customer_email: EmailStr
    customer_phone: str = Field(min_length=7, max_length=40)
    delivery_address: str = Field(min_length=5, max_length=500)
    items: list[OrderItemCreate] = Field(min_length=1)


class OrderItemOut(BaseModel):
    product_id: int
    product_name: str | None = None
    quantity: int
    unit_price: float
    line_total: float

    model_config = ConfigDict(from_attributes=True)


class OrderOut(BaseModel):
    id: int
    status: str
    payment_method: str
    total_amount: float
    created_at: datetime | None = None
    items: list[OrderItemOut]

    model_config = ConfigDict(from_attributes=True)
