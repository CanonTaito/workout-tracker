import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Dashboard from "../components/Dashboard";

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
}

describe("Dashboard", () => {
  it("shows loading skeleton initially", () => {
    const { container } = renderWithRouter();
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("shows error state with retry button", async () => {
    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network error"));
    renderWithRouter();

    expect(await screen.findByText("Network error")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("shows welcome message when no data exists", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        totalWorkouts: 0,
        totalExercises: 0,
        totalSets: 0,
        recentSessions: [],
      }),
    } as Response);

    renderWithRouter();

    expect(await screen.findByText("Welcome to Workout Tracker")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /new session/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add exercise/i })).toBeInTheDocument();
  });

  it("shows stats and recent sessions when data exists", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        totalWorkouts: 5,
        totalExercises: 10,
        totalSets: 25,
        recentSessions: [
          { id: 1, date: "2026-07-01T00:00:00", durationMinutes: 45, notes: "Push" },
        ],
      }),
    } as Response);

    renderWithRouter();

    expect(await screen.findByText("5")).toBeInTheDocument();
    expect(screen.getByText("Workouts")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("Total Sets")).toBeInTheDocument();
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });
});
