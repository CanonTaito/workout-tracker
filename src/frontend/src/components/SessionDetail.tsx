import { useState, useEffect } from "react";
import type { WorkoutSession, WorkoutSet, Exercise } from "../types";
import AddSetForm from "./AddSetForm";
import ConfirmDialog from "./ConfirmDialog";
import SetRow from "./SetRow";

interface Props {
  sessionId: number;
  onBack: () => void;
  onDeleteSession: (id: number) => void;
}

export default function SessionDetail({ sessionId, onBack, onDeleteSession }: Props) {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingSession, setEditingSession] = useState(false);
  const [editDate, setEditDate] = useState("");
  const [editDuration, setEditDuration] = useState(0);
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionRes, exercisesRes] = await Promise.all([
          fetch(`/api/sessions/${sessionId}`),
          fetch("/api/exercises"),
        ]);
        const sessionData: WorkoutSession = await sessionRes.json();
        const exercisesData: Exercise[] = await exercisesRes.json();
        setSession(sessionData);
        setExercises(exercisesData);
      } catch (err) {
        console.error("Failed to fetch session detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sessionId]);

  if (loading) return <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">Loading session...</div>;

  const handleSetAdded = () => {
    setShowAddForm(false);
    fetch(`/api/sessions/${sessionId}`)
      .then((res) => res.json())
      .then((data) => setSession(data));
  };

  const handleUpdateSet = (setId: number, updated: Partial<WorkoutSet>) => {
    fetch(`/api/sessions/${sessionId}/sets/${setId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update set");
        return fetch(`/api/sessions/${sessionId}`);
      })
      .then((res) => res.json())
      .then((data) => setSession(data))
      .catch((err) => console.error("Failed to update set:", err));
  };

  const handleDeleteSet = (setId: number) => {
    fetch(`/api/sessions/${sessionId}/sets/${setId}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete set");
        setSession((prev) => {
          if (!prev) return prev;
          return { ...prev, sets: prev.sets.filter((s) => s.id !== setId) };
        });
      })
      .catch((err) => console.error("Failed to delete set:", err));
  };

  const handleDelete = async() => {
    await fetch(`/api/sessions/${sessionId}`, { method: "DELETE"});
    setShowDeleteConfirm(false);
    onDeleteSession(sessionId);
  }

  const handleEditSession = () => {
    if (!session) return;
    setEditDate(session.date.split("T")[0]);
    setEditDuration(session.durationMinutes);
    setEditNotes(session.notes ?? "");
    setEditingSession(true);
  };

  const handleSaveSession = async () => {
    const response = await fetch(`/api/sessions/${sessionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: editDate, durationMinutes: editDuration, notes: editNotes }),
    });
    if (!response.ok) return;
    const updated = await response.json();
    setSession(updated);
    setEditingSession(false);
  };

  const handleCancelEdit = () => {
    setEditingSession(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="text-blue-400 hover:text-blue-300">
          ← Back to Sessions
        </button>
        <div className="flex gap-2">
          {editingSession ? (
            <>
              <button onClick={handleSaveSession} className="text-green-400 hover:text-green-300 text-sm">
                Save
              </button>
              <button onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-300 text-sm">
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={handleEditSession} className="text-blue-400 hover:text-blue-300 text-sm">
                Edit
              </button>
              <button onClick={() => setShowDeleteConfirm(true)} className="text-red-400 hover:text-red-300 text-sm">
                Delete Session
              </button>
            </>
          )}
        </div>
      </div>
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        message="Delete this session and all its sets?"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {editingSession ? (
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-gray-400 mb-1">Date</label>
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="bg-gray-700 text-gray-100 p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={editDuration}
              onChange={(e) => setEditDuration(Number(e.target.value))}
              className="bg-gray-700 text-gray-100 p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Notes</label>
            <input
              type="text"
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="bg-gray-700 text-gray-100 p-2 rounded w-full"
            />
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-2">
            {session && new Date(session.date).toLocaleDateString()}
          </h1>
          <p className="text-gray-400 mb-1">{session?.durationMinutes} minutes</p>
          {session?.notes && <p className="text-gray-400 mb-6">{session.notes}</p>}
        </>
      )}
      <h2 className="text-xl font-bold mb-4">Exercises</h2>
      {(!session?.sets || session.sets.length === 0) && (
        <p className="text-gray-500">No sets yet. Add your first exercise below.</p>
      )}
      {session?.sets && session.sets.length > 0 && (
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="border-b border-gray-700 text-left text-gray-400 uppercase text-sm">
              <th className="py-3 px-4">Exercise</th>
              <th className="py-3 px-4">Sets</th>
              <th className="py-3 px-4">Reps</th>
              <th className="py-3 px-4">Weight</th>
              <th className="py-3 px-4">RPE</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {session.sets.map((set) => (
              <SetRow
                key={set.id}
                set={set}
                exercises={exercises}
                onSave={handleUpdateSet}
                onDelete={handleDeleteSet}
              />
            ))}
          </tbody>
        </table>
      )}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        {showAddForm ? "Cancel" : "Add Set"}
      </button>
      {showAddForm && (
        <AddSetForm
          sessionId={sessionId}
          exercises={exercises}
          onSetAdded={handleSetAdded}
        />
      )}
    </div>
  );
}