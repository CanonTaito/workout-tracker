import { useToast } from "./ToastContext";

const bgMap = {
  success: "bg-green-600",
  error: "bg-red-600",
  info: "bg-blue-600",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${bgMap[toast.type]} text-white px-4 py-3 rounded shadow-lg flex items-center gap-3 animate-slide-in`}
        >
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="text-white/80 hover:text-white text-lg leading-none">&times;</button>
        </div>
      ))}
    </div>
  );
}
