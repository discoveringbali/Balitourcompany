"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FlashSaleCard({ data }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, isMounted: false
  });

  useEffect(() => {
    if (!data?.active || !data?.endTime) {
      setTimeLeft(prev => ({ ...prev, isMounted: true, isExpired: true }));
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(data.endTime).getTime();
      const difference = end - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, isMounted: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isExpired: false,
        isMounted: true,
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [data]);

  if (!timeLeft.isMounted || timeLeft.isExpired || !data?.active) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        className="px-6 mb-8 mt-2"
      >
        <Link href={data.linkUrl || "/tours"} className="block relative w-full overflow-hidden rounded-[24px] bg-[#0A0A0A] border border-white/10 group shadow-2xl">
          <div className="flex flex-col md:flex-row relative z-10 p-1 min-h-[140px]">
            
            {/* Image Section */}
            <div className="relative w-full md:w-[220px] h-[120px] md:h-auto rounded-[20px] overflow-hidden shrink-0">
              {data.image ? (
                <Image src={data.image} alt={data.title || "Flash Sale"} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <Tag className="text-white/30 w-12 h-12" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:hidden"></div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-center flex-1 p-5 md:px-8 relative z-20">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#ff3333] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,51,51,0.4)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  Flash Sale
                </span>
                {data.discountText && (
                  <span className="text-[#ff3333] font-black text-sm bg-[#ff3333]/10 px-2.5 py-0.5 rounded-md border border-[#ff3333]/20">
                    {data.discountText}
                  </span>
                )}
              </div>
              <h3 className="text-white font-black text-[22px] md:text-[28px] leading-tight mb-1 group-hover:text-primary transition-colors">
                {data.title || "Limited Time Offer"}
              </h3>
            </div>

            {/* Timer Section */}
            <div className="flex items-center justify-start md:justify-end md:w-[320px] p-5 md:pl-0 md:pr-8 border-t md:border-t-0 md:border-l border-white/10 shrink-0 bg-black/20">
              <div className="flex flex-col items-start md:items-end w-full">
                <div className="flex items-center gap-1.5 text-gray-400 mb-2">
                  <Clock size={14} className="text-primary animate-pulse" />
                  <span className="text-[12px] font-bold uppercase tracking-wider">Ends In</span>
                </div>
                
                <div className="flex items-center gap-2 md:gap-3 text-white">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                      <span className="font-black text-lg md:text-xl">{timeLeft.days.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 mt-1 uppercase">Days</span>
                  </div>
                  <span className="text-gray-600 font-bold mb-4">:</span>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                      <span className="font-black text-lg md:text-xl">{timeLeft.hours.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 mt-1 uppercase">Hrs</span>
                  </div>
                  <span className="text-gray-600 font-bold mb-4">:</span>

                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                      <span className="font-black text-lg md:text-xl">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 mt-1 uppercase">Mins</span>
                  </div>
                  <span className="text-gray-600 font-bold mb-4">:</span>

                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#ff3333]/20 text-[#ff3333] rounded-xl flex items-center justify-center backdrop-blur-md border border-[#ff3333]/30 shadow-inner">
                      <span className="font-black text-lg md:text-xl">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#ff3333]/70 mt-1 uppercase">Secs</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff3333]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
