import { useCallback, useState } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { ToastContext } from "./useToast";


export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = (id) => setToasts((list) => list.filter((t) => t.id !== id));

  const show = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list, { id, message, type }]);
    setTimeout(() => dismiss(id), 4000);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-60 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2" aria-live="polite">
        {toasts.map((t) => {
          const Icon = t.type === "error" ? XCircle : CheckCircle2;
          return (
            <div key={t.id} className="pointer-events-auto flex items-start gap-3 rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink shadow-lg">
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${t.type === "error" ? "text-red-600" : "text-brand-600"}`} aria-hidden />
              <p className="flex-1">{t.message}</p>
              <button type="button" onClick={() => dismiss(t.id)} className="text-body hover:text-ink" aria-label="Dismiss">
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
