"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { isTripSaved, toggleSaveTrip } from "@/lib/favorites";
import { useCurrency } from "@/lib/currency";

export default function ListingCard({ item, linkTo, compact }) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (item?.id) {
      setIsSaved(isTripSaved(item.id));
    }

    const handleUpdate = (e) => {
      if (item?.id && e.detail?.id === item.id) {
        setIsSaved(e.detail.isSaved);
      }
    };

    window.addEventListener("favoritesUpdated", handleUpdate);
    return () => window.removeEventListener("favoritesUpdated", handleUpdate);
  }, [item?.id]);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!item) return;
    const newState = toggleSaveTrip(item);
    setIsSaved(newState);
  };

  const getFormattedPrice = (rawPrice) => {
    const p = Number(rawPrice);
    return Math.floor(p > 1000 ? p : p * 1000);
  };

  let basePriceToUse = item.price;
  const dataObj = item.data || item || {};
  // Find all possible tiers
  let allTiers = [];
  if (dataObj.tourTiers) allTiers = [...allTiers, ...dataObj.tourTiers];
  if (dataObj.allInclusiveTiers) allTiers = [...allTiers, ...dataObj.allInclusiveTiers];
  if (dataObj.groupTiers) allTiers = [...allTiers, ...dataObj.groupTiers];

  const validTiers = allTiers.filter(t => t.price && Number(String(t.price).replace(/[^0-9]/g, '')) > 0);

  const cleanBasePriceVal = Number(String(basePriceToUse || 0).replace(/[^0-9]/g, ''));

  if (validTiers.length > 0) {
      // Find the absolute lowest price PER PERSON equivalent
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

  const cleanBasePrice = Number(String(basePriceToUse || 0).replace(/[^0-9]/g, ''));
  const formattedPrice = formatPrice(cleanBasePrice);

  if (item.service === "Spa") {
    // Determine the prices to show
    const prices = [];
    if (item.min60) prices.push({ label: '60 Min', price: item.min60 });
    if (item.min90) prices.push({ label: '90 Min', price: item.min90 });
    if (item.min120) prices.push({ label: '120 Min', price: item.min120 });
    
    // Fallback price logic if no explicit durations are found
    if (prices.length === 0) prices.push({ label: 'Starts at', price: item.price });
    
    const displayPrice = prices.length > 0 ? prices[0] : null;

    return (
      <Link href={linkTo} className="flex flex-col w-full bg-[#fbfbfb] rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#ededed] group transition-all hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] outline-none">
        
        {/* Spa Image Section */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#e6e6e6] shrink-0">
          {item.image ? (
            <Image 
              src={item.image} 
              alt={item.title || "Spa Image"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-[12s] ease-out group-hover:scale-110 opacity-95 group-hover:opacity-100 mix-blend-multiply" 
            />
          ) : (
            <div className="absolute inset-0 bg-[#e6e6e6] w-full h-full"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          
          {/* Badge */}
          {item.spaSetting && (
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-block px-3 py-1.5 bg-[#939393]/95 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-widest shadow-sm rounded-xl border border-white/20">{item.spaSetting}</span>
            </div>
          )}

          {/* Heart Favorite Button */}
          <button 
            onClick={handleSave} 
            className="liquid-glass absolute top-4 right-4 w-[36px] h-[36px] rounded-full flex items-center justify-center text-white z-10"
          >
            <Heart size={18} strokeWidth={2.5} className={isSaved ? "text-black fill-black" : ""} />
          </button>
        </div>
        
        {/* Content Section */}
        <div className="flex flex-col p-5 pt-5 flex-1">
          {/* Location & Category */}
          <div className="text-[10px] font-black tracking-[0.2em] text-[#acacac] uppercase mb-1.5 truncate">
            Wellness • {item.location || "Bali"}
          </div>
          
          {/* Title */}
          <h3 className="font-extrabold text-[18px] leading-[1.3] text-[#383838] line-clamp-2 mb-2 group-hover:text-[#939393] transition-colors font-serif">
            {item.title}
          </h3>
          
          {/* Short description / Benefit */}
          <p className="text-[12px] font-medium text-[#909090] line-clamp-2 mb-4 leading-relaxed">
             {item.description || item.highlights || item.included || "Experience deep relaxation and rejuvenation with our bespoke spa therapies."}
          </p>

          {/* Footer (Price + Button) */}
          <div className="mt-auto pt-4 flex items-end justify-between gap-2 border-t border-[#ededed]">
            <div className="flex flex-col justify-end">
              {displayPrice && (
                 <>
                   <span className="text-[10px] font-bold text-[#acacac] uppercase tracking-widest mb-0.5">{displayPrice.label}</span>
                   <div className="flex items-end gap-1">
                     <span className="font-extrabold text-[15px] text-[#1c1c1c]">
                       {formatPrice(displayPrice.price)}
                     </span>
                   </div>
                 </>
              )}
            </div>
            <button className="text-[12px] font-extrabold text-white bg-[#939393] px-5 py-2.5 rounded-xl shrink-0 shadow-sm transition-transform active:scale-95 group-hover:bg-[#7e7e7e]">
              Reserve
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // Standard Tour/Listing Return
  return (
    <Link href={linkTo} className="flex flex-col w-full bg-white rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 group transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] block outline-none">
      
      {/* Image Section */}
      <div className={`relative w-full overflow-hidden bg-[#f4f4f4] shrink-0 ${compact ? 'aspect-square md:aspect-[4/3]' : 'aspect-[4/3]'}`}>
        {item.image && (
          <Image 
            src={item.image} 
            alt={item.title || "Tour Image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-[10s] ease-out group-hover:scale-110" 
          />
        )}
        
        {/* Badge */}
        {item.badge && (
          <div className={`absolute left-2 z-10 ${compact ? 'top-2 md:top-4 md:left-4' : 'top-4 left-4'}`}>
            <span className={`inline-block bg-white/95 backdrop-blur-md text-primary font-extrabold uppercase tracking-wider shadow-sm rounded-xl border border-white/40 ${compact ? 'px-2 py-1 text-[8px] sm:text-[10px] md:px-3 md:py-1.5 md:text-[11px]' : 'px-3 py-1.5 text-[10px] sm:text-[11px]'}`}>{item.badge}</span>
          </div>
        )}

        {/* Heart Favorite Button */}
        <button 
          onClick={handleSave} 
          className={`absolute bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-text-secondary/80 shadow-sm z-10 transition-all group-hover:opacity-100 active:scale-90 hover:bg-white hover:text-black ${compact ? 'top-2 right-2 w-[28px] h-[28px] md:top-4 md:right-4 md:w-[36px] md:h-[36px]' : 'top-4 right-4 w-[36px] h-[36px]'}`}
        >
          <Heart size={compact ? 14 : 18} strokeWidth={2.5} className={isSaved ? "text-black fill-black" : ""} />
        </button>
      </div>
      
      {/* Content Section */}
      <div className={`flex flex-col flex-1 ${compact ? 'p-3 pt-2 md:p-5 md:pt-4' : 'p-5 pt-4'}`}>
        {/* Location & Category (GyG style subtitle) */}
        <div className={`font-extrabold tracking-widest text-[#909090] uppercase mb-1.5 truncate ${compact ? 'text-[9px] md:text-[11px]' : 'text-[11px]'}`}>
          {item.service || "Tour"} • {item.location || "Bali"}
        </div>
        
        {/* Title */}
        <h3 className={`font-extrabold leading-[1.2] md:leading-[1.3] text-primary line-clamp-2 mb-2 group-hover:text-accent transition-colors ${compact ? 'text-[13px] md:text-[16px]' : 'text-[16px]'}`}>
          {item.title}
        </h3>
        
        {/* Ratings */}
        <div className="flex items-center gap-1 mb-3 md:mb-4">
          <Star size={compact ? 10 : 13} strokeWidth={2.5} className="fill-black text-black pb-[0.5px]" />
          <span className={`font-bold text-primary ${compact ? 'text-[11px] md:text-[13px]' : 'text-[13px]'}`}>{Number(item.rating || 5).toFixed(1)}</span>
          <span className={`font-semibold text-text-secondary ${compact ? 'text-[10px] md:text-[13px]' : 'text-[13px]'}`}>({item.reviews || 0} reviews)</span>
        </div>

        {/* Footer (Price + Button/Date) */}
        <div className="mt-auto pt-2 md:pt-3 flex items-end justify-between gap-1 border-t border-gray-100/80">
          <div className="flex flex-col justify-end">
            <span className={`font-bold text-text-secondary uppercase tracking-widest mb-0.5 ${compact ? 'text-[8px] md:text-[10px]' : 'text-[10px]'}`}>From</span>
            <div className="flex items-end gap-1">
              <span className={`font-extrabold text-primary tracking-tight leading-none ${compact ? 'text-[13px] md:text-[17px]' : 'text-[17px]'}`}>
                {formattedPrice}
              </span>
            </div>
          </div>
          <button className={`liquid-glass font-extrabold rounded-xl shrink-0 transition-transform active:scale-95 group-hover:scale-105 ${compact ? 'text-[11px] px-3 py-1.5 md:text-[13px] md:px-4 md:py-2' : 'text-[13px] px-4 py-2'}`}>
            Book
          </button>
        </div>
      </div>
    </Link>
  );
}

