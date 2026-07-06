import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { WorkoutSession } from "../types";
import Skeleton from "./Skeleton";
import { useToast } from "./ToastContext";

interface FormErrors {
  date?: string;
  duration?: string;
}

export default function SessionList() {

  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

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

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!date) e.date = "Date is required";
    if (!duration || Number(duration) <= 0) e.duration = "Duration must be greater than 0";
    return e;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    setApiError(null);
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
      setFormErrors({});
      addToast("Session created", "success");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `bg-gray-600 text-gray-300 placeholder:text-gray-500 border ${formErrors[field] ? 'border-red-500' : 'border-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded w-full`;

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-gray-800 p-4 rounded">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          ))}
        </div>
      </div>
    );
  }

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
          {apiError && <div className="bg-red-500 text-white p-2 rounded mb-4">{apiError}</div>}
          <div className="mb-4">
            <label className="block text-gray-400 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); if (formErrors.date) setFormErrors((prev) => ({ ...prev, date: undefined })); }}
              className={inputClass("date")}
            />
            {formErrors.date && <p className="text-red-400 text-sm mt-1">{formErrors.date}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => { setDuration(e.target.value); if (formErrors.duration) setFormErrors((prev) => ({ ...prev, duration: undefined })); }}
              className={inputClass("duration")}
            />
            {formErrors.duration && <p className="text-red-400 text-sm mt-1">{formErrors.duration}</p>}
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
          <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 px-4 rounded">
            {submitting ? "Saving..." : "Create Session"}
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
