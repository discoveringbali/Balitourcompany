"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, MapPin, Menu, Bell, Settings2, ChevronDown, User, Map, Sparkles, Gift, Tag, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { ScooterIcon, SpaIcon, TowelsIcon } from "@/components/icons/CategoryIcons";
import Sidebar from "@/components/navigation/Sidebar";

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const WhatsAppIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.029 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export default function Navbar({ promoCode = "BALI2026" }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);


  const [filterOpen, setFilterOpen] = useState(false);
  const [activeService, setActiveService] = useState("Tour");
  const [promoDropdownOpen, setPromoDropdownOpen] = useState(false);
  const [promos, setPromos] = useState([]);

  // Derived state to instantly close modal on route change
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    if (promoDropdownOpen) {
      setPromoDropdownOpen(false);
    }
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    
    // Add event listener for auto-opening promo modal
    const handleOpenPromoModal = () => {
      setPromoDropdownOpen(true);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener('openPromoModal', handleOpenPromoModal);

    fetch('/api/discounts')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPromos(data.filter(c => c.active && !c.isSecret));
        }
      })
      .catch(err => console.error(err));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('openPromoModal', handleOpenPromoModal);
    };
  }, []);


  
  const services = [
    { id: "Tour", icon: Map },
    { id: "Activities", icon: Sparkles },
    { id: "eSIM", icon: TowelsIcon },
  ];




  if (pathname?.startsWith('/admin')) return null;
  if (pathname?.startsWith('/tours') || pathname === '/map' || pathname?.startsWith('/blog') || pathname?.startsWith('/profile') || pathname?.startsWith('/favorites') || pathname?.startsWith('/bookings')) return null;

  return (
    <>
      <header className={`fixed z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] left-1/2 -translate-x-1/2 ${
      isScrolled 
        ? "top-2 w-[95%] max-w-[95%] rounded-full bg-white/20 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-white/20 py-2.5 md:top-4 md:w-[85%] md:max-w-[1000px] md:bg-white/70 md:backdrop-blur-2xl md:backdrop-saturate-150 md:shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:border-white/50" 
        : "top-0 w-full bg-transparent pt-4 pb-4 md:w-[95%] md:max-w-[1400px] md:py-5"
    }`}>
      
      {/* MOBILE LAYOUT */}
      <div className="md:hidden px-5 sm:px-6 flex items-center justify-between">
        
        {/* Left Side: Hamburger Menu */}
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-full bg-[#ffffff] border border-[#eaeaea] flex items-center justify-center text-[#1c1c1c] hover:bg-[#f9fafb] transition-all shadow-sm outline-none"
          >
            <Menu size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Right Side: Currency & Language */}
        <div className="flex items-center gap-1.5 sm:gap-2 relative z-50">
          <a 
            href="https://instagram.com/balanceislandtour"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 sm:w-10 sm:h-10 bg-[#ffffff] border border-[#eaeaea] text-[#1c1c1c] rounded-full flex items-center justify-center hover:bg-white/90 shadow-sm transition-colors relative mr-1"
          >
            <InstagramIcon size={16} />
          </a>
          <div className="relative">
            <button 
              onClick={() => { setPromoDropdownOpen(!promoDropdownOpen); }}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-[#ffffff] border border-[#eaeaea] text-[#1c1c1c] rounded-full flex items-center justify-center hover:bg-white/90 shadow-sm transition-colors relative"
            >
              <Gift size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
            </button>
            {promoDropdownOpen && (
              <div className="hidden sm:flex absolute top-12 right-0 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl flex-col min-w-[320px] border border-border animate-in fade-in zoom-in-95 duration-200 z-[100]">
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={18} className="text-primary" />
                  <span className="font-bold text-[14px]">Available Promos</span>
                </div>
                <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto hide-scroll">
                  {promos.length > 0 ? promos.map((promo, idx) => (
                    <div key={idx} className="bg-black text-white border border-dashed border-gray-700 rounded-xl p-3 flex flex-col items-center text-center relative overflow-hidden shrink-0">
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-r border-gray-200"></div>
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-l border-gray-200"></div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                        {promo.type === 'percent' ? `${promo.value}% OFF` : `Rp ${promo.value.toLocaleString('id-ID')} OFF`}
                      </span>
                      <span className="text-[18px] font-black tracking-widest text-white">{promo.code}</span>
                      <span className="text-[10px] text-gray-500 mt-1 font-medium">Use at checkout</span>
                    </div>
                  )) : (
                    <div className="bg-black text-white border border-dashed border-gray-700 rounded-xl p-3 flex flex-col items-center text-center shrink-0">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">Current Code</span>
                      <span className="text-[18px] font-black tracking-widest text-white">{promoCode || "BALI2026"}</span>
                      <span className="text-[10px] text-gray-500 mt-1 font-medium">Use at checkout</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <a 
              href="https://wa.me/6285174119423?text=Hello%20Balance%20Island,%20I%20would%20like%20to%20inquire%20about%20a%20tour"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 sm:px-3.5 h-9 sm:h-10 bg-[#25D366] text-white rounded-full flex items-center gap-1.5 justify-center hover:bg-[#1ebd5a] shadow-sm font-extrabold text-[11px] sm:text-[13px] transition-colors relative"
            >
              <WhatsAppIcon size={16} /> 
              Contact Us
            </a>
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT (Clean adaptation of the new design system) */}
      <div className="hidden md:flex container mx-auto px-6 w-full items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className={`font-black tracking-[0.1em] flex-1 flex items-center text-xl md:text-[22px] transition-colors duration-500 ${isScrolled ? 'text-[#1c1c1c]' : 'text-white'}`}>
          Balance Island
        </Link>

        {/* Center Compressed Search */}
        <div className="flex-1 justify-center flex relative z-[60]">
          <div className={`flex items-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full pl-2 pr-2 py-1.5 cursor-pointer transition-all duration-500 w-full max-w-[420px] relative hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] ${isScrolled ? 'bg-white border border-border' : 'border border-white/30 bg-black/20 backdrop-blur-md hover:bg-white/20'}`}>
            <button 
              onClick={() => setFilterOpen(!filterOpen)} 
              className={`flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full active:scale-95 transition-all outline-none ${isScrolled ? 'hover:bg-gray-50 text-primary' : 'hover:bg-white/20 text-white'}`}
            >
              <span className="font-extrabold text-[13px] tracking-tight">{activeService}</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${filterOpen ? 'rotate-180' : ''} ${isScrolled ? 'text-text-secondary' : 'text-white'}`} />
            </button>
            <div className={`h-5 w-[1px] mx-1 shrink-0 transition-colors duration-500 ${isScrolled ? 'bg-border/80' : 'bg-white/30'}`}></div>
            <Search size={16} className={`mx-2 transition-colors duration-500 ${isScrolled ? 'text-text-secondary' : 'text-white'}`} />
            <input 
              type="text" 
              placeholder={`Search ${activeService.toLowerCase()}s...`}
              onChange={(e) => window.dispatchEvent(new CustomEvent('searchQueryChanged', { detail: e.target.value }))}
              className={`flex-1 outline-none text-[13px] font-medium bg-transparent min-w-0 transition-colors duration-500 ${isScrolled ? 'text-primary placeholder:text-text-secondary' : 'text-white placeholder:text-white/80'}`} 
            />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ml-2 shadow-sm transition-all hover:scale-105 shrink-0 ${isScrolled ? 'bg-black text-white' : 'bg-white text-black'}`}>
              <Settings2 size={15} strokeWidth={2.5} className={isScrolled ? 'text-white' : 'text-black'} />
            </div>
            
            {/* Desktop Navbar Dropdown */}
            {filterOpen && (
              <div className="absolute top-[50px] left-0 bg-white/95 backdrop-blur-xl rounded-2xl p-2 shadow-2xl flex flex-col min-w-[160px] border border-border animate-in fade-in zoom-in-95 duration-200">
                {services.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button 
                      key={s.id} 
                      onClick={() => { 
                        setFilterOpen(false); 
                        if (s.id === "eSIM") {
                          router.push("/esim");
                        } else {
                          setActiveService(s.id); 
                          if (pathname !== "/") {
                            router.push("/");
                          } else {
                            window.dispatchEvent(new CustomEvent('serviceChanged', { detail: s.id }));
                          }
                        }
                      }} 
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-[13px] text-left transition-colors ${activeService === s.id ? 'bg-black text-white' : 'bg-transparent text-text-secondary hover:bg-gray-50 hover:text-primary'} outline-none`}
                    >
                      <Icon size={16} className={activeService === s.id ? 'text-white' : 'text-text-secondary'} strokeWidth={2} />
                      {s.id}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex-1 items-center justify-end gap-3 flex">

          <a 
            href="https://instagram.com/balanceislandtour"
            target="_blank"
            className="w-9 h-9 border rounded-full flex items-center justify-center transition-all duration-500 shadow-soft relative bg-[#ffffff] border-[#eaeaea] text-[#1c1c1c] hover:bg-[#f9fafb]"
          >
            <InstagramIcon size={15} className="text-[#1c1c1c]" />
          </a>

          <div className="relative">
            <button 
              onClick={() => { setPromoDropdownOpen(!promoDropdownOpen); setLangDropdownOpen(false); setCurrencyDropdownOpen(false); }}
              className="w-9 h-9 border rounded-full flex items-center justify-center transition-all duration-500 shadow-soft relative bg-[#ffffff] border-[#eaeaea] text-[#1c1c1c] hover:bg-[#f9fafb]"
            >
              <Gift size={15} className="text-[#1c1c1c]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
            </button>
            {promoDropdownOpen && (
              <div className="absolute top-12 right-0 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl flex flex-col min-w-[320px] border border-border animate-in fade-in zoom-in-95 duration-200 z-[100]">
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={18} className="text-primary" />
                  <span className="font-bold text-[14px]">Available Promos</span>
                </div>
                <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto hide-scroll">
                  {promos.length > 0 ? promos.map((promo, idx) => (
                    <div key={idx} className="bg-black text-white rounded-2xl p-4 flex flex-col relative overflow-hidden shrink-0 shadow-sm">
                      <div className="absolute -left-3 top-[35%] w-6 h-6 bg-white rounded-full border-r border-gray-200 shadow-[inset_2px_0_4px_rgba(0,0,0,0.02)]"></div>
                      <div className="absolute -right-3 top-[35%] w-6 h-6 bg-white rounded-full border-l border-gray-200 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.02)]"></div>
                      
                      <div className="flex flex-col px-2">
                        <span className="text-[14px] font-extrabold text-white">
                          {promo.type === 'percent' ? `Save ${promo.value}% on your booking` : `Save IDR ${promo.value.toLocaleString('id-ID')}${promo.scope === 'per_person' ? ' per person' : ' on your booking'}`}
                        </span>
                        <span className="text-[11px] font-bold text-gray-400 mt-0.5">
                          {(!promo.applicableTours || promo.applicableTours.length === 0) ? 'Applicable to all experiences.' : 'Applicable to selected experiences.'}
                        </span>
                      </div>
                      
                      <div className="border-t border-dashed border-gray-700 my-3"></div>
                      
                      <div className="flex items-center justify-between px-2">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Code</span>
                          <span className="text-[18px] font-black tracking-widest text-white">{promo.code}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            localStorage.setItem('savedPromoCode', promo.code);
                            router.push(`/tours?promo=${promo.code}`);
                            setPromoDropdownOpen(false);
                          }}
                          className="bg-white text-black px-5 py-2.5 rounded-xl text-[11px] font-bold active:scale-95 transition-all shadow-md hover:bg-gray-200"
                        >
                          APPLY CODE
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="bg-black text-white rounded-2xl p-4 flex flex-col relative overflow-hidden shrink-0 shadow-sm">
                      <div className="absolute -left-3 top-[35%] w-6 h-6 bg-white rounded-full border-r border-gray-200 shadow-[inset_2px_0_4px_rgba(0,0,0,0.02)]"></div>
                      <div className="absolute -right-3 top-[35%] w-6 h-6 bg-white rounded-full border-l border-gray-200 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.02)]"></div>
                      
                      <div className="flex flex-col px-2">
                        <span className="text-[14px] font-extrabold text-white">Special Promo</span>
                        <span className="text-[11px] font-bold text-gray-400 mt-0.5">Valid for all upcoming tours</span>
                      </div>
                      
                      <div className="border-t border-dashed border-gray-700 my-3"></div>
                      
                      <div className="flex items-center justify-between px-2">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Code</span>
                          <span className="text-[18px] font-black tracking-widest text-white">{promoCode || "BALI2026"}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            localStorage.setItem('savedPromoCode', promoCode || "BALI2026");
                            router.push(`/tours?promo=${promoCode || "BALI2026"}`);
                            setPromoDropdownOpen(false);
                          }}
                          className="bg-white text-black px-5 py-2.5 rounded-xl text-[11px] font-bold active:scale-95 transition-all shadow-md hover:bg-gray-200"
                        >
                          APPLY CODE
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <a 
              href="https://wa.me/6285174119423?text=Hello%20Balance%20Island,%20I%20would%20like%20to%20inquire%20about%20a%20tour"
              target="_blank"
              rel="noreferrer"
              className={`px-3.5 h-9 rounded-full flex items-center gap-1.5 justify-center transition-all duration-500 shadow-soft font-extrabold text-[12px] relative bg-[#25D366] hover:bg-[#1ebd5a] text-white`}
            >
              <WhatsAppIcon size={16} /> Contact Us
            </a>
          </div>
        </div>
      </div>
    </header>

    {/* Global Mobile Promo Modal */}
    {promoDropdownOpen && (
      <div className="sm:hidden font-sans">
        <div className="fixed inset-0 bg-black/60 z-[990] backdrop-blur-sm animate-in fade-in flex items-center justify-center p-4">
          <div 
            className="w-full max-w-sm bg-white rounded-[28px] p-6 shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 z-[1000]"
            onClick={(e) => e.stopPropagation()}
          >
          <div className="flex items-center gap-2 mb-4">
            <Tag size={18} className="text-black" />
            <span className="font-bold text-[16px] text-black">Available Promos</span>
          </div>
          <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto hide-scroll pb-4">
            {promos.length > 0 ? promos.map((promo, idx) => (
              <div key={idx} className="bg-black text-white rounded-2xl p-4 flex flex-col relative overflow-hidden shrink-0">
                <div className="absolute -left-3 top-[35%] w-6 h-6 bg-white rounded-full shadow-[inset_-3px_0_6px_rgba(0,0,0,0.05)]"></div>
                <div className="absolute -right-3 top-[35%] w-6 h-6 bg-white rounded-full shadow-[inset_3px_0_6px_rgba(0,0,0,0.05)]"></div>
                
                <div className="flex flex-col px-2">
                  <span className="text-[14px] font-extrabold text-white uppercase tracking-wide">
                    {promo.type === 'percent' ? `SAVE ${promo.value}% ON YOUR BOOKING` : `SAVE IDR ${promo.value.toLocaleString('id-ID')}${promo.scope === 'per_person' ? ' PER PERSON' : ' ON YOUR BOOKING'}`}
                  </span>
                  <span className="text-[11px] font-bold text-gray-400 mt-0.5">
                    {(!promo.applicableTours || promo.applicableTours.length === 0) ? 'Applicable to all experiences.' : 'Applicable to selected experiences.'}
                  </span>
                </div>
                
                <div className="border-t border-dashed border-gray-700 my-3"></div>
                
                <div className="flex items-center justify-between px-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Code</span>
                    <span className="text-[16px] font-black tracking-widest text-white">{promo.code}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      localStorage.setItem('savedPromoCode', promo.code);
                      router.push(`/tours?promo=${promo.code}`);
                      setPromoDropdownOpen(false);
                    }}
                    className="bg-white text-black px-3 py-1.5 rounded-lg text-[11px] font-bold active:scale-95 transition-all shadow-md hover:bg-gray-200 shrink-0"
                  >
                    APPLY CODE
                  </button>
                </div>
              </div>
            )) : (
              <div className="bg-black text-white rounded-2xl p-4 flex flex-col relative overflow-hidden shrink-0">
                <div className="absolute -left-3 top-[35%] w-6 h-6 bg-white rounded-full shadow-[inset_-3px_0_6px_rgba(0,0,0,0.05)]"></div>
                <div className="absolute -right-3 top-[35%] w-6 h-6 bg-white rounded-full shadow-[inset_3px_0_6px_rgba(0,0,0,0.05)]"></div>
                
                <div className="flex flex-col px-2">
                  <span className="text-[14px] font-extrabold text-white uppercase tracking-wide">SPECIAL PROMO</span>
                  <span className="text-[11px] font-bold text-gray-400 mt-0.5">Valid for all upcoming tours</span>
                </div>
                
                <div className="border-t border-dashed border-gray-700 my-3"></div>
                
                <div className="flex items-center justify-between px-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Code</span>
                    <span className="text-[16px] font-black tracking-widest text-white">{promoCode || "BALI2026"}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      localStorage.setItem('savedPromoCode', promoCode || "BALI2026");
                      router.push(`/tours?promo=${promoCode || "BALI2026"}`);
                      setPromoDropdownOpen(false);
                    }}
                    className="bg-white text-black px-3 py-1.5 rounded-lg text-[11px] font-bold active:scale-95 transition-all shadow-md hover:bg-gray-200 shrink-0"
                  >
                    APPLY CODE
                  </button>
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setPromoDropdownOpen(false)} className="mt-2 w-full py-3.5 bg-black text-white rounded-xl font-bold text-[15px] active:scale-95 transition-transform hover:bg-gray-800 border border-gray-800">
            Close
          </button>
        </div>
        </div>
      </div>
    )}


    
    {/* Sidebar Component */}
    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
