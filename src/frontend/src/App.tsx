import { Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ExerciseList from "./components/ExerciseList";
import SessionList from "./components/SessionList";
import SessionDetail from "./components/SessionDetail";

function App() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-3xl font-bold ${isActive ? "text-blue-400" : "text-gray-400 hover:text-gray-200"}`;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="flex gap-4 mb-6">
        <NavLink to="/" end className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/sessions" className={linkClass}>
          Sessions
        </NavLink>
        <NavLink to="/exercises" className={linkClass}>
          Exercises
        </NavLink>
      </div>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sessions" element={<SessionList />} />
        <Route path="/sessions/:id" element={<SessionDetail />} />
        <Route path="/exercises" element={<ExerciseList />} />
      </Routes>
    </div>
  );
}

export default App;
