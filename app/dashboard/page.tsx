"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Car,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Info,
  ScanLine,
  Bot,
  Wrench,
  ClipboardList,
  Fuel,
  Gauge,
  Calendar,
  User,
  ArrowRight,
  Shield,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVehicle } from "@/contexts/VehicleContext";
import { formatCurrency, formatKm } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: "easeOut" },
  }),
};

const urgencyConfig = {
  critical: {
    icon: AlertTriangle,
    class: "text-red-500",
    bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
    badge: "destructive" as const,
    label: "Critical",
  },
  warning: {
    icon: AlertTriangle,
    class: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
    badge: "warning" as const,
    label: "Soon",
  },
  info: {
    icon: Info,
    class: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
    badge: "info" as const,
    label: "Upcoming",
  },
};

const quickActions = [
  {
    icon: ScanLine,
    label: "Scan Receipt",
    description: "Upload via OCR",
    href: "/history",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Bot,
    label: "AI Help",
    description: "Ask AI Mechanic",
    href: "/ai-mechanic",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Wrench,
    label: "Find Garage",
    description: "Get instant bids",
    href: "/marketplace",
    color: "from-orange-500 to-amber-600",
  },
  {
    icon: ClipboardList,
    label: "Full History",
    description: "View all records",
    href: "/history",
    color: "from-green-500 to-emerald-600",
  },
];

const SPARK_MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Now"];

export default function Dashboard() {
  const { activeVehicle } = useVehicle();
  const car = activeVehicle.car;
  const alerts = activeVehicle.maintenanceAlerts;
  const spark = activeVehicle.sparklineValues;

  const priceDiff = car.marketValue - car.officialValue;
  const priceDiffPct = ((priceDiff / car.officialValue) * 100).toFixed(1);
  const isDown = priceDiff < 0;

  const prevDiff = car.marketValue - car.previousMarketValue;
  const prevDiffPct = ((prevDiff / car.previousMarketValue) * 100).toFixed(1);

  const sparkMin = Math.min(...spark) * 0.97;
  const sparkMax = Math.max(...spark) * 1.02;

  const ordinal = (n: number) =>
    n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`;

  return (
    <div className="min-h-screen p-6 space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-0.5">
            {car.year} {car.make} {car.model} — {car.licensePlate}
          </p>
        </div>
        {alerts.some((a) => a.urgency === "critical") ? (
          <Badge variant="destructive" className="mt-1">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Action Required
          </Badge>
        ) : (
          <Badge variant="success" className="mt-1">
            <Shield className="h-3 w-3 mr-1" />
            All Systems OK
          </Badge>
        )}
      </motion.div>

      {/* Row 1: Car Profile + Market Value */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Car Profile */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
          <Card className="h-full overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  My Car
                </CardTitle>
                <Badge variant="secondary">{ordinal(car.hand)} Owner</Badge>
              </div>
              <CardDescription>
                {car.licensePlate} &middot; VIN ending in {car.vin.slice(-6)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Car visual */}
              <div className="relative rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 h-36 flex items-center justify-center mb-5 overflow-hidden">
                <Car className="h-20 w-20 text-slate-400 dark:text-slate-600" />
                <div className="absolute bottom-3 right-3 text-xs text-slate-500 font-medium">
                  {car.color}
                </div>
                <div className="absolute top-3 left-3 bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-md">
                  {car.year}
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Car, label: "Model", value: `${car.make} ${car.model}` },
                  { icon: Calendar, label: "Year", value: car.year.toString() },
                  { icon: Gauge, label: "Mileage", value: formatKm(car.km) },
                  { icon: User, label: "Ownership", value: `${ordinal(car.hand)} Owner` },
                  { icon: Fuel, label: "Fuel", value: car.fuelType },
                  { icon: Shield, label: "Gearbox", value: car.transmission },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/50"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground leading-none mb-0.5">
                          {stat.label}
                        </div>
                        <div className="text-sm font-semibold truncate">
                          {stat.value}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Market Value */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Market Value
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  Updated today
                </Badge>
              </div>
              <CardDescription>
                Official valuation vs. live market prices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Price comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-muted/50 p-4">
                  <div className="text-xs text-muted-foreground mb-1">Official Value</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(car.officialValue)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Gov. appraisal</div>
                </div>
                <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
                  <div className="text-xs text-muted-foreground mb-1">Market Price</div>
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(car.marketValue)}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs mt-1 ${
                      isDown ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {isDown ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <TrendingUp className="h-3 w-3" />
                    )}
                    {Math.abs(Number(priceDiffPct))}% vs official
                  </div>
                </div>
              </div>

              {/* Dynamic sparkline */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>6-Month Trend</span>
                  <span className={prevDiff < 0 ? "text-red-500" : "text-green-500"}>
                    {prevDiff < 0 ? "" : "+"}
                    {formatCurrency(prevDiff)} ({prevDiffPct}%)
                  </span>
                </div>
                <div className="flex items-end gap-1 h-16">
                  {spark.map((val, i) => {
                    const heightPct =
                      ((val - sparkMin) / (sparkMax - sparkMin)) * 100;
                    return (
                      <div
                        key={i}
                        className="flex-1 rounded-sm transition-all"
                        style={{
                          height: `${Math.max(heightPct, 8)}%`,
                          background:
                            i === spark.length - 1
                              ? "hsl(var(--primary))"
                              : "hsl(var(--muted-foreground) / 0.3)",
                        }}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  {SPARK_MONTHS.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>

              {/* Insight */}
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-3 flex items-start gap-2">
                <TrendingDown className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Market price has dropped{" "}
                  <span className="font-semibold">
                    {formatCurrency(Math.abs(prevDiff))}
                  </span>{" "}
                  since last quarter. Consider selling before next service cycle.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Row 2: Action Center */}
      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Action Center</CardTitle>
            <CardDescription>Quick access to your most-used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.label} href={action.href}>
                    <motion.div
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all cursor-pointer"
                    >
                      <div
                        className={`p-2.5 rounded-lg bg-gradient-to-br ${action.color}`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold">{action.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Row 3: Predictive Maintenance */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Predictive Maintenance</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/marketplace" className="flex items-center gap-1">
                  Book Service
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
            <CardDescription>
              AI-predicted upcoming service needs based on your mileage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No maintenance alerts. Your car is up to date!
              </div>
            ) : (
              alerts.map((alert) => {
                const cfg = urgencyConfig[alert.urgency];
                const Icon = cfg.icon;
                return (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-3 rounded-lg border p-4 ${cfg.bg}`}
                  >
                    <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${cfg.class}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold">{alert.type}</span>
                        <Badge variant={cfg.badge} className="text-xs">
                          {cfg.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alert.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      {alert.estimatedCost > 0 && (
                        <>
                          <div className="text-xs text-muted-foreground">Est. cost</div>
                          <div className="text-sm font-semibold">
                            {formatCurrency(alert.estimatedCost)}
                          </div>
                        </>
                      )}
                      {alert.kmUntil > 0 && (
                        <div className="text-xs text-muted-foreground">
                          in {formatKm(alert.kmUntil)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
