import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import ProductList from "../ProductList/ProductList";
import { useState } from "react";
import { CartItem } from "../interfaces/CartItem";
import { Products } from "../interfaces/Products";
import mockResponse from "../assets/products.json";

const dataUrl = "https://raw.githubusercontent.com/larsthorup/checkout-data/main/product-v2.json";

const TestComponent = () => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [productList, setList] = useState<Products>({});
    return (
        <ProductList items={items} setItems={setItems} setList={setList}/>
    );
};

describe(ProductList.name, () => {
    beforeEach(async () => {
        const mockFetch = vi
            .spyOn(window, "fetch")
            .mockImplementation(async (url: RequestInfo | URL) => {
                if (url === dataUrl) {
                    return {
                        json: async () => mockResponse,
                        ok: true,
                    } as Response;
                } else {
                    return {} as Response;
                }
            });
        render(<TestComponent />);
        await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(dataUrl));
        expect(screen.queryByText("Produkter loader...")).not.toBeInTheDocument();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("Page has products", () => {
        expect(screen.getAllByLabelText(/Produkt /)).toHaveLength(29);
    });

    it("Product has information", () => {
        const product = screen.getByLabelText("Produkt D-vitamin, 90ug, 120 stk");
        expect(product).toBeInTheDocument();
        expect(product).toHaveTextContent(/D-vitamin, 90ug, 120 stk/);
        expect(product).toHaveTextContent(/116.00 DKK/);
        expect(product).toHaveTextContent(/Køb for 3 Stk \(Spar 10%\)/);
        expect(product).toHaveTextContent(/Læg i inkøbskurv/);
    });
});