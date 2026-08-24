"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Navigation, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/utils";

// Formatter for IDR
const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

// Local cache of Bali regions
const LOCATION_CACHE = {
  'nusa penida': { lat: -8.739184, lng: 115.53112 },
  'mount batur': { lat: -8.239045, lng: 115.377685 },
  'kintamani': { lat: -8.239045, lng: 115.377685 },
  'ubud': { lat: -8.51909, lng: 115.26325 },
  'uluwatu': { lat: -8.8267, lng: 115.0938 },
  'canggu': { lat: -8.6478, lng: 115.1385 },
  'seminyak': { lat: -8.6913, lng: 115.1682 },
  'kuta': { lat: -8.7233, lng: 115.1686 },
  'sanur': { lat: -8.6793, lng: 115.2630 },
  'nusa dua': { lat: -8.8061, lng: 115.2268 },
  'bedugul': { lat: -8.2833, lng: 115.1667 },
  'lovina': { lat: -8.1611, lng: 115.0256 },
  'amed': { lat: -8.3364, lng: 115.6514 },
  'ulun danu': { lat: -8.2833, lng: 115.1667 },
  'airport': { lat: -8.7482, lng: 115.1673 },
  'dps': { lat: -8.7482, lng: 115.1673 }
};

const BALI_HOTSPOTS = [
  { name: "Ngurah Rai Airport (DPS)", area: "Tuban, Kuta", lat: -8.7482, lng: 115.1673 },
  { name: "Ubud Center & Palace", area: "Gianyar, Ubud", lat: -8.5191, lng: 115.2633 },
  { name: "Canggu (Batu Bolong)", area: "North Kuta", lat: -8.6478, lng: 115.1385 },
  { name: "Seminyak Beach", area: "Badung", lat: -8.6913, lng: 115.1682 },
  { name: "Uluwatu Temple", area: "South Kuta", lat: -8.8267, lng: 115.0938 },
  { name: "Nusa Dua Resorts", area: "South Kuta", lat: -8.8061, lng: 115.2268 },
  { name: "Sanur Harbour", area: "Denpasar", lat: -8.6793, lng: 115.2630 },
  { name: "Kintamani / Mount Batur", area: "Bangli", lat: -8.2390, lng: 115.3777 },
  { name: "Bedugul (Lake Beratan)", area: "Tabanan", lat: -8.2833, lng: 115.1667 },
  { name: "Nusa Penida", area: "Klungkung", lat: -8.7392, lng: 115.5311 },
  { name: "Amed Beach", area: "Karangasem", lat: -8.3364, lng: 115.6514 },
  { name: "Lovina Beach", area: "Buleleng", lat: -8.1611, lng: 115.0256 }
];

const CATEGORIES = ["Tour", "Activities"];

// Leaflet-friendly Autocomplete Input
function PlaceAutocompleteInput({ placeholder, onPlaceSelect, value, onChange, icon: Icon }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (text) => {
    onChange(text);
    if (!text || text.trim().length === 0) {
      setSuggestions(BALI_HOTSPOTS);
      setIsOpen(true);
      return;
    }

    const trimmed = text.toLowerCase();
    const matches = BALI_HOTSPOTS.filter(
      h => h.name.toLowerCase().includes(trimmed) || h.area.toLowerCase().includes(trimmed)
    );
    setSuggestions(matches);
    setIsOpen(true);
  };

  const handleSelect = (item) => {
    onChange(item.name);
    onPlaceSelect(item);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="flex gap-3 items-center bg-white/5 px-4 py-3 rounded-xl border border-white/10">
        {Icon ? <Icon size={16} className="text-white shrink-0" /> : <div className="w-2.5 h-2.5 rounded-full bg-white shrink-0 relative after:absolute after:w-0.5 after:h-5 after:bg-white/20 after:top-2.5 after:left-1"></div>}
        <input 
          type="text" 
          placeholder={placeholder} 
          className="flex-1 outline-none font-semibold text-[14px] bg-transparent text-white placeholder:text-gray-400"
          value={value}
          onFocus={() => {
            if (!value) setSuggestions(BALI_HOTSPOTS);
            setIsOpen(true);
          }}
          onChange={(e) => handleInputChange(e.target.value)}
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#000000] border border-white/20 rounded-2xl p-1.5 shadow-2xl z-50 max-h-48 overflow-y-auto no-scrollbar">
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 transition-colors flex flex-col gap-0.5 outline-none"
            >
              <span className="font-bold text-[13px] text-white">{item.name}</span>
              {item.area && <span className="text-[11px] text-gray-400">{item.area}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MapComponent() {
  const router = useRouter();
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLayerRef = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [routeStats, setRouteStats] = useState(null);
  const [transportsData, setTransportsData] = useState([]);
  const [dbTours, setDbTours] = useState([]);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [dynamicDestinations, setDynamicDestinations] = useState([]);
  const [activeMode, setActiveMode] = useState("Tour");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [activeRouteInfo, setActiveRouteInfo] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isTransportMinimized, setIsTransportMinimized] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    const initLeaflet = async () => {
      const L = (await import("leaflet")).default;

      if (!isMounted) return;

      if (!leafletMapRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [-8.409518, 115.188919],
          zoom: 10,
          zoomControl: false,
          attributionControl: false
        });

        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          subdomains: "abcd",
          maxZoom: 19
        }).addTo(map);

        map.on("click", () => {
          setSelectedRegion(null);
        });

        markersLayerRef.current = L.layerGroup().addTo(map);
        routeLayerRef.current = L.layerGroup().addTo(map);

        leafletMapRef.current = map;
        setMapLoaded(true);
      }
    };

    initLeaflet();

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data } = await supabase.from('listings').select('*, pricing_tiers(*)').eq('status', 'Active');
        if (data) {
          const trans = data.filter(d => d.type === 'Transport' || d.type === 'Car Rental');
          setTransportsData(trans.map(d => ({
            id: d.id,
            title: d.title,
            image: d.image,
            year: d.duration || d.data?.duration || "",
            pricePerKm: d.pricePerKm || d.data?.pricePerKm || 6500
          })));

          const tours = data.filter(d => d.type === 'Tour' || d.type === 'Activities');
          const mappedTours = tours.map(t => {
            const dataObj = t.metadata || t.data || {};
            if (t.pricing_tiers) {
              dataObj.tourTiers = t.pricing_tiers.map(pt => ({ pax: pt.min_pax, price: pt.price }));
            }
            
            let basePriceToUse = t.base_price || t.price || 0;
            let allTiers = [];
            if (dataObj.tourTiers) allTiers = [...allTiers, ...dataObj.tourTiers];
            if (dataObj.allInclusiveTiers) allTiers = [...allTiers, ...dataObj.allInclusiveTiers];
            if (dataObj.groupTiers) allTiers = [...allTiers, ...dataObj.groupTiers];

            const validTiers = allTiers.filter(tier => tier.price && Number(String(tier.price).replace(/[^0-9]/g, '')) > 0);
            const cleanBasePriceVal = Number(String(basePriceToUse || 0).replace(/[^0-9]/g, ''));

            if (validTiers.length > 0) {
                validTiers.sort((a, b) => {
                    const aPrice = Number(String(a.price).replace(/[^0-9]/g, '')) / (Number(a.pax) || 1);
                    const bPrice = Number(String(b.price).replace(/[^0-9]/g, '')) / (Number(b.pax) || 1);
                    return aPrice - bPrice;
                });
                const minTier = validTiers[0];
                const minPricePerPax = Number(String(minTier.price).replace(/[^0-9]/g, '')) / (Number(minTier.pax) || 1);
                if (!basePriceToUse || basePriceToUse == 0 || minPricePerPax < cleanBasePriceVal) {
                    basePriceToUse = minPricePerPax;
                }
            } else {
                if (dataObj.pricingType === "Per Group" && dataObj.groupPricingMode === "flat" && dataObj.groupPrice) {
                    const flatPrice = Number(String(dataObj.groupPrice).replace(/[^0-9]/g, ''));
                    if (!basePriceToUse || basePriceToUse == 0 || flatPrice < cleanBasePriceVal) {
                        basePriceToUse = flatPrice;
                    }
                } else if (dataObj.allInclusiveSurcharge && (!basePriceToUse || basePriceToUse == 0)) {
                    basePriceToUse = Number(String(dataObj.allInclusiveSurcharge).replace(/[^0-9]/g, ''));
                }
            }
            const finalPrice = Math.floor(Number(String(basePriceToUse || 0).replace(/[^0-9]/g, '')));

            return {
              id: t.id,
              locationRaw: t.location || dataObj.location || "Bali",
              price: finalPrice,
              name: t.title || dataObj.title,
              image: t.thumbnail_image || t.image || dataObj.images?.[0] || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4'
            };
          });

          const regionMap = new globalThis.Map();
          mappedTours.forEach(t => {
            for (const [key, coords] of Object.entries(LOCATION_CACHE)) {
              if (t.locationRaw.toLowerCase().includes(key)) {
                t.mapRegionId = key;
                if (!regionMap.has(key)) regionMap.set(key, { id: key, name: key.toUpperCase(), ...coords });
              }
            }
          });
          
          if (regionMap.size === 0) {
            for (const [key, coords] of Object.entries(LOCATION_CACHE).slice(0, 6)) {
              regionMap.set(key, { id: key, name: key.toUpperCase(), ...coords });
            }
          }

          setDynamicDestinations(Array.from(regionMap.values()));
          setDbTours(mappedTours);
        }
      } catch (err) { console.error(err); }
    };
    fetchListings();
  }, []);

  // Update Markers
  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerRef.current) return;
    const update = async () => {
      const L = (await import("leaflet")).default;
      markersLayerRef.current.clearLayers();
      if (activeMode !== "Transport") {
        dynamicDestinations.forEach(dest => {
          const isSelected = selectedRegion === dest.id;
          const marker = L.marker([dest.lat, dest.lng], {
            icon: L.divIcon({ 
              className: "custom-div-icon", 
              html: `<div class='cursor-pointer transition-all duration-200 px-3.5 py-1.5 rounded-full font-bold text-xs shadow-md border ${isSelected ? 'bg-black text-white border-black ring-2 ring-white scale-110' : 'bg-white text-black border-gray-200 hover:scale-105'}'>${dest.name}</div>`,
              iconSize: [100, 30],
              iconAnchor: [50, 15]
            })
          });
          marker.on("click", () => setSelectedRegion(dest.id));
          marker.addTo(markersLayerRef.current);
        });
      }
    };
    update();
  }, [dynamicDestinations, activeMode, selectedRegion]);

  const resolveCoords = async (text, explicit) => {
    if (explicit) return explicit;
    if (!text) return null;
    const lower = text.toLowerCase();
    for (const [key, coords] of Object.entries(LOCATION_CACHE)) {
      if (lower.includes(key)) return coords;
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text + " Bali")}&countrycodes=id&limit=1`).then(r => r.json());
      if (res?.[0]) return { lat: parseFloat(res[0].lat), lng: parseFloat(res[0].lon) };
    } catch (e) {
      console.warn("Geocoding fallback failed", e);
    }
    return { lat: -8.5191, lng: 115.2633 }; // Default Ubud
  };

  const handleRouteSearch = async () => {
    if (!pickup && !dropoff) return;
    const start = await resolveCoords(pickup, pickupCoords);
    const end = await resolveCoords(dropoff, dropoffCoords);
    if (!start || !end || !leafletMapRef.current || !routeLayerRef.current) return;

    const L = (await import("leaflet")).default;
    routeLayerRef.current.clearLayers();
    
    try {
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
      const res = await fetch(osrmUrl).then(r => r.json());
      if (res.routes?.[0]) {
        const coords = res.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        const polyline = L.polyline(coords, { color: "#000000", weight: 4.5, opacity: 0.95 }).addTo(routeLayerRef.current);
        
        // Add A and B markers
        const startIcon = L.divIcon({
          className: "route-start",
          html: `<div class="w-6 h-6 rounded-full bg-white border-2 border-black flex items-center justify-center font-black text-[11px] text-black shadow-md">A</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        const endIcon = L.divIcon({
          className: "route-end",
          html: `<div class="w-6 h-6 rounded-full bg-black border-2 border-white flex items-center justify-center font-black text-[11px] text-white shadow-md">B</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        L.marker([start.lat, start.lng], { icon: startIcon }).addTo(routeLayerRef.current);
        L.marker([end.lat, end.lng], { icon: endIcon }).addTo(routeLayerRef.current);

        leafletMapRef.current.fitBounds(polyline.getBounds(), { padding: [60, 60] });
        const distKm = (res.routes[0].distance / 1000).toFixed(1);
        const durationText = Math.round(res.routes[0].duration / 60) + " mins";
        setRouteStats({ distKm, distanceText: `${distKm} km`, durationText });
        setIsTransportMinimized(true);
        setActiveRouteInfo(true);
      }
    } catch (err) {
      console.warn("OSRM error, using straight line", err);
      const coords = [[start.lat, start.lng], [end.lat, end.lng]];
      const polyline = L.polyline(coords, { color: "#000000", weight: 3.5, dashArray: "4, 6" }).addTo(routeLayerRef.current);
      leafletMapRef.current.fitBounds(polyline.getBounds(), { padding: [60, 60] });
      setRouteStats({ distKm: "18.5", distanceText: "18.5 km", durationText: "40 mins" });
      setIsTransportMinimized(true);
      setActiveRouteInfo(true);
    }
  };

  const displayedTours = selectedRegion ? dbTours.filter(t => t.mapRegionId === selectedRegion) : dbTours;

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#f4f4f4]">
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0" />
      
      <div className="absolute top-0 left-0 right-0 p-6 z-20 pt-12 flex flex-col items-center gap-3 pointer-events-none">
        {activeMode === "Transport" ? (
          isTransportMinimized && activeRouteInfo ? (
            <button onClick={() => setIsTransportMinimized(false)} className="bg-black text-white backdrop-blur-md rounded-full shadow-xl px-5 py-4 flex items-center gap-4 pointer-events-auto border border-white/20">
              <div className="w-3 h-3 rounded-full bg-white" />
              <span className="font-bold text-sm truncate">{pickup.split(',')[0]} → {dropoff.split(',')[0]}</span>
            </button>
          ) : (
            <div className="bg-[#000000] text-white backdrop-blur-md rounded-[28px] p-5 shadow-2xl pointer-events-auto w-full max-w-[400px] border border-white/20">
              <div className="flex justify-between items-center px-1 mb-3">
                <h3 className="font-extrabold text-lg">Discover Ride</h3>
                <button onClick={() => setFilterOpen(!filterOpen)} className="p-2 rounded-full bg-white/10 hover:bg-white/20"><SlidersHorizontal size={14} /></button>
              </div>
              <PlaceAutocompleteInput placeholder="Pick-up..." value={pickup} onChange={setPickup} onPlaceSelect={(item) => setPickupCoords({lat: item.lat, lng: item.lng})} />
              <div className="h-3" />
              <PlaceAutocompleteInput placeholder="Where to?" value={dropoff} onChange={setDropoff} onPlaceSelect={(item) => setDropoffCoords({lat: item.lat, lng: item.lng})} icon={MapPin} />
              <button onClick={handleRouteSearch} className="w-full bg-[#1c1c1c] hover:bg-neutral-800 text-white font-bold py-3 rounded-xl mt-4 border border-white/10">Calculate Route</button>
            </div>
          )
        ) : (
          <div className="relative">
            <div className="bg-black text-white backdrop-blur-md rounded-full flex gap-3 items-center px-4 py-3 shadow-xl pointer-events-auto border border-white/20">
              <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center gap-1.5 px-2 font-extrabold text-sm">{activeMode} <ChevronDown size={14} /></button>
            </div>
            {filterOpen && (
              <div className="absolute top-14 left-0 bg-[#000000] border border-white/20 rounded-xl shadow-xl p-2 min-w-[140px] pointer-events-auto z-50">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => {setActiveMode(cat); setFilterOpen(false)}} className="block w-full text-left px-4 py-2 text-sm font-bold text-white hover:bg-white/10 rounded-lg">
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {activeMode === "Transport" && routeStats && (
        <div className="absolute bottom-28 left-0 right-0 z-20 flex gap-4 overflow-x-auto pointer-events-auto px-6 snap-x snap-mandatory pb-4 hide-scroll">
          {transportsData.map(car => (
            <div key={car.id} onClick={() => setSelectedTransport(car.id)} className={`w-[260px] md:w-[300px] shrink-0 bg-white p-5 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 cursor-pointer transition-transform active:scale-95 snap-start ${selectedTransport === car.id ? 'border-black' : 'border-transparent'}`}>
              <h3 className="font-extrabold text-[15px] leading-tight text-primary truncate">{car.title}</h3>
              <p className="text-[13px] font-bold text-gray-400 mt-1">{routeStats.distanceText} • {routeStats.durationText}</p>
              <div className="font-black mt-3 text-[16px] text-primary">{formatIDR(routeStats.distKm * car.pricePerKm)}</div>
              {selectedTransport === car.id && (
                <a href={`https://wa.me/6285174119423`} target="_blank" className="block text-center mt-4 bg-black text-white py-3 rounded-xl text-[14px] font-bold hover:scale-105 transition-transform">Book on WhatsApp</a>
              )}
            </div>
          ))}
        </div>
      )}

      {activeMode !== "Transport" && selectedRegion && displayedTours.length > 0 && (
        <div className="absolute bottom-28 left-0 right-0 z-20 flex gap-4 overflow-x-auto pointer-events-auto px-6 snap-x snap-mandatory pb-4 hide-scroll animate-in slide-in-from-bottom-8 fade-in duration-300">
          {displayedTours.map(tour => (
            <div key={tour.id} onClick={() => router.push(`/tours/${generateSlug(tour.name)}`)} className="w-[280px] shrink-0 bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] snap-start overflow-hidden border border-gray-100 flex items-center p-3 cursor-pointer active:scale-95 transition-transform hover:-translate-y-1 gap-3">
              <div className="relative w-[72px] h-[72px] rounded-[12px] bg-gray-200 shrink-0 overflow-hidden">
                <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col flex-1 min-w-0 justify-center">
                <h3 className="font-extrabold text-[13px] leading-snug text-primary line-clamp-2 mb-1.5">{tour.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Starts From</span>
                    <span className="font-black text-primary text-[14px]">{formatIDR(tour.price)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
