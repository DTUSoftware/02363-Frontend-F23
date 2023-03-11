import { render, screen } from "@testing-library/react";
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

    //Change to use mocking when we implement API calls
    it("Enter country, limited to 'Denmark'", () => {
        render(component);
    });

    //Change to use mocking when we implement API calls
    it("Enter zip code, if Denmark, validate against https://api.dataforsyningen.dk/postnumre", () => {
        render(component);
    });

    //Change to use mocking when we implement API calls
    it("Enter city, if Denmark provide automatically from zip code", () => {
        render(component);
    });

    //Change to use mocking when we implement API calls
    it("Enter address line 1 and 2", () => {
        render(component);
    });

    //Change to use mocking when we implement API calls
    it("Enter name", () => {
        render(component);
    });

    //Change to use mocking when we implement API calls
    it("Enter phone, if Denmark, validate as 8 digits", () => {
        render(component);
    });

    //Change to use mocking when we implement API calls
    it("Enter email, validate as valid email address", () => {
        render(component);
    });

    //Change to use mocking when we implement API calls
    it("Enter company name", () => {
        render(component);
    });

    //Change to use mocking when we implement API calls
    it("Enter company VAT number, if Denmark, validate as 8 digits", () => {
        render(component);
    });
})