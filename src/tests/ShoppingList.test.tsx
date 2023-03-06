import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ShoppingList from "../ShoppingList/ShoppingList";
import userEvent from '@testing-library/user-event'
import App from "../App";

describe(ShoppingList.name, () => {
  it("Should render title", () => {
    render(<App />);
    expect(screen.getByText("Din indkøbskurv")).toBeInTheDocument();
  });

  //Change to use mocking when we implemnt API calls
  it("User can see list of items", () => {
    render(<App />);
    const tableRows = screen.getAllByRole("row");
    expect(tableRows).toHaveLength(4);
    expect(screen.getByText("C-vitamin, 500mg, 250 stk", {selector: ".product"})).toBeInTheDocument();
    expect(screen.getByText("De små synger", {selector: ".product"})).toBeInTheDocument();
    expect(screen.getByText("Rørsukker, 1000g", {selector: ".product"})).toBeInTheDocument();
  });

  //Change to use mocking when we implemnt API calls
  it("User can see price per item", () => {
    render(<App />);
    const tableRows = screen.getAllByRole("row");
    expect(tableRows).toHaveLength(4);
    expect(screen.getByText("150 DKK", {selector: ".price"})).toBeInTheDocument();
    expect(screen.getByText("120 DKK", {selector: ".price"})).toBeInTheDocument();
    expect(screen.getByText("40 DKK", {selector: ".price"})).toBeInTheDocument();
  });

  //Change to use mocking when we implemnt API calls
  it("User can see total amount", () => {
    render(<App />);
    expect(screen.getByText("Pris i alt 425 DKK", {selector: ".total"})).toBeInTheDocument();
  });

  //Change to use mocking when we implemnt API calls
  it("Let user increment quantity of item", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByText("Pris i alt 425 DKK", {selector: ".total"})).toBeInTheDocument();
    const incrementButton = screen.getByLabelText("increment 1");
    await user.click(incrementButton);    
    expect(screen.getByText("Pris i alt 545 DKK", {selector: ".total"})).toBeInTheDocument();
  });

  //Change to use mocking when we implemnt API calls
  it("Let user decrement quantity of item", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByText("Pris i alt 425 DKK", {selector: ".total"})).toBeInTheDocument();
    const decrementButton = screen.getByLabelText("decrement 0");
    await user.click(decrementButton);    
    expect(screen.getByText("Pris i alt 350 DKK", {selector: ".total"})).toBeInTheDocument();
  });

  //Change to use mocking when we implemnt API calls
  it("Let user remove item", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getAllByRole("row")).toHaveLength(4);
    const removeButton = screen.getByLabelText("remove 0");
    await user.click(removeButton);  
    expect(screen.getAllByRole("row")).toHaveLength(3);
    expect(screen.getByText("Pris i alt 200 DKK", {selector: ".total"})).toBeInTheDocument();
  });

  //Change to use mocking when we implemnt API calls
  it("Render empty cart message", async () => {
    const user = userEvent.setup();
    render(<App />);
    const removeButton = screen.getByLabelText("remove 0");
    await user.click(removeButton);
    await user.click(removeButton);
    await user.click(removeButton);
    expect(screen.getByText("Din kurv er tom!", {selector: ".empty"})).toBeInTheDocument();
  });

  //Change to use mocking when we implemnt API calls
  it("display and toggle gift wrap, per item", async () => {
    const user = userEvent.setup();
    render(<App />);
    const giftwrap = screen.getByLabelText("giftwrap 0 false");
    expect(giftwrap).toBeInTheDocument();
    await user.click(giftwrap);
    expect(screen.getByLabelText("giftwrap 0 true")).toBeInTheDocument();
  });

  //Change to use mocking when we implemnt API calls
  it("let user choose recurring order schedule per item", async () => {
    const user = userEvent.setup();
    render(<App />);
    const recurringorder = screen.getByLabelText("recurringorder 0 false");
    expect(recurringorder).toBeInTheDocument();
    await user.click(recurringorder);
    expect(screen.getByLabelText("recurringorder 0 true")).toBeInTheDocument();
  });
});