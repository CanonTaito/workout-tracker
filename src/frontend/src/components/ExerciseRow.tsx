import { useState } from "react";
import type { Exercise } from "../types";
import ConfirmDialog from "./ConfirmDialog";

interface Props {
  exercise: Exercise;
  onSave: (id: number, updated: Partial<Exercise>) => void;
  onDelete: (id: number) => void;
}

export default function ExerciseRow({ exercise, onSave, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(exercise.name);
  const [category, setCategory] = useState(exercise.category);
  const [muscleGroup, setMuscleGroup] = useState(exercise.muscleGroup);
  const [showConfirm, setShowConfirm] = useState(false);

  if (editing) {
    return (
      <tr className="border-b border-gray-800">
        <td className="py-3 px-4">
          <input value={name} onChange={e => setName(e.target.value)} className="bg-gray-700 text-gray-100 p-1 rounded w-full" />
        </td>
        <td className="py-3 px-4">
          <input value={category} onChange={e => setCategory(e.target.value)} className="bg-gray-700 text-gray-100 p-1 rounded w-full" />
        </td>
        <td className="py-3 px-4">
          <input value={muscleGroup} onChange={e => setMuscleGroup(e.target.value)} className="bg-gray-700 text-gray-100 p-1 rounded w-full" />
        </td>
        <td className="py-3 px-4 flex gap-2">
          <button onClick={() => { onSave(exercise.id, { name, category, muscleGroup }); setEditing(false); }} className="text-green-400 hover:text-green-300">Save</button>
          <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-300">Cancel</button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-gray-800 hover:bg-gray-800">
      <td className="py-3 px-4 font-medium">{exercise.name}</td>
      <td className="py-3 px-4 text-gray-400">{exercise.category}</td>
      <td className="py-3 px-4 text-gray-400">{exercise.muscleGroup}</td>
      <td className="py-3 px-4 flex gap-2">
        <button onClick={() => setEditing(true)} className="text-blue-400 hover:text-blue-300">Edit</button>
        <button onClick={() => setShowConfirm(true)} className="text-red-400 hover:text-red-300">Delete</button>
      </td>
      <ConfirmDialog
        isOpen={showConfirm}
        message={`Delete "${exercise.name}"?`}
        onConfirm={() => { onDelete(exercise.id); setShowConfirm(false); }}
        onCancel={() => setShowConfirm(false)}
        />  
    </tr>
  );
}