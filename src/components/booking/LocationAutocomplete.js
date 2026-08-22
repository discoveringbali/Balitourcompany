"use client";

import React, { useState, useEffect, useRef } from "react";

const BALI_HOTSPOTS = [
  { name: "Ngurah Rai International Airport (DPS)", area: "Tuban, Kuta", lat: -8.7482, lng: 115.1673 },
  { name: "Ubud Center & Monkey Forest", area: "Gianyar, Ubud", lat: -8.5191, lng: 115.2633 },
  { name: "Canggu (Batu Bolong / Echo Beach)", area: "North Kuta, Badung", lat: -8.6478, lng: 115.1385 },
  { name: "Seminyak Beach & Oberoi", area: "Badung, Bali", lat: -8.6913, lng: 115.1682 },
  { name: "Uluwatu Temple & Padang Padang", area: "South Kuta, Badung", lat: -8.8267, lng: 115.0938 },
  { name: "Nusa Dua Resort Area", area: "South Kuta, Badung", lat: -8.8061, lng: 115.2268 },
  { name: "Sanur Beach & Harbour", area: "Denpasar, Bali", lat: -8.6793, lng: 115.2630 },
  { name: "Kintamani & Mount Batur", area: "Bangli, Bali", lat: -8.2390, lng: 115.3777 },
  { name: "Bedugul (Ulun Danu Beratan)", area: "Tabanan, Bali", lat: -8.2833, lng: 115.1667 },
  { name: "Nusa Penida (Sanur Fast Boat)", area: "Klungkung, Bali", lat: -8.7392, lng: 115.5311 },
  { name: "Amed & Tulamben Diving Area", area: "Karangasem, Bali", lat: -8.3364, lng: 115.6514 },
  { name: "Lovina Beach (Dolphin Watching)", area: "Buleleng, Bali", lat: -8.1611, lng: 115.0256 }
];

export default function LocationAutocomplete({ value, onChange, placeholder, icon: Icon }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search logic
  useEffect(() => {
    if (!isOpen) return;

    if (!query || query.trim().length === 0) {
      setSuggestions(BALI_HOTSPOTS.map(h => ({ name: h.name, subtitle: h.area, lat: h.lat, lng: h.lng })));
      return;
    }

    const trimmed = query.trim().toLowerCase();
    const localMatches = BALI_HOTSPOTS.filter(
      h => h.name.toLowerCase().includes(trimmed) || h.area.toLowerCase().includes(trimmed)
    ).map(h => ({ name: h.name, subtitle: h.area, lat: h.lat, lng: h.lng }));

    setSuggestions(localMatches);

    // Debounced Nominatim API search for custom Bali locations
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) return;
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query + " Bali"
          )}&countrycodes=id&viewbox=114.4,-8.0,115.8,-8.9&bounded=0&limit=5`
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const apiResults = data.map(item => ({
              name: item.display_name.split(',')[0],
              subtitle: item.display_name.split(',').slice(1, 4).join(',').trim(),
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon)
            }));
            
            // Merge and deduplicate
            const seen = new Set(localMatches.map(m => m.name.toLowerCase()));
            const merged = [...localMatches];
            for (const r of apiResults) {
              if (!seen.has(r.name.toLowerCase())) {
                seen.add(r.name.toLowerCase());
                merged.push(r);
              }
            }
            setSuggestions(merged);
          }
        }
      } catch (err) {
        console.error("Nominatim search error", err);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleSelect = (item) => {
    setQuery(item.name);
    setIsOpen(false);
    onChange({
      name: item.name,
      url: `https://www.openstreetmap.org/?mlat=${item.lat}&mlon=${item.lng}#map=15/${item.lat}/${item.lng}`,
      coords: [item.lat, item.lng]
    });
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative flex items-center">
        {Icon && <Icon className="absolute left-4 text-gray-400" size={18} />}
        <input 
          required 
          type="text" 
          value={query} 
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            onChange({ name: e.target.value, url: "" });
          }} 
          placeholder={placeholder} 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-[15px] font-medium text-white outline-none focus:border-accent transition-colors placeholder:text-gray-500" 
        />
        {isLoading && (
          <div className="absolute right-4 w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1c1c1c] rounded-2xl p-2 shadow-2xl border border-white/10 z-50 max-h-60 overflow-y-auto no-scrollbar animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider px-3 py-1">
            Suggested Locations
          </div>
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors flex flex-col gap-0.5 outline-none active:bg-white/20"
            >
              <span className="font-bold text-[14px] text-white">{item.name}</span>
              {item.subtitle && (
                <span className="text-[11px] text-gray-400 truncate">{item.subtitle}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
