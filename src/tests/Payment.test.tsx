import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Payment from "../Payment/Payment";
import { CreditCard } from "../interfaces/CreditCard";

const submitUrl = "https://eoysx40p399y9yl.m.pipedream.net";

const payment: CreditCard = {
    cardNumber: "0123456789101112",
    cvcNumber: "123",
    expiryMonth: "01",
    expiryYear: "23",
};

const options: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    mode: "cors",
    body: JSON.stringify(payment),
};

describe(Payment.name, () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("Should render title", () => {
        render(<Payment />);
        expect(screen.getByText("Kort oplysninger")).toBeInTheDocument();
    });

    it("Choose expiration month", async () => {
        const monthValue = "04";
        render(<Payment />);
        const expirationMonth = screen.getByRole("combobox", {
            name: /Udløbsmåned/i,
        });
        const month = screen.getByRole("option", { name: monthValue });
        await userEvent.selectOptions(expirationMonth, month);
        expect(month).toHaveValue(monthValue);
    });

    it("Choose expiration year", async () => {
        const yearValue = "29";
        render(<Payment />);
        const expirationYear = screen.getByRole("combobox", {
            name: /Udløbsår/i,
        });
        const year = screen.getByRole("option", { name: yearValue });
        await userEvent.selectOptions(expirationYear, year);
        expect(year).toHaveValue(yearValue);
    });

    it("Choose valid card number", async () => {
        const number = "0123456789101112";
        render(<Payment />);
        const cardNumber = screen.getByRole("textbox", { name: /Kortnummer/i });
        await userEvent.type(cardNumber, number);
        expect(cardNumber).toHaveValue(number);
        expect(cardNumber).toBeValid();
    });

    it("Choose invalid card number", async () => {
        render(<Payment />);
        const cardNumber = screen.getByRole("textbox", { name: /Kortnummer/i });
        expect(cardNumber).not.toBeValid();
    });

    it("Choose valid CVC", async () => {
        const cvc = "123";
        render(<Payment />);
        const cardCvc = screen.getByRole("textbox", { name: /CVC/i });
        await userEvent.type(cardCvc, cvc);
        expect(cardCvc).toHaveValue(cvc);
        expect(cardCvc).toBeValid();
    });

    it("Choose invalid CVC", async () => {
        render(<Payment />);
        const cardCvc = screen.getByRole("textbox", { name: /CVC/i });
        expect(cardCvc).not.toBeValid();
    });

    it("Submit all payment to the end-point", async () => {
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
        render(<Payment />);
        const cardNumber = screen.getByRole("textbox", { name: /Kortnummer/i });
        await userEvent.type(cardNumber, payment.cardNumber);
        const cardCvc = screen.getByRole("textbox", { name: /CVC/i });
        await userEvent.type(cardCvc, payment.cvcNumber);
        const submitButton = screen.getByText("Bekræft Betaling");
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
        render(<Payment />);
        const cardNumber = screen.getByRole("textbox", { name: /Kortnummer/i });
        await userEvent.type(cardNumber, payment.cardNumber);
        const cardCvc = screen.getByRole("textbox", { name: /CVC/i });
        await userEvent.type(cardCvc, payment.cvcNumber);
        const submitButton = screen.getByText("Bekræft Betaling");
        await userEvent.click(submitButton);
        await waitFor(() =>
            expect(mockFetch).toHaveBeenCalledWith(submitUrl, options)
        );
        expect(await screen.findByLabelText("Loading")).toBeInTheDocument();
        expect(
            await screen.findByText(
                "Vi beklager ulejligheden, noget gik galt ved indsendelsen af din betaling med kort!"
            )
        ).toBeInTheDocument();
    });
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
