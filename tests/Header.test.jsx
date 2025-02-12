import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../src/components/Header";

describe("Header component", () => {

    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();
    });

    it("Renders snapshot", () => {
        const { container } = render(<Header />);
        expect(container).toMatchSnapshot();
    });
});

it('handles fetch error', async () => {
    // Mock a failed fetch response
    window.fetch = vi.fn(() =>
        Promise.reject(new Error("Network error"))
    );

    await act(async () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>);
    });

    const errorMessage = await screen.findByText("A network error was encountered");
    expect(errorMessage).toBeInTheDocument();
})

it("Renders categories after fetching", async () => {
    // Mock the fetch response
    const mockCategories = ["electronics", "jewelery", "men's clothing", "women's clothing"];
    window.fetch = vi.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockCategories),
        })
    );
    await act(async () => {
        render(<MemoryRouter>
            <Header />
        </MemoryRouter>);
    });

    screen.debug()

    const categories = await screen.findByText("Categories");
    expect(categories).toBeInTheDocument();


});
