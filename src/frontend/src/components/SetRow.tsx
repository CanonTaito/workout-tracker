import { useState } from "react";
import type { WorkoutSet, Exercise } from "../types";
import ConfirmDialog from "./ConfirmDialog";

interface Props {
  set: WorkoutSet;
  exercises: Exercise[];
  onSave: (id: number, updated: Partial<WorkoutSet>) => void;
  onDelete: (id: number) => void;
}

export default function SetRow({ set, exercises, onSave, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [exerciseId, setExerciseId] = useState(set.exerciseId);
  const [sets, setSets] = useState(set.sets);
  const [reps, setReps] = useState(set.reps);
  const [weightKg, setWeightKg] = useState(set.weightKg);
  const [rpe, setRpe] = useState<number | null>(set.rpe ?? null);
  const [showConfirm, setShowConfirm] = useState(false);

  const exerciseMap = new Map<number, string>();
  exercises.forEach((ex) => exerciseMap.set(ex.id, ex.name));

  const handleSaveEdit = () => {
    onSave(set.id, {
      exerciseId,
      sets,
      reps,
      weightKg,
      rpe: rpe ?? undefined,
    });
    setEditing(false);
  };

  if (editing) {
    return (
      <tr className="border-b border-gray-800">
        <td className="py-3 px-4">
          <select
            value={exerciseId}
            onChange={(e) => setExerciseId(Number(e.target.value))}
            className="bg-gray-700 text-gray-100 p-1 rounded w-full"
          >
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
        </td>
        <td className="py-3 px-4">
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(Number(e.target.value))}
            className="bg-gray-700 text-gray-100 p-1 rounded w-full"
          />
        </td>
        <td className="py-3 px-4">
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(Number(e.target.value))}
            className="bg-gray-700 text-gray-100 p-1 rounded w-full"
          />
        </td>
        <td className="py-3 px-4">
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(Number(e.target.value))}
            className="bg-gray-700 text-gray-100 p-1 rounded w-full"
          />
        </td>
        <td className="py-3 px-4">
          <input
            type="number"
            value={rpe ?? ""}
            onChange={(e) => setRpe(e.target.value ? Number(e.target.value) : null)}
            className="bg-gray-700 text-gray-100 p-1 rounded w-full"
          />
        </td>
        <td className="py-3 px-4 flex gap-2">
          <button onClick={handleSaveEdit} className="text-green-400 hover:text-green-300">
            Save
          </button>
          <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-300">
            Cancel
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-gray-800">
      <td className="py-3 px-4 font-medium">
        {exerciseMap.get(set.exerciseId) || `Exercise #${set.exerciseId}`}
      </td>
      <td className="py-3 px-4 text-gray-400">{set.sets}</td>
      <td className="py-3 px-4 text-gray-400">{set.reps}</td>
      <td className="py-3 px-4 text-gray-400">{set.weightKg} kg</td>
      <td className="py-3 px-4 text-gray-400">{set.rpe ?? "—"}</td>
      <td className="py-3 px-4 flex gap-2">
        <button onClick={() => setEditing(true)} className="text-blue-400 hover:text-blue-300">
          Edit
        </button>
        <button onClick={() => setShowConfirm(true)} className="text-red-400 hover:text-red-300">
          Delete
        </button>
      </td>
      <ConfirmDialog
        isOpen={showConfirm}
        message="Delete this set?"
        onConfirm={() => { onDelete(set.id); setShowConfirm(false); }}
        onCancel={() => setShowConfirm(false)}
      />
    </tr>
  );
}
