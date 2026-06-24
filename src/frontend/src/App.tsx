import { useState, useEffect } from 'react';
import type { Exercise } from './types';
import AddExerciseForm from './components/AddExerciseForm';
import ExerciseTable from './components/ExerciseTable';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  const handleExerciseAdded = (exercise: Exercise) => {
    setShowForm(false);
    setExercises((prev) => [...prev, exercise]);
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
};

const handleDeleteExercise = async (id: number) => {
  const response = await fetch(`/api/exercises/${id}`, { method: "DELETE" });
  if (!response.ok) return;
  setExercises((prev) => prev.filter((ex) => ex.id !== id));
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

  if (loading) return <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">Loading exercises...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Exercises</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Exercise
        </button>
      </div>

      {showForm ? (
        <AddExerciseForm onExerciseAdded={handleExerciseAdded} />
      ) : (
        <ExerciseTable exercises={exercises} onSave={handleSaveExercise} onDelete={handleDeleteExercise} />
      )}
    </div>
  );
}

export default App;
