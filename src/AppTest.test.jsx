import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppTest } from "./App.jsx";

describe("App component", () => {
  it("renders correct heading", () => {
    render(<AppTest />);
    expect(screen.getByRole("heading").textContent).toMatch(/our first test/i);
  });
});