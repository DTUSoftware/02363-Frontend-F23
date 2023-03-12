import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Delivery from "../Delivery/Delivery";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from 'react-router-dom'

// MemoryRouter to manually control route history
const component = (
    <MemoryRouter initialEntries={['/delivery']}>
        <Delivery />
    </MemoryRouter>
)

describe(Delivery.name, () => {

    it("Should render titles", () => {
        render(component);
        expect(screen.getByText("Faktureringsadresse")).toBeInTheDocument();
        expect(screen.getByText("Leveringsadresse")).toBeInTheDocument();
    });

    it("Enter firstname", async () => {
        render(component);
        const fornavn = screen.getByRole('textbox', { name: /fornavn/i })
        userEvent.type(fornavn, "Goli")      

        await waitFor(() => expect(fornavn).toHaveValue("Goli"));
    });

    it("Enter lastname", async () => {
        render(component);
        const efternavn = screen.getByRole('textbox', { name: /efternavn/i })
        userEvent.type(efternavn, "Haidari")      

        await waitFor(() => expect(efternavn).toHaveValue("Haidari"));
    });


    it("Enter email, validate as valid email address", async () => {
        render(component);
        const email = screen.getByRole('textbox', { name: /email/i })
        userEvent.type(email, "goli@gmail.com") 

        await waitFor(() => expect(email).toHaveValue("goli@gmail.com")); 
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
        userEvent.type(firmanavn, "My compnay")  

        await waitFor(() => expect(firmanavn).toHaveValue("My compnay"));
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

    //Change to use mocking when we implement API calls
    it("Enter zip code, if Denmark, validate against https://api.dataforsyningen.dk/postnumre", async  () => {
        render(component);
        /*const select = screen.getByRole("combobox", {name: /postnummer/i });
        userEvent.selectOptions(select, within(select).getByRole('option', {name: /2000/i}) )

        await waitFor(()=> expect(screen.getByDisplayValue(/2000/i)).toBeInTheDocument());*/
    });

    //Change to use mocking when we implement API calls
    it("Enter city, if Denmark provide automatically from zip code", () => {
        render(component);
    });


    it("Enter country, limited to 'Denmark'", async () => {
        render(component);
        const land =  screen.getByRole("textbox", { name: /land/i });
        await waitFor(() => expect(land).toHaveValue("Danmark"));
    });
})