import { useState, useEffect } from "react";
import type { WorkoutSession, WorkoutSet, Exercise } from "../types";
import AddSetForm from "./AddSetForm";
import ConfirmDialog from "./ConfirmDialog";

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

  const exerciseMap = new Map<number, string>();
  exercises.forEach((ex) => exerciseMap.set(ex.id, ex.name));

  const handleSetAdded = () => {
    setShowAddForm(false);
    fetch(`/api/sessions/${sessionId}`)
      .then((res) => res.json())
      .then((data) => setSession(data));
  };

  const handleDelete = async() => {
    await fetch(`/api/sessions/${sessionId}`, { method: "DELETE"});
    setShowDeleteConfirm(false);
    onDeleteSession(sessionId);
  }

  return (
    <div>
  <div className="flex justify-between items-center mb-4">
    <button onClick={onBack} className="text-blue-400 hover:text-blue-300">
      ← Back to Sessions
    </button>
    <button onClick={() => setShowDeleteConfirm(true)} className="text-red-400 hover:text-red-300 text-sm">
      Delete Session
    </button>
  </div>
  <ConfirmDialog
    isOpen={showDeleteConfirm}
    message="Delete this session and all its sets?"
    onConfirm={handleDelete}
    onCancel={() => setShowDeleteConfirm(false)}
  />

      <h1 className="text-3xl font-bold mb-2">
        {session && new Date(session.date).toLocaleDateString()}
      </h1>
      <p className="text-gray-400 mb-1">{session?.durationMinutes} minutes</p>
      {session?.notes && <p className="text-gray-400 mb-6">{session.notes}</p>}
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
            </tr>
          </thead>
          <tbody>
            {session.sets.map((set) => (
              <tr key={set.id} className="border-b border-gray-800">
                <td className="py-3 px-4 font-medium">
                  {exerciseMap.get(set.exerciseId) || `Exercise #${set.exerciseId}`}
                </td>
                <td className="py-3 px-4 text-gray-400">{set.sets}</td>
                <td className="py-3 px-4 text-gray-400">{set.reps}</td>
                <td className="py-3 px-4 text-gray-400">{set.weightKg} kg</td>
                <td className="py-3 px-4 text-gray-400">{set.rpe ?? "—"}</td>
              </tr>
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