"use client";

import React, { useState } from "react";
import { Home, Search, Compass, Heart, Map, AlignJustify } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { id: "home", icon: Home, path: "/" },
    { id: "explore", icon: Search, path: "/tours" },
    { id: "favorites", icon: Heart, path: "/favorites" },
    { id: "map", icon: AlignJustify, path: "/map" },
  ];

  // Map path to active tab on mount
  React.useEffect(() => {
    if (pathname === "/") setActiveTab("home");
    else if (pathname === "/tours") setActiveTab("explore");
    else if (pathname.startsWith("/map")) setActiveTab("map");
    else if (pathname.startsWith("/favorites")) setActiveTab("favorites");
  }, [pathname]);

  if (pathname?.startsWith('/admin')) return null;

  // Hide BottomNav on tour detail pages to prevent overlapping with booking bar
  if (pathname.startsWith("/tours/")) return null;

  const mainNavItems = navItems.filter(item => item.id !== "map");
  const mapItem = navItems.find(item => item.id === "map");

  return (
    <div 
      className="md:hidden fixed left-0 right-0 z-50 flex justify-center px-4"
      style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex justify-between items-center w-full max-w-[350px] gap-3 sm:gap-5">
        
        {/* Main Pill */}
        <div className="bg-[#121212] rounded-[32px] shadow-2xl p-2 flex items-center justify-between flex-1 border border-white/10">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Link 
                key={item.id} 
                href={item.path}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center justify-center transition-all duration-300 ${
                  isActive ? "bg-[#333333] rounded-[24px] px-4 py-2.5 gap-2 shadow-sm" : "w-11 h-11 px-2"
                }`}
              >
                <Icon 
                  size={isActive ? 18 : 22} 
                  strokeWidth={isActive ? 2.5 : 1.5} 
                  className={`relative z-10 transition-colors duration-300 ${isActive ? "text-white fill-white" : "text-gray-400 hover:text-white"}`} 
                />
                {isActive && (
                  <span className="text-[13px] font-bold text-white tracking-wide capitalize">
                    {item.id}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Separate Button */}
        <Link 
          href={mapItem.path} 
          onClick={() => setActiveTab(mapItem.id)}
          className={`rounded-full shadow-2xl w-14 h-14 shrink-0 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 ${
            activeTab === "map" ? "bg-[#f5a545] border-[3px] border-[#333]" : "bg-[#ffb766]"
          }`}
        >
          <IconWrapper Icon={mapItem.icon} />
        </Link>

      </div>
    </div>
  );
}

// Wrapper to safely render Icon
function IconWrapper({ Icon }) {
  return <Icon size={24} strokeWidth={2} className="text-black" />;
}
