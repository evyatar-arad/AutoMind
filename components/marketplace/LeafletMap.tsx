import dynamic from "next/dynamic";
import type { GarageBid } from "@/lib/mockData";

const LeafletMapCore = dynamic(() => import("./LeafletMapCore"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-xl border border-border bg-muted/30 flex items-center justify-center"
      style={{ height: 480 }}
    >
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm font-medium">Loading map…</p>
      </div>
    </div>
  ),
});

interface LeafletMapProps {
  garages: GarageBid[];
  userLocation?: { lat: number; lng: number } | null;
  onLocate?: (coords: { lat: number; lng: number }) => void;
  onGarageSelect?: (garage: GarageBid) => void;
}

export default function LeafletMap(props: LeafletMapProps) {
  return <LeafletMapCore {...props} />;
}
