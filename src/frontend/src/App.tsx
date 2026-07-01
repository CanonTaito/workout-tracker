import { useState } from 'react';
import Dashboard from './components/Dashboard';
import ExerciseList from './components/ExerciseList';
import SessionList from './components/SessionList';

function App() {
  const [page, setPage] = useState<"dashboard" | "sessions" | "exercises">("dashboard");
  const [initialSessionId, setInitialSessionId] = useState<number | null>(null);

  const handleNavigate = (p: "dashboard" | "sessions" | "exercises") => {
    setPage(p);
  };

  const handleSelectSession = (id: number) => {
    setInitialSessionId(id);
    setPage("sessions");
  };

  const handleCloseSession = () => {
    setInitialSessionId(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setPage("dashboard")}
          className={`text-3xl font-bold ${page === "dashboard" ? "text-blue-400" : "text-gray-400 hover:text-gray-200"}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setPage("sessions")}
          className={`text-3xl font-bold ${page === "sessions" ? "text-blue-400" : "text-gray-400 hover:text-gray-200"}`}
        >
          Sessions
        </button>
        <button
          onClick={() => setPage("exercises")}
          className={`text-3xl font-bold ${page === "exercises" ? "text-blue-400" : "text-gray-400 hover:text-gray-200"}`}
        >
          Exercises
        </button>
      </div>

      {page === "dashboard" && (
        <Dashboard onNavigate={handleNavigate} onSelectSession={handleSelectSession} />
      )}
      {page === "exercises" && <ExerciseList />}
      {page === "sessions" && (
        <SessionList initialSessionId={initialSessionId ?? undefined} onCloseSession={handleCloseSession} />
      )}
    </div>
  );
}

export default App;
