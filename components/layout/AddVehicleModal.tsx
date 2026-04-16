"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Upload,
  Loader2,
  CheckCircle,
  Car,
  Sparkles,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVehicle } from "@/contexts/VehicleContext";
import { useToast } from "@/components/ui/toast";
import { MOCK_OCR_VEHICLE } from "@/lib/mockData";
import type { VehicleData } from "@/lib/mockData";

interface Props {
  open: boolean;
  onClose: () => void;
}

type OcrState = "idle" | "loading" | "done";

const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric", "LPG"];
const TRANSMISSIONS = ["Automatic", "Manual", "CVT"];

export function AddVehicleModal({ open, onClose }: Props) {
  const { addVehicle } = useVehicle();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [ocrState, setOcrState] = useState<OcrState>("idle");
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    licensePlate: "",
    hand: 1,
    color: "",
    fuelType: "Petrol",
    transmission: "Automatic",
    km: 0,
    officialValue: 0,
    marketValue: 0,
  });

  const update = (field: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOcrState("loading");

    setTimeout(() => {
      setForm((prev) => ({
        ...prev,
        make: MOCK_OCR_VEHICLE.make,
        model: MOCK_OCR_VEHICLE.model,
        year: MOCK_OCR_VEHICLE.year,
        licensePlate: MOCK_OCR_VEHICLE.licensePlate,
        hand: MOCK_OCR_VEHICLE.hand,
        color: MOCK_OCR_VEHICLE.color,
        fuelType: MOCK_OCR_VEHICLE.fuelType,
        transmission: MOCK_OCR_VEHICLE.transmission,
        km: MOCK_OCR_VEHICLE.km,
        officialValue: MOCK_OCR_VEHICLE.officialValue,
        marketValue: MOCK_OCR_VEHICLE.marketValue,
      }));
      setOcrState("done");
      toast({
        variant: "success",
        title: "Document scanned!",
        description: "Vehicle details extracted automatically. Review and confirm.",
      });
    }, 2200);
  };

  const handleSubmit = () => {
    if (!form.make || !form.model || !form.licensePlate) {
      toast({
        variant: "error",
        title: "Missing fields",
        description: "Please fill in Make, Model, and License Plate.",
      });
      return;
    }

    const sparkBase = form.marketValue || 50000;
    const newVehicle: VehicleData = {
      car: {
        id: Date.now(),
        make: form.make,
        model: form.model,
        year: form.year,
        km: form.km,
        hand: form.hand,
        color: form.color || "Unknown",
        licensePlate: form.licensePlate,
        fuelType: form.fuelType,
        transmission: form.transmission,
        officialValue: form.officialValue || sparkBase + 8000,
        marketValue: form.marketValue || sparkBase,
        previousMarketValue: (form.marketValue || sparkBase) + 2500,
        vin: "VIN" + Math.random().toString(36).slice(2, 12).toUpperCase(),
      },
      serviceHistory: [],
      maintenanceAlerts: [
        {
          id: 1,
          type: "Add First Service Record",
          urgency: "info",
          kmUntil: 0,
          description:
            "Upload your first service receipt to start building your car's history.",
          estimatedCost: 0,
          icon: "Info",
        },
      ],
      sparklineValues: Array.from({ length: 6 }, (_, i) =>
        Math.round((form.marketValue || sparkBase) + (5 - i) * 800)
      ),
      chatWelcome: `Hello! I'm your **AutoMind AI Mechanic**. I've loaded the ${form.year} ${form.make} ${form.model} owner manual.\n\nHow can I help you today?`,
    };

    addVehicle(newVehicle);
    toast({
      variant: "success",
      title: "Vehicle added!",
      description: `${form.make} ${form.model} (${form.year}) is now in your garage.`,
    });
    handleClose();
  };

  const handleClose = () => {
    setOcrState("idle");
    setForm({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      licensePlate: "",
      hand: 1,
      color: "",
      fuelType: "Petrol",
      transmission: "Automatic",
      km: 0,
      officialValue: 0,
      marketValue: 0,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Add New Vehicle"
      description="Upload your car's ownership document to auto-fill details, or enter them manually."
    >
      {/* OCR upload zone */}
      <div className="mb-5">
        <input
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <AnimatePresence mode="wait">
          {ocrState === "idle" && (
            <motion.button
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-xl border-2 border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 transition-all p-5 flex flex-col items-center gap-3 group"
            >
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-primary">
                  Upload Car License / Ownership Document
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPEG, PNG or PDF &middot; AI will extract all details automatically
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Hebrew & English supported
              </div>
            </motion.button>
          )}

          {ocrState === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full rounded-xl border border-border bg-muted/30 p-5 flex flex-col items-center gap-3"
            >
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm font-semibold">AI processing document…</p>
              <p className="text-xs text-muted-foreground">
                Extracting vehicle details from your document
              </p>
            </motion.div>
          )}

          {ocrState === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20 p-4 flex items-center gap-3"
            >
              <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                  Document scanned successfully
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Fields auto-filled — review below and confirm
                </p>
              </div>
              <button
                onClick={() => { setOcrState("idle"); fileRef.current!.value = ""; }}
                className="text-xs text-muted-foreground hover:text-foreground shrink-0"
              >
                Re-scan
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Form */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Make *">
            <Input
              value={form.make}
              onChange={(e) => update("make", e.target.value)}
              placeholder="e.g. Toyota"
              className={ocrState === "done" ? "border-green-400 dark:border-green-600" : ""}
            />
          </Field>
          <Field label="Model *">
            <Input
              value={form.model}
              onChange={(e) => update("model", e.target.value)}
              placeholder="e.g. Corolla"
              className={ocrState === "done" ? "border-green-400 dark:border-green-600" : ""}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Year">
            <Input
              type="number"
              value={form.year}
              onChange={(e) => update("year", parseInt(e.target.value))}
              min={1980}
              max={new Date().getFullYear() + 1}
              className={ocrState === "done" ? "border-green-400 dark:border-green-600" : ""}
            />
          </Field>
          <Field label="License Plate *">
            <Input
              value={form.licensePlate}
              onChange={(e) => update("licensePlate", e.target.value)}
              placeholder="e.g. 123-456-78"
              className={ocrState === "done" ? "border-green-400 dark:border-green-600" : ""}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Current KM">
            <Input
              type="number"
              value={form.km || ""}
              onChange={(e) => update("km", parseInt(e.target.value) || 0)}
              placeholder="e.g. 65000"
              className={ocrState === "done" ? "border-green-400 dark:border-green-600" : ""}
            />
          </Field>
          <Field label="Ownership (Hand)">
            <Input
              type="number"
              value={form.hand}
              onChange={(e) => update("hand", parseInt(e.target.value) || 1)}
              min={1}
              max={10}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Fuel Type">
            <select
              value={form.fuelType}
              onChange={(e) => update("fuelType", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {FUEL_TYPES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </Field>
          <Field label="Transmission">
            <select
              value={form.transmission}
              onChange={(e) => update("transmission", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {TRANSMISSIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Color">
          <Input
            value={form.color}
            onChange={(e) => update("color", e.target.value)}
            placeholder="e.g. Pearl White"
            className={ocrState === "done" ? "border-green-400 dark:border-green-600" : ""}
          />
        </Field>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <Button variant="outline" className="flex-1" onClick={handleClose}>
          Cancel
        </Button>
        <Button className="flex-1 gap-2" onClick={handleSubmit}>
          <Car className="h-4 w-4" />
          Add Vehicle
        </Button>
      </div>
    </Dialog>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
