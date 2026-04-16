"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Info,
  Zap,
  CheckCircle2,
  ChevronRight,
  Wrench,
  MessageSquarePlus,
  X,
  ScanLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VISUAL_DIAGNOSES } from "@/lib/diagnoses";
import type { VisualDiagnosis } from "@/lib/diagnoses";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ─── Scan phases ──────────────────────────────────────────────────────────────

const PHASES = [
  { label: "Uploading image…", to: 33 },
  { label: "Detecting warning indicators…", to: 66 },
  { label: "Cross-referencing OBD-II database…", to: 100 },
];

const severityConfig = {
  critical: {
    badge: "destructive" as const,
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
    label: "Critical — Stop Driving",
  },
  high: {
    badge: "warning" as const,
    icon: AlertTriangle,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
    label: "High Priority",
  },
  moderate: {
    badge: "info" as const,
    icon: Info,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
    label: "Moderate — Schedule Soon",
  },
  low: {
    badge: "secondary" as const,
    icon: Info,
    color: "text-muted-foreground",
    bg: "bg-muted/50 border-border",
    label: "Low Priority",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface VisualDiagnosticModalProps {
  imageUrl: string;
  onClose: () => void;
  onAddToChat: (diagnosis: VisualDiagnosis, imageUrl: string) => void;
}

export default function VisualDiagnosticModal({
  imageUrl,
  onClose,
  onAddToChat,
}: VisualDiagnosticModalProps) {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [diagnosis] = useState<VisualDiagnosis>(
    () => VISUAL_DIAGNOSES[Date.now() % VISUAL_DIAGNOSES.length]
  );

  // Drive the progress animation: 3 phases × 1 second each
  useEffect(() => {
    let raf: number;
    const startTime = performance.now();
    const totalDuration = 3000; // 3 seconds

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(pct);

      const newPhase = pct < 33 ? 0 : pct < 66 ? 1 : 2;
      setPhase(newPhase);

      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setDone(true), 200);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const cfg = severityConfig[diagnosis.severity];
  const SeverityIcon = cfg.icon;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <ScanLine className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-bold">Visual AI Diagnostic</h2>
                <p className="text-xs text-muted-foreground">Analyzing your image…</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Image + scan overlay */}
            <div className="relative rounded-xl overflow-hidden bg-muted/30 border border-border flex items-center justify-center h-36">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Diagnostic image"
                className="max-w-full max-h-full object-contain"
              />
              {!done && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="flex flex-col items-center gap-2"
                  >
                    <ScanLine className="h-8 w-8 text-primary" />
                    <p className="text-xs text-white font-semibold">Scanning…</p>
                  </motion.div>
                </div>
              )}
              {done && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Scan Complete
                </motion.div>
              )}
            </div>

            {/* Progress */}
            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">
                      {PHASES[phase].label}
                    </span>
                    <span className="text-primary font-bold">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex gap-2">
                    {PHASES.map((p, i) => (
                      <div
                        key={p.label}
                        className={cn(
                          "flex-1 h-0.5 rounded-full transition-colors duration-300",
                          i <= phase ? "bg-primary" : "bg-muted"
                        )}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : (
                /* ── Diagnosis result ── */
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Fault identified banner */}
                  <div className={cn("rounded-xl border p-4 flex items-start gap-3", cfg.bg)}>
                    <SeverityIcon className={cn("h-5 w-5 shrink-0 mt-0.5", cfg.color)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-sm font-bold">{diagnosis.lightName}</span>
                        <Badge variant={cfg.badge} className="text-xs">
                          {cfg.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                        <code className="bg-muted/60 px-1.5 py-0.5 rounded font-mono">
                          {diagnosis.code}
                        </code>
                        <span>{diagnosis.codeDesc}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-foreground/80">
                        {diagnosis.description}
                      </p>
                    </div>
                  </div>

                  {/* Recommended actions */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Recommended Actions
                    </p>
                    <ul className="space-y-1.5">
                      {diagnosis.actions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Estimated cost */}
                  {diagnosis.estimatedCost > 0 && (
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                      <span className="text-xs text-muted-foreground">Estimated repair cost</span>
                      <span className="text-sm font-bold text-primary">
                        {formatCurrency(diagnosis.estimatedCost)}
                      </span>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      className="flex-1 gap-2"
                      asChild
                      onClick={onClose}
                    >
                      <Link href="/marketplace">
                        <Wrench className="h-4 w-4" />
                        Find Garage
                      </Link>
                    </Button>
                    <Button
                      className="flex-1 gap-2"
                      onClick={() => onAddToChat(diagnosis, imageUrl)}
                    >
                      <MessageSquarePlus className="h-4 w-4" />
                      Add to Chat
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
