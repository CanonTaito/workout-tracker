import { useState, useEffect } from "react";

interface DashboardStats {
  totalWorkouts: number;
  totalExercises: number;
  totalSets: number;
  recentSessions: { id: number; date: string; durationMinutes: number; notes?: string }[];
}

interface Props {
  onNavigate: (page: "dashboard" | "sessions" | "exercises") => void;
  onSelectSession: (id: number) => void;
}

export default function Dashboard({ onNavigate, onSelectSession }: Props) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = () => {
    setLoading(true);
    setError(null);
    fetch("/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load dashboard");
        return res.json();
      })
      .then((data) => setStats(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDashboard(); }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-400">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={fetchDashboard} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
          Retry
        </button>
      </div>
    );
  }

  if (!stats || (stats.totalWorkouts === 0 && stats.totalExercises === 0)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Workout Tracker</h1>
        <p className="text-gray-400 mb-8">Start by adding an exercise or logging your first session.</p>
        <div className="flex gap-4">
          <button onClick={() => onNavigate("sessions")} className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded text-lg font-semibold">
            New Session
          </button>
          <button onClick={() => onNavigate("exercises")} className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded text-lg font-semibold">
            Add Exercise
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Workouts" value={stats.totalWorkouts} />
        <StatCard label="Exercises" value={stats.totalExercises} />
        <StatCard label="Total Sets" value={stats.totalSets} />
      </div>

      <h2 className="text-xl font-bold mb-4">Recent Sessions</h2>
      {stats.recentSessions.length === 0 ? (
        <p className="text-gray-500 mb-8">No sessions yet. Start your first workout!</p>
      ) : (
        <div className="space-y-3 mb-8">
          {stats.recentSessions.map((s) => (
            <div
              key={s.id}
              onClick={() => { onNavigate("sessions"); onSelectSession(s.id); }}
              className="bg-gray-800 p-4 rounded cursor-pointer hover:bg-gray-700 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{new Date(s.date).toLocaleDateString()}</p>
                <p className="text-gray-400 text-sm">{s.durationMinutes} minutes{s.notes ? ` — ${s.notes}` : ""}</p>
              </div>
              <span className="text-gray-500 text-xl">→</span>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="flex gap-4">
        <button onClick={() => onNavigate("sessions")} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
          New Session
        </button>
        <button onClick={() => onNavigate("exercises")} className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded">
          Add Exercise
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gray-800 p-6 rounded">
      <p className="text-4xl font-bold">{value}</p>
      <p className="text-gray-400 mt-1">{label}</p>
    </div>
  );
}
