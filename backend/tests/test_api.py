from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db import Base, get_db
from app.main import app
from app.models import Category, Product

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def setup_module():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    category = Category(name="Tools")
    db.add(category)
    db.flush()
    db.add(
        Product(
            name="Test Spade",
            description="Useful garden spade",
            category_id=category.id,
            price=499.0,
            stock=10,
        )
    )
    db.commit()
    db.close()


def teardown_module():
    Base.metadata.drop_all(bind=engine)


def test_get_products():
    response = client.get("/products")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1


def test_create_inquiry():
    response = client.post(
        "/inquiries",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "phone": "9999999999",
            "message": "Need availability details.",
            "product_id": 1,
        },
    )
    assert response.status_code == 201
    assert response.json()["status"] == "submitted"


def test_create_cod_order():
    response = client.post(
        "/orders/cod",
        json={
            "customer_name": "COD Buyer",
            "customer_email": "buyer@example.com",
            "customer_phone": "9876543210",
            "delivery_address": "123 Green Street",
            "items": [{"product_id": 1, "quantity": 2}],
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert body["payment_method"] == "cod"
    assert body["status"] == "placed_cod"
    assert body["total_amount"] == 998.0
    assert len(body["items"]) == 1


def test_get_order_by_id():
    response = client.get("/orders/1")
    assert response.status_code == 200
    assert response.json()["id"] == 1


def test_search_orders():
    response = client.get("/orders/search?email=buyer@example.com")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
