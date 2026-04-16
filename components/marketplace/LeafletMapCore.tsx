"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { Navigation, Star, Phone, Locate } from "lucide-react";
import type { GarageBid } from "@/lib/mockData";
import { formatCurrency, haversineDistance } from "@/lib/utils";

// ─── Custom marker icons ──────────────────────────────────────────────────────

function garageIcon(badgeColor: string) {
  const bg =
    badgeColor === "blue"
      ? "#3b82f6"
      : badgeColor === "green"
      ? "#22c55e"
      : "#f59e0b";
  return L.divIcon({
    className: "",
    html: `<div style="
      width:28px;height:28px;
      border-radius:50% 50% 50% 0;
      background:${bg};
      border:2px solid #fff;
      box-shadow:0 2px 6px rgba(0,0,0,.5);
      transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
    "><div style="width:8px;height:8px;background:#fff;border-radius:50%;transform:rotate(45deg)"></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -32],
  });
}

const userIcon = L.divIcon({
  className: "",
  html: `<div style="position:relative;width:20px;height:20px;display:flex;align-items:center;justify-content:center;">
    <div style="position:absolute;width:34px;height:34px;border-radius:50%;background:rgba(59,130,246,.25);top:50%;left:50%;transform:translate(-50%,-50%);animation:leaflet-pulse 1.8s ease-out infinite"></div>
    <div style="width:14px;height:14px;border-radius:50%;background:#3b82f6;border:2px solid #fff;box-shadow:0 0 6px rgba(59,130,246,.8);position:relative;z-index:1"></div>
  </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -14],
});

// ─── Fly-to helper ────────────────────────────────────────────────────────────

function FlyTo({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 1.2 });
  }, [lat, lng, zoom, map]);
  return null;
}

// ─── Main component ───────────────────────────────────────────────────────────

interface LeafletMapCoreProps {
  garages: GarageBid[];
  userLocation?: { lat: number; lng: number } | null;
  onLocate?: (coords: { lat: number; lng: number }) => void;
  onGarageSelect?: (garage: GarageBid) => void;
}

export default function LeafletMapCore({
  garages,
  userLocation,
  onLocate,
  onGarageSelect,
}: LeafletMapCoreProps) {
  const [locating, setLocating] = useState(false);
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number; zoom: number } | null>(null);

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        onLocate?.(coords);
        setFlyTarget({ ...coords, zoom: 13 });
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border" style={{ height: 480 }}>
      {/* Leaflet CSS keyframe injection */}
      <style>{`
        @keyframes leaflet-pulse {
          0% { transform: translate(-50%,-50%) scale(0.5); opacity:.8; }
          100% { transform: translate(-50%,-50%) scale(2.5); opacity:0; }
        }
        .leaflet-popup-content-wrapper {
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          border: 1px solid hsl(var(--border));
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,.3);
          padding: 0;
        }
        .leaflet-popup-content { margin: 0; }
        .leaflet-popup-tip-container { display:none; }
        .leaflet-container { background: #1a1f2e; }
      `}</style>

      <MapContainer
        center={[31.8, 34.9]}
        zoom={8}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={19}
        />

        {flyTarget && (
          <FlyTo lat={flyTarget.lat} lng={flyTarget.lng} zoom={flyTarget.zoom} />
        )}

        {/* Garage markers */}
        {garages.map((g) => (
          <Marker
            key={g.id}
            position={[g.lat, g.lng]}
            icon={garageIcon(g.badgeColor)}
            eventHandlers={{ click: () => onGarageSelect?.(g) }}
          >
            <Popup>
              <div style={{ padding: "12px", minWidth: 200 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                  {g.specialty}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "hsl(var(--foreground))", marginBottom: 2 }}>
                  {g.name}
                </div>
                <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginBottom: 10 }}>
                  {g.location}
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <div style={{ flex: 1, background: "hsl(var(--muted))", borderRadius: 8, padding: "6px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}>Price</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "hsl(var(--primary))" }}>{formatCurrency(g.price)}</div>
                  </div>
                  <div style={{ flex: 1, background: "hsl(var(--muted))", borderRadius: 8, padding: "6px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}>Rating</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "hsl(var(--foreground))" }}>⭐ {g.rating}</div>
                  </div>
                </div>

                {userLocation && (
                  <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginBottom: 8 }}>
                    📍 {haversineDistance(userLocation.lat, userLocation.lng, g.lat, g.lng).toFixed(1)} km away
                  </div>
                )}

                <div style={{ display: "flex", gap: 6 }}>
                  <a
                    href={`tel:${g.phone.replace(/-/g, "")}`}
                    style={{ flex: 1, background: "hsl(var(--secondary))", color: "hsl(var(--foreground))", border: "1px solid hsl(var(--border))", borderRadius: 8, padding: "6px 0", fontSize: 12, textAlign: "center", textDecoration: "none", display: "block" }}
                  >
                    📞 Call
                  </a>
                  <a
                    href={`/marketplace/${g.id}`}
                    style={{ flex: 1, background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))", borderRadius: 8, padding: "6px 0", fontSize: 12, textAlign: "center", textDecoration: "none", display: "block", fontWeight: 600 }}
                  >
                    View →
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div style={{ padding: "8px 12px", fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))" }}>
                📍 Your location
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Locate Me button */}
      <button
        onClick={handleLocate}
        disabled={locating}
        className="absolute bottom-4 left-4 z-[1000] flex items-center gap-2 bg-card border border-border text-foreground text-xs font-semibold px-3 py-2 rounded-lg shadow-lg hover:bg-accent transition-colors disabled:opacity-60"
      >
        <Locate className={`h-3.5 w-3.5 ${locating ? "animate-spin" : ""}`} />
        {locating ? "Locating…" : "Locate Me"}
      </button>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-[1000] bg-card/90 backdrop-blur-sm border border-border rounded-lg p-2.5 text-xs space-y-1.5">
        {[
          { color: "#3b82f6", label: "Official / EV / Electrical" },
          { color: "#22c55e", label: "Top Rated / Tire Specialist" },
          { color: "#f59e0b", label: "Budget / Body / Transmission" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: l.color }} />
            <span className="text-muted-foreground">{l.label}</span>
          </div>
        ))}
        {userLocation && (
          <div className="flex items-center gap-1.5 pt-1 border-t border-border">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
            <span className="text-muted-foreground">Your location</span>
          </div>
        )}
      </div>
    </div>
  );
}
