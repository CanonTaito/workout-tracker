import { useState } from 'react';
import type { Exercise } from '../types';

interface Props {
  onExerciseAdded: (exercise: Exercise) => void;
  onCancel: () => void;
}

export default function AddExerciseForm({ onExerciseAdded, onCancel }: Props) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, muscleGroup }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add exercise');
      }
      const newExercise: Exercise = await response.json();
      onExerciseAdded(newExercise);
      setName('');
      setCategory('');
      setMuscleGroup('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded mb-6">
      <h2 className="text-xl font-bold mb-4">Add New Exercise</h2>
      {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-400 mb-1">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-600 text-gray-300 placeholder:text-gray-500 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded w-full"
          placeholder="Enter exercise name"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="category" className="block text-gray-400 mb-1">Category</label>
        <input
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-gray-600 text-gray-300 placeholder:text-gray-500 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded w-full"
          placeholder="e.g. Strength, Cardio"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="muscleGroup" className="block text-gray-400 mb-1">Muscle Group</label>
        <input
          id="muscleGroup"
          type="text"
          value={muscleGroup}
          onChange={(e) => setMuscleGroup(e.target.value)}
          className="bg-gray-600 text-gray-300 placeholder:text-gray-500 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded w-full"
          placeholder="e.g. Legs, Back"
          required
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded">
          {submitting ? "Saving..." : "Add Exercise"}
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded">
          Cancel
        </button>
      </div>
    </form>
  );
}
