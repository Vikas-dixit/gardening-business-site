from app.db import Base, SessionLocal, engine
from app.models import Category, Product


def run_seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Category).count() > 0:
            return

        categories = [
            Category(name="Tools"),
            Category(name="Flowers"),
            Category(name="Pots"),
            Category(name="Soil & Fertilizer"),
        ]
        db.add_all(categories)
        db.flush()

        products = [
            Product(
                name="Garden Trowel",
                description="Durable steel trowel for planting and potting.",
                category_id=categories[0].id,
                price=249.0,
                stock=60,
            ),
            Product(
                name="Rose Plant (Red)",
                description="Healthy nursery-grown rose plant ready for transplant.",
                category_id=categories[1].id,
                price=399.0,
                stock=45,
            ),
            Product(
                name="Terracotta Pot 10 inch",
                description="Classic breathable clay pot for indoor and outdoor use.",
                category_id=categories[2].id,
                price=299.0,
                stock=80,
            ),
            Product(
                name="Organic Compost Mix",
                description="Nutrient-rich compost mix for better root development.",
                category_id=categories[3].id,
                price=199.0,
                stock=120,
            ),
        ]
        db.add_all(products)
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
