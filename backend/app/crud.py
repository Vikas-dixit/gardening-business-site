from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from app import models, schemas


def get_categories(db: Session):
    statement = select(models.Category).order_by(models.Category.name.asc())
    return db.scalars(statement).all()


def get_products(db: Session, category_id: int | None = None, search: str | None = None):
    statement = select(models.Product).order_by(models.Product.name.asc())
    if category_id:
        statement = statement.where(models.Product.category_id == category_id)
    if search:
        statement = statement.where(
            or_(
                models.Product.name.ilike(f"%{search}%"),
                models.Product.description.ilike(f"%{search}%"),
            )
        )
    return db.scalars(statement).all()


def get_product_by_id(db: Session, product_id: int):
    return db.get(models.Product, product_id)


def create_inquiry(db: Session, inquiry_in: schemas.InquiryCreate):
    inquiry = models.Inquiry(**inquiry_in.model_dump())
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry


def create_cod_order(db: Session, order_in: schemas.OrderCreate):
    products_by_id: dict[int, models.Product] = {}
    for item in order_in.items:
        product = get_product_by_id(db, item.product_id)
        if not product:
            raise ValueError(f"Product not found: {item.product_id}")
        if product.stock < item.quantity:
            raise ValueError(f"Insufficient stock for: {product.name}")
        products_by_id[item.product_id] = product

    order = models.Order(
        customer_name=order_in.customer_name,
        customer_email=order_in.customer_email,
        customer_phone=order_in.customer_phone,
        delivery_address=order_in.delivery_address,
        status="placed_cod",
        payment_method="cod",
        total_amount=0,
    )
    db.add(order)
    db.flush()

    total_amount = 0.0
    for item in order_in.items:
        product = products_by_id[item.product_id]
        line_total = product.price * item.quantity
        total_amount += line_total
        db.add(
            models.OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=item.quantity,
                unit_price=product.price,
                line_total=line_total,
            )
        )
        product.stock -= item.quantity

    order.total_amount = total_amount
    db.commit()
    db.refresh(order)
    return order


def get_order_by_id(db: Session, order_id: int):
    statement = (
        select(models.Order)
        .where(models.Order.id == order_id)
        .options(selectinload(models.Order.items).selectinload(models.OrderItem.product))
    )
    return db.scalars(statement).first()


def search_orders(db: Session, email: str | None = None, phone: str | None = None):
    statement = select(models.Order).options(
        selectinload(models.Order.items).selectinload(models.OrderItem.product)
    )
    if email:
        statement = statement.where(models.Order.customer_email == email)
    if phone:
        statement = statement.where(models.Order.customer_phone == phone)
    statement = statement.order_by(models.Order.id.desc())
    return db.scalars(statement).all()
