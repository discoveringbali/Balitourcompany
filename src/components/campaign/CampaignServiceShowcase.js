"use client";

import React, { useState } from "react";
import { Check, ExternalLink, ShieldCheck, Star, MapPin, Clock, ArrowUpRight } from "lucide-react";

export default function CampaignServiceShowcase({ campaign, serviceName }) {
  const isScooter = (campaign?.id === 'scooter' || serviceName === 'Scooter');
  
  const companyTitle = campaign?.title || (isScooter ? "The Bike Bali" : "Ubud Tranquility Spa");
  const companySubtitle = campaign?.subtitle || (isScooter 
    ? "Premium automatic scooters delivered directly to your villa or hotel across Bali." 
    : "Authentic Balinese healing rituals, organic therapies, and luxury wellness sanctuaries.");

  const defaultFeatures = isScooter ? [
    "Free villa & hotel delivery across Bali",
    "2 clean sanitized helmets + phone mount",
    "Comprehensive insurance & 24/7 roadside support",
    "No passport hold required"
  ] : [
    "Certified master Balinese massage therapists",
    "100% natural organic essential oils & herbal scrubs",
    "Private VIP couple suites & floral open-air baths",
    "Complimentary welcome herbal drink & refreshments"
  ];

  const defaultOptions = isScooter ? [
    { name: "Honda Scoopy 110cc", desc: "Best for beach & cafe trips", price: "$6 / day" },
    { name: "Yamaha NMAX 155cc", desc: "Comfort & power for island exploration", price: "$12 / day", popular: true },
    { name: "Honda PCX 160cc", desc: "Premium touring with large storage", price: "$14 / day" }
  ] : [
    { name: "Balinese Deep Tissue Massage", desc: "60-90 min traditional muscle tension relief", price: "$18" },
    { name: "Royal Herbal Scrub & Flower Bath", desc: "120 min signature revitalizing ritual", price: "$32", popular: true },
    { name: "Couples Harmony Sanctuary", desc: "150 min full body scrub, massage & private bath", price: "$58" }
  ];

  const features = campaign?.features?.length > 0 ? campaign.features : defaultFeatures;
  const options = campaign?.options?.length > 0 ? campaign.options : defaultOptions;
  const [selectedOption, setSelectedOption] = useState(options[1] ? 1 : 0);

  const targetUrl = campaign?.externalUrl || (isScooter ? "https://thebikebali.com" : "https://ubudtranquilityspa.com");
  const formattedUrl = targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`;
  const displayDomain = formattedUrl.replace(/^https?:\/\//, '').split('/')[0];

  const handleBooking = () => {
    if (typeof window !== "undefined") {
      window.open(formattedUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="w-full py-8 md:py-14 px-4 md:px-8 max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
        
        {/* Left Column: Clean Company Profile Overview */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Partner & Trust Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3.5 py-1 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-xs">
              {campaign?.badge || "Official Partner"}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-[11px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 border border-gray-200">
              <ShieldCheck size={14} className="text-black" /> Verified Company Profile
            </span>
          </div>

          {/* Company Title */}
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.08] text-[#1c1c1c] tracking-tight">
              {companyTitle}
            </h1>
            <p className="text-base md:text-lg font-medium text-gray-600 leading-relaxed mt-3 max-w-2xl">
              {companySubtitle}
            </p>
          </div>

          {/* Key Company Specs / Quick Facts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-3.5 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-black font-extrabold text-sm">
                <Star size={15} className="fill-black text-black" />
                <span>{campaign?.rating || "4.9"}/5.0</span>
              </div>
              <span className="text-[11px] font-semibold text-gray-500 mt-0.5">{campaign?.reviewsCount || "850+"} Verified Reviews</span>
            </div>

            <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-3.5 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-black font-extrabold text-sm">
                <MapPin size={15} className="text-black" />
                <span className="truncate">{campaign?.location || (isScooter ? "Island-wide" : "Ubud & Seminyak")}</span>
              </div>
              <span className="text-[11px] font-semibold text-gray-500 mt-0.5">{isScooter ? "Doorstep Delivery" : "Central Sanctuary"}</span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-gray-50 border border-gray-200/80 rounded-2xl p-3.5 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-black font-extrabold text-sm">
                <Clock size={15} className="text-black" />
                <span>Instant Confirmation</span>
              </div>
              <span className="text-[11px] font-semibold text-gray-500 mt-0.5">Online Reservation</span>
            </div>
          </div>
          
          {/* Crisp Highlights (No Long Paragraphs) */}
          <div className="flex flex-col gap-3 mt-1">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-black text-white flex-shrink-0 flex items-center justify-center shadow-2xs">
                  <Check size={13} strokeWidth={3} />
                </div>
                <span className="font-bold text-[#1c1c1c] text-sm md:text-[15px] leading-snug">
                  {feat}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Interactive Booking / Package Selector Card */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-gray-200 shadow-xl relative overflow-hidden group">
            
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-black" />
            
            {/* Cover Image Banner */}
            {campaign?.image && (
              <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-6 bg-gray-100 border border-gray-100">
                <img 
                  src={campaign.image} 
                  alt={companyTitle} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md">
                    {campaign?.type || (isScooter ? "Scooter Fleet" : "Spa Sanctuary")}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/90 text-white flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live Partner
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="font-black text-xl text-[#1c1c1c] tracking-tight">
                  {isScooter ? "Select Vehicle Tier" : "Select Treatment Tier"}
                </h3>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">
                  {isScooter ? "Instant direct booking with verified partner" : "Private suites & couple packages available"}
                </p>
              </div>
            </div>

            {/* Selectable Options */}
            <div className="space-y-3 mb-6">
              {options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedOption(idx)}
                    className={`flex items-center justify-between p-4 border-2 rounded-2xl transition-all cursor-pointer relative ${
                      isSelected 
                        ? 'border-black bg-gray-50/80 shadow-xs' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {opt.popular && (
                      <div className="absolute -top-2.5 right-4 bg-black text-white text-[9px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full shadow-2xs">
                        Most Popular
                      </div>
                    )}
                    <div className="pr-3">
                      <div className={`font-extrabold text-sm ${isSelected ? 'text-black' : 'text-gray-800'}`}>
                        {opt.name}
                      </div>
                      <div className="text-xs font-medium text-gray-500 mt-0.5">
                        {opt.desc}
                      </div>
                    </div>
                    <div className={`font-black text-base shrink-0 ${isSelected ? 'text-black' : 'text-gray-700'}`}>
                      {opt.price}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Direct Booking CTA Button (Opens external partner website in a new tab) */}
            <a
              href={formattedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-black text-white font-extrabold py-4 px-6 rounded-2xl hover:bg-neutral-800 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 group/btn cursor-pointer no-underline text-center"
            >
              <span>{isScooter ? "Book Scooter Online" : "Book Treatment Online"}</span>
              <ArrowUpRight size={17} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </a>

            <p className="text-center text-[11px] font-semibold text-gray-400 mt-3.5">
              Redirecting to official partner website: <span className="font-bold text-gray-600 underline">{displayDomain}</span> ↗
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
