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

describe(ShoppingList.name, () => {
    it("Should render title", () => {
        render(component);
        expect(screen.getByText("Din indkøbskurv")).toBeInTheDocument();
    });

    //Change to use mocking when we implement API calls
    it("User can see list of items", () => {
        render(component);
        const tableRows = screen.getAllByRole("row");
        expect(tableRows).toHaveLength(4);
        expect(
            screen.getByText("C-vitamin, 500mg, 250 stk", {
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

    //Change to use mocking when we implement API calls
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

    //Change to use mocking when we implement API calls
    it("User can see total amount", () => {
        render(component);
        expect(
            screen.getByText("Pris i alt 425 DKK", { selector: ".total" })
        ).toBeInTheDocument();
    });

    //Change to use mocking when we implement API calls
    it("Let user increment quantity of item", async () => {
        const user = userEvent.setup();
        render(component);
        expect(
            screen.getByText("Pris i alt 425 DKK", { selector: ".total" })
        ).toBeInTheDocument();
        const incrementButton = screen.getByLabelText(
            "forøg antal De små synger"
        );
        await user.click(incrementButton);
        expect(
            screen.getByText("Pris i alt 545 DKK", { selector: ".total" })
        ).toBeInTheDocument();
    });

    //Change to use mocking when we implement API calls
    it("Let user decrement quantity of item", async () => {
        const user = userEvent.setup();
        render(component);
        expect(
            screen.getByText("Pris i alt 425 DKK", { selector: ".total" })
        ).toBeInTheDocument();
        const decrementButton = screen.getByLabelText(
            "reducer antal C-vitamin, 500mg, 250 stk"
        );
        await user.click(decrementButton);
        expect(
            screen.getByText("Pris i alt 350 DKK", { selector: ".total" })
        ).toBeInTheDocument();
    });

    //Change to use mocking when we implement API calls
    it("Let user remove item", async () => {
        const user = userEvent.setup();
        render(component);
        expect(screen.getAllByRole("row")).toHaveLength(4);
        const removeButton = screen.getByLabelText(
            "fjern C-vitamin, 500mg, 250 stk"
        );
        await user.click(removeButton);
        expect(screen.getAllByRole("row")).toHaveLength(3);
        expect(
            screen.getByText("Pris i alt 200 DKK", { selector: ".total" })
        ).toBeInTheDocument();
    });

    //Change to use mocking when we implement API calls
    it("Render empty cart message", async () => {
        const user = userEvent.setup();
        render(component);
        const removeButton = screen.getByLabelText(
            "fjern C-vitamin, 500mg, 250 stk"
        );
        await user.tripleClick(removeButton);
        expect(
            screen.getByText("Din kurv er tom!", { selector: ".empty" })
        ).toBeInTheDocument();
    });

    //Change to use mocking when we implement API calls
    it("display and toggle gift wrap, per item", async () => {
        const user = userEvent.setup();
        render(component);
        const giftwrap = screen.getByLabelText(
            "gavepapir C-vitamin, 500mg, 250 stk false"
        );
        expect(giftwrap).toBeInTheDocument();
        await user.click(giftwrap);
        expect(
            screen.getByLabelText("gavepapir C-vitamin, 500mg, 250 stk true")
        ).toBeInTheDocument();
    });

    //Change to use mocking when we implement API calls
    it("let user choose recurring order schedule per item", async () => {
        const user = userEvent.setup();
        render(component);
        const recurringorder = screen.getByLabelText(
            "gentag order C-vitamin, 500mg, 250 stk false"
        );
        expect(recurringorder).toBeInTheDocument();
        await user.click(recurringorder);
        expect(
            screen.getByLabelText("gentag order C-vitamin, 500mg, 250 stk true")
        ).toBeInTheDocument();
    });

    //Change to use mocking when we implement API calls
    it("Deduce from total price: rebate for larger quantities, per item", async () => {
        const user = userEvent.setup();
        render(component);

        expect(
            screen.getByText("Pris i alt 425 DKK", { selector: ".total" })
        ).toBeInTheDocument();
        const decrementButton = screen.getByLabelText(
            "forøg antal Rørsukker, 1000g"
        );
        //We add 2 more the basket. When buying 4 'Rørsukker, 1000g' one gets a rebate of 25%
        await user.dblClick(decrementButton);
        expect(
            screen.getByText("Pris i alt 465 DKK", { selector: ".total" })
        ).toBeInTheDocument();
    });

    //Change to use mocking when we implement API calls
    it("Deduce from total price: 10% discount for orders over 300 DKK", async () => {
        render(component);
    });

    //Change to use mocking when we implement API calls
    it("Nudge user to increase for quantity to get rebate", async () => {
        render(component);
    });

    //Change to use mocking when we implement API calls
    it("Nudge user to choose a more expensive product if available for upsell", async () => {
        render(component);
    });
});
