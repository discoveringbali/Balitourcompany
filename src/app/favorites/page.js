"use client";

import React, { useState, useEffect } from "react";
import { Heart, Search } from "lucide-react";
import WishlistCard from "@/components/listing/WishlistCard";
import { generateSlug } from "@/lib/utils";
import { getSavedTrips } from "@/lib/favorites";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load from local storage
    const loadFavs = () => {
      const trips = getSavedTrips();
      setFavorites(trips);
      setLoading(false);
    };

    loadFavs();

    const handleUpdate = (e) => {
      if (e.detail?.all) {
        setFavorites(e.detail.all);
      } else {
        setFavorites(getSavedTrips());
      }
    };

    window.addEventListener("favoritesUpdated", handleUpdate);
    return () => window.removeEventListener("favoritesUpdated", handleUpdate);
  }, []);

  const filteredFavorites = favorites.filter((tour) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      tour.title?.toLowerCase().includes(q) ||
      tour.location?.toLowerCase().includes(q) ||
      tour.category?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#000000]">
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-black animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#000000] pb-32 font-sans">
      <div className="px-6 pt-6 pb-6 max-w-7xl mx-auto">
        <div className="bg-[#111111] rounded-2xl flex gap-3 items-center px-5 py-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white/10 mb-8">
          <Search size={20} className="text-gray-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your saved trips..." 
            className="flex-1 outline-none font-bold text-[14px] bg-transparent text-white placeholder:text-gray-400 placeholder:font-medium"
          />
        </div>

        {filteredFavorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-[#222222] rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Heart size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
              {favorites.length === 0 ? "No saved trips yet" : "No matching saved trips"}
            </h3>
            <p className="text-gray-500 font-medium max-w-sm">
              {favorites.length === 0 
                ? "When you see a trip you like, click the heart icon on any card to save it here."
                : "Try a different search query to find your saved trips."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFavorites.map((tour) => (
              <WishlistCard key={tour.id} item={tour} linkTo={`/tours/${generateSlug(tour.title || "tour")}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
