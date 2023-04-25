import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Finish from "../Finish/Finish";

describe(Finish.name, () => {
    it("Should render title", () => {
        render(<Finish />);
        expect(screen.getByText("Mange tak!")).toBeInTheDocument();
    });

    it("Should render paragraphs", () => {
        render(<Finish />);
        expect(
            screen.getByText("Din er order er nu bestilt.")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Tjek din email for kvittering.")
        ).toBeInTheDocument();
    });

    it("Should render button", () => {
        render(<Finish />);
        expect(screen.getByText("Shop videre?")).toBeInTheDocument();
    });
});
