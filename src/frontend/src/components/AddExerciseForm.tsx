import { useState } from 'react';
import type { Exercise } from '../types';

interface Props {
  onExerciseAdded: (exercise: Exercise) => void;
  onCancel: () => void;
}

interface Errors {
  name?: string;
  category?: string;
  muscleGroup?: string;
}

export default function AddExerciseForm({ onExerciseAdded, onCancel }: Props) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!category.trim()) e.category = 'Category is required';
    if (!muscleGroup.trim()) e.muscleGroup = 'Muscle group is required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setSubmitting(true);
    setApiError(null);
    try {
      const response = await fetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), category: category.trim(), muscleGroup: muscleGroup.trim() }),
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
      setErrors({});
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field: keyof Errors) =>
    `bg-gray-600 text-gray-300 placeholder:text-gray-500 border ${errors[field] ? 'border-red-500' : 'border-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded w-full`;

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded mb-6">
      <h2 className="text-xl font-bold mb-4">Add New Exercise</h2>
      {apiError && <div className="bg-red-500 text-white p-2 rounded mb-4">{apiError}</div>}
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-400 mb-1">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((prev) => ({ ...prev, name: undefined })); }}
          className={inputClass('name')}
          placeholder="Enter exercise name"
        />
        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="category" className="block text-gray-400 mb-1">Category</label>
        <input
          id="category"
          type="text"
          value={category}
          onChange={(e) => { setCategory(e.target.value); if (errors.category) setErrors((prev) => ({ ...prev, category: undefined })); }}
          className={inputClass('category')}
          placeholder="e.g. Strength, Cardio"
        />
        {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="muscleGroup" className="block text-gray-400 mb-1">Muscle Group</label>
        <input
          id="muscleGroup"
          type="text"
          value={muscleGroup}
          onChange={(e) => { setMuscleGroup(e.target.value); if (errors.muscleGroup) setErrors((prev) => ({ ...prev, muscleGroup: undefined })); }}
          className={inputClass('muscleGroup')}
          placeholder="e.g. Legs, Back"
        />
        {errors.muscleGroup && <p className="text-red-400 text-sm mt-1">{errors.muscleGroup}</p>}
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
