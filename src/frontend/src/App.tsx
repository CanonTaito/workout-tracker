import { useState } from 'react';
import ExerciseList from './components/ExerciseList';
import SessionList from './components/SessionList';

function App() {
  const [page, setPage] = useState<"exercises" | "sessions">("exercises");

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setPage("exercises")}
          className={`text-3xl font-bold ${page === "exercises" ? "text-blue-400" : "text-gray-400 hover:text-gray-200"}`}
        >
          Exercises
        </button>
        <button
          onClick={() => setPage("sessions")}
          className={`text-3xl font-bold ${page === "sessions" ? "text-blue-400" : "text-gray-400 hover:text-gray-200"}`}
        >
          Sessions
        </button>
      </div>

      {page === "exercises" ? <ExerciseList /> : <SessionList />}
    </div>
  );
}

export default App;
