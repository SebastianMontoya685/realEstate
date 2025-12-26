"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { LatLngExpression } from "leaflet";
import { api } from "~/trpc/react";

// Dynamically import Leaflet components (client-side only)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false },
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false },
);
const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false },
);

// Helper function to get color based on investment score
function getHeatMapColor(score: number | null | undefined): string {
  if (!score) return "#gray";

  if (score >= 85) return "#10b981"; // Green (excellent)
  if (score >= 75) return "#84cc16"; // Light green (good)
  if (score >= 65) return "#fbbf24"; // Yellow (moderate)
  if (score >= 50) return "#fb923c"; // Orange (fair)
  return "#ef4444"; // Red (poor)
}

// Helper function to get label text
function getScoreLabel(score: number | null | undefined): string {
  if (!score) return "No data";

  if (score >= 85) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 65) return "Moderate";
  if (score >= 50) return "Fair";
  return "Poor";
}

interface SuburbMapProps {
  onSuburbClick?: (suburbId: string) => void;
}

export function SuburbMap({ onSuburbClick }: SuburbMapProps) {
  const [mounted, setMounted] = useState(false);
  const { data: suburbs, isLoading } = api.suburb.getForMap.useQuery();

  // Sydney's coordinates
  const sydneyCenter: LatLngExpression = [-33.8688, 151.2093];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center rounded-lg bg-gray-100">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center rounded-lg bg-gray-100">
        <p className="text-gray-500">Loading suburbs...</p>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={sydneyCenter}
        zoom={10}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {suburbs?.map((suburb) => {
          const color = getHeatMapColor(suburb.investmentScore);
          const label = getScoreLabel(suburb.investmentScore);

          return (
            <CircleMarker
              key={suburb.id}
              center={[suburb.latitude, suburb.longitude]}
              radius={12}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.7,
                color: "#fff",
                weight: 2,
              }}
              eventHandlers={{
                click: () => {
                  if (onSuburbClick) {
                    onSuburbClick(suburb.id);
                  }
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                <div className="font-semibold">{suburb.name}</div>
                <div className="text-sm text-gray-600">{suburb.postcode}</div>
              </Tooltip>

              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="text-lg font-bold mb-2">{suburb.name}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Postcode:</span>
                      <span className="font-medium">{suburb.postcode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Investment Score:</span>
                      <span
                        className="font-bold"
                        style={{ color }}
                      >
                        {suburb.investmentScore?.toFixed(0) ?? "N/A"} - {label}
                      </span>
                    </div>
                    {suburb.medianPrice && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Median Price:</span>
                        <span className="font-medium">
                          ${(suburb.medianPrice / 1000).toFixed(0)}k
                        </span>
                      </div>
                    )}
                    {suburb.priceGrowth12m && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">12m Growth:</span>
                        <span className="font-medium text-green-600">
                          +{suburb.priceGrowth12m.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onSuburbClick?.(suburb.id)}
                    className="mt-3 w-full rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 z-[1000]">
        <h4 className="text-sm font-bold mb-2">Investment Score</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#10b981]"></div>
            <span>Excellent (85+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#84cc16]"></div>
            <span>Good (75-84)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#fbbf24]"></div>
            <span>Moderate (65-74)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#fb923c]"></div>
            <span>Fair (50-64)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#ef4444]"></div>
            <span>Poor (&lt;50)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

