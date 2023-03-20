import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Submit from "../Submit/Submit";
import { CartItem } from "../interfaces/CartItem";
import { useState } from "react";
import { MemoryRouter } from "react-router-dom";
import { Address } from "../interfaces/Address";
import userEvent from "@testing-library/user-event";
import { Order } from "../interfaces/Order";

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

const submitUrl = "https://eoysx40p399y9yl.m.pipedream.net";

const TestComponent = () => {
    const [basket, setBasket] = useState<CartItem[]>([]);
    const [billingAddress, setBilling] = useState<Address>(address);
    const [shippingAddress, setShipping] = useState<Address>(address);
    const [check, setCheck] = useState(false);

    const resetAfterSubmit = () => {
        setBasket([]);
        setBilling(address);
        setShipping(address);
        setCheck(false);
    };

    return (
        // MemoryRouter to manually control route history
        <MemoryRouter initialEntries={["/submit"]}>
            <Submit
                cartItems={basket}
                billingAddress={billingAddress}
                shippingAddress={shippingAddress}
                resetAfterSubmit={resetAfterSubmit}
            />
        </MemoryRouter>
    );
};

describe(Submit.name, () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("Should render title", () => {
        render(<TestComponent />);
        expect(screen.getByText("Indsendelse af order")).toBeInTheDocument();
    });

    it("Let user accept terms & conditions", async () => {
        render(<TestComponent />);
        const checkBox = screen.getByRole("checkbox", {
            name: "Jeg accepterer vilkårene og betingelserne og privatlivsaftalen.",
        });
        expect(checkBox).not.toBeChecked;
        await userEvent.click(checkBox);
        expect(checkBox).toBeChecked;
    });

    it("Let user accept to receive marketing emails", async () => {
        render(<TestComponent />);
        const checkBox = screen.getByRole("checkbox", {
            name: "Jeg accepterer at modtage marketingmails fra denne webshop.",
        });
        expect(checkBox).not.toBeChecked;
        await userEvent.click(checkBox);
        expect(checkBox).toBeChecked;
    });

    it("Let user enter an optional order comment", async () => {
        const enterComment = "Test, i am a comment";
        render(<TestComponent />);
        const textBox = screen.getByRole("textbox", {
            name: "Tilføj en yderligere kommentar",
        });
        await userEvent.type(textBox, enterComment);
        expect(textBox).toHaveValue(enterComment);
    });

    it("Submit all relevant information to the end-point", async () => {
        const cartItem: CartItem[] = [];
        const order: Order = {
            cartItems: cartItem,
            billingAddress: address,
            shippingAddress: address,
            checkMarketing: false,
            submitComment: "",
        };
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const options: RequestInit = {
            method: "POST",
            headers,
            mode: "cors",
            body: JSON.stringify(order),
        };
        const mockFetch = vi
            .spyOn(window, "fetch")
            .mockImplementation(async (url: RequestInfo | URL) => {
                if (url === submitUrl) {
                    await delay(2000);
                    return {
                        ok: true,
                    } as Response;
                } else {
                    return {} as Response;
                }
            });
        render(<TestComponent />);
        const checkBox = screen.getByRole("checkbox", {
            name: "Jeg accepterer vilkårene og betingelserne og privatlivsaftalen.",
        });
        await userEvent.click(checkBox);
        const submitButton = screen.getByText("Indsend order");
        await userEvent.click(submitButton);
        await waitFor(() =>
            expect(mockFetch).toHaveBeenCalledWith(submitUrl, options)
        );
        await waitFor(() => expect(screen.getByText("Loading...")));
    });

    it("Include loading indicator and error reporting", async () => {
        const cartItem: CartItem[] = [];
        const order: Order = {
            cartItems: cartItem,
            billingAddress: address,
            shippingAddress: address,
            checkMarketing: false,
            submitComment: "",
        };
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const options: RequestInit = {
            method: "POST",
            headers,
            mode: "cors",
            body: JSON.stringify(order),
        };
        const mockFetch = vi
            .spyOn(window, "fetch")
            .mockImplementation(async (url: RequestInfo | URL) => {
                if (url === submitUrl) {
                    await delay(2000);
                    return {
                        ok: false, //ok is false
                    } as Response;
                } else {
                    return {} as Response;
                }
            });
        render(<TestComponent />);
        const checkBox = screen.getByRole("checkbox", {
            name: "Jeg accepterer vilkårene og betingelserne og privatlivsaftalen.",
        });
        await userEvent.click(checkBox);
        const submitButton = screen.getByText("Indsend order");
        await userEvent.click(submitButton);
        await waitFor(() =>
            expect(mockFetch).toHaveBeenCalledWith(submitUrl, options)
        );
        await waitFor(() => expect(screen.getByText("Loading...")));
    });
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
