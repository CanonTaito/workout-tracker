import type { Exercise } from "../types";
import ExerciseRow from "./ExerciseRow";

interface Props {
  exercises: Exercise[];
  onSave: (id: number, updated: Partial<Exercise>) => void;
  onDelete: (id: number) => void;
}

export default function ExerciseTable({ exercises, onSave, onDelete }: Props) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-700 text-left text-gray-400 uppercase text-sm">
          <th className="py-3 px-4">Name</th>
          <th className="py-3 px-4">Category</th>
          <th className="py-3 px-4">Muscle Group</th>
          <th className="py-3 px-4">Actions</th> 
        </tr>
      </thead>
      <tbody>
        {exercises.map((ex) => (
          <ExerciseRow
            key={ex.id}
            exercise={ex}
            onSave={onSave}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
}