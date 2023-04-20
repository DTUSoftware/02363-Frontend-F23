import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ShoppingList from "../ShoppingList/ShoppingList";
import userEvent from "@testing-library/user-event";
import mockData from "../assets/products.json";
import { CartItem } from "../interfaces/CartItem";
import { useState } from "react";
import { Products } from "../interfaces/Products";

const TestComponent = () => {
    const products: Products = {};
    mockData.forEach((x) => (products[x.id] = x));
    const [items, setItems] = useState<CartItem[]>([]);
    return (
        <ShoppingList
            items={items}
            setItems={setItems}
            productList={products}
        />
    );
};

describe(ShoppingList.name, () => {
    beforeEach(async () => {
        render(<TestComponent />);
        expect(screen.queryByText("Din kurv er tom!")).not.toBeInTheDocument();
    });

    it("Should render title", () => {
        expect(screen.getByText("Din indkøbskurv")).toBeInTheDocument();
    });

    it("User can see list of items", () => {
        expect(screen.getAllByRole("row", {name: /pris/i})).toHaveLength(3);
        expect(
            screen.getByText("C-vitamin, 500mg, 200 stk")
        ).toBeInTheDocument();
        expect(screen.getByText("De små synger")).toBeInTheDocument();
        expect(screen.getByText("Rørsukker, 1000g")).toBeInTheDocument();
    });

    it("User can see price per item", () => {
        expect(screen.getAllByRole("row", {name: /pris/i})).toHaveLength(3);
        expect(screen.getByLabelText("Pris 150.00 DKK")).toBeInTheDocument();
        expect(screen.getByLabelText("Pris 120.00 DKK")).toBeInTheDocument();
        expect(screen.getByLabelText("Pris 40.00 DKK")).toBeInTheDocument();
    });

    it("User can see total amount", () => {
        expect(screen.getByLabelText("Subtotal 425.00 DKK")).toBeInTheDocument();
    });

    it("Let user increment quantity of item", async () => {
        const user = userEvent.setup();
        expect(screen.getByLabelText("Subtotal 425.00 DKK")).toBeInTheDocument();
        const incrementButton = screen.getByLabelText(
            "forøg antal De små synger"
        );
        await user.click(incrementButton);
        expect(screen.getByLabelText("Subtotal 545.00 DKK")).toBeInTheDocument();
    });

    it("Let user decrement quantity of item", async () => {
        const user = userEvent.setup();
        expect(screen.getByLabelText("Subtotal 425.00 DKK")).toBeInTheDocument();
        const decrementButton = screen.getByLabelText(
            "reducer antal C-vitamin, 500mg, 200 stk"
        );
        await user.click(decrementButton);
        expect(screen.getByLabelText("Subtotal 350.00 DKK")).toBeInTheDocument();
    });

    it("Let user remove item", async () => {
        const user = userEvent.setup();
        expect(screen.getAllByRole("row", {name: /pris/i})).toHaveLength(3);
        const removeButton = screen.getByLabelText(
            "fjern C-vitamin, 500mg, 200 stk"
        );
        await user.click(removeButton);
        expect(screen.getAllByRole("row", {name: /pris/i})).toHaveLength(2);
        expect(screen.getByLabelText("Subtotal 200.00 DKK")).toBeInTheDocument();
    });

    it("Render empty cart message", async () => {
        const user = userEvent.setup();
        const removeButton = screen.getByLabelText(
            "fjern C-vitamin, 500mg, 200 stk"
        );
        await user.tripleClick(removeButton);
        expect(screen.getByText("Din kurv er tom!")).toBeInTheDocument();
    });

    it("display and toggle gift wrap, per item", async () => {
        const user = userEvent.setup();
        const giftwrap = screen.getByLabelText(
            "gavepapir C-vitamin, 500mg, 200 stk false"
        );
        expect(giftwrap).toBeInTheDocument();
        await user.click(giftwrap);
        expect(
            screen.getByLabelText("gavepapir C-vitamin, 500mg, 200 stk true")
        ).toBeInTheDocument();
    });

    it("let user choose recurring order schedule per item", async () => {
        const user = userEvent.setup();
        const recurringorder = screen.getByLabelText(
            "gentag order C-vitamin, 500mg, 200 stk false"
        );
        expect(recurringorder).toBeInTheDocument();
        await user.click(recurringorder);
        expect(
            screen.getByLabelText("gentag order C-vitamin, 500mg, 200 stk true")
        ).toBeInTheDocument();
    });

    it("Deduce from total price: rebate for larger quantities, per item", async () => {
        const user = userEvent.setup();
        expect(screen.getByLabelText("Subtotal 425.00 DKK")).toBeInTheDocument();
        const decrementButton = screen.getByLabelText(
            "forøg antal Rørsukker, 1000g"
        );
        //We add 2 more the basket. When buying 4 'Rørsukker, 1000g' one gets a rebate of 25%
        await user.dblClick(decrementButton);
        expect(screen.getByLabelText("Subtotal 465.00 DKK")).toBeInTheDocument();
    });

    it("Deduce from total price: 10% discount for orders over 300 DKK", async () => {
        const subtotal = 425;
        const rebate = 0.1;
        const transport = 39;
        expect(
            screen.getByLabelText(`Subtotal ${subtotal.toFixed(2)} DKK`)
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText(
                `Pris i alt ${(subtotal * (1 - rebate) + transport).toFixed(
                    2
                )} DKK`
            )
        ).toBeInTheDocument();
    });

    it("Nudge user to increase for quantity to get rebate", async () => {
        const price1 = 150;
        const quantity1 = 2;
        const rebate = 0.25;
        expect(
            screen.getByText(`Køb 2, spar ${rebate * 100}%`)
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                `${(price1 * quantity1 * (1 - rebate)).toFixed(2)} DKK`
            )
        ).toBeInTheDocument();
    });

    it("Nudge user to choose a more expensive product if available for upsell", async () => {
        const user = userEvent.setup();
        expect(
            screen.getByText("C-vitamin, 500mg, 200 stk")
        ).toBeInTheDocument();
        const upsellButton = screen.getByLabelText(
            "Andre har valgt C-vitamin Depot, 500mg, 200 stk"
        );
        expect(upsellButton).toBeInTheDocument();
        await user.click(upsellButton);
        expect(
            screen.getByText("C-vitamin Depot, 500mg, 200 stk")
        ).toBeInTheDocument();
    });
});
