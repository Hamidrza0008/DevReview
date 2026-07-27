"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

const ToastContext = createContext();

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((type, message, duration = 3200) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => dismissToast(id), duration);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2 pointer-events-none w-[calc(100%-2rem)] sm:w-auto">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
              className={`pointer-events-auto flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl border text-sm font-bold md:backdrop-blur-md ${
                toast.type === "success"
                  ? "bg-accent-soft/95 border-accent/30 text-accent"
                  : toast.type === "warning"
                  ? "bg-star/10 border-star/30 text-star"
                  : "bg-danger/10 border-danger/30 text-danger"
              }`}
            >
              {toast.type === "success" && <CheckCircle2 className="w-5 h-5 shrink-0" />}
              {toast.type === "warning" && <AlertCircle className="w-5 h-5 shrink-0" />}
              {toast.type === "error" && <XCircle className="w-5 h-5 shrink-0" />}
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
