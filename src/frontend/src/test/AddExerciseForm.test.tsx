import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import AddExerciseForm from "../components/AddExerciseForm";

function renderForm(onExerciseAdded = vi.fn(), onCancel = vi.fn()) {
  return {
    onExerciseAdded,
    onCancel,
    ...render(<AddExerciseForm onExerciseAdded={onExerciseAdded} onCancel={onCancel} />),
  };
}

describe("AddExerciseForm", () => {
  it("renders form fields and buttons", () => {
    renderForm();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Muscle Group")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add exercise/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("calls onCancel when Cancel is clicked", async () => {
    const onCancel = vi.fn();
    renderForm(undefined, onCancel);
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("disables submit button while submitting", async () => {
    // Keep fetch pending so submitting stays true
    vi.spyOn(global, "fetch").mockImplementationOnce(() => new Promise(() => {}));

    renderForm();
    const submitBtn = screen.getByRole("button", { name: /add exercise/i });

    expect(submitBtn).not.toBeDisabled();

    await userEvent.type(screen.getByLabelText("Name"), "Bench Press");
    await userEvent.type(screen.getByLabelText("Category"), "Strength");
    await userEvent.type(screen.getByLabelText("Muscle Group"), "Chest");
    await userEvent.click(submitBtn);

    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveTextContent(/saving/i);
  });
});
