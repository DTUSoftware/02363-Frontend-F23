import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ShoppingList from "../ShoppingList/ShoppingList";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from 'react-router-dom'

// MemoryRouter to manually control route history
const component = (
    <MemoryRouter initialEntries={['/']}>
        <ShoppingList />
    </MemoryRouter>
)

//Change to use mocking when we implement API calls
describe(ShoppingList.name, () => {
    it("Should render title", () => {
        render(component);
        expect(screen.getByText("Din indkøbskurv")).toBeInTheDocument();
    });

    it("User can see list of items", () => {
        render(component);
        const tableRows = screen.getAllByRole("row");
        expect(tableRows).toHaveLength(4);
        expect(
            screen.getByText("C-vitamin, 500mg, 200 stk", {
                selector: ".product",
            })
        ).toBeInTheDocument();
        expect(
            screen.getByText("De små synger", { selector: ".product" })
        ).toBeInTheDocument();
        expect(
            screen.getByText("Rørsukker, 1000g", { selector: ".product" })
        ).toBeInTheDocument();
    });

    it("User can see price per item", () => {
        render(component);
        const tableRows = screen.getAllByRole("row");
        expect(tableRows).toHaveLength(4);
        expect(
            screen.getByText("150 DKK", { selector: ".price" })
        ).toBeInTheDocument();
        expect(
            screen.getByText("120 DKK", { selector: ".price" })
        ).toBeInTheDocument();
        expect(
            screen.getByText("40 DKK", { selector: ".price" })
        ).toBeInTheDocument();
    });

    it("User can see total amount", () => {
        render(component);
        expect(
            screen.getByText("Subtotal: 425 DKK", { selector: ".rebatetext" })
        ).toBeInTheDocument();
    });

    it("Let user increment quantity of item", async () => {
        const user = userEvent.setup();
        render(component);
        expect(
            screen.getByText("Subtotal: 425 DKK", { selector: ".rebatetext" })
        ).toBeInTheDocument();
        const incrementButton = screen.getByLabelText(
            "forøg antal De små synger"
        );
        await user.click(incrementButton);
        expect(
            screen.getByText("Subtotal: 545 DKK", { selector: ".rebatetext" })
        ).toBeInTheDocument();
    });

    it("Let user decrement quantity of item", async () => {
        const user = userEvent.setup();
        render(component);
        expect(
            screen.getByText("Subtotal: 425 DKK", { selector: ".rebatetext" })
        ).toBeInTheDocument();
        const decrementButton = screen.getByLabelText(
            "reducer antal C-vitamin, 500mg, 200 stk"
        );
        await user.click(decrementButton);
        expect(
            screen.getByText("Subtotal: 350 DKK", { selector: ".rebatetext" })
        ).toBeInTheDocument();
    });

    it("Let user remove item", async () => {
        const user = userEvent.setup();
        render(component);
        expect(screen.getAllByRole("row")).toHaveLength(4);
        const removeButton = screen.getByLabelText(
            "fjern C-vitamin, 500mg, 200 stk"
        );
        await user.click(removeButton);
        expect(screen.getAllByRole("row")).toHaveLength(3);
        expect(
            screen.getByText("Subtotal: 200 DKK", { selector: ".rebatetext" })
        ).toBeInTheDocument();
    });

    it("Render empty cart message", async () => {
        const user = userEvent.setup();
        render(component);
        const removeButton = screen.getByLabelText(
            "fjern C-vitamin, 500mg, 200 stk"
        );
        await user.tripleClick(removeButton);
        expect(
            screen.getByText("Din kurv er tom!", { selector: ".empty" })
        ).toBeInTheDocument();
    });

    it("display and toggle gift wrap, per item", async () => {
        const user = userEvent.setup();
        render(component);
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
        render(component);
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
        render(component);

        expect(
            screen.getByText("Subtotal: 425 DKK", { selector: ".rebatetext" })
        ).toBeInTheDocument();
        const decrementButton = screen.getByLabelText(
            "forøg antal Rørsukker, 1000g"
        );
        //We add 2 more the basket. When buying 4 'Rørsukker, 1000g' one gets a rebate of 25%
        await user.dblClick(decrementButton);
        expect(
            screen.getByText("Subtotal: 465 DKK", { selector: ".rebatetext" })
        ).toBeInTheDocument();
    });

    it("Deduce from total price: 10% discount for orders over 300 DKK", async () => {
        const subtotal = 425;
        const rebate = 0.1;
        const transport = 39;
        render(component);
        expect(screen.getByText(`Subtotal: ${subtotal} DKK`, { selector: ".rebatetext" })).toBeInTheDocument();
        expect(screen.getByText(`Pris i alt: ${subtotal*(1-rebate)+transport} DKK`, { selector: ".totalprice" })).toBeInTheDocument();
    });

    it("Nudge user to increase for quantity to get rebate", async () => {
        const price1 = 150;
        const quantity1 = 2;
        const rebate = 0.25;
        render(component);
        expect(screen.getByText(`Køb 2, spar ${rebate*100}%`, { selector: ".rebate" })).toBeInTheDocument();
        expect(screen.getByText(`${price1*quantity1*(1-rebate)} DKK`, { selector: ".priceTotal" })).toBeInTheDocument();
    });

    it("Nudge user to choose a more expensive product if available for upsell", async () => {
        const user = userEvent.setup();
        render(component);
        expect(screen.getByText("C-vitamin, 500mg, 200 stk", { selector: ".product" })).toBeInTheDocument();
        const upsellButton = screen.getByLabelText("Andre har valgt vitamin-c-depot-500-250");
        expect(upsellButton).toBeInTheDocument();
        await user.click(upsellButton);
        expect(screen.getByText("C-vitamin Depot, 500mg, 200 stk", { selector: ".product" })).toBeInTheDocument();
    });
});
