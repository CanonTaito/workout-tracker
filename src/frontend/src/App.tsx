import { useState, useEffect } from 'react';
import type { Exercise } from './types';
import AddExerciseForm from './components/AddExerciseForm';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  const handleExerciseAdded = (exercise: Exercise) => {
    setShowForm(false);
    setExercises((prev) => [...prev, exercise]);
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
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-700 text-left text-gray-400 uppercase text-sm">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Muscle Group</th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((ex) => (
              <tr key={ex.id} className="border-b border-gray-800 hover:bg-gray-800">
                <td className="py-3 px-4 font-medium">{ex.name}</td>
                <td className="py-3 px-4 text-gray-400">{ex.category}</td>
                <td className="py-3 px-4 text-gray-400">{ex.muscleGroup}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
