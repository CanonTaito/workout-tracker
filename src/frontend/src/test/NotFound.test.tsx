import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import NotFound from "../components/NotFound";

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );
}

describe("NotFound", () => {
  it("renders 404 heading", () => {
    renderWithRouter();
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders 'Page not found' message", () => {
    renderWithRouter();
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });

  it("renders a link to Dashboard", () => {
    renderWithRouter();
    const link = screen.getByRole("link", { name: /go to dashboard/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
