"use client";

import { api } from "~/trpc/react";
import { X } from "lucide-react";

interface SuburbDetailProps {
  suburbId: string | null;
  onClose: () => void;
}

const POI_ICONS: Record<string, string> = {
  school: "🎓",
  shopping: "🛍️",
  transport: "🚇",
  park: "🌳",
  medical: "🏥",
};

const POI_LABELS: Record<string, string> = {
  school: "Schools",
  shopping: "Shopping",
  transport: "Transport",
  park: "Parks & Recreation",
  medical: "Medical",
};

export function SuburbDetail({ suburbId, onClose }: SuburbDetailProps) {
  const { data: suburb, isLoading } = api.suburb.getById.useQuery(
    { id: suburbId! },
    { enabled: !!suburbId },
  );

  if (!suburbId) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-gray-500">Loading suburb details...</p>
          </div>
        ) : !suburb ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-gray-500">Suburb not found</p>
          </div>
        ) : (
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                {suburb.name}
              </h2>
              <p className="text-lg text-gray-600">
                {suburb.postcode}, {suburb.state}
              </p>
            </div>

            {/* Investment Metrics */}
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {suburb.investmentScore && (
                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="text-sm text-blue-600 font-medium">
                    Investment Score
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {suburb.investmentScore.toFixed(0)}/100
                  </div>
                </div>
              )}

              {suburb.medianPrice && (
                <div className="rounded-lg bg-green-50 p-4">
                  <div className="text-sm text-green-600 font-medium">
                    Median Price
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    ${(suburb.medianPrice / 1000).toFixed(0)}k
                  </div>
                </div>
              )}

              {suburb.priceGrowth12m && (
                <div className="rounded-lg bg-purple-50 p-4">
                  <div className="text-sm text-purple-600 font-medium">
                    12m Growth
                  </div>
                  <div className="text-2xl font-bold text-purple-900">
                    +{suburb.priceGrowth12m.toFixed(1)}%
                  </div>
                </div>
              )}

              {suburb.rentalYield && (
                <div className="rounded-lg bg-orange-50 p-4">
                  <div className="text-sm text-orange-600 font-medium">
                    Rental Yield
                  </div>
                  <div className="text-2xl font-bold text-orange-900">
                    {suburb.rentalYield.toFixed(1)}%
                  </div>
                </div>
              )}
            </div>

            {/* Demographics */}
            {(suburb.populationSize || suburb.averageIncome) && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Demographics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {suburb.populationSize && (
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="text-sm text-gray-600 font-medium">
                        Population
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {suburb.populationSize.toLocaleString()}
                      </div>
                    </div>
                  )}

                  {suburb.averageIncome && (
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="text-sm text-gray-600 font-medium">
                        Median Income
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        ${(suburb.averageIncome / 1000).toFixed(0)}k
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Points of Interest */}
            {suburb.pointsOfInterest && suburb.pointsOfInterest.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Points of Interest
                </h3>

                {/* Group POIs by type */}
                {Object.entries(
                  suburb.pointsOfInterest.reduce(
                    (acc, poi) => {
                      if (!acc[poi.type]) acc[poi.type] = [];
                      acc[poi.type].push(poi);
                      return acc;
                    },
                    {} as Record<string, typeof suburb.pointsOfInterest>,
                  ),
                ).map(([type, pois]) => (
                  <div key={type} className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-2xl">
                        {POI_ICONS[type] || "📍"}
                      </span>
                      {POI_LABELS[type] || type}
                    </h4>
                    <div className="space-y-3">
                      {pois.map((poi) => (
                        <div
                          key={poi.id}
                          className="rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900">
                                {poi.name}
                              </h5>
                              {poi.address && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {poi.address}
                                </p>
                              )}
                              {poi.rating && (
                                <div className="mt-2 flex items-center gap-1">
                                  <span className="text-yellow-400">★</span>
                                  <span className="text-sm font-medium">
                                    {poi.rating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                            {poi.metadata && (
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  poi.name + " " + (poi.address || suburb.name),
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                View on Map →
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Investment Summary */}
            <div className="mt-8 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Investment Summary
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {suburb.investmentScore && suburb.investmentScore >= 85 && (
                  <>
                    <strong>{suburb.name}</strong> is an <strong>excellent</strong> investment opportunity. 
                    With strong price growth and good rental yields, this suburb offers great potential 
                    for first-home buyers and investors alike.
                  </>
                )}
                {suburb.investmentScore && suburb.investmentScore >= 75 && suburb.investmentScore < 85 && (
                  <>
                    <strong>{suburb.name}</strong> is a <strong>good</strong> investment choice. 
                    The suburb shows solid fundamentals with steady growth and reasonable yields.
                  </>
                )}
                {suburb.investmentScore && suburb.investmentScore >= 65 && suburb.investmentScore < 75 && (
                  <>
                    <strong>{suburb.name}</strong> presents a <strong>moderate</strong> investment opportunity. 
                    Consider your budget and long-term goals when evaluating this suburb.
                  </>
                )}
                {suburb.investmentScore && suburb.investmentScore < 65 && (
                  <>
                    <strong>{suburb.name}</strong> may require careful consideration. 
                    Review the metrics and compare with other suburbs to make an informed decision.
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Inline icon component to avoid external dependency for MVP
function X({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

