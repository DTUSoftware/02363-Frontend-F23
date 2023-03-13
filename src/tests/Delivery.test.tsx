import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Delivery from "../Delivery/Delivery";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from 'react-router-dom'
import mockResponse from "../assets/zip-codes.json";

// MemoryRouter to manually control route history
const component = (
    <MemoryRouter initialEntries={['/delivery']}>
        <Delivery />
    </MemoryRouter>
)
const zipCodeUrl = "https://api.dataforsyningen.dk/postnumre";

describe(Delivery.name, () => {
    afterEach(() => {
        vi.restoreAllMocks();
      });

    it("Should render titles", () => {
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
        expect(screen.getByText("Leveringsadresse")).toBeInTheDocument();
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
        const enterFirstName = "test"
        render(component);
        const firstName = screen.getByRole('textbox', { name: /fornavn/i })
        userEvent.type(firstName, enterFirstName)      

        await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(zipCodeUrl));
        await waitFor(() => expect(firstName).toHaveValue(enterFirstName));
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
        const enterLastName = "test"
        render(component);
        const lastName = screen.getByRole('textbox', { name: /efternavn/i })
        userEvent.type(lastName, enterLastName)      

        await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(zipCodeUrl));
        await waitFor(() => expect(lastName).toHaveValue(enterLastName));
    });

    //  Continue
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
        const enterEmail = "test@test.com"
        render(component);
        const email = screen.getByRole('textbox', { name: /email/i })
        userEvent.type(email, enterEmail) 

        await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(zipCodeUrl));
        await waitFor(() => expect(email).toHaveValue(enterEmail)); 
    });


    it("Enter phone, if Denmark, validate as 8 digits", async () => {
        render(component);
        const mobileNr = screen.getByRole('textbox', { name: /mobilnummer/i })
        userEvent.type(mobileNr, "12345678")  

        await waitFor(() => expect(mobileNr).toHaveValue("12345678"));       
    });

    
    it("Enter company name", async () => {
        render(component);
        const firmanavn = screen.getByRole('textbox', { name: /Evt. firmanavn/i })
        userEvent.type(firmanavn, "My company")  

        await waitFor(() => expect(firmanavn).toHaveValue("My company"));
    });

    
    it("Enter company VAT number, if Denmark, validate as 8 digits", async () => {
        render(component);
        const vatNr = screen.getByRole('textbox', { name: /VirksomhedVAT-nummer/i })
        userEvent.type(vatNr, "12345678")
        
        await waitFor( () => expect(vatNr).toHaveValue("12345678"));
    });


    it("Enter address line 1", async () => {
        render(component);
        const address1= screen.getByRole('textbox', { name: /adresselinje 1/i })
        userEvent.type( address1 , "st tv1")
        
        await waitFor(() => expect(address1).toHaveValue("st tv1"))        
    });
    

    it("Enter address line2", async () => {
        render(component);
        const address2 = screen.getByRole('textbox', { name: /adresselinje 2/i })
        userEvent.type(address2, "1 sal")

        await waitFor(() => expect(address2).toHaveValue("1 sal"))        
    });

    it("Enter zip code, if Denmark, validate against https://api.dataforsyningen.dk/postnumre", async  () => {
        render(component);
        
    });

    // TODO
    it("Enter city, if Denmark provide automatically from zip code", () => {
        render(component);
    });


    it("Enter country, limited to 'Denmark'", async () => {
        render(component);
        const land =  screen.getByRole("textbox", { name: /land/i });
        await waitFor(() => expect(land).toHaveValue("Danmark"));
    });
})