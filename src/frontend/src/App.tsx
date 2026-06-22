import { useState, useEffect } from 'react';
import type { Exercise } from './types';

function App() {

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

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
      <h1 className="text-3xl font-bold mb-6">Exercises</h1>
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
    </div>
  );
}

export default App;
