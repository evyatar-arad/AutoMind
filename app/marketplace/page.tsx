"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  CheckCircle,
  Award,
  Phone,
  Shield,
  ThumbsUp,
  Calendar,
  Zap,
  List,
  Map,
  Navigation,
  X,
  Tag,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { mockGarageBids } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import type { GarageBid } from "@/lib/mockData";
import LeafletMap from "@/components/marketplace/LeafletMap";

// ─── Types ────────────────────────────────────────────────────────────────────

type City = "All" | "Beer Sheva" | "Tel Aviv" | "Haifa" | "Jerusalem";
type SortBy = "price" | "rating" | "eta";
type ViewMode = "list" | "map";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const badgeColorMap: Record<string, "info" | "success" | "warning"> = {
  blue: "info",
  green: "success",
  orange: "warning",
};

const etaOrder = (bid: GarageBid) => {
  if (bid.etaDays.includes("Same")) return 0;
  if (bid.etaDays.includes("1")) return 1;
  return 2;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/40"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Garage Card ─────────────────────────────────────────────────────────────

function GarageCard({
  bid,
  index,
  matchedPart,
  distanceKm,
}: {
  bid: GarageBid;
  index: number;
  matchedPart?: { name: string; price: number };
  distanceKm?: number;
}) {
  const [booked, setBooked] = useState(false);

  const BadgeIcon =
    bid.badge.includes("Official") || bid.badge.includes("Dealer")
      ? Award
      : bid.badge.includes("Top") || bid.badge.includes("Premium") || bid.badge.includes("Fast")
      ? ThumbsUp
      : Zap;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -3 }}
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge
              variant={badgeColorMap[bid.badgeColor] ?? "secondary"}
              className="text-xs"
            >
              <BadgeIcon className="h-3 w-3 mr-1" />
              {bid.badge}
            </Badge>
            <div className="flex items-center gap-1.5">
              {distanceKm !== undefined && (
                <Badge variant="outline" className="text-xs">
                  <Navigation className="h-2.5 w-2.5 mr-0.5" />
                  {distanceKm.toFixed(1)} km
                </Badge>
              )}
              {bid.verified ? (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  Unverified
                </Badge>
              )}
            </div>
          </div>

          {/* Clickable garage name */}
          <Link href={`/marketplace/${bid.id}`}>
            <CardTitle className="text-base leading-tight hover:text-primary transition-colors flex items-center gap-1 group">
              {bid.name}
              <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardTitle>
          </Link>
          <CardDescription className="flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0" />
            {bid.location}
          </CardDescription>
          {bid.specialty !== "General Service" && (
            <Badge variant="secondary" className="text-xs mt-1 w-fit">
              {bid.specialty}
            </Badge>
          )}

          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={bid.rating} />
            <span className="text-sm font-semibold">{bid.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({bid.reviews} reviews)
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col gap-4">
          {matchedPart && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-lg bg-primary/5 border border-primary/30 px-3 py-2 flex items-center justify-between"
            >
              <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                <Tag className="h-3 w-3" />
                {matchedPart.name}
              </div>
              <span className="text-base font-bold text-primary">
                {formatCurrency(matchedPart.price)}
              </span>
            </motion.div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <div className="text-center rounded-lg bg-muted/50 p-2">
              <div className="text-xs text-muted-foreground mb-0.5">Price</div>
              <div className="text-base font-bold text-primary">
                {formatCurrency(bid.price)}
              </div>
            </div>
            <div className="text-center rounded-lg bg-muted/50 p-2">
              <div className="text-xs text-muted-foreground mb-0.5">ETA</div>
              <div className="text-xs font-semibold leading-tight">{bid.etaDays}</div>
            </div>
            <div className="text-center rounded-lg bg-muted/50 p-2">
              <div className="text-xs text-muted-foreground mb-0.5">Reply</div>
              <div className="text-xs font-semibold leading-tight">
                {bid.responseTime}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Includes
            </div>
            <ul className="space-y-1.5">
              {bid.services.slice(0, 4).map((service) => (
                <li key={service} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                  <span>{service}</span>
                </li>
              ))}
              {bid.services.length > 4 && (
                <li className="text-xs text-muted-foreground pl-5">
                  +{bid.services.length - 4} more services
                </li>
              )}
            </ul>
          </div>

          <div className="flex items-center gap-2 text-sm pt-1 border-t border-border">
            <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <a
              href={`tel:${bid.phone.replace(/-/g, "")}`}
              className="text-primary hover:underline font-medium"
            >
              {bid.phone}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <AnimatePresence mode="wait">
              {booked ? (
                <motion.div
                  key="booked"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="col-span-2 flex items-center justify-center gap-2 rounded-lg bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 py-2.5 text-sm font-medium"
                >
                  <CheckCircle className="h-4 w-4" />
                  Booking Confirmed!
                </motion.div>
              ) : (
                <>
                  <Button
                    key="book"
                    className="gap-1.5"
                    onClick={() => setBooked(true)}
                  >
                    <Calendar className="h-4 w-4" />
                    Book Now
                  </Button>
                  <Button variant="outline" asChild className="gap-1.5">
                    <Link href={`/marketplace/${bid.id}`}>
                      View Profile
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Map selected garage panel ────────────────────────────────────────────────

function SelectedGaragePanel({
  garage,
  onClose,
  distanceKm,
}: {
  garage: GarageBid;
  onClose: () => void;
  distanceKm?: number;
}) {
  const [booked, setBooked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full border border-border rounded-xl bg-card overflow-hidden"
    >
      <div className="flex items-start justify-between gap-2 p-4 border-b border-border">
        <div className="flex-1 min-w-0">
          <Badge
            variant={badgeColorMap[garage.badgeColor] ?? "secondary"}
            className="text-xs mb-1"
          >
            {garage.badge}
          </Badge>
          <Link href={`/marketplace/${garage.id}`}>
            <h3 className="font-semibold text-sm leading-tight hover:text-primary transition-colors">
              {garage.name} →
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3" />
            {garage.location}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center gap-2">
          <StarRating rating={garage.rating} />
          <span className="text-sm font-semibold">{garage.rating}</span>
          <span className="text-xs text-muted-foreground">({garage.reviews})</span>
        </div>

        {distanceKm !== undefined && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Navigation className="h-3 w-3 text-primary" />
            <span>{distanceKm.toFixed(1)} km from your location</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-muted/50 p-2.5 text-center">
            <div className="text-xs text-muted-foreground">Price</div>
            <div className="text-lg font-bold text-primary">
              {formatCurrency(garage.price)}
            </div>
          </div>
          <div className="rounded-lg bg-muted/50 p-2.5 text-center">
            <div className="text-xs text-muted-foreground">ETA</div>
            <div className="text-sm font-semibold">{garage.etaDays}</div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Services
          </p>
          <ul className="space-y-1.5">
            {garage.services.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Parts Catalog
          </p>
          <div className="space-y-1.5">
            {garage.catalog.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm rounded-lg bg-muted/30 px-2.5 py-1.5"
              >
                <span>{item.name}</span>
                <span className="font-semibold text-primary">
                  {formatCurrency(item.price)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <a
          href={`tel:${garage.phone.replace(/-/g, "")}`}
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <Phone className="h-4 w-4" />
          {garage.phone}
        </a>
      </div>

      <div className="p-4 border-t border-border space-y-2">
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/marketplace/${garage.id}`}>
            View Full Profile →
          </Link>
        </Button>
        <AnimatePresence mode="wait">
          {booked ? (
            <motion.div
              key="done"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center gap-2 rounded-lg bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 py-2.5 text-sm font-medium"
            >
              <CheckCircle className="h-4 w-4" />
              Booking Confirmed!
            </motion.div>
          ) : (
            <Button className="w-full gap-2" onClick={() => setBooked(true)}>
              <Calendar className="h-4 w-4" />
              Book Now
            </Button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState<City>("All");
  const [sortBy, setSortBy] = useState<SortBy>("rating");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedGarage, setSelectedGarage] = useState<GarageBid | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const filteredBids = mockGarageBids.filter((bid) => {
    const matchesCity = cityFilter === "All" || bid.city === cityFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCity;
    const matchesSearch =
      bid.name.toLowerCase().includes(q) ||
      bid.services.some((s) => s.toLowerCase().includes(q)) ||
      bid.catalog.some((c) => c.name.toLowerCase().includes(q)) ||
      bid.city.toLowerCase().includes(q) ||
      bid.specialty.toLowerCase().includes(q);
    return matchesCity && matchesSearch;
  });

  const sortedBids = [...filteredBids].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return etaOrder(a) - etaOrder(b);
  });

  const getMatchedCatalogItem = (bid: GarageBid) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return undefined;
    return bid.catalog.find((c) => c.name.toLowerCase().includes(q));
  };

  const getDistanceKm = (bid: GarageBid) => {
    if (!userLocation) return undefined;
    const R = 6371;
    const dLat = ((bid.lat - userLocation.lat) * Math.PI) / 180;
    const dLng = ((bid.lng - userLocation.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((userLocation.lat * Math.PI) / 180) *
        Math.cos((bid.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const isPartSearch =
    searchQuery.trim().length > 2 &&
    filteredBids.some((b) => b.catalog.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())));

  const CITIES: City[] = ["All", "Beer Sheva", "Tel Aviv", "Haifa", "Jerusalem"];

  return (
    <div className="min-h-screen p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold">Find a Garage</h1>
        <p className="text-muted-foreground mt-0.5">
          {mockGarageBids.length} certified garages across Israel — instant bids & transparent pricing
        </p>
      </motion.div>

      {/* Search + City + View toggle */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="flex flex-col sm:flex-row gap-3 flex-wrap"
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11"
            placeholder="Search by service, part, or specialty…"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* City filter */}
        <div className="flex gap-1 bg-muted rounded-lg p-1 shrink-0 overflow-x-auto">
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setCityFilter(city)}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors whitespace-nowrap font-medium ${
                cityFilter === city
                  ? "bg-card shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {city === "All" ? (
                <span className="flex items-center gap-1">
                  <Navigation className="h-3 w-3" /> All
                </span>
              ) : (
                city
              )}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-1 bg-muted rounded-lg p-1 shrink-0">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors font-medium ${
              viewMode === "list"
                ? "bg-card shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="h-3.5 w-3.5" /> List
          </button>
          <button
            onClick={() => {
              setViewMode("map");
              setSelectedGarage(null);
            }}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors font-medium ${
              viewMode === "map"
                ? "bg-card shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Map className="h-3.5 w-3.5" /> Map
          </button>
        </div>
      </motion.div>

      {/* Sort + Results summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {sortedBids.length} garage{sortedBids.length !== 1 ? "s" : ""}
          </span>{" "}
          {searchQuery
            ? `matching "${searchQuery}"`
            : cityFilter !== "All"
            ? `in ${cityFilter}`
            : "across Israel"}
        </p>

        {viewMode === "list" && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground shrink-0">Sort:</span>
            {(["rating", "price", "eta"] as SortBy[]).map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                  sortBy === option
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border bg-card hover:bg-accent"
                }`}
              >
                {option === "eta" ? "Fastest" : option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Part price comparison banner */}
      <AnimatePresence>
        {isPartSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl border border-primary/30 bg-primary/5 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Price comparison for &quot;{searchQuery}&quot;
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sortedBids.map((bid) => {
                const item = getMatchedCatalogItem(bid);
                if (!item) return null;
                return (
                  <div
                    key={bid.id}
                    className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 text-sm"
                  >
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="font-medium">
                      {bid.name.split(" ").slice(0, 2).join(" ")}
                    </span>
                    <span className="text-primary font-bold">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map / List view */}
      <AnimatePresence mode="wait">
        {viewMode === "map" ? (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className={`grid gap-4 ${
                selectedGarage ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"
              }`}
            >
              <div className={selectedGarage ? "lg:col-span-2" : ""}>
                <LeafletMap
                  garages={sortedBids}
                  userLocation={userLocation}
                  onLocate={(coords) => setUserLocation(coords)}
                  onGarageSelect={(g) => setSelectedGarage(g)}
                />
              </div>

              <AnimatePresence>
                {selectedGarage && (
                  <div className="h-[480px]">
                    <SelectedGaragePanel
                      garage={selectedGarage}
                      onClose={() => setSelectedGarage(null)}
                      distanceKm={getDistanceKm(selectedGarage)}
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {sortedBids.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No garages found</p>
                <p className="text-xs mt-1">Try a different search term or city</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {sortedBids.map((bid, index) => (
                  <GarageCard
                    key={bid.id}
                    bid={bid}
                    index={index}
                    matchedPart={getMatchedCatalogItem(bid)}
                    distanceKm={getDistanceKm(bid)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guarantee banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-border bg-card p-4 flex items-start gap-3"
      >
        <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold">AutoMind Booking Guarantee</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            All verified garages are reviewed by our team. Book with confidence —
            if a garage doesn&apos;t meet the quoted price, AutoMind covers the
            difference up to ₪200.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
