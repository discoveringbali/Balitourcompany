"use client";

import React, { useState } from "react";
import { Home, Compass, Heart, Map } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { id: "home", icon: Home, path: "/" },
    { id: "tours", icon: Compass, path: "/tours" },
    { id: "favorites", icon: Heart, path: "/favorites" },
    { id: "map", icon: Map, path: "/map" },
  ];

  // Map path to active tab on mount
  React.useEffect(() => {
    if (pathname === "/") setActiveTab("home");
    else if (pathname === "/tours") setActiveTab("tours");
    else if (pathname.startsWith("/map")) setActiveTab("map");
    else if (pathname.startsWith("/favorites")) setActiveTab("favorites");
  }, [pathname]);

  if (pathname?.startsWith('/admin')) return null;

  // Hide BottomNav on tour detail pages to prevent overlapping with booking bar
  if (pathname.startsWith("/tours/")) return null;

  return (
    <div 
      className="md:hidden fixed left-0 right-0 z-50 flex justify-center px-4"
      style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
    >
      <div className="bg-[#2a2e33] rounded-[32px] shadow-2xl px-2.5 py-2.5 flex justify-between items-center w-full max-w-[340px] border border-white/5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Link 
              key={item.id} 
              href={item.path}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                isActive ? "bg-white shadow-sm" : ""
              }`}
            >
              <Icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={`relative z-10 transition-colors duration-300 ${isActive ? "text-black" : "text-gray-400 hover:text-white"}`} 
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
