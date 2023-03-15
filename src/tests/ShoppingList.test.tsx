import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import ShoppingList from "../ShoppingList/ShoppingList";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from 'react-router-dom'
import mockResponse from "../assets/products.json";

// MemoryRouter to manually control route history
const component = (
    <MemoryRouter initialEntries={['/']}>
        <ShoppingList />
    </MemoryRouter>
)

const dataUrl = "https://raw.githubusercontent.com/larsthorup/checkout-data/main/product-v2.json";

//Change to use mocking when we implement API calls
describe(ShoppingList.name, () => {
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
        render(component);
        await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(dataUrl));
        await waitFor(() => expect(screen.queryByText("Din kurv er tom!")).not.toBeInTheDocument());
    });
    
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("Should render title", () => {
        expect(screen.getByText("Din indkøbskurv")).toBeInTheDocument();
    });

    it("User can see list of items", () => {
        const tableRows = screen.getAllByRole("row");
        expect(tableRows).toHaveLength(4);
        expect(
            screen.getByText("C-vitamin, 500mg, 200 stk")
        ).toBeInTheDocument();
        expect(
            screen.getByText("De små synger")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Rørsukker, 1000g")
        ).toBeInTheDocument();
    });

    it("User can see price per item", () => {
        const tableRows = screen.getAllByRole("row");
        expect(tableRows).toHaveLength(4);
        expect(
            screen.getByLabelText("Pris 150 DKK")
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText("Pris 120 DKK")
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText("Pris 40 DKK")
        ).toBeInTheDocument();
    });

    it("User can see total amount", () => {
        expect(
            screen.getByText("Subtotal: 425 DKK")
        ).toBeInTheDocument();
    });

    it("Let user increment quantity of item", async () => {
        const user = userEvent.setup();
        expect(
            screen.getByText("Subtotal: 425 DKK")
        ).toBeInTheDocument();
        const incrementButton = screen.getByLabelText(
            "forøg antal De små synger"
        );
        await user.click(incrementButton);
        expect(
            screen.getByText("Subtotal: 545 DKK")
        ).toBeInTheDocument();
    });

    it("Let user decrement quantity of item", async () => {
        const user = userEvent.setup();
        expect(
            screen.getByText("Subtotal: 425 DKK")
        ).toBeInTheDocument();
        const decrementButton = screen.getByLabelText(
            "reducer antal C-vitamin, 500mg, 200 stk"
        );
        await user.click(decrementButton);
        expect(
            screen.getByText("Subtotal: 350 DKK")
        ).toBeInTheDocument();
    });

    it("Let user remove item", async () => {
        const user = userEvent.setup();
        expect(screen.getAllByRole("row")).toHaveLength(4);
        const removeButton = screen.getByLabelText(
            "fjern C-vitamin, 500mg, 200 stk"
        );
        await user.click(removeButton);
        expect(screen.getAllByRole("row")).toHaveLength(3);
        expect(
            screen.getByText("Subtotal: 200 DKK")
        ).toBeInTheDocument();
    });

    it("Render empty cart message", async () => {
        const user = userEvent.setup();
        const removeButton = screen.getByLabelText(
            "fjern C-vitamin, 500mg, 200 stk"
        );
        await user.tripleClick(removeButton);
        expect(
            screen.getByText("Din kurv er tom!")
        ).toBeInTheDocument();
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
        expect(
            screen.getByText("Subtotal: 425 DKK")
        ).toBeInTheDocument();
        const decrementButton = screen.getByLabelText(
            "forøg antal Rørsukker, 1000g"
        );
        //We add 2 more the basket. When buying 4 'Rørsukker, 1000g' one gets a rebate of 25%
        await user.dblClick(decrementButton);
        expect(
            screen.getByText("Subtotal: 465 DKK")
        ).toBeInTheDocument();
    });

    it("Deduce from total price: 10% discount for orders over 300 DKK", async () => {
        const subtotal = 425;
        const rebate = 0.1;
        const transport = 39;
        expect(screen.getByText(`Subtotal: ${subtotal} DKK`)).toBeInTheDocument();
        expect(screen.getByText(`Pris i alt: ${subtotal*(1-rebate)+transport} DKK`)).toBeInTheDocument();
    });

    it("Nudge user to increase for quantity to get rebate", async () => {
        const price1 = 150;
        const quantity1 = 2;
        const rebate = 0.25;
        expect(screen.getByText(`Køb 2, spar ${rebate*100}%`)).toBeInTheDocument();
        expect(screen.getByText(`${price1*quantity1*(1-rebate)} DKK`)).toBeInTheDocument();
    });

    it("Nudge user to choose a more expensive product if available for upsell", async () => {
        const user = userEvent.setup();
        expect(screen.getByText("C-vitamin, 500mg, 200 stk")).toBeInTheDocument();
        const upsellButton = screen.getByLabelText("Andre har valgt vitamin-c-depot-500-250");
        expect(upsellButton).toBeInTheDocument();
        await user.click(upsellButton);
        expect(screen.getByText("C-vitamin Depot, 500mg, 200 stk")).toBeInTheDocument();
    });
});
