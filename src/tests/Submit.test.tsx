import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Submit from "../Submit/Submit";
import { CartItem } from "../interfaces/CartItem";
import { useState } from "react";
import { Address } from "../interfaces/Address";
import userEvent from "@testing-library/user-event";
import { Order } from "../interfaces/Order";

// Dummy Address to be used in tests
const address: Address = {
    firstName: "",
    lastName: "",
    email: "",
    mobileNr: 0,
    company: "",
    vatNr: "",
    country: "Danmark",
    zipCode: "",
    city: "",
    address1: "",
    address2: "",
};

// Comment and dummy order to be used in tests
const comment = "Test, i am a comment";
const order: Order = {
    orderDetails: [],
    billingAddress: address,
    shippingAddress: address,
    checkMarketing: false,
    submitComment: comment,
};

// RequestInit POST options with JSON stringified body to be used in tests
const options: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    mode: "cors",
    body: JSON.stringify(order),
};

// RequestBin URL for fetch mock implementation
const submitUrl = "https://eoysx40p399y9yl.m.pipedream.net";

/**
 * Test component to be used for setting up the necessary state handling and parameters for implementing the Submit component page
 * This is necessary as Submit relies on state which lives outside the component 
 */
const TestComponent = () => {
    const [basket, setBasket] = useState<CartItem[]>([]);
    const [billingAddress, setBilling] = useState<Address>(address);
    const [shippingAddress, setShipping] = useState<Address>(address);
    const resetAfterSubmit = () => {
        setBasket([]);
        setBilling(address);
        setShipping(address);
    };
    return (
        <Submit
            cartItems={basket}
            billingAddress={billingAddress}
            shippingAddress={shippingAddress}
            resetAfterSubmit={resetAfterSubmit}
        />
    );
};

/**
 * Submit page test suite containing appropriate test function declarations to be run
 */
describe(Submit.name, () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("Should render title", () => {
        render(<TestComponent />);
        expect(screen.getByText("Indsendelse af ordre")).toBeInTheDocument();
    });

    it("Let user accept terms & conditions", async () => {
        render(<TestComponent />);
        const checkBox = screen.getByRole("checkbox", {
            name: "Jeg accepterer vilkårene og betingelserne og privatlivsaftalen*",
        });
        expect(checkBox).not.toBeChecked;
        await userEvent.click(checkBox);
        expect(checkBox).toBeChecked;
    });

    it("Let user accept to receive marketing emails", async () => {
        render(<TestComponent />);
        const checkBox = screen.getByRole("checkbox", {
            name: "Jeg accepterer at modtage marketingmails fra denne webshop",
        });
        expect(checkBox).not.toBeChecked;
        await userEvent.click(checkBox);
        expect(checkBox).toBeChecked;
    });

    it("Let user enter an optional ordre comment", async () => {
        const enterComment = "Test, i am a comment";
        render(<TestComponent />);
        const textBox = screen.getByRole("textbox", {
            name: "Tilføj en yderligere kommentar",
        });
        await userEvent.type(textBox, enterComment);
        expect(textBox).toHaveValue(enterComment);
    });

    it("Submit all relevant information to the end-point", async () => {
        const mockFetch = vi
            .spyOn(window, "fetch")
            .mockImplementation(async (url: RequestInfo | URL) => {
                if (url === submitUrl) {
                    return {
                        ok: true,
                    } as Response;
                } else {
                    return {} as Response;
                }
            });
        render(<TestComponent />);
        const checkBox = screen.getByRole("checkbox", {
            name: "Jeg accepterer vilkårene og betingelserne og privatlivsaftalen*",
        });
        await userEvent.click(checkBox);
        const submitButton = screen.getByText("Indsend ordre");
        const textBox = screen.getByRole("textbox", {
            name: "Tilføj en yderligere kommentar",
        });
        await userEvent.type(textBox, comment);
        await userEvent.click(submitButton);
        await waitFor(() =>
            expect(mockFetch).toHaveBeenCalledWith(submitUrl, options)
        );
    });

    it("Include loading indicator and error reporting", async () => {
        const mockFetch = vi
            .spyOn(window, "fetch")
            .mockImplementation(async (url: RequestInfo | URL) => {
                if (url === submitUrl) {
                    await delay(100); // Delay to expect on loading
                    return {
                        ok: false,
                    } as Response;
                } else {
                    return {} as Response;
                }
            });
        render(<TestComponent />);
        const checkBox = screen.getByRole("checkbox", {
            name: "Jeg accepterer vilkårene og betingelserne og privatlivsaftalen*",
        });
        await userEvent.click(checkBox);
        const submitButton = screen.getByText("Indsend ordre");
        const textBox = screen.getByRole("textbox", {
            name: "Tilføj en yderligere kommentar",
        });
        await userEvent.type(textBox, comment);
        await userEvent.click(submitButton);
        await waitFor(() =>
            expect(mockFetch).toHaveBeenCalledWith(submitUrl, options)
        );
        expect(await screen.findByLabelText("Loading")).toBeInTheDocument();
        expect(
            await screen.findByText(
                "Vi beklager ulejligheden, noget gik galt ved indsendelsen af din ordre!"
            )
        ).toBeInTheDocument();
    });
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
