import React from 'react';
import { ArrowLeft, Share2, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function Loading() {
  return (
    <main className="min-h-screen bg-background pb-32 font-sans animate-pulse -mt-20 md:-mt-24">
      {/* Hero Header Section Skeleton */}
      <div className="relative w-full h-[50vh] md:h-[65vh] bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/5"></div>

        {/* Top Navigation Bar */}
        <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-20">
          <div className="w-10 h-10 bg-white/40 rounded-full"></div>
          <div className="w-10 h-10 bg-white/40 rounded-full"></div>
        </div>

        {/* Title / Meta Area */}
        <div className="absolute bottom-6 md:bottom-12 inset-x-6 md:inset-x-12 z-20 flex flex-col md:w-[70%]">
          <div className="w-24 h-6 bg-white/40 rounded-[8px] mb-4"></div>
          <div className="w-3/4 h-10 md:h-16 bg-white/40 rounded-xl mb-4"></div>
          <div className="w-1/2 h-10 md:h-16 bg-white/40 rounded-xl mb-6"></div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="w-32 h-8 bg-white/40 rounded-full"></div>
            <div className="w-32 h-8 bg-white/40 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Content Area Skeleton */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 pt-10 md:pt-16 pb-12 flex flex-col gap-6">
        <div className="w-full h-6 bg-gray-200 rounded-md"></div>
        <div className="w-full h-6 bg-gray-200 rounded-md"></div>
        <div className="w-4/5 h-6 bg-gray-200 rounded-md"></div>
        
        <div className="w-full h-6 bg-gray-200 rounded-md mt-6"></div>
        <div className="w-full h-6 bg-gray-200 rounded-md"></div>
        <div className="w-3/4 h-6 bg-gray-200 rounded-md"></div>
      </div>
    </main>
  );
}
