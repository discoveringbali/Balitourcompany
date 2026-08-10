"use client";

import React, { useState } from "react";
import ListingCard from "@/components/listing/ListingCard";
import UniversalSearchBar from "@/components/search/UniversalSearchBar";
import { ChevronDown } from "lucide-react";
import { generateSlug } from "@/lib/utils";

const categories = ["All", "Adventure", "Water", "Nature", "Culture"];
const locations = ["All", "Ubud", "Nusa Penida", "Kuta", "Seminyak", "Canggu", "Uluwatu", "Bedugul"];

export default function ToursClient({ initialTours }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLocation, setActiveLocation] = useState("All");

  const filteredTours = initialTours.filter(tour => {
    let matchCat = true;
    let matchLoc = true;

    if (activeCategory !== "All") {
      const cat = tour.category || tour.data?.category || "";
      matchCat = cat.toLowerCase() === activeCategory.toLowerCase();
    }

    if (activeLocation !== "All") {
      const loc = (tour.location || tour.data?.location || "").toLowerCase();
      matchLoc = loc.includes(activeLocation.toLowerCase());
    }

    return matchCat && matchLoc;
  });

  return (
    <div className="w-full bg-background min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 lg:max-w-7xl">
        
        {/* Header & Search */}
        <div className="mb-8 hidden md:block">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Explore Bali Tours</h1>
          <p className="text-text-secondary mb-8">Discover and book the most epic adventures on the island.</p>
          <div className="bg-surface p-2 rounded-3xl shadow-sm mb-8 inline-block max-w-full lg:min-w-[800px]">
            <UniversalSearchBar />
          </div>
        </div>

        {/* Mobile Title (hidden on desktop) */}
        <h1 className="text-2xl font-bold mb-6 md:hidden">Explore Tours</h1>

        {/* Pill Filters */}
        <div className="mb-6 flex flex-col gap-4">
          
          {/* Category Filter */}
          <div className="flex items-center overflow-x-auto no-scrollbar hide-scroll gap-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full font-bold text-[14px] whitespace-nowrap transition-colors outline-none shrink-0 border ${
                    isActive 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-text-secondary border-border hover:border-black hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Location Filter */}
          <div className="flex items-center overflow-x-auto no-scrollbar hide-scroll gap-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {locations.map((loc) => {
              const isActive = activeLocation === loc;
              return (
                <button
                  key={loc}
                  onClick={() => setActiveLocation(loc)}
                  className={`px-5 py-2 rounded-full font-bold text-[14px] whitespace-nowrap transition-colors outline-none shrink-0 border ${
                    isActive 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-text-secondary border-border hover:border-black hover:text-black'
                  }`}
                >
                  {loc}
                </button>
              );
            })}
          </div>

        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Listings */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <span className="font-medium text-text-secondary text-sm">Showing {filteredTours.length} Tours</span>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary hidden sm:inline">Sort by:</span>
                <button className="flex items-center gap-1 text-sm font-semibold bg-surface px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-border hover:bg-surface-hover transition-colors">
                  Recommended <ChevronDown size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {filteredTours.map(tour => (
                <ListingCard key={tour.id} item={tour} linkTo={`/tours/${generateSlug(tour.title)}`} compact={true} />
              ))}
            </div>
            
            {filteredTours.length === 0 && (
              <div className="py-12 text-center text-text-secondary">
                No tours found matching your selected filters.
              </div>
            )}
            
            {filteredTours.length > 0 && (
              <div className="mt-12 flex justify-center">
                <button className="rounded-full bg-surface text-text-primary px-8 py-3 border border-border hover:bg-surface-hover font-semibold transition-colors shadow-sm">
                  Load More Experiences
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
