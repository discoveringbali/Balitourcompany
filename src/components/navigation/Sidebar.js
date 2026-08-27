"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, Home, Map, Sparkles, HelpCircle, FileText, Info, Phone, ShieldAlert } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const mainLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Tours", path: "/tours", icon: Map },
    { name: "Activities", path: "/tours?category=Activities", icon: Sparkles },
    { name: "About Us", path: "/about", icon: Info },
    { name: "Contact Us", path: "/contact", icon: Phone },
  ];

  const policyLinks = [
    { name: "FAQ", path: "/faq", icon: HelpCircle },
    { name: "Cancellation Policy", path: "/cancellation-policy", icon: ShieldAlert },
    { name: "Terms & Conditions", path: "/terms", icon: FileText },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-[#000000] border-r border-white/10 z-[100] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <Link href="/" onClick={onClose} className="font-black text-xl tracking-[0.1em] text-white uppercase">
            BALANCE ISLAND
          </Link>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors shrink-0"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar">
          
          {/* Main Navigation */}
          <div className="space-y-1">
            <span className="px-4 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Menu</span>
            {mainLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.name} 
                  href={link.path}
                  onClick={onClose}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-colors ${
                    isActive 
                      ? 'bg-white text-black' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="h-px bg-white/10 mx-4" />

          {/* Policy Navigation */}
          <div className="space-y-1">
            <span className="px-4 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Support & Legal</span>
            {policyLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.name} 
                  href={link.path}
                  onClick={onClose}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-colors ${
                    isActive 
                      ? 'bg-white text-black' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-[#111111]">
          <p className="text-xs font-bold text-gray-400 text-center">
            © {new Date().getFullYear()} Balance Island Tours
          </p>
        </div>
      </div>
    </>
  );
}
