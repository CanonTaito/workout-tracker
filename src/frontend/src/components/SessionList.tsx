import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { WorkoutSession } from "../types";

export default function SessionList() {

  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/sessions");
        if (!response.ok) throw new Error("Failed to fetch sessions");
        const data: WorkoutSession[] = await response.json();
        setSessions(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, durationMinutes: Number(duration), notes }),
      });
      if (!response.ok) throw new Error("Failed to create session");
      const created: WorkoutSession = await response.json();
      setSessions((prev) => [created, ...prev]);
      setShowForm(false);
      setDate("");
      setDuration("");
      setNotes("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">Loading sessions...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sessions</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          New Session
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleCreate} className="bg-gray-800 p-4 rounded mb-6">
            {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}
          <div className="mb-4">
            <label className="block text-gray-400 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-gray-600 text-gray-300 placeholder:text-gray-500 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="bg-gray-600 text-gray-300 placeholder:text-gray-500 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-1">Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-gray-600 text-gray-300 placeholder:text-gray-500 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded w-full"
              placeholder="Optional notes..."
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
            Create Session
          </button>
        </form>
      )}
      <div className="space-y-4">
        {sessions.map((session) => (
          <Link
            key={session.id}
            to={`/sessions/${session.id}`}
            className="block bg-gray-800 p-4 rounded cursor-pointer hover:bg-gray-700"
          >
            <p className="font-semibold text-lg">
              {new Date(session.date).toLocaleDateString()}
            </p>
            <p className="text-gray-400">{session.durationMinutes} minutes</p>
            {session.notes && (
              <p className="text-gray-400 mt-2">{session.notes}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
