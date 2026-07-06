import { useState } from "react";
import type { Exercise } from "../types";

interface Props {
  sessionId: number;
  exercises: Exercise[];
  onSetAdded: () => void;
}

interface Errors {
  exerciseId?: string;
  sets?: string;
  reps?: string;
  weightKg?: string;
  rpe?: string;
}

export default function AddSetForm({ sessionId, exercises, onSetAdded }: Props) {
  const [exerciseId, setExerciseId] = useState<number | "">("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weightKg, setWeightKg] = useState(0);
  const [rpe, setRpe] = useState<number | "">("");
  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): Errors => {
    const e: Errors = {};
    if (exerciseId === "") e.exerciseId = "Select an exercise";
    if (sets < 1) e.sets = "Must be at least 1";
    if (reps < 1) e.reps = "Must be at least 1";
    if (weightKg < 0) e.weightKg = "Cannot be negative";
    if (rpe !== "" && (rpe < 1 || rpe > 10)) e.rpe = "Must be 1–10";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    if (exerciseId === "") return;

    const body = {
      exerciseId,
      sets,
      reps,
      weightKg,
      rpe: rpe === "" ? null : rpe,
    };

    setSubmitting(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/sets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to add set");
      onSetAdded();
      setExerciseId("");
      setSets(3);
      setReps(10);
      setWeightKg(0);
      setRpe("");
      setErrors({});
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field: keyof Errors) =>
    `bg-gray-700 text-gray-100 p-2 rounded w-full border ${errors[field] ? 'border-red-500' : 'border-transparent'}`;

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded mt-4">
      <h3 className="text-lg font-bold mb-4">Add Set</h3>
      {apiError && <div className="bg-red-500 text-white p-2 rounded mb-4">{apiError}</div>}

      <div className="mb-4">
        <label className="block text-gray-400 mb-1">Exercise</label>
        <select
          value={exerciseId}
          onChange={(e) => { setExerciseId(Number(e.target.value)); if (errors.exerciseId) setErrors((prev) => ({ ...prev, exerciseId: undefined })); }}
          className={`bg-gray-700 text-gray-100 p-2 rounded w-full border ${errors.exerciseId ? 'border-red-500' : 'border-transparent'}`}
        >
          <option value="" disabled>Select exercise</option>
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>
        {errors.exerciseId && <p className="text-red-400 text-sm mt-1">{errors.exerciseId}</p>}
      </div>

      <div className="flex gap-4">
        <div className="mb-4 flex-1">
          <label className="block text-gray-400 mb-1">Sets</label>
          <input
            type="number"
            value={sets}
            onChange={(e) => { setSets(Number(e.target.value)); if (errors.sets) setErrors((prev) => ({ ...prev, sets: undefined })); }}
            className={inputClass("sets") + " [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"}
            min="1"
          />
          {errors.sets && <p className="text-red-400 text-sm mt-1">{errors.sets}</p>}
        </div>

        <div className="mb-4 flex-1">
          <label className="block text-gray-400 mb-1">Reps</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => { setReps(Number(e.target.value)); if (errors.reps) setErrors((prev) => ({ ...prev, reps: undefined })); }}
            className={inputClass("reps") + " [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"}
            min="1"
          />
          {errors.reps && <p className="text-red-400 text-sm mt-1">{errors.reps}</p>}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="mb-4 flex-1">
          <label className="block text-gray-400 mb-1">Weight (kg)</label>
          <input
            type="number"
            value={weightKg}
            onChange={(e) => { setWeightKg(Number(e.target.value)); if (errors.weightKg) setErrors((prev) => ({ ...prev, weightKg: undefined })); }}
            className={inputClass("weightKg") + " [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"}
            min="0"
            step="0.5"
          />
          {errors.weightKg && <p className="text-red-400 text-sm mt-1">{errors.weightKg}</p>}
        </div>

        <div className="mb-4 flex-1">
          <label className="block text-gray-400 mb-1">RPE</label>
          <input
            type="number"
            value={rpe}
            onChange={(e) => { setRpe(e.target.value === "" ? "" : Number(e.target.value)); if (errors.rpe) setErrors((prev) => ({ ...prev, rpe: undefined })); }}
            className={inputClass("rpe") + " [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"}
            min="1"
            max="10"
            step="0.5"
          />
          {errors.rpe && <p className="text-red-400 text-sm mt-1">{errors.rpe}</p>}
        </div>
      </div>

      <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 px-4 rounded">
        {submitting ? "Saving..." : "Add Set"}
      </button>
    </form>
  );
}