import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFound from "../NotFound/NotFound";

/**
 * NotFound page test suite containing appropriate test function declarations to be run
 */
describe(NotFound.name, () => {
    it("Should render title", () => {
        render(<NotFound />);
        expect(
            screen.getByText("Hov... du er vist kommet på afveje!")
        ).toBeInTheDocument();
    });

    it("Should render paragraphs", () => {
        render(<NotFound />);
        expect(
            screen.getByText("Denne side eksisterer ikke endnu.")
        ).toBeInTheDocument();
    });

    it("Should render button", () => {
        render(<NotFound />);
        expect(screen.getByText("Tilbage til shop")).toBeInTheDocument();
    });
});
