// ─── Types ────────────────────────────────────────────────────────────────────

export interface CarProfile {
  id: number;
  make: string;
  model: string;
  year: number;
  km: number;
  hand: number;
  color: string;
  licensePlate: string;
  fuelType: string;
  transmission: string;
  officialValue: number;
  marketValue: number;
  previousMarketValue: number;
  vin: string;
}

export interface ServiceRecord {
  id: number;
  date: string;
  type: string;
  garage: string;
  garageAddress: string;
  cost: number;
  km: number;
  parts: string[];
  notes: string;
  receiptUploaded: boolean;
}

export interface MaintenanceAlert {
  id: number;
  type: string;
  urgency: "critical" | "warning" | "info";
  kmUntil: number;
  description: string;
  estimatedCost: number;
  icon: string;
}

export interface ServiceCatalogItem {
  name: string;
  price: number;
  category?: string;
}

export interface GarageBid {
  id: number;
  name: string;
  location: string;
  city: "Beer Sheva" | "Tel Aviv" | "Haifa" | "Jerusalem";
  lat: number;
  lng: number;
  rating: number;
  reviews: number;
  price: number;
  etaDays: string;
  services: string[];
  catalog: ServiceCatalogItem[];
  badge: string;
  badgeColor: string;
  verified: boolean;
  phone: string;
  responseTime: string;
  specialty: string;
  description: string;
  openHours: string;
  mapX: number; // 0–100 % for legacy SVG MockMap
  mapY: number;
}

export interface ChatMessage {
  id: number;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  imageUrl?: string;
}

export interface VehicleData {
  car: CarProfile;
  serviceHistory: ServiceRecord[];
  maintenanceAlerts: MaintenanceAlert[];
  sparklineValues: number[];
  chatWelcome: string;
}

// ─── Vehicle 1: Hyundai Tucson 2021 ──────────────────────────────────────────

const tucsonHistory: ServiceRecord[] = [
  {
    id: 1,
    date: "2024-03-15",
    type: "Periodic 60,000 km Service",
    garage: "Hyundai Official — Beer Sheva",
    garageAddress: "Derech Hevron 45, Beer Sheva",
    cost: 1850,
    km: 60000,
    parts: ["Engine Oil 5W-30 (5L)", "Oil Filter", "Air Filter", "Cabin Air Filter"],
    notes:
      "All 60-point checks passed. Battery at 82% health. Next service recommended at 70,000 km.",
    receiptUploaded: true,
  },
  {
    id: 2,
    date: "2023-09-10",
    type: "Brake Inspection & Front Pads",
    garage: "AutoCare Pro",
    garageAddress: "Shderot Rager 110, Beer Sheva",
    cost: 650,
    km: 52000,
    parts: ["Front Brake Pads (OEM)"],
    notes:
      "Front pads replaced — 2mm remaining. Rear pads at ~40%, recommend replacement within 10,000–15,000 km. Brake fluid level normal.",
    receiptUploaded: true,
  },
  {
    id: 3,
    date: "2023-02-20",
    type: "Tire Rotation & Wheel Alignment",
    garage: "SpeedFit Tires",
    garageAddress: "Industrial Zone, Beer Sheva",
    cost: 280,
    km: 44000,
    parts: [],
    notes:
      "All four tires rotated (front-to-rear cross pattern). Alignment adjusted to factory spec. Tread depth: FL 5mm, FR 5mm, RL 6mm, RR 6mm.",
    receiptUploaded: false,
  },
];

const tucsonAlerts: MaintenanceAlert[] = [
  {
    id: 1,
    type: "Rear Brake Replacement",
    urgency: "warning",
    kmUntil: 5000,
    description: "Rear brake pads estimated at ~35% — replacement recommended before 70,000 km.",
    estimatedCost: 650,
    icon: "AlertTriangle",
  },
  {
    id: 2,
    type: "Periodic 70,000 km Service",
    urgency: "info",
    kmUntil: 5000,
    description: "Next full periodic service due at 70,000 km. Includes oil change, filters, and full inspection.",
    estimatedCost: 1800,
    icon: "Info",
  },
  {
    id: 3,
    type: "Cabin Air Filter",
    urgency: "info",
    kmUntil: 15000,
    description: "Cabin air filter last replaced at 60,000 km. Hyundai recommends replacement every 20,000 km.",
    estimatedCost: 120,
    icon: "Wind",
  },
];

// ─── Vehicle 2: Toyota Corolla 2019 ──────────────────────────────────────────

const corollaHistory: ServiceRecord[] = [
  {
    id: 1,
    date: "2024-01-20",
    type: "Periodic 80,000 km Service",
    garage: "Toyota Official — Beer Sheva",
    garageAddress: "Hebron Road 72, Beer Sheva",
    cost: 1650,
    km: 80000,
    parts: ["Engine Oil 0W-20 (4.5L)", "Oil Filter", "Spark Plugs ×4"],
    notes:
      "Spark plugs replaced at 80k mark. All 60-point checks passed. Next service at 90,000 km.",
    receiptUploaded: true,
  },
  {
    id: 2,
    date: "2023-05-15",
    type: "Clutch Replacement",
    garage: "Transmission Expert BS",
    garageAddress: "Industrial Zone B, Beer Sheva",
    cost: 3200,
    km: 73000,
    parts: ["Clutch Kit (3-piece OEM)", "Flywheel Resurfacing"],
    notes:
      "Clutch fully replaced due to slippage at low RPM. Flywheel resurfaced. Expected lifespan: 80,000+ km.",
    receiptUploaded: true,
  },
  {
    id: 3,
    date: "2022-09-05",
    type: "Battery & Electrical Check",
    garage: "AutoCare Pro",
    garageAddress: "Shderot Rager 110, Beer Sheva",
    cost: 780,
    km: 64000,
    parts: ["Battery 70Ah AGM", "Battery Terminal Protectors"],
    notes:
      "Old battery at 45% health — replaced. Alternator output normal at 14.3V. No fault codes.",
    receiptUploaded: false,
  },
];

const corollaAlerts: MaintenanceAlert[] = [
  {
    id: 1,
    type: "Timing Belt Replacement",
    urgency: "critical",
    kmUntil: 2000,
    description:
      "Timing belt due at 90,000 km — failure can cause catastrophic engine damage. Book inspection immediately.",
    estimatedCost: 1200,
    icon: "AlertTriangle",
  },
  {
    id: 2,
    type: "Rear Tire Replacement",
    urgency: "warning",
    kmUntil: 8000,
    description: "Rear tires showing uneven wear pattern (~4mm tread remaining). Replacement recommended.",
    estimatedCost: 1600,
    icon: "AlertTriangle",
  },
  {
    id: 3,
    type: "AC Cabin Filter",
    urgency: "info",
    kmUntil: 12000,
    description: "Cabin filter last replaced at 70,000 km. Toyota recommends replacement every 20,000 km.",
    estimatedCost: 120,
    icon: "Wind",
  },
];

// ─── Vehicles Array ────────────────────────────────────────────────────────────

export const mockVehicles: VehicleData[] = [
  {
    car: {
      id: 1,
      make: "Hyundai",
      model: "Tucson",
      year: 2021,
      km: 65000,
      hand: 2,
      color: "Pearl White",
      licensePlate: "123-456-78",
      fuelType: "Petrol",
      transmission: "Automatic",
      officialValue: 92000,
      marketValue: 87500,
      previousMarketValue: 90200,
      vin: "KMHJ341ABMU123456",
    },
    serviceHistory: tucsonHistory,
    maintenanceAlerts: tucsonAlerts,
    sparklineValues: [88000, 89500, 90200, 89000, 88200, 87500],
    chatWelcome:
      "Hello! I'm your **AutoMind AI Mechanic**. I've analyzed your Hyundai Tucson 2021 owner manual and your full service history.\n\nHow can I help you today? You can ask me about warning lights, unusual noises, maintenance questions, or anything about your car.",
  },
  {
    car: {
      id: 2,
      make: "Toyota",
      model: "Corolla",
      year: 2019,
      km: 88000,
      hand: 3,
      color: "Metallic Silver",
      licensePlate: "456-789-01",
      fuelType: "Petrol",
      transmission: "Manual",
      officialValue: 68000,
      marketValue: 65500,
      previousMarketValue: 66800,
      vin: "JTDBR32E190123456",
    },
    serviceHistory: corollaHistory,
    maintenanceAlerts: corollaAlerts,
    sparklineValues: [71000, 70000, 68500, 67200, 66000, 65500],
    chatWelcome:
      "Hello! I'm your **AutoMind AI Mechanic**. I've analyzed your Toyota Corolla 2019 manual and your service history (clutch replaced at 73,000 km, current mileage 88,000 km).\n\n⚠️ I notice a **critical alert**: your timing belt is due for replacement at 90,000 km. How can I assist you today?",
  },
];

// ─── Backward-compat aliases ──────────────────────────────────────────────────

export const mockCar = mockVehicles[0].car;
export const mockServiceHistory = mockVehicles[0].serviceHistory;
export const mockMaintenanceAlerts = mockVehicles[0].maintenanceAlerts;

// ─── Marketplace Garages (20 total) ──────────────────────────────────────────

export const mockGarageBids: GarageBid[] = [
  // ══════════════════════════════════════
  // BEER SHEVA (5)
  // ══════════════════════════════════════
  {
    id: 1,
    name: "Hyundai Official Service Center",
    location: "Derech Hevron 45, Beer Sheva",
    city: "Beer Sheva",
    lat: 31.252,
    lng: 34.791,
    rating: 4.8,
    reviews: 234,
    price: 1750,
    etaDays: "3 business days",
    services: ["Engine oil & filter change", "Air & cabin filter", "60-point inspection", "Fluid top-up", "Battery check", "OBD-II diagnostic scan"],
    catalog: [
      { name: "Oil Change", price: 380, category: "Engine & Oil" },
      { name: "Front Brake Pads", price: 520, category: "Brakes" },
      { name: "Rear Brake Pads", price: 450, category: "Brakes" },
      { name: "Air Filter", price: 180, category: "Engine & Oil" },
      { name: "Cabin Air Filter", price: 160, category: "AC & Climate" },
      { name: "Tire Rotation", price: 150, category: "Tires & Wheels" },
      { name: "Battery Replacement", price: 850, category: "Electrical" },
      { name: "AC Service & Recharge", price: 780, category: "AC & Climate" },
      { name: "Full Diagnostic Scan", price: 250, category: "Diagnostics" },
    ],
    badge: "Official Dealer",
    badgeColor: "blue",
    verified: true,
    phone: "08-646-1234",
    responseTime: "< 1 hour",
    specialty: "Official Dealer",
    description: "Authorized Hyundai service center with factory-trained technicians and genuine OEM parts. Full warranty on all labor and parts.",
    openHours: "Sun–Thu 08:00–18:00 | Fri 08:00–13:00",
    mapX: 55,
    mapY: 72,
  },
  {
    id: 2,
    name: "AutoMaster Beer Sheva",
    location: "Shderot Rager 110, Beer Sheva",
    city: "Beer Sheva",
    lat: 31.245,
    lng: 34.803,
    rating: 4.6,
    reviews: 156,
    price: 1380,
    etaDays: "1 business day",
    services: ["Engine oil & filter change", "Air filter replacement", "30-point inspection", "Fluid top-up", "Brake system check"],
    catalog: [
      { name: "Oil Change", price: 320, category: "Engine & Oil" },
      { name: "Front Brake Pads", price: 450, category: "Brakes" },
      { name: "Rear Brake Pads", price: 380, category: "Brakes" },
      { name: "Air Filter", price: 150, category: "Engine & Oil" },
      { name: "Alternator Replacement", price: 1100, category: "Electrical" },
      { name: "Tire Repair", price: 90, category: "Tires & Wheels" },
      { name: "Brake Fluid Flush", price: 220, category: "Brakes" },
    ],
    badge: "Top Rated",
    badgeColor: "green",
    verified: true,
    phone: "08-623-5678",
    responseTime: "< 30 min",
    specialty: "General Service",
    description: "Family-owned garage with 20+ years of experience. Fast turnaround, transparent pricing, and no hidden fees.",
    openHours: "Sun–Thu 07:30–19:00 | Fri 07:30–14:00",
    mapX: 63,
    mapY: 69,
  },
  {
    id: 3,
    name: "GarageHub Express",
    location: "Industrial Zone, Kiryat Gat Rd, Beer Sheva",
    city: "Beer Sheva",
    lat: 31.238,
    lng: 34.778,
    rating: 4.2,
    reviews: 89,
    price: 950,
    etaDays: "Same day",
    services: ["Engine oil & filter change", "Air filter replacement", "Basic visual check", "Tire repair"],
    catalog: [
      { name: "Oil Change", price: 280, category: "Engine & Oil" },
      { name: "Front Brake Pads", price: 380, category: "Brakes" },
      { name: "Rear Brake Pads", price: 320, category: "Brakes" },
      { name: "Tire Repair", price: 70, category: "Tires & Wheels" },
      { name: "Battery Replacement", price: 720, category: "Electrical" },
    ],
    badge: "Best Price",
    badgeColor: "orange",
    verified: false,
    phone: "08-611-9900",
    responseTime: "< 2 hours",
    specialty: "General Service",
    description: "No-frills budget garage with quick service. Ideal for oil changes and tire repairs.",
    openHours: "Sun–Fri 08:00–20:00",
    mapX: 49,
    mapY: 76,
  },
  {
    id: 4,
    name: "SpeedFit Tires Beer Sheva",
    location: "HaTa'asiya 12, Beer Sheva Industrial Zone",
    city: "Beer Sheva",
    lat: 31.259,
    lng: 34.812,
    rating: 4.7,
    reviews: 201,
    price: 1100,
    etaDays: "Same day",
    services: ["Tire fitting & balancing", "Wheel alignment", "Nitrogen inflation", "Tire rotation", "TPMS service", "Run-flat installation"],
    catalog: [
      { name: "Tire Rotation", price: 120, category: "Tires & Wheels" },
      { name: "Wheel Alignment", price: 280, category: "Tires & Wheels" },
      { name: "Tire Balancing (per wheel)", price: 60, category: "Tires & Wheels" },
      { name: "Summer Tire Set (195/65R15)", price: 1600, category: "Tires & Wheels" },
      { name: "Winter Tire Set (195/65R15)", price: 1800, category: "Tires & Wheels" },
      { name: "Tire Repair", price: 65, category: "Tires & Wheels" },
      { name: "TPMS Sensor Replacement", price: 280, category: "Tires & Wheels" },
    ],
    badge: "Tire Specialist",
    badgeColor: "green",
    verified: true,
    phone: "08-634-7788",
    responseTime: "< 1 hour",
    specialty: "Tire & Wheels",
    description: "The Negev's largest tire specialist. All major brands in stock with same-day fitting. Certified wheel alignment equipment.",
    openHours: "Sun–Thu 08:00–19:00 | Fri 08:00–14:00",
    mapX: 60,
    mapY: 65,
  },
  {
    id: 5,
    name: "ElectroAuto Beer Sheva",
    location: "Shderot Ben Gurion 88, Beer Sheva",
    city: "Beer Sheva",
    lat: 31.263,
    lng: 34.798,
    rating: 4.5,
    reviews: 112,
    price: 1250,
    etaDays: "1 business day",
    services: ["Full electrical diagnostic", "Alternator & starter repair", "Car audio installation", "Dashboard warning lights", "ECU diagnostics", "EV battery check"],
    catalog: [
      { name: "Full Electrical Diagnostic", price: 350, category: "Electrical" },
      { name: "Alternator Replacement", price: 1050, category: "Electrical" },
      { name: "Starter Motor Replacement", price: 780, category: "Electrical" },
      { name: "Battery Replacement", price: 750, category: "Electrical" },
      { name: "ECU Diagnostic & Reset", price: 420, category: "Diagnostics" },
      { name: "Window Regulator", price: 580, category: "Electrical" },
    ],
    badge: "Electrical Expert",
    badgeColor: "blue",
    verified: true,
    phone: "08-618-4455",
    responseTime: "< 45 min",
    specialty: "Electrical & Electronics",
    description: "Specialized electrical and electronics workshop. From basic battery checks to complex ECU reprogramming and EV diagnostics.",
    openHours: "Sun–Thu 08:00–18:00 | Fri 08:00–13:00",
    mapX: 57,
    mapY: 67,
  },

  // ══════════════════════════════════════
  // TEL AVIV (7)
  // ══════════════════════════════════════
  {
    id: 6,
    name: "Tel Aviv Motors",
    location: "Ramat HaHayal 22, Tel Aviv",
    city: "Tel Aviv",
    lat: 32.112,
    lng: 34.837,
    rating: 4.7,
    reviews: 312,
    price: 1850,
    etaDays: "2 business days",
    services: ["Full engine service", "60-point inspection", "Air & cabin filter", "OBD-II scan", "Tire check", "Brake service"],
    catalog: [
      { name: "Oil Change", price: 420, category: "Engine & Oil" },
      { name: "Front Brake Pads", price: 580, category: "Brakes" },
      { name: "Rear Brake Pads", price: 510, category: "Brakes" },
      { name: "Alternator Replacement", price: 1450, category: "Electrical" },
      { name: "AC Service & Recharge", price: 850, category: "AC & Climate" },
      { name: "Battery Replacement", price: 900, category: "Electrical" },
      { name: "Timing Belt", price: 1800, category: "Engine & Oil" },
      { name: "Full Diagnostic Scan", price: 280, category: "Diagnostics" },
    ],
    badge: "Official Network",
    badgeColor: "blue",
    verified: true,
    phone: "03-768-1234",
    responseTime: "< 1 hour",
    specialty: "Official Dealer",
    description: "Multi-brand authorized service center in Ramat HaHayal. Factory-trained technicians, computerized diagnostics, and genuine parts.",
    openHours: "Sun–Thu 07:00–19:00 | Fri 07:00–14:00",
    mapX: 35,
    mapY: 44,
  },
  {
    id: 7,
    name: "SpeedTech TLV",
    location: "Ben Yehuda St 140, Tel Aviv",
    city: "Tel Aviv",
    lat: 32.073,
    lng: 34.773,
    rating: 4.5,
    reviews: 198,
    price: 1450,
    etaDays: "1 business day",
    services: ["Oil change & filter", "Air filter", "Brake inspection", "Fluid top-up", "Quick service guarantee"],
    catalog: [
      { name: "Oil Change", price: 360, category: "Engine & Oil" },
      { name: "Front Brake Pads", price: 490, category: "Brakes" },
      { name: "Rear Brake Pads", price: 420, category: "Brakes" },
      { name: "Tire Repair", price: 95, category: "Tires & Wheels" },
      { name: "Air Filter", price: 170, category: "Engine & Oil" },
      { name: "Windshield Replacement", price: 1200, category: "Body & Glass" },
    ],
    badge: "Fast Service",
    badgeColor: "green",
    verified: true,
    phone: "03-522-9876",
    responseTime: "< 30 min",
    specialty: "General Service",
    description: "Central Tel Aviv's fastest turnaround garage. Book same-day appointments and most services completed within 2 hours.",
    openHours: "Sun–Thu 07:00–20:00 | Fri 07:00–15:00",
    mapX: 42,
    mapY: 40,
  },
  {
    id: 8,
    name: "AutoFix TLV",
    location: "HaArba'a St 17, Tel Aviv",
    city: "Tel Aviv",
    lat: 32.083,
    lng: 34.790,
    rating: 4.1,
    reviews: 76,
    price: 1100,
    etaDays: "Same day",
    services: ["Oil change", "Basic brake check", "Visual inspection", "Tire repair"],
    catalog: [
      { name: "Oil Change", price: 290, category: "Engine & Oil" },
      { name: "Front Brake Pads", price: 410, category: "Brakes" },
      { name: "Rear Brake Pads", price: 350, category: "Brakes" },
      { name: "Tire Repair", price: 75, category: "Tires & Wheels" },
    ],
    badge: "Budget",
    badgeColor: "orange",
    verified: false,
    phone: "03-599-4400",
    responseTime: "< 2 hours",
    specialty: "General Service",
    description: "Budget-friendly walk-in garage in central Tel Aviv. No appointment needed for basic services.",
    openHours: "Sun–Fri 08:00–21:00",
    mapX: 28,
    mapY: 48,
  },
  {
    id: 9,
    name: "TLV Tire King",
    location: "Kibbutz Galuyot Rd 96, Tel Aviv",
    city: "Tel Aviv",
    lat: 32.065,
    lng: 34.780,
    rating: 4.6,
    reviews: 255,
    price: 1200,
    etaDays: "Same day",
    services: ["Tire fitting & balancing", "4-wheel alignment", "TPMS service", "Seasonal tire storage", "Run-flat specialists"],
    catalog: [
      { name: "Tire Rotation", price: 130, category: "Tires & Wheels" },
      { name: "4-Wheel Alignment", price: 320, category: "Tires & Wheels" },
      { name: "Tire Balancing (per wheel)", price: 70, category: "Tires & Wheels" },
      { name: "Summer Tire Set (205/55R16)", price: 1800, category: "Tires & Wheels" },
      { name: "Tire Repair", price: 80, category: "Tires & Wheels" },
      { name: "TPMS Sensor Replacement", price: 310, category: "Tires & Wheels" },
    ],
    badge: "Tire Specialist",
    badgeColor: "green",
    verified: true,
    phone: "03-531-6620",
    responseTime: "< 1 hour",
    specialty: "Tire & Wheels",
    description: "Tel Aviv's premier tire center with over 5,000 tire sizes in stock. Authorized dealer for Bridgestone, Michelin, and Continental.",
    openHours: "Sun–Thu 08:00–19:00 | Fri 08:00–14:00",
    mapX: 32,
    mapY: 52,
  },
  {
    id: 10,
    name: "ElectroMech TLV",
    location: "Petach Tikva Rd 43, Tel Aviv",
    city: "Tel Aviv",
    lat: 32.092,
    lng: 34.803,
    rating: 4.8,
    reviews: 189,
    price: 1350,
    etaDays: "1 business day",
    services: ["ECU diagnostics & programming", "Hybrid/EV battery service", "Alternator rebuild", "Car security systems", "Dashboard warning lights", "CAN bus diagnostics"],
    catalog: [
      { name: "Full Electrical Diagnostic", price: 380, category: "Electrical" },
      { name: "Alternator Replacement", price: 1380, category: "Electrical" },
      { name: "ECU Diagnostic & Programming", price: 550, category: "Diagnostics" },
      { name: "Hybrid Battery Check", price: 480, category: "Electrical" },
      { name: "Battery Replacement", price: 920, category: "Electrical" },
      { name: "Starter Motor Replacement", price: 850, category: "Electrical" },
    ],
    badge: "EV & Electrical",
    badgeColor: "blue",
    verified: true,
    phone: "03-744-8833",
    responseTime: "< 45 min",
    specialty: "Electrical & Electronics",
    description: "Advanced automotive electronics lab. Specialists in hybrid/EV systems, ECU programming, and complex electrical fault diagnosis.",
    openHours: "Sun–Thu 08:00–18:00",
    mapX: 38,
    mapY: 36,
  },
  {
    id: 11,
    name: "BodyCraft Tel Aviv",
    location: "HaHashmonaim 95, Tel Aviv",
    city: "Tel Aviv",
    lat: 32.078,
    lng: 34.815,
    rating: 4.9,
    reviews: 302,
    price: 2200,
    etaDays: "5 business days",
    services: ["Full body repair & painting", "Dent removal (PDR)", "Scratch & stone chip repair", "Insurance claim handling", "Color matching", "Rust treatment"],
    catalog: [
      { name: "Dent Removal (PDR, per panel)", price: 380, category: "Body & Glass" },
      { name: "Full Panel Repaint", price: 1200, category: "Body & Glass" },
      { name: "Scratch Repair", price: 280, category: "Body & Glass" },
      { name: "Windshield Replacement", price: 1100, category: "Body & Glass" },
      { name: "Bumper Repair", price: 850, category: "Body & Glass" },
      { name: "Full Exterior Paint", price: 8500, category: "Body & Glass" },
    ],
    badge: "Body Shop",
    badgeColor: "blue",
    verified: true,
    phone: "03-682-7799",
    responseTime: "< 2 hours",
    specialty: "Body Shop",
    description: "Award-winning body shop with insurance-approved technicians, computerized color matching, and a lifetime paint warranty.",
    openHours: "Sun–Thu 07:30–18:00 | Fri 07:30–13:00",
    mapX: 44,
    mapY: 43,
  },
  {
    id: 12,
    name: "Transmission Pro TLV",
    location: "Derech Menachem Begin 156, Tel Aviv",
    city: "Tel Aviv",
    lat: 32.100,
    lng: 34.768,
    rating: 4.6,
    reviews: 143,
    price: 1900,
    etaDays: "3 business days",
    services: ["Automatic transmission overhaul", "Manual gearbox repair", "Clutch replacement", "CVT service", "Transfer case service", "DSG/DCT maintenance"],
    catalog: [
      { name: "Automatic Transmission Service", price: 1200, category: "Transmission" },
      { name: "Clutch Kit Replacement", price: 2200, category: "Transmission" },
      { name: "Manual Gearbox Rebuild", price: 3500, category: "Transmission" },
      { name: "CVT Fluid Change", price: 650, category: "Transmission" },
      { name: "DSG Service", price: 1400, category: "Transmission" },
      { name: "Flywheel Resurfacing", price: 580, category: "Transmission" },
    ],
    badge: "Transmission Expert",
    badgeColor: "orange",
    verified: true,
    phone: "03-613-5540",
    responseTime: "< 1 hour",
    specialty: "Transmission",
    description: "Israel's leading transmission specialist with 30+ years of experience. All types of gearboxes — automatic, manual, CVT, DSG.",
    openHours: "Sun–Thu 08:00–18:00",
    mapX: 30,
    mapY: 44,
  },

  // ══════════════════════════════════════
  // HAIFA (6)
  // ══════════════════════════════════════
  {
    id: 13,
    name: "Haifa Auto Center",
    location: "Sderot HaNasi 85, Haifa",
    city: "Haifa",
    lat: 32.820,
    lng: 34.998,
    rating: 4.9,
    reviews: 445,
    price: 1600,
    etaDays: "2 business days",
    services: ["Full 75-point service", "Oil & filters", "Brake system check", "Transmission fluid", "AC recharge", "Suspension check"],
    catalog: [
      { name: "Oil Change", price: 390, category: "Engine & Oil" },
      { name: "Front Brake Pads", price: 540, category: "Brakes" },
      { name: "Rear Brake Pads", price: 480, category: "Brakes" },
      { name: "Alternator Replacement", price: 1300, category: "Electrical" },
      { name: "Clutch Replacement", price: 2200, category: "Transmission" },
      { name: "Timing Belt", price: 1650, category: "Engine & Oil" },
      { name: "AC Service", price: 720, category: "AC & Climate" },
    ],
    badge: "Premium",
    badgeColor: "blue",
    verified: true,
    phone: "04-866-5432",
    responseTime: "< 1 hour",
    specialty: "General Service",
    description: "Haifa's top-rated multi-brand service center. Comprehensive 75-point inspections with a detailed digital report emailed after every visit.",
    openHours: "Sun–Thu 07:30–19:00 | Fri 07:30–14:00",
    mapX: 30,
    mapY: 20,
  },
  {
    id: 14,
    name: "Carmel Garage",
    location: "HaGalil 33, Haifa",
    city: "Haifa",
    lat: 32.808,
    lng: 34.973,
    rating: 4.6,
    reviews: 167,
    price: 1300,
    etaDays: "1 business day",
    services: ["Oil change & filter", "Brake pads (front or rear)", "Air filter", "Basic inspection", "Tire service"],
    catalog: [
      { name: "Oil Change", price: 340, category: "Engine & Oil" },
      { name: "Front Brake Pads", price: 470, category: "Brakes" },
      { name: "Rear Brake Pads", price: 400, category: "Brakes" },
      { name: "Air Filter", price: 160, category: "Engine & Oil" },
      { name: "Tire Repair", price: 85, category: "Tires & Wheels" },
      { name: "Battery Replacement", price: 780, category: "Electrical" },
    ],
    badge: "Top Rated",
    badgeColor: "green",
    verified: true,
    phone: "04-852-7766",
    responseTime: "< 45 min",
    specialty: "General Service",
    description: "Long-standing Carmel neighborhood garage trusted by three generations of Haifa drivers. Honest pricing and reliable work.",
    openHours: "Sun–Thu 08:00–18:30 | Fri 08:00–13:30",
    mapX: 38,
    mapY: 16,
  },
  {
    id: 15,
    name: "Port Mechanics",
    location: "Industrial Port Zone, Haifa",
    city: "Haifa",
    lat: 32.830,
    lng: 34.988,
    rating: 4.0,
    reviews: 55,
    price: 890,
    etaDays: "Same day",
    services: ["Oil change", "Brake pads", "Basic inspection", "Tire repair"],
    catalog: [
      { name: "Oil Change", price: 270, category: "Engine & Oil" },
      { name: "Front Brake Pads", price: 390, category: "Brakes" },
      { name: "Rear Brake Pads", price: 330, category: "Brakes" },
      { name: "Tire Repair", price: 65, category: "Tires & Wheels" },
    ],
    badge: "Best Price",
    badgeColor: "orange",
    verified: false,
    phone: "04-841-3300",
    responseTime: "< 3 hours",
    specialty: "General Service",
    description: "Affordable garage in Haifa's port industrial zone. Great for basic maintenance without the premium price tag.",
    openHours: "Sun–Fri 08:00–20:00",
    mapX: 23,
    mapY: 24,
  },
  {
    id: 16,
    name: "Haifa Tires & Wheels",
    location: "Kiryat Eliezer, HaMelech George 40, Haifa",
    city: "Haifa",
    lat: 32.815,
    lng: 35.010,
    rating: 4.7,
    reviews: 178,
    price: 1050,
    etaDays: "Same day",
    services: ["Tire fitting & balancing", "4-wheel computerized alignment", "TPMS service", "Alloy wheel repair", "Nitrogen filling"],
    catalog: [
      { name: "Tire Rotation", price: 115, category: "Tires & Wheels" },
      { name: "4-Wheel Alignment", price: 295, category: "Tires & Wheels" },
      { name: "Tire Balancing (per wheel)", price: 55, category: "Tires & Wheels" },
      { name: "Summer Tire Set (205/55R16)", price: 1700, category: "Tires & Wheels" },
      { name: "Alloy Wheel Repair", price: 350, category: "Tires & Wheels" },
      { name: "Tire Repair", price: 75, category: "Tires & Wheels" },
    ],
    badge: "Tire Specialist",
    badgeColor: "green",
    verified: true,
    phone: "04-855-2233",
    responseTime: "< 1 hour",
    specialty: "Tire & Wheels",
    description: "Northern Israel's tire experts with the latest Hunter alignment systems. Alloy wheel refurbishment available in-store.",
    openHours: "Sun–Thu 08:00–18:00 | Fri 08:00–14:00",
    mapX: 33,
    mapY: 18,
  },
  {
    id: 17,
    name: "CoolAir Haifa",
    location: "Sderot Yitzhak Rabin 18, Haifa",
    city: "Haifa",
    lat: 32.795,
    lng: 34.980,
    rating: 4.8,
    reviews: 234,
    price: 1150,
    etaDays: "1 business day",
    services: ["AC gas recharge (R134a/R1234yf)", "AC evaporator cleaning", "Cabin filter replacement", "AC leak detection", "Compressor replacement", "Heater core service"],
    catalog: [
      { name: "AC Recharge (R134a)", price: 280, category: "AC & Climate" },
      { name: "AC Recharge (R1234yf)", price: 480, category: "AC & Climate" },
      { name: "AC Evaporator Cleaning", price: 320, category: "AC & Climate" },
      { name: "Cabin Air Filter", price: 150, category: "AC & Climate" },
      { name: "AC Compressor Replacement", price: 2100, category: "AC & Climate" },
      { name: "AC Leak Detection", price: 250, category: "AC & Climate" },
    ],
    badge: "AC Specialist",
    badgeColor: "blue",
    verified: true,
    phone: "04-863-9944",
    responseTime: "< 30 min",
    specialty: "AC & Climate",
    description: "Dedicated automotive AC and climate control specialists. Both R134a and modern R1234yf refrigerant systems serviced.",
    openHours: "Sun–Thu 08:00–18:00 | Fri 08:00–13:00",
    mapX: 27,
    mapY: 22,
  },
  {
    id: 18,
    name: "Haifa Body & Paint",
    location: "Kiryat Haim, HaOren 5, Haifa",
    city: "Haifa",
    lat: 32.835,
    lng: 35.005,
    rating: 4.5,
    reviews: 121,
    price: 1950,
    etaDays: "4 business days",
    services: ["Body panel repair", "Full respray", "PDR dent removal", "Rust proofing", "Insurance work", "Window replacement"],
    catalog: [
      { name: "Dent Removal (PDR)", price: 350, category: "Body & Glass" },
      { name: "Panel Repaint", price: 1100, category: "Body & Glass" },
      { name: "Scratch Repair", price: 260, category: "Body & Glass" },
      { name: "Windshield Replacement", price: 1050, category: "Body & Glass" },
      { name: "Bumper Repair & Paint", price: 780, category: "Body & Glass" },
      { name: "Rust Treatment", price: 650, category: "Body & Glass" },
    ],
    badge: "Body Shop",
    badgeColor: "orange",
    verified: true,
    phone: "04-872-1199",
    responseTime: "< 2 hours",
    specialty: "Body Shop",
    description: "Kiryat Haim's trusted body and paint workshop. 20+ years specializing in collision repair and full exterior restorations.",
    openHours: "Sun–Thu 07:30–17:30",
    mapX: 35,
    mapY: 14,
  },

  // ══════════════════════════════════════
  // JERUSALEM (2)
  // ══════════════════════════════════════
  {
    id: 19,
    name: "Jerusalem Motors",
    location: "Kanfei Nesharim 66, Jerusalem",
    city: "Jerusalem",
    lat: 31.782,
    lng: 35.196,
    rating: 4.7,
    reviews: 289,
    price: 1700,
    etaDays: "2 business days",
    services: ["Full periodic service", "Multi-brand diagnostics", "AC service", "Brake system service", "Suspension & steering", "OBD-II scan"],
    catalog: [
      { name: "Oil Change", price: 400, category: "Engine & Oil" },
      { name: "Front Brake Pads", price: 560, category: "Brakes" },
      { name: "Rear Brake Pads", price: 490, category: "Brakes" },
      { name: "Timing Belt", price: 1750, category: "Engine & Oil" },
      { name: "AC Recharge", price: 320, category: "AC & Climate" },
      { name: "Battery Replacement", price: 880, category: "Electrical" },
      { name: "Full Diagnostic Scan", price: 260, category: "Diagnostics" },
    ],
    badge: "Top Rated",
    badgeColor: "green",
    verified: true,
    phone: "02-624-8899",
    responseTime: "< 1 hour",
    specialty: "General Service",
    description: "Jerusalem's most trusted multi-brand service center. Serving the capital's drivers for 25 years with transparent pricing and a free inspection guarantee.",
    openHours: "Sun–Thu 07:30–19:00 | Fri 07:30–14:00",
    mapX: 62,
    mapY: 55,
  },
  {
    id: 20,
    name: "City of Gold Transmission",
    location: "Givat Shaul Industrial Zone, Jerusalem",
    city: "Jerusalem",
    lat: 31.771,
    lng: 35.210,
    rating: 4.6,
    reviews: 97,
    price: 2100,
    etaDays: "3 business days",
    services: ["Automatic transmission overhaul", "Manual gearbox repair", "Clutch & flywheel", "4×4 transfer case", "Differential service"],
    catalog: [
      { name: "Automatic Transmission Service", price: 1150, category: "Transmission" },
      { name: "Clutch Kit Replacement", price: 2100, category: "Transmission" },
      { name: "Manual Gearbox Rebuild", price: 3200, category: "Transmission" },
      { name: "CVT Service", price: 700, category: "Transmission" },
      { name: "Differential Oil Change", price: 350, category: "Transmission" },
      { name: "4×4 Transfer Case Service", price: 950, category: "Transmission" },
    ],
    badge: "Transmission Expert",
    badgeColor: "orange",
    verified: true,
    phone: "02-651-7722",
    responseTime: "< 2 hours",
    specialty: "Transmission",
    description: "Jerusalem's specialist for all transmission types. Full workshop with Allison and ZF factory-approved tooling.",
    openHours: "Sun–Thu 08:00–17:30",
    mapX: 68,
    mapY: 58,
  },
];

// ─── Chat Messages ────────────────────────────────────────────────────────────

export const mockChatMessages: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hello! I'm your **AutoMind AI Mechanic**. I've analyzed your Hyundai Tucson 2021 owner manual and your full service history.\n\nHow can I help you today? You can ask me about warning lights, unusual noises, maintenance questions, or anything about your car.",
    timestamp: "10:30",
  },
  {
    id: 2,
    role: "user",
    content: "I hear a ticking noise from the engine when I start the car in the morning. Is this something I should worry about?",
    timestamp: "10:31",
  },
  {
    id: 3,
    role: "assistant",
    content:
      "Based on your **Tucson 2021 manual** (Section 6.2 — Engine Startup) and your service history (65,000 km, last oil change at 60,000 km), a cold-start ticking noise is most commonly caused by:\n\n**1. Hydraulic Valve Lifter Noise** — A known characteristic of the 1.6L GDI engine. Cold oil takes ~30 seconds to fully lubricate the lifters. Normal if it resolves within 60 seconds.\n\n**2. Low Oil Pressure on Cold Start** — Oil sits in the pan overnight. Your oil change at 60,000 km was 5,000 km ago — you are within the safe window.\n\n**3. Exhaust Manifold Thermal Expansion** — Expansion clicks on cold startup. Disappear within 1–2 minutes.\n\n**My Assessment:** This appears to be **normal cold-start behavior**. However, if the ticking persists for more than 2 minutes or gets louder under load, schedule an inspection immediately.\n\nWould you like me to find nearby garages for a diagnostic check?",
    timestamp: "10:31",
  },
];

// ─── Quick Prompts ────────────────────────────────────────────────────────────

export const quickPrompts = [
  "What does the check engine light mean?",
  "My AC isn't cooling properly",
  "How often should I change the oil?",
  "I feel vibration at high speeds",
  "My car pulls to the left when braking",
];

// ─── Mock OCR Results ─────────────────────────────────────────────────────────

export const MOCK_OCR_VEHICLE = {
  make: "Toyota",
  model: "RAV4",
  year: 2020,
  licensePlate: "987-654-32",
  hand: 1,
  color: "Metallic Gray",
  fuelType: "Hybrid",
  transmission: "Automatic",
  km: 45000,
  officialValue: 118000,
  marketValue: 112000,
};

export const MOCK_OCR_RECEIPT: Omit<ServiceRecord, "id"> = {
  date: new Date().toISOString().split("T")[0],
  type: "Uploaded Service — AI OCR Extracted",
  garage: "Beit Yosef Auto Service",
  garageAddress: "Industrial Zone 4, Extracted from Receipt",
  cost: 1250,
  km: 65500,
  parts: ["Engine Oil 5W-30 (5L)", "Oil Filter", "Air Filter"],
  notes:
    "AI OCR extraction: Periodic service performed. All fluid levels checked and topped. Next service recommended at 75,000 km. Signed: Technician Moshe K.",
  receiptUploaded: true,
};
