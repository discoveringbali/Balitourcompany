"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Heart, Map } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { id: "home", icon: Home, path: "/" },
    { id: "explore", icon: Compass, path: "/tours" },
    { id: "saved", icon: Heart, path: "/favorites" },
    { id: "map", icon: Map, path: "/map" },
  ];

  return (
    <div 
      className="fixed left-0 right-0 z-50 flex justify-center px-4 md:hidden"
      style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
    >
      <div className="bg-[#24292e] rounded-[32px] shadow-2xl px-2.5 py-2.5 flex items-center justify-between w-full max-w-[340px] border border-white/5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
          
          return (
            <Link key={item.id} href={item.path} className="relative flex items-center justify-center">
              <div 
                className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                  isActive ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "" : ""} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
