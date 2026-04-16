"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Navigation,
  Star,
  CheckCircle,
  Award,
  ThumbsUp,
  Zap,
  Clock,
  Shield,
  Calendar,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockGarageBids } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

const badgeColorMap: Record<string, "info" | "success" | "warning"> = {
  blue: "info",
  green: "success",
  orange: "warning",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/40"
          }`}
        />
      ))}
    </div>
  );
}

// Group catalog items by category
function groupCatalog(catalog: { name: string; price: number; category?: string }[]) {
  const groups: Record<string, typeof catalog> = {};
  for (const item of catalog) {
    const cat = item.category ?? "Other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
  }
  return groups;
}

const categoryOrder = [
  "Engine & Oil",
  "Brakes",
  "Tires & Wheels",
  "Electrical",
  "AC & Climate",
  "Transmission",
  "Body & Glass",
  "Diagnostics",
  "Other",
];

export default function GarageProfile() {
  const params = useParams();
  const id = Number(params.id);
  const garage = mockGarageBids.find((g) => g.id === id);

  const [bookedServices, setBookedServices] = useState<Set<string>>(new Set());

  if (!garage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Garage not found</p>
          <Button asChild variant="outline">
            <Link href="/marketplace">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const grouped = groupCatalog(garage.catalog);
  const orderedCategories = categoryOrder.filter((c) => grouped[c]);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(garage.name + " " + garage.location)}`;
  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(garage.name + " " + garage.location)}&navigate=yes`;

  const toggleBook = (serviceName: string) => {
    setBookedServices((prev) => {
      const next = new Set(prev);
      if (next.has(serviceName)) {
        next.delete(serviceName);
      } else {
        next.add(serviceName);
      }
      return next;
    });
  };

  const BadgeIcon =
    garage.badge.includes("Official") || garage.badge.includes("Dealer")
      ? Award
      : garage.badge.includes("Top") || garage.badge.includes("Premium") || garage.badge.includes("Fast")
      ? ThumbsUp
      : Zap;

  return (
    <div className="min-h-screen p-6 space-y-6 max-w-3xl mx-auto">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/marketplace" className="flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>
        </Button>
      </motion.div>

      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge
                    variant={badgeColorMap[garage.badgeColor] ?? "secondary"}
                    className="text-xs"
                  >
                    <BadgeIcon className="h-3 w-3 mr-1" />
                    {garage.badge}
                  </Badge>
                  {garage.verified ? (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      Unverified
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {garage.specialty}
                  </Badge>
                </div>
                <h1 className="text-xl font-bold mb-1">{garage.name}</h1>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {garage.location}
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={garage.rating} />
                  <span className="font-semibold">{garage.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({garage.reviews} reviews)
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-muted-foreground mb-0.5">From</div>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(garage.price)}
                </div>
                <div className="text-xs text-muted-foreground">{garage.etaDays}</div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`tel:${garage.phone.replace(/-/g, "")}`}
                className="flex flex-col items-center gap-1.5 rounded-xl bg-primary text-primary-foreground py-3 px-2 text-center hover:opacity-90 transition-opacity"
              >
                <Phone className="h-4 w-4" />
                <span className="text-xs font-semibold">Call Now</span>
                <span className="text-[10px] opacity-80">{garage.phone}</span>
              </a>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 rounded-xl bg-secondary text-secondary-foreground py-3 px-2 text-center hover:bg-accent transition-colors border border-border"
              >
                <Navigation className="h-4 w-4" />
                <span className="text-xs font-semibold">Google Maps</span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                  Navigate <ExternalLink className="h-2.5 w-2.5" />
                </span>
              </a>
              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 rounded-xl bg-secondary text-secondary-foreground py-3 px-2 text-center hover:bg-accent transition-colors border border-border"
              >
                <Navigation className="h-4 w-4 text-sky-500" />
                <span className="text-xs font-semibold">Waze</span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                  Navigate <ExternalLink className="h-2.5 w-2.5" />
                </span>
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* About + Hours */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {garage.description}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Business Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{garage.openHours}</p>
            <div className="flex items-center gap-2 text-xs">
              <Zap className="h-3 w-3 text-primary" />
              <span className="text-muted-foreground">
                Response time:{" "}
                <span className="font-semibold text-foreground">
                  {garage.responseTime}
                </span>
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Services included */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Services Included in Quote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {garage.services.map((s) => (
                <div key={s} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Service Catalog */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.3 }}
        className="space-y-4"
      >
        <h2 className="text-base font-bold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Service Menu
        </h2>

        {orderedCategories.map((category) => (
          <Card key={category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {grouped[category].map((item) => {
                const isBooked = bookedServices.has(item.name);
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-3 rounded-lg bg-muted/30 px-3 py-2.5 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-bold text-primary">
                        {formatCurrency(item.price)}
                      </span>
                      <AnimatePresence mode="wait">
                        {isBooked ? (
                          <motion.button
                            key="booked"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            onClick={() => toggleBook(item.name)}
                            className="flex items-center gap-1 text-xs bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-md px-2.5 py-1 font-medium"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Booked
                          </motion.button>
                        ) : (
                          <motion.button
                            key="book"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            onClick={() => toggleBook(item.name)}
                            className="text-xs bg-primary text-primary-foreground rounded-md px-2.5 py-1 font-medium hover:opacity-90 transition-opacity flex items-center gap-1"
                          >
                            <ChevronRight className="h-3 w-3" />
                            Book
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Booking summary */}
      <AnimatePresence>
        {bookedServices.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="sticky bottom-6 bg-primary text-primary-foreground rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-sm font-bold">
                {bookedServices.size} service{bookedServices.size > 1 ? "s" : ""} selected
              </p>
              <p className="text-xs opacity-80">
                {formatCurrency(
                  garage.catalog
                    .filter((i) => bookedServices.has(i.name))
                    .reduce((s, i) => s + i.price, 0)
                )}{" "}
                total
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="shrink-0"
              onClick={() => {
                setBookedServices(new Set());
              }}
            >
              <CheckCircle className="h-4 w-4 mr-1.5" />
              Confirm Booking
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
