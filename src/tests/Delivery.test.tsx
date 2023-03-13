import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Delivery from "../Delivery/Delivery";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import mockResponse from "../assets/zip-codes.json";

// MemoryRouter to manually control route history
const component = (
    <MemoryRouter initialEntries={["/delivery"]}>
        <Delivery />
    </MemoryRouter>
);
const zipCodeUrl = "https://api.dataforsyningen.dk/postnumre";

describe(Delivery.name, () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("Should render title", () => {
        const mockFetch = vi
            .spyOn(window, "fetch")
            .mockImplementation(async (url: RequestInfo | URL) => {
                if (url === zipCodeUrl) {
                    return {
                        json: async () => mockResponse,
                    } as Response;
                } else {
                    return {} as Response;
                }
            });
        render(component);

        expect(mockFetch).toHaveBeenCalledWith(zipCodeUrl);
        expect(screen.getByText("Faktureringsadresse")).toBeInTheDocument();
    });

    it("Enter firstname", async () => {
        const mockFetch = vi
            .spyOn(window, "fetch")
            .mockImplementation(async (url: RequestInfo | URL) => {
                if (url === zipCodeUrl) {
                    return {
                        json: async () => mockResponse,
                    } as Response;
                } else {
                    return {} as Response;
                }
            });
        const enterFirstName = "test";
        render(component);
        const firstName = screen.getByRole("textbox", { name: /fornavn/i });
        await userEvent.type(firstName, enterFirstName);

        expect(mockFetch).toHaveBeenCalledWith(zipCodeUrl);
        expect(firstName).toHaveValue(enterFirstName);
        expect(firstName).toBeValid();
    });

    it("Enter lastname", async () => {
        const mockFetch = vi
            .spyOn(window, "fetch")
            .mockImplementation(async (url: RequestInfo | URL) => {
                if (url === zipCodeUrl) {
                    return {
                        json: async () => mockResponse,
                    } as Response;
                } else {
                    return {} as Response;
                }
            });
        const enterLastName = "test";
        render(component);
        const lastName = screen.getByRole("textbox", { name: /efternavn/i });

        expect(mockFetch).toHaveBeenCalledWith(zipCodeUrl);
        await userEvent.type(lastName, enterLastName);
        expect(lastName).toHaveValue(enterLastName);
        expect(lastName).toBeValid();
    });

    it("Enter email, validate as valid email address", async () => {
        const mockFetch = vi
            .spyOn(window, "fetch")
            .mockImplementation(async (url: RequestInfo | URL) => {
                if (url === zipCodeUrl) {
                    return {
                        json: async () => mockResponse,
                    } as Response;
                } else {
                    return {} as Response;
                }
            });
        const invalidEmail = "test";
        const enterEmail = "@test.com";
        render(component);
        const email = screen.getByRole("textbox", { name: /email/i });

        expect(mockFetch).toHaveBeenCalledWith(zipCodeUrl);
        await userEvent.type(email, invalidEmail);
        expect(email).toBeInvalid();
        await userEvent.type(email, enterEmail);
        expect(email).toBeValid();
    });

    it("Enter phone, if Denmark, validate as 8 digits", async () => {
        const mockFetch = vi
            .spyOn(window, "fetch")
            .mockImplementation(async (url: RequestInfo | URL) => {
                if (url === zipCodeUrl) {
                    return {
                        json: async () => mockResponse,
                    } as Response;
                } else {
                    return {} as Response;
                }
            });
        const invalidNumber = "123456";
        const enterNumber = "78";
        render(component);
        const mobileNr = screen.getByRole("textbox", { name: /mobilnummer/i });

        expect(mockFetch).toHaveBeenCalledWith(zipCodeUrl);
        await userEvent.type(mobileNr, invalidNumber);
        expect(mobileNr).toBeInvalid();
        await userEvent.type(mobileNr, enterNumber);
        expect(mobileNr).toBeValid();
    });

    it("Enter company name", async () => {
        const mockFetch = vi
            .spyOn(window, "fetch")
            .mockImplementation(async (url: RequestInfo | URL) => {
                if (url === zipCodeUrl) {
                    return {
                        json: async () => mockResponse,
                    } as Response;
                } else {
                    return {} as Response;
                }
            });
        const companyName = "My company";
        render(component);
        const company = screen.getByRole("textbox", {
            name: /Evt. firmanavn/i,
        });

        expect(mockFetch).toHaveBeenCalledWith(zipCodeUrl);
        await userEvent.type(company, companyName);
        expect(company).toHaveValue(companyName);
        expect(company).toBeValid();
    });

    it("Enter company VAT number, if Denmark, validate as 8 digits", async () => {
        const mockFetch = vi
            .spyOn(window, "fetch")
            .mockImplementation(async (url: RequestInfo | URL) => {
                if (url === zipCodeUrl) {
                    return {
                        json: async () => mockResponse,
                    } as Response;
                } else {
                    return {} as Response;
                }
            });
        const invalidNumber = "123456";
        const enterNumber = "78";
        render(component);
        const vatNr = screen.getByRole("textbox", {
            name: /VirksomhedVAT-nummer/i,
        });

        expect(mockFetch).toHaveBeenCalledWith(zipCodeUrl);
        await userEvent.type(vatNr, invalidNumber);
        expect(vatNr).toBeInvalid();
        await userEvent.type(vatNr, enterNumber);
        expect(vatNr).toBeValid();
    });

    it("Enter address line 1", async () => {
        const mockFetch = vi
            .spyOn(window, "fetch")
            .mockImplementation(async (url: RequestInfo | URL) => {
                if (url === zipCodeUrl) {
                    return {
                        json: async () => mockResponse,
                    } as Response;
                } else {
                    return {} as Response;
                }
            });
        const addressText = "st tv1";
        render(component);
        const address = screen.getByRole("textbox", {
            name: /adresselinje 1/i,
        });

        expect(mockFetch).toHaveBeenCalledWith(zipCodeUrl);
        await userEvent.type(address, addressText);
        expect(address).toHaveValue(addressText);
        expect(address).toBeValid();
    });

    it("Enter address line2", async () => {
        const mockFetch = vi
            .spyOn(window, "fetch")
            .mockImplementation(async (url: RequestInfo | URL) => {
                if (url === zipCodeUrl) {
                    return {
                        json: async () => mockResponse,
                    } as Response;
                } else {
                    return {} as Response;
                }
            });
        const addressText = "1. sal";
        render(component);
        const address = screen.getByRole("textbox", {
            name: /adresselinje 2/i,
        });

        expect(mockFetch).toHaveBeenCalledWith(zipCodeUrl);
        await userEvent.type(address, addressText);
        expect(address).toHaveValue(addressText);
        expect(address).toBeValid();
    });

    /*
    it("Enter zip code, if Denmark, validate against https://api.dataforsyningen.dk/postnumre", async  () => {
        const mockFetch = vi
        .spyOn(window, "fetch")
        .mockImplementation(async (url: RequestInfo | URL) => {
            if (url === zipCodeUrl) {
            return {
                json: async () => mockResponse,
            } as Response;
            } else {
            return {} as Response;
            }
        });
        const invalidZipCode = "9999";
        const validZipCode = "2800";
        render(component);
        const zipCode = screen.getByRole('textbox', { name: /postnummer/i })
        
        expect(mockFetch).toHaveBeenCalledWith(zipCodeUrl);
        await userEvent.type(zipCode, invalidZipCode);
        expect(screen.queryAllByText("Det valgte postnummer er ikke korrekt!")[0]).toBeVisible();
        await userEvent.clear(zipCode);
        await userEvent.type(zipCode,validZipCode);
        expect(screen.queryAllByText("Det valgte postnummer er ikke korrekt!")[0]).not.toBeVisible();
        expect(zipCode).toBeValid();
    });

    it("Enter city, if Denmark provide automatically from zip code", async () => {
        const mockFetch = vi
        .spyOn(window, "fetch")
        .mockImplementation(async (url: RequestInfo | URL) => {
            if (url === zipCodeUrl) {
            return {
                json: async () => mockResponse,
            } as Response;
            } else {
            return {} as Response;
            }
        });
        const validZipCode = "2800";
        render(component);
        const zipCode = screen.getByRole('textbox', { name: /postnummer/i });
        const city = screen.getByRole('textbox', { name: /by/i });

        expect(mockFetch).toHaveBeenCalledWith(zipCodeUrl);
        await userEvent.type(zipCode, validZipCode);
        expect(city).toHaveValue("Kongens Lyngby");
    });
    */

    it("Enter country, limited to 'Denmark'", () => {
        const mockFetch = vi
            .spyOn(window, "fetch")
            .mockImplementation(async (url: RequestInfo | URL) => {
                if (url === zipCodeUrl) {
                    return {
                        json: async () => mockResponse,
                    } as Response;
                } else {
                    return {} as Response;
                }
            });
        render(component);
        const country = screen.getByRole("textbox", { name: /land/i });

        expect(mockFetch).toHaveBeenCalledWith(zipCodeUrl);
        expect(country).toHaveValue("Danmark");
    });

    it.only("Let user enter a delivery address and a billing address if different", async () => {
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

        const enterZipCode1 = "2880";
        const enterZipCode2 = "2800";
        render(component);

        const checkBox = screen.getByRole("checkbox", {
            name: "Min leveringsadresse er en anden end min faktureringsadresse",
        });
        await userEvent.click(checkBox);
        const zipCode = screen.getAllByRole("textbox", { name: "Postnummer" });

        await waitFor(() => expect(zipCode[0]).not.toBeDisabled());
        await waitFor(() => expect(zipCode[1]).not.toBeDisabled());

        expect(mockFetch).toHaveBeenCalledWith(zipCodeUrl);
        await userEvent.type(zipCode[0], enterZipCode1);
        await userEvent.type(zipCode[1], enterZipCode2);

        const city = screen.getAllByRole("textbox", { name: "By" });
        expect(city).toHaveLength(2);
        await waitFor(() => expect(city[0]).toHaveValue("Bagsværd"));
        await waitFor(() => expect(city[1]).toHaveValue("Kongens Lyngby"));
    });
});
