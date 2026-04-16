"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastVariant = "success" | "error" | "info" | "loading";

interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
}

interface ToastOptions {
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (opts: ToastOptions) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ variant, title, description, duration = 4000 }: ToastOptions) => {
      const id = Math.random().toString(36).slice(2, 9);
      setToasts((prev) => [...prev, { id, variant, title, description }]);
      if (variant !== "loading") {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// ─── Toaster Stack ────────────────────────────────────────────────────────────

const iconMap: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />,
  error: <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />,
  info: <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />,
  loading: (
    <Loader2 className="h-5 w-5 text-primary shrink-0 mt-0.5 animate-spin" />
  ),
};

const borderMap: Record<ToastVariant, string> = {
  success: "border-green-200 dark:border-green-800",
  error: "border-red-200 dark:border-red-800",
  info: "border-blue-200 dark:border-blue-800",
  loading: "border-border",
};

function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 64, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 64, scale: 0.92 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-xl min-w-[300px] max-w-[400px] bg-card",
              borderMap[t.variant]
            )}
          >
            {iconMap[t.variant]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">{t.title}</p>
              {t.description && (
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {t.description}
                </p>
              )}
            </div>
            <button
              onClick={() => onDismiss(t.id)}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors -mt-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
