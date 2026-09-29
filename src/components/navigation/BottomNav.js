"use client";

import React, { useState } from "react";
import { Home, Search, Heart, Map } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("home");
  const [isVisible, setIsVisible] = useState(true);

  React.useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          // Check if at the very bottom (seeing footer)
          const isAtBottom = (window.innerHeight + currentScrollY) >= document.body.offsetHeight - 50;

          if (isAtBottom) {
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY) {
            setIsVisible(true); // scrolling up
          } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false); // scrolling down
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const mainNavItems = navItems.filter(item => item.id !== "map");
  const mapItem = navItems.find(item => item.id === "map");

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="md:hidden fixed left-0 right-0 z-50 flex justify-center px-4"
          style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
        >
          <div className="flex justify-between items-center w-full max-w-[350px] gap-3 sm:gap-5">
        
        {/* Main Pill */}
        <div className="bg-white rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.1)] p-2 flex items-center justify-between flex-1 border border-gray-100 relative">
          {mainNavItems.map((item) => {
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

        {/* Separate Map Button */}
        <Link 
          href={mapItem.path} 
          onClick={() => setActiveTab(mapItem.id)}
          className={`rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] w-14 h-14 shrink-0 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 border border-gray-100 ${
            activeTab === "map" ? "bg-black" : "bg-white"
          }`}
        >
          <mapItem.icon size={24} strokeWidth={activeTab === "map" ? 2.5 : 2} className={activeTab === "map" ? "text-white" : "text-black"} />
        </Link>
      </div>
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
