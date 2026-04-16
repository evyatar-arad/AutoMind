"use client";

import React, { createContext, useContext, useState } from "react";
import { mockVehicles } from "@/lib/mockData";
import type { VehicleData, ServiceRecord } from "@/lib/mockData";

interface VehicleContextType {
  vehicles: VehicleData[];
  activeVehicle: VehicleData;
  activeVehicleId: number;
  setActiveVehicleId: (id: number) => void;
  addVehicle: (v: VehicleData) => void;
  addServiceRecord: (vehicleId: number, record: ServiceRecord) => void;
}

const VehicleContext = createContext<VehicleContextType | null>(null);

export function useVehicle(): VehicleContextType {
  const ctx = useContext(VehicleContext);
  if (!ctx) throw new Error("useVehicle must be used within <VehicleProvider>");
  return ctx;
}

export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<VehicleData[]>(mockVehicles);
  const [activeVehicleId, setActiveVehicleId] = useState<number>(
    mockVehicles[0].car.id
  );

  const activeVehicle =
    vehicles.find((v) => v.car.id === activeVehicleId) ?? vehicles[0];

  const addVehicle = (v: VehicleData) => {
    setVehicles((prev) => [...prev, v]);
    setActiveVehicleId(v.car.id);
  };

  const addServiceRecord = (vehicleId: number, record: ServiceRecord) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.car.id === vehicleId
          ? { ...v, serviceHistory: [record, ...v.serviceHistory] }
          : v
      )
    );
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        activeVehicle,
        activeVehicleId,
        setActiveVehicleId,
        addVehicle,
        addServiceRecord,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}
