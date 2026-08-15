"use client";

import React, { useState } from "react";
import { Home, Compass, CalendarCheck, Heart, Map } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname?.startsWith('/admin')) {
    return null;
  }
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { id: "home", icon: Home, path: "/" },
    { id: "tours", icon: Compass, path: "/tours" },
    { id: "bookings", icon: CalendarCheck, path: "/bookings" },
    { id: "favorites", icon: Heart, path: "/favorites" },
    { id: "map", icon: Map, path: "/map" },
  ];

  // Map path to active tab on mount
  React.useEffect(() => {
    if (pathname === "/") setActiveTab("home");
    else if (pathname === "/tours") setActiveTab("tours");
    else if (pathname.startsWith("/map")) setActiveTab("map");
    else if (pathname.startsWith("/bookings")) setActiveTab("bookings");
    else if (pathname.startsWith("/favorites")) setActiveTab("favorites");
  }, [pathname]);

  // Hide BottomNav on tour detail pages to prevent overlapping with booking bar
  if (pathname.startsWith("/tours/")) return null;

  return (
    <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center px-6">
      <div className="bg-[#1c1c1c]/60 backdrop-blur-2xl rounded-[32px] py-4 px-6 flex justify-between items-center w-full max-w-sm shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-white/10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Link 
              key={item.id} 
              href={item.path}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center w-10 h-10"
            >
              {isActive && (
                <div className="absolute inset-0 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.25)]"></div>
              )}
              <Icon 
                size={22} 
                className={`relative z-10 transition-colors duration-300 ${isActive ? "text-black stroke-[2.5px]" : "text-white/70 hover:text-white"}`} 
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
