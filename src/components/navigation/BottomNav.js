"use client";

import React, { useState } from "react";
import { Home, Search, Heart, Map } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { id: "home", icon: Home, path: "/" },
    { id: "explore", icon: Search, path: "/tours" },
    { id: "favorites", icon: Heart, path: "/favorites" },
    { id: "map", icon: Map, path: "/map" },
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

  return (
    <div 
      className="md:hidden fixed left-0 right-0 z-50 flex justify-center px-4"
      style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
    >
      <div className="bg-white rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] p-2 flex items-center justify-between w-full max-w-[340px] border border-gray-100">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Link 
              key={item.id} 
              href={item.path}
              onClick={() => setActiveTab(item.id)}
              className="relative flex items-center justify-center flex-1 h-12"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 bg-black rounded-full shadow-md"
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-center justify-center gap-1.5 px-3">
                <Icon 
                  size={isActive ? 18 : 22} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={`transition-colors duration-300 ${isActive ? "text-white" : "text-gray-400 hover:text-black"}`} 
                />
                {isActive && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    className="text-[12px] font-extrabold text-white tracking-wide capitalize"
                  >
                    {item.id}
                  </motion.span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
