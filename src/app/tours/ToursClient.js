"use client";

import React, { useState } from "react";
import ListingCard from "@/components/listing/ListingCard";
import UniversalSearchBar from "@/components/search/UniversalSearchBar";
import { ChevronDown } from "lucide-react";
import { generateSlug } from "@/lib/utils";
import { motion } from "framer-motion";

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
    <div className="w-full bg-background min-h-screen pt-20 md:pt-24 pb-20">
      <div className="container mx-auto px-4 lg:max-w-7xl">
        
        {/* Header & Search */}
        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 hidden md:block">Explore Bali Tours</h1>
          <p className="text-text-secondary mb-8 hidden md:block">Discover and book the most epic adventures on the island.</p>
          <div className="bg-surface p-2 rounded-3xl shadow-sm inline-block w-full lg:min-w-[800px]">
            <UniversalSearchBar />
          </div>
        </div>

        {/* Sticky Category Filter */}
        <div className="sticky top-[70px] md:top-[90px] z-30 bg-background pt-2 pb-4">
          <div className="bg-black rounded-[32px] p-1.5 shadow-md">
            <div className="flex items-center overflow-x-auto no-scrollbar hide-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="relative flex items-center justify-center px-4 py-2 rounded-[24px] active:scale-95 outline-none shrink-0"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="toursCategoryIndicator"
                        className="absolute inset-0 bg-white rounded-[24px] shadow-sm"
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      />
                    )}
                    <div className="relative z-10 flex items-center justify-center">
                        <span className={`text-[13px] tracking-tight whitespace-nowrap transition-colors duration-300 ${isActive ? 'text-black font-extrabold' : 'text-white/70 font-bold hover:text-white'}`}>
                          {cat}
                        </span>
                    </div>
                  </button>
                );
              })}
            </div>
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
