"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardList,
  Bot,
  Wrench,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Zap,
  Car,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { AddVehicleModal } from "./AddVehicleModal";
import { useVehicle } from "@/contexts/VehicleContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/history", label: "Service History", icon: ClipboardList },
  { href: "/ai-mechanic", label: "AI Mechanic", icon: Bot },
  { href: "/marketplace", label: "Find Garage", icon: Wrench },
];

// ─── Vehicle Switcher ─────────────────────────────────────────────────────────

function VehicleSwitcher({
  collapsed,
  onAddVehicle,
}: {
  collapsed: boolean;
  onAddVehicle: () => void;
}) {
  const { vehicles, activeVehicle, setActiveVehicleId } = useVehicle();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (collapsed) {
    return (
      <div className="flex justify-center py-2 px-2">
        <button
          title={`${activeVehicle.car.make} ${activeVehicle.car.model}`}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted hover:bg-accent transition-colors"
        >
          <Car className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative px-2 py-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 bg-muted/50 hover:bg-muted transition-colors"
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 shrink-0">
          <Car className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="text-xs font-semibold truncate">
            {activeVehicle.car.make} {activeVehicle.car.model}
          </div>
          <div className="text-xs text-muted-foreground">
            {activeVehicle.car.year} &middot; {activeVehicle.car.km.toLocaleString()} km
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            {vehicles.map((v) => (
              <button
                key={v.car.id}
                onClick={() => {
                  setActiveVehicleId(v.car.id);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition-colors text-left",
                  v.car.id === activeVehicle.car.id && "bg-primary/5"
                )}
              >
                <Car className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {v.car.make} {v.car.model}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {v.car.year} &middot; {v.car.licensePlate}
                  </div>
                </div>
                {v.car.id === activeVehicle.car.id && (
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                )}
              </button>
            ))}

            <div className="border-t border-border">
              <button
                onClick={() => {
                  setOpen(false);
                  onAddVehicle();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition-colors text-primary"
              >
                <Plus className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium">Add New Vehicle</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="relative flex flex-col h-screen border-r border-border bg-card shrink-0 overflow-visible z-20"
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shrink-0">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-bold text-lg tracking-tight text-foreground whitespace-nowrap overflow-hidden"
                >
                  AutoMind
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Vehicle Switcher */}
        <div className="border-b border-border overflow-hidden">
          <VehicleSwitcher
            collapsed={collapsed}
            onAddVehicle={() => setShowAddVehicle(true)}
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <AnimatePresence initial={false}>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm font-medium whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-2 border-t border-border space-y-1">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer",
              collapsed && "justify-center px-0"
            )}
            title={collapsed ? "Settings" : undefined}
          >
            <Settings className="h-5 w-5 shrink-0" />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className={cn(collapsed && "flex justify-center")}>
            <ThemeToggle collapsed={collapsed} />
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md hover:text-foreground transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </motion.aside>

      {/* Add Vehicle Modal — rendered at sibling level to avoid overflow clipping */}
      <AddVehicleModal
        open={showAddVehicle}
        onClose={() => setShowAddVehicle(false)}
      />
    </>
  );
}
