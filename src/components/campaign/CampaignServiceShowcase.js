"use client";

import React, { useState } from "react";
import { Check, ExternalLink, ShieldCheck, Sparkles, Star } from "lucide-react";
import Image from "next/image";

export default function CampaignServiceShowcase({ campaign, serviceName }) {
  const isScooter = (campaign?.id === 'scooter' || serviceName === 'Scooter');
  
  const defaultFeatures = isScooter ? [
    "Free delivery & pickup to your villa / hotel across South Bali & Ubud",
    "2 clean sanitized helmets + phone mount & surf rack on request",
    "Full mechanical check before delivery + 24/7 island roadside assistance",
    "Transparent pricing with no hidden charges or passport hold required"
  ] : [
    "Certified master therapists skilled in authentic ancient Balinese massage",
    "100% organic cold-pressed essential oils, fresh herb scrubs & floral baths",
    "VIP private couple treatment suites with private open-air bathtubs",
    "Instant booking confirmation with complimentary ginger tea & refreshments"
  ];

  const defaultOptions = isScooter ? [
    { name: "Honda Scoopy 110cc", desc: "Best for town, cafe hopping & beach trips", price: "$6 / day" },
    { name: "Yamaha NMAX 155cc", desc: "Comfortable power for long island scenic rides", price: "$12 / day", popular: true },
    { name: "Honda PCX 160cc", desc: "Smooth luxury touring with large underseat storage", price: "$14 / day" }
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

  const handleBooking = () => {
    if (typeof window !== "undefined") {
      window.open(formattedUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="w-full py-8 md:py-16 px-4 md:px-8 max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
        
        {/* Left Value Proposition Column */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-full">
              {campaign?.badge || "Official Partner"}
            </span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={14} className="text-[#1c1c1c]" /> Verified Partner
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.08] text-[#1c1c1c] tracking-tight">
            {campaign?.title || (isScooter ? "Premium Scooter & Motorbike Rental" : "Luxury Spa & Authentic Massage")}
          </h1>

          <p className="text-base md:text-lg font-medium text-gray-600 leading-relaxed">
            {campaign?.subtitle || (isScooter 
              ? "Explore Bali with total freedom. Book premium, well-maintained automatic scooters delivered directly to your door." 
              : "Immerse yourself in deeply restorative Balinese healing therapies and luxury spa wellness sanctuaries.")}
          </p>
          
          <div className="flex flex-col gap-3.5 mt-2">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-[#1c1c1c] text-white flex-shrink-0 flex items-center justify-center mt-0.5 shadow-2xs">
                  <Check size={15} strokeWidth={3} />
                </div>
                <span className="font-semibold text-[#1c1c1c] text-sm md:text-base leading-snug">
                  {feat}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center gap-4 text-xs font-bold text-gray-500">
            <span className="flex items-center gap-1"><Star size={14} className="fill-black text-black" /> 4.9/5 Rating</span>
            <span>•</span>
            <span>Over 2,500+ Happy Travelers</span>
          </div>
        </div>

        {/* Right Showcase & Booking Card */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#eaeaea] shadow-2xl relative overflow-hidden group">
            
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 w-full h-2 bg-[#1c1c1c]" />
            
            {/* Campaign Photo Banner */}
            {campaign?.image && (
              <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-6 bg-gray-100 border border-[#eaeaea]">
                <img 
                  src={campaign.image} 
                  alt={campaign.title || "Campaign Cover"} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 backdrop-blur-md">
                    {campaign?.type || (isScooter ? "Scooter Integration" : "Spa Wellness")}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-black text-2xl text-[#1c1c1c] tracking-tight">
                  {isScooter ? "Select Scooter Tier" : "Featured Treatments"}
                </h3>
                <p className="text-xs font-semibold text-gray-500 mt-1">
                  {isScooter ? "Free delivery & instant WhatsApp reservation" : "Private suites & couple packages available"}
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
                        ? 'border-[#1c1c1c] bg-[#f9f9f9] shadow-sm' 
                        : 'border-[#eaeaea] hover:border-gray-300 bg-white'
                    }`}
                  >
                    {opt.popular && (
                      <div className="absolute -top-2.5 right-4 bg-[#1c1c1c] text-white text-[9px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full shadow-2xs">
                        Most Popular
                      </div>
                    )}
                    <div className="pr-3">
                      <div className={`font-extrabold text-sm ${isSelected ? 'text-[#1c1c1c]' : 'text-gray-800'}`}>
                        {opt.name}
                      </div>
                      <div className="text-xs font-medium text-gray-500 mt-0.5">
                        {opt.desc}
                      </div>
                    </div>
                    <div className={`font-black text-base shrink-0 ${isSelected ? 'text-[#1c1c1c]' : 'text-gray-700'}`}>
                      {opt.price}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Direct Booking CTA Button */}
            <button
              onClick={handleBooking}
              className="w-full bg-[#1c1c1c] text-white font-extrabold py-4 px-6 rounded-2xl hover:bg-black active:scale-[0.99] transition-all shadow-lg flex items-center justify-center gap-2 group/btn"
            >
              <span>{isScooter ? "Reserve Scooter Online" : "Book Spa Treatment"}</span>
              <ExternalLink size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>

            <p className="text-center text-[11px] font-semibold text-gray-400 mt-3.5">
              You will be redirected to our verified booking partner ({targetUrl.replace(/^https?:\/\//, '').split('/')[0]}).
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
