import { useState, useEffect } from 'react';
import type { Exercise } from '../types';
import AddExerciseForm from './AddExerciseForm';
import ExerciseTable from './ExerciseTable';
import Skeleton from './Skeleton';
import { useToast } from './ToastContext';

export default function ExerciseList() {
  const [showForm, setShowForm] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToast } = useToast();

  const filtered = exercises.filter(
    (ex) =>
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExerciseAdded = (exercise: Exercise) => {
    setShowForm(false);
    setExercises((prev) => [...prev, exercise]);
    addToast("Exercise added", "success");
  };

  const handleSaveExercise = async (id: number, updated: Partial<Exercise>) => {
    const response = await fetch(`/api/exercises/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (!response.ok) return;
    const saved = await response.json();
    setExercises((prev) => prev.map((ex) => (ex.id === id ? saved : ex)));
    addToast("Exercise updated", "success");
  };

  const handleDeleteExercise = async (id: number) => {
    const response = await fetch(`/api/exercises/${id}`, { method: "DELETE" });
    if (!response.ok) return;
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
    addToast("Exercise deleted", "success");
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('/api/exercises');
        if (!response.ok) {
          throw new Error('Failed to fetch exercises');
        }
        const data: Exercise[] = await response.json();
        setExercises(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchExercises();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-700">
              {[1, 2, 3, 4].map((i) => (
                <th key={i} className="py-3 px-4 text-left">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="border-b border-gray-700">
                {[1, 2, 3, 4].map((j) => (
                  <td key={j} className="py-3 px-4">
                    <Skeleton className="h-5 w-24" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Exercises</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Exercise
        </button>
      </div>
      {!showForm && exercises.length > 0 && (
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search exercises..."
          className="bg-gray-700 text-gray-100 placeholder:text-gray-500 p-2 rounded w-full mb-4"
        />
      )}
      {showForm ? (
        <AddExerciseForm onExerciseAdded={handleExerciseAdded} onCancel={() => setShowForm(false)} />
      ) : (
        <ExerciseTable exercises={filtered} onSave={handleSaveExercise} onDelete={handleDeleteExercise} />
      )}
    </>
  );
}
