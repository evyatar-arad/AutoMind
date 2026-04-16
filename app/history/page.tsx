"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  CheckCircle,
  Clock,
  MapPin,
  Wrench,
  Receipt,
  Package,
  ArrowUpFromLine,
  FileText,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
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
import { useToast } from "@/components/ui/toast";
import { MOCK_OCR_RECEIPT } from "@/lib/mockData";
import type { ServiceRecord } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.35, ease: "easeOut" },
  }),
};

type UploadState = "idle" | "processing" | "done";

function ServiceCard({
  record,
  index,
  isLast,
}: {
  record: ServiceRecord;
  index: number;
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="relative pl-10"
    >
      {/* Timeline dot + connector */}
      <div className="absolute left-0 top-5 flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-primary border-2 border-background ring-2 ring-primary/30 z-10" />
        {!isLast && (
          <div className="w-0.5 bg-border flex-1 min-h-[60px] mt-1" />
        )}
      </div>

      <Card className="mb-4 hover:shadow-md transition-shadow">
        <CardHeader
          className="pb-3 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant="secondary" className="text-xs shrink-0">
                  {new Date(record.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Badge>
                {record.receiptUploaded && (
                  <Badge variant="success" className="text-xs shrink-0">
                    <Receipt className="h-3 w-3 mr-1" />
                    Receipt
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base">{record.type}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {record.garage} &middot; {record.km.toLocaleString()} km
              </CardDescription>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xl font-bold text-foreground">
                {formatCurrency(record.cost)}
              </div>
              <span className="text-muted-foreground">
                {expanded ? (
                  <ChevronUp className="h-4 w-4 ml-auto mt-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-auto mt-1" />
                )}
              </span>
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <CardContent className="pt-0 space-y-4">
                <div className="h-px bg-border" />
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{record.garageAddress}</span>
                </div>
                {record.parts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-sm font-medium mb-2">
                      <Package className="h-4 w-4 text-primary" />
                      Parts Replaced
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {record.parts.map((part) => (
                        <span
                          key={part}
                          className="inline-flex items-center text-xs bg-muted rounded-md px-2.5 py-1"
                        >
                          {part}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-medium mb-1.5">
                    <FileText className="h-4 w-4 text-primary" />
                    Technician Notes
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 rounded-lg p-3">
                    {record.notes}
                  </p>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export default function History() {
  const { activeVehicle, activeVehicleId, addServiceRecord } = useVehicle();
  const { toast } = useToast();
  const history = activeVehicle.serviceHistory;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>("idle");

  const processFile = (_file: File) => {
    setUploadState("processing");
    setTimeout(() => {
      const newRecord: ServiceRecord = {
        ...MOCK_OCR_RECEIPT,
        id: Date.now(),
      };
      addServiceRecord(activeVehicleId, newRecord);
      setUploadState("done");
      toast({
        variant: "success",
        title: "Receipt processed!",
        description:
          "AI extracted service details and added the record to your timeline.",
      });
      setTimeout(() => setUploadState("idle"), 3000);
    }, 2200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const totalSpent = history.reduce((s, r) => s + r.cost, 0);

  return (
    <div className="min-h-screen p-6 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Service History</h1>
          <p className="text-muted-foreground mt-0.5">
            {history.length} records &middot; {activeVehicle.car.make}{" "}
            {activeVehicle.car.model} {activeVehicle.car.year}
          </p>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2 shrink-0"
          onClick={() =>
            toast({
              variant: "info",
              title: "QR Export",
              description: "QR code export is coming in v1.1.",
            })
          }
        >
          <QrCode className="h-4 w-4" />
          Export to QR
        </Button>
      </motion.div>

      {/* Upload Receipt Zone */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <AnimatePresence mode="wait">
          {uploadState === "processing" ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-border bg-muted/30 p-8 flex flex-col items-center gap-3"
            >
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm font-semibold">AI processing receipt…</p>
              <p className="text-xs text-muted-foreground">
                Extracting garage name, date, parts, and cost
              </p>
            </motion.div>
          ) : uploadState === "done" ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20 p-6 flex items-center gap-4"
            >
              <div className="p-2.5 rounded-full bg-green-100 dark:bg-green-900/40">
                <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                  Receipt added to timeline
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                  All details extracted and saved. Check the top of the timeline.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-xl border-2 border-dashed transition-all duration-200 p-8 text-center cursor-pointer group ${
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`p-3 rounded-full transition-colors ${
                    isDragging
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary"
                  }`}
                >
                  <ArrowUpFromLine className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {isDragging
                      ? "Drop your receipt here"
                      : "Upload a Service Receipt"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Drag & drop or click to browse &middot; AI extracts all
                    details automatically
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    JPEG, PNG, PDF
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    AI OCR powered
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Hebrew & English
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Summary stats */}
      <motion.div
        custom={1.5}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 gap-3"
      >
        {[
          { label: "Total Spent", value: formatCurrency(totalSpent), icon: Receipt },
          { label: "Services", value: `${history.length} records`, icon: Wrench },
          {
            label: "Last Service",
            value:
              history.length > 0
                ? new Date(history[0].date).toLocaleDateString("en-GB", {
                    month: "short",
                    year: "numeric",
                  })
                : "None yet",
            icon: Clock,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-4 flex flex-col items-center text-center gap-1"
            >
              <Icon className="h-4 w-4 text-primary mb-1" />
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          );
        })}
      </motion.div>

      {/* Timeline */}
      {history.length === 0 ? (
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-center py-12 text-muted-foreground"
        >
          <Receipt className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No service records yet</p>
          <p className="text-xs mt-1">Upload your first receipt above to get started</p>
        </motion.div>
      ) : (
        <div className="space-y-0 pt-2">
          {history.map((record, index) => (
            <ServiceCard
              key={record.id}
              record={record}
              index={index}
              isLast={index === history.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
