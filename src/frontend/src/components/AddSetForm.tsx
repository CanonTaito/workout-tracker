import { useState } from "react";
import type { Exercise } from "../types";

interface Props {
  sessionId: number;
  exercises: Exercise[];
  onSetAdded: () => void;
}

export default function AddSetForm({ sessionId, exercises, onSetAdded }: Props) {
  const [exerciseId, setExerciseId] = useState<number | "">("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weightKg, setWeightKg] = useState(0);
  const [rpe, setRpe] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (exerciseId === "") return;

    const body = {
      exerciseId,
      sets,
      reps,
      weightKg,
      rpe: rpe === "" ? null : rpe,
    };

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded mt-4">
      <h3 className="text-lg font-bold mb-4">Add Set</h3>
      {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}

      <div className="mb-4">
        <label className="block text-gray-400 mb-1">Exercise</label>
        <select
          value={exerciseId}
          onChange={(e) => setExerciseId(Number(e.target.value))}
          className="bg-gray-700 text-gray-100 p-2 rounded w-full"
          required
        >
          <option value="" disabled>Select exercise</option>
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <div className="mb-4 flex-1">
          <label className="block text-gray-400 mb-1">Sets</label>
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(Number(e.target.value))}
            className="bg-gray-700 text-gray-100 p-2 rounded w-full"
            min="1"
            required
          />
        </div>

        <div className="mb-4 flex-1">
          <label className="block text-gray-400 mb-1">Reps</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(Number(e.target.value))}
            className="bg-gray-700 text-gray-100 p-2 rounded w-full"
            min="1"
            required
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="mb-4 flex-1">
          <label className="block text-gray-400 mb-1">Weight (kg)</label>
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(Number(e.target.value))}
            className="bg-gray-700 text-gray-100 p-2 rounded w-full"
            min="0"
            step="0.5"
            required
          />
        </div>

        <div className="mb-4 flex-1">
          <label className="block text-gray-400 mb-1">RPE</label>
          <input
            type="number"
            value={rpe}
            onChange={(e) => setRpe(e.target.value === "" ? "" : Number(e.target.value))}
            className="bg-gray-700 text-gray-100 p-2 rounded w-full"
            min="1"
            max="10"
            step="0.5"
          />
        </div>
      </div>

      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
        Add Set
      </button>
    </form>
  );
}