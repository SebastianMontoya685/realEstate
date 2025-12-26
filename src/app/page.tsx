"use client";

import { useState } from "react";
import { SuburbMap } from "~/app/_components/SuburbMap";
import { SuburbDetail } from "~/app/_components/SuburbDetail";

export default function Home() {
  const [selectedSuburbId, setSelectedSuburbId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Sydney Property Investment Insights
          </h1>
          <p className="mt-2 text-gray-600">
            Data-driven insights to help first-home buyers make smarter investment decisions
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-3">
            Discover Your Perfect Suburb
          </h2>
          <p className="text-blue-50 text-lg mb-4">
            Explore Sydney suburbs with our interactive heat map. See investment scores, 
            price trends, and local amenities at a glance.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <span>Investment Metrics</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏫</span>
              <span>Schools & Education</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚇</span>
              <span>Transport Links</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛍️</span>
              <span>Shopping & Amenities</span>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Sydney Suburbs Heat Map
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Click on any suburb marker to view detailed information and points of interest
            </p>
          </div>
          <SuburbMap onSuburbClick={setSelectedSuburbId} />
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Investment Score
            </h3>
            <p className="text-gray-600 text-sm">
              Our proprietary score combines price growth, rental yields, and local amenities 
              to help you identify the best investment opportunities.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Price Trends
            </h3>
            <p className="text-gray-600 text-sm">
              Track median property prices and 12-month growth rates to understand 
              market dynamics and timing for your investment.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="text-3xl mb-3">📍</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Local Insights
            </h3>
            <p className="text-gray-600 text-sm">
              Explore schools, transport, shopping centers, and parks to understand 
              what makes each suburb unique and liveable.
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-12 rounded-lg bg-white p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600 mb-3">
                1
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Explore the Map</h4>
              <p className="text-sm text-gray-600">
                View color-coded suburbs based on investment potential
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600 mb-3">
                2
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Check Metrics</h4>
              <p className="text-sm text-gray-600">
                Review prices, growth rates, and rental yields
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600 mb-3">
                3
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Explore Amenities</h4>
              <p className="text-sm text-gray-600">
                Discover schools, transport, and local facilities
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600 mb-3">
                4
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Make Decision</h4>
              <p className="text-sm text-gray-600">
                Use data-driven insights to choose your ideal suburb
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Sydney Property Investment Insights - Making property investment accessible for all Australians
          </p>
          <p className="text-xs mt-2">
            MVP Version • Data for demonstration purposes
          </p>
        </div>
      </footer>

      {/* Suburb Detail Modal */}
      {selectedSuburbId && (
        <SuburbDetail
          suburbId={selectedSuburbId}
          onClose={() => setSelectedSuburbId(null)}
        />
      )}
    </main>
  );
}
