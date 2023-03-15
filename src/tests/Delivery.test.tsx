import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import mockResponse from "../assets/zip-codes.json";
import Delivery from "../Delivery/Delivery"
import { useState } from "react";
import { Address } from '../interfaces/Address';

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

const TestComponent = () => {
    const [billingAddress, setBilling] = useState<Address>(address);
    const [shippingAddress, setShipping] = useState<Address>(address);
    const [check, setCheck] = useState(false);
    return (
        // MemoryRouter to manually control route history
        <MemoryRouter initialEntries={["/delivery"]}>
            <Delivery billingAddress={billingAddress} setBilling={setBilling} shippingAddress={shippingAddress} setShipping={setShipping} address={address} check={check} setCheck={setCheck}/>
        </MemoryRouter>
    );
};

const zipCodeUrl = "https://api.dataforsyningen.dk/postnumre";

describe(Delivery.name, () => {
    beforeEach(async () => {
        const mockFetch = vi
            .spyOn(window, "fetch")
            .mockImplementation(async (url: RequestInfo | URL) => {
                if (url === zipCodeUrl) {
                    return {
                        json: async () => mockResponse,
                        ok: true,
                    } as Response;
                } else {
                    return {} as Response;
                }
            });
        render(<TestComponent/>);
        await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(zipCodeUrl));
        await waitFor(() => expect(screen.getByRole('textbox', { name: /postnummer/i })).not.toBeDisabled());
    });
    
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("Should render title", () => {
        expect(screen.getByText("Faktureringsadresse")).toBeInTheDocument();
    });

    it("Enter firstname", async () => {
        const enterFirstName = "test";
        const firstName = screen.getByRole("textbox", { name: /fornavn/i });
        await userEvent.type(firstName, enterFirstName);

        expect(firstName).toHaveValue(enterFirstName);
        expect(firstName).toBeValid();
    });

    it("Enter lastname", async () => {
        const enterLastName = "test";
        const lastName = screen.getByRole("textbox", { name: /efternavn/i });

        await userEvent.type(lastName, enterLastName);
        expect(lastName).toHaveValue(enterLastName);
        expect(lastName).toBeValid();
    });

    it("Enter email, validate as valid email address", async () => {
        const invalidEmail = "test";
        const enterEmail = "@test.com";
        const email = screen.getByRole("textbox", { name: /email/i });

        await userEvent.type(email, invalidEmail);
        expect(email).toBeInvalid();
        await userEvent.type(email, enterEmail);
        expect(email).toBeValid();
    });

    it("Enter phone, if Denmark, validate as 8 digits", async () => {
        const invalidNumber = "123456";
        const enterNumber = "78";
        const mobileNr = screen.getByRole("textbox", { name: /mobilnummer/i });

        await userEvent.type(mobileNr, invalidNumber);
        expect(mobileNr).toBeInvalid();
        await userEvent.type(mobileNr, enterNumber);
        expect(mobileNr).toBeValid();
    });

    it("Enter company name", async () => {
        const companyName = "My company";
        const company = screen.getByRole("textbox", {
            name: /Evt. firmanavn/i,
        });

        await userEvent.type(company, companyName);
        expect(company).toHaveValue(companyName);
        expect(company).toBeValid();
    });

    it("Enter company VAT number, if Denmark, validate as 8 digits", async () => {
        const invalidNumber = "123456";
        const enterNumber = "78";
        const vatNr = screen.getByRole("textbox", {
            name: /VirksomhedVAT-nummer/i,
        });

        await userEvent.type(vatNr, invalidNumber);
        expect(vatNr).toBeInvalid();
        await userEvent.type(vatNr, enterNumber);
        expect(vatNr).toBeValid();
    });

    it("Enter address line 1", async () => {
        const addressText = "st tv1";
        const address = screen.getByRole("textbox", {
            name: /adresselinje 1/i,
        });

        await userEvent.type(address, addressText);
        expect(address).toHaveValue(addressText);
        expect(address).toBeValid();
    });

    it("Enter address line2", async () => {
        const addressText = "1. sal";
        const address = screen.getByRole("textbox", {
            name: /adresselinje 2/i,
        });

        await userEvent.type(address, addressText);
        expect(address).toHaveValue(addressText);
        expect(address).toBeValid();
    });

    it("Enter zip code, if Denmark, validate against https://api.dataforsyningen.dk/postnumre", async  () => {
        const invalidZipCode = "9999";
        const validZipCode = "2800";
        const zipCode = screen.getByRole('textbox', { name: /postnummer/i })
        
        await waitFor(() => expect(zipCode).not.toBeDisabled());
        await userEvent.type(zipCode, invalidZipCode);
        expect(screen.queryAllByText("Det valgte postnummer er ikke korrekt!")[0]).toBeVisible();
        await userEvent.clear(zipCode);
        await userEvent.type(zipCode,validZipCode);
        expect(screen.queryAllByText("Det valgte postnummer er ikke korrekt!")[0]).not.toBeVisible();
        expect(zipCode).toBeValid();
    });

    it("Enter city, if Denmark provide automatically from zip code", async () => {
        const enterZipCode = "2800";

        const zipCode = screen.getByRole("textbox", { name: "Postnummer" });
        await waitFor(() => expect(zipCode).not.toBeDisabled());
        await userEvent.type(zipCode, enterZipCode);
        const city = screen.getByRole("textbox", { name: "By" });
        expect(city).toHaveValue("Kongens Lyngby");
    });

    it("Enter country, limited to 'Denmark'", () => {
        const country = screen.getByRole("textbox", { name: /land/i });
        expect(country).toHaveValue("Danmark");
    });

    it("Let user enter a delivery address and a billing address if different", async () => {
        const enterZipCode1 = "2880";
        const enterZipCode2 = "2800";

        const checkBox = screen.getByRole("checkbox", {
            name: "Min leveringsadresse er en anden end min faktureringsadresse",
        });
        await userEvent.click(checkBox);
        const zipCode = screen.getAllByRole("textbox", { name: "Postnummer" });

        await waitFor(() => expect(zipCode[0]).not.toBeDisabled());
        await waitFor(() => expect(zipCode[1]).not.toBeDisabled());
        await userEvent.type(zipCode[0], enterZipCode1);
        await userEvent.type(zipCode[1], enterZipCode2);
        const city = screen.getAllByRole("textbox", { name: "By" });
        expect(city).toHaveLength(2);
        expect(city[0]).toHaveValue("Bagsværd");
        expect(city[1]).toHaveValue("Kongens Lyngby");
    });
});
