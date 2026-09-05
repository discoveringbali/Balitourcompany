"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
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

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] transition-opacity duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-full sm:w-[420px] bg-white z-[100] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-6">
          <Link href="/" onClick={onClose} className="font-extrabold text-[22px] tracking-tight text-primary flex items-center gap-2">
            Balance Island
          </Link>
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-black hover:bg-gray-100 rounded-full transition-colors shrink-0"
            >
              <X size={24} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-20 pt-2 space-y-8 no-scrollbar">
          
          {/* MENU Section */}
          <div className="space-y-5">
            <h4 className="text-[11px] font-bold text-gray-500 tracking-[0.15em] uppercase">Menu</h4>
            <div className="flex flex-col space-y-5">
              <Link href="/" onClick={onClose} className="font-serif text-[26px] text-[#1a1a1a] hover:text-gray-600 transition-colors">
                Home
              </Link>
              <Link href="/tours?category=Activities" onClick={onClose} className="font-serif text-[26px] text-[#1a1a1a] hover:text-gray-600 transition-colors">
                Activities & Attractions
              </Link>
              <Link href="/tours" onClick={onClose} className="font-serif text-[26px] text-[#1a1a1a] hover:text-gray-600 transition-colors">
                Tour packages
              </Link>
            </div>
          </div>

          <div className="h-px bg-gray-200 w-full" />

          {/* READ Section */}
          <div className="space-y-5">
            <h4 className="text-[11px] font-bold text-gray-500 tracking-[0.15em] uppercase">Read</h4>
            <div className="flex flex-col space-y-5">
              <Link href="/blog" onClick={onClose} className="font-serif italic text-[28px] text-[#1a1a1a] hover:text-gray-600 transition-colors">
                Our Blog
              </Link>
              <Link href="/about" onClick={onClose} className="font-serif text-[26px] text-[#1a1a1a] hover:text-gray-600 transition-colors">
                About Us
              </Link>
            </div>
          </div>

          <div className="h-px bg-gray-200 w-full" />

          {/* ACCOUNT/SUPPORT Section */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-gray-500 tracking-[0.15em] uppercase mb-2">Support</h4>
            <div className="flex flex-col">
              <Link href="/contact" onClick={onClose} className="flex items-center justify-between py-4 text-[16px] font-medium text-[#1a1a1a] hover:bg-gray-50 transition-colors border-b border-gray-100">
                <span>Contact Us</span>
                <ChevronRight size={18} className="text-gray-400" />
              </Link>
              <Link href="/faq" onClick={onClose} className="flex items-center justify-between py-4 text-[16px] font-medium text-[#1a1a1a] hover:bg-gray-50 transition-colors border-b border-gray-100">
                <span>Help center</span>
                <ChevronRight size={18} className="text-gray-400" />
              </Link>
              <Link href="/terms" onClick={onClose} className="flex items-center justify-between py-4 text-[16px] font-medium text-[#1a1a1a] hover:bg-gray-50 transition-colors border-b border-gray-100">
                <span>Terms & Conditions</span>
                <ChevronRight size={18} className="text-gray-400" />
              </Link>
            </div>
          </div>

          {/* BOTTOM PILL */}
          <div className="pt-6">
            <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-black px-4 py-2.5 rounded-[24px] text-[12px] font-extrabold transition-colors tracking-wide">
              EN · IDR
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
