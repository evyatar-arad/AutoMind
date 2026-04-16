export interface VisualDiagnosis {
  id: string;
  lightName: string;
  code: string;
  codeDesc: string;
  severity: "critical" | "high" | "moderate" | "low";
  description: string;
  actions: string[];
  estimatedCost: number;
}

export const VISUAL_DIAGNOSES: VisualDiagnosis[] = [
  {
    id: "check-engine",
    lightName: "Check Engine",
    code: "P0300",
    codeDesc: "Random / Multiple Cylinder Misfire Detected",
    severity: "high",
    description:
      "Multiple cylinder misfires can damage the catalytic converter and significantly affect fuel economy. Common causes include worn spark plugs, faulty ignition coils, or clogged fuel injectors.",
    actions: [
      "Schedule a full OBD-II diagnostic scan within 48 hours",
      "Inspect spark plugs and ignition coils",
      "Check fuel injector spray pattern",
      "Avoid prolonged high-RPM driving until resolved",
    ],
    estimatedCost: 450,
  },
  {
    id: "oil-pressure",
    lightName: "Low Oil Pressure",
    code: "P0520",
    codeDesc: "Engine Oil Pressure Sensor / Switch Circuit Fault",
    severity: "critical",
    description:
      "Critically low oil pressure can cause catastrophic engine damage within minutes of driving. Do not continue driving — pull over immediately and shut off the engine.",
    actions: [
      "STOP the vehicle immediately and turn off the engine",
      "Check oil level with the dipstick after 5 minutes",
      "If oil level is normal, do NOT restart — call roadside assistance",
      "If oil is low, add correct-grade oil and inspect for leaks before driving",
    ],
    estimatedCost: 850,
  },
  {
    id: "battery",
    lightName: "Battery / Charging",
    code: "CHG FAULT",
    codeDesc: "Battery Charging System Fault",
    severity: "high",
    description:
      "The alternator is not sufficiently charging the battery. The car may lose all electrical power within 20–30 minutes of driving. Drive to the nearest garage as soon as possible.",
    actions: [
      "Drive directly to the nearest garage",
      "Disable non-essential electronics (AC, radio, seat heaters)",
      "Inspect battery terminals for corrosion and loose connections",
      "Test alternator output — should read 13.8–14.4 V at idle",
    ],
    estimatedCost: 750,
  },
  {
    id: "brake",
    lightName: "Brake Warning",
    code: "BRAKE",
    codeDesc: "Brake System Fault or Low Brake Fluid Level",
    severity: "critical",
    description:
      "A brake warning light signals a potential safety-critical failure in the braking system — this may include dangerously low brake fluid, a stuck caliper, or a hydraulic leak.",
    actions: [
      "Check brake fluid reservoir level under the hood",
      "Press the brake pedal — if it feels soft or goes to the floor, stop driving immediately",
      "Inspect the ground under the car for brake fluid puddles",
      "Book an emergency brake inspection without delay",
    ],
    estimatedCost: 1200,
  },
  {
    id: "temperature",
    lightName: "Engine Overheating",
    code: "TEMP HIGH",
    codeDesc: "Engine Coolant Temperature Above Safe Operating Range",
    severity: "critical",
    description:
      "Engine overheating can warp cylinder heads and cause irreversible engine damage within minutes. Stop driving and allow the engine to cool down completely.",
    actions: [
      "Pull over safely and turn off the engine immediately",
      "Do NOT open the radiator cap while the engine is hot",
      "Wait at least 30 minutes before checking coolant level",
      "Check for coolant leaks around hoses and the radiator",
      "Call roadside assistance if coolant is leaking",
    ],
    estimatedCost: 1800,
  },
  {
    id: "tpms",
    lightName: "Tire Pressure (TPMS)",
    code: "TPMS",
    codeDesc: "Tire Pressure Monitoring System — Low Pressure Detected",
    severity: "low",
    description:
      "One or more tires is significantly under-inflated. Under-inflated tires reduce fuel efficiency, cause uneven tread wear, and can increase the risk of a blowout at highway speeds.",
    actions: [
      "Check all 4 tire pressures at the nearest gas station",
      "Refer to the sticker inside the driver's door for correct PSI",
      "Inspect for a slow puncture or nail in the tread",
      "Reset the TPMS system after inflating to correct pressure",
    ],
    estimatedCost: 80,
  },
  {
    id: "abs",
    lightName: "ABS Warning",
    code: "C0040",
    codeDesc: "ABS Wheel Speed Sensor Circuit Fault",
    severity: "moderate",
    description:
      "The Anti-lock Braking System has a fault and is currently disabled. Normal braking still functions, but in emergency stops your wheels may lock — increasing stopping distance on wet or slippery roads.",
    actions: [
      "Schedule an ABS diagnostic scan at your earliest convenience",
      "Inspect the ABS wheel speed sensors for damage or debris",
      "Drive cautiously — increase following distance in wet conditions",
      "Avoid relying on hard braking until the system is repaired",
    ],
    estimatedCost: 350,
  },
];
