import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/ProductCard";

describe("ProductCard", () => {
  it("renders basic product data", () => {
    render(
      <ProductCard
        product={{
          id: 1,
          name: "Test Pot",
          description: "A durable pot for indoor plants",
          category_id: 2,
          price: 250,
          stock: 15
        }}
      />
    );

    expect(screen.getByText("Test Pot")).toBeInTheDocument();
    expect(screen.getByText(/durable pot/i)).toBeInTheDocument();
    expect(screen.getByText(/250.00/i)).toBeInTheDocument();
  });
});
