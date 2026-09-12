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

export default function Navbar({ promoCode = "BALI2026" }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);


  const [filterOpen, setFilterOpen] = useState(false);
  const [activeService, setActiveService] = useState("Tour");
  
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const [promoDropdownOpen, setPromoDropdownOpen] = useState(false);
  const [promos, setPromos] = useState([]);

  // Derived state to instantly close modal on route change
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    if (promoDropdownOpen) {
      setPromoDropdownOpen(false);
    }
    if (cartOpen) {
      setCartOpen(false);
    }
  }

  useEffect(() => {
    import('@/lib/cart').then(mod => {
      setCartItems(mod.getCart());
    });
    const handleCartUpdate = (e) => {
      if (e.detail && e.detail.newCart) setCartItems(e.detail.newCart);
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const formatIDR = (num) => {
    if (!num || isNaN(num)) return num;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    
    // Add event listener for auto-opening promo modal
    const handleOpenPromoModal = () => {
      setPromoDropdownOpen(true);
      setCartOpen(false);
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
            className="w-10 h-10 rounded-full bg-white/70 border border-white/60 backdrop-blur-2xl flex items-center justify-center text-primary hover:bg-white/90 transition-all shadow-sm outline-none"
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
            className="w-9 h-9 sm:w-10 sm:h-10 bg-white/70 backdrop-blur-2xl border border-white/60 text-primary rounded-full flex items-center justify-center hover:bg-white/90 shadow-sm transition-colors relative mr-1"
          >
            <InstagramIcon size={16} />
          </a>
          <div className="relative">
            <button 
              onClick={() => { setPromoDropdownOpen(!promoDropdownOpen); setCartOpen(false); }}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-white/70 backdrop-blur-2xl border border-white/60 text-primary rounded-full flex items-center justify-center hover:bg-white/90 shadow-sm transition-colors relative"
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
            <button 
              onClick={() => { setCartOpen(!cartOpen); setPromoDropdownOpen(false); }}
              className="px-2.5 sm:px-3.5 h-9 sm:h-10 bg-white/70 backdrop-blur-2xl border border-white/60 text-primary rounded-full flex items-center gap-1.5 justify-center hover:bg-white/90 shadow-sm font-extrabold text-[11px] sm:text-[13px] transition-colors relative"
            >
              <ShoppingCart size={15} /> 
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-in zoom-in">
                  {cartItems.length}
                </span>
              )}
            </button>
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
            rel="noopener noreferrer"
            className={`w-9 h-9 border rounded-full flex items-center justify-center transition-all duration-500 shadow-soft relative ${isScrolled ? 'border-border bg-white hover:bg-gray-50 text-primary' : 'border-white/30 bg-black/20 backdrop-blur-md hover:bg-white/20 text-white'}`}
          >
            <InstagramIcon size={15} className={`transition-colors duration-500 ${isScrolled ? 'text-primary' : 'text-white'}`} />
          </a>

          <div className="relative">
            <button 
              onClick={() => { setPromoDropdownOpen(!promoDropdownOpen); setLangDropdownOpen(false); setCurrencyDropdownOpen(false); }}
              className={`w-9 h-9 border rounded-full flex items-center justify-center transition-all duration-500 shadow-soft relative ${isScrolled ? 'border-border bg-white hover:bg-gray-50 text-primary' : 'border-white/30 bg-black/20 backdrop-blur-md hover:bg-white/20 text-white'}`}
            >
              <Gift size={15} className={`transition-colors duration-500 ${isScrolled ? 'text-primary' : 'text-white'}`} />
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
            <button 
              onClick={() => { setCartOpen(!cartOpen); setPromoDropdownOpen(false); }}
              className={`px-3 h-9 border rounded-full flex items-center gap-1.5 justify-center transition-all duration-500 shadow-soft font-extrabold text-[12px] relative ${isScrolled ? 'border-border bg-white hover:bg-gray-50 text-primary' : 'border-white/30 bg-black/20 backdrop-blur-md hover:bg-white/20 text-white'}`}
            >
              <ShoppingCart size={14} className={`transition-colors duration-500 ${isScrolled ? 'text-primary' : 'text-white'}`} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-in zoom-in">
                  {cartItems.length}
                </span>
              )}
            </button>
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

    {/* Shopping Cart Drawer */}
    {cartOpen && (
      <div className="fixed inset-0 z-[1000] flex justify-end font-sans">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in"
          onClick={() => setCartOpen(false)}
        ></div>
        
        {/* Drawer */}
        <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="font-black text-[18px] text-primary">Your Cart</h2>
                <p className="text-[12px] text-gray-500 font-medium">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
            <button 
              onClick={() => setCartOpen(false)}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <Settings2 size={20} className="text-gray-400" /> {/* Just as close icon placeholder, could use X */}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length > 0 ? cartItems.map((item) => (
              <div key={item.cartItemId} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm relative group">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="font-bold text-[14px] text-primary line-clamp-2 leading-tight pr-6">{item.title}</h3>
                  <span className="text-[12px] font-semibold text-gray-400 mt-1">{item.category}</span>
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="font-extrabold text-[15px] text-primary">{formatIDR(item.price)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    import('@/lib/cart').then(mod => mod.removeFromCart(item.cartItemId));
                  }}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                <ShoppingCart size={48} className="text-gray-300 mb-4" />
                <h3 className="font-bold text-gray-500 text-[16px]">Your cart is empty</h3>
                <p className="text-[13px] text-gray-400 mt-1 max-w-[200px]">Add tours or activities to build your perfect Bali itinerary.</p>
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-gray-500">Total</span>
                <span className="font-black text-[22px] text-primary">
                  {formatIDR(cartItems.reduce((acc, item) => acc + (item.price || 0), 0))}
                </span>
              </div>
              <button 
                onClick={() => {
                  const message = encodeURIComponent(
                    `Hello Balance Island!\n\nI would like to book the following items from my cart:\n\n` +
                    cartItems.map(item => `- ${item.title} (${formatIDR(item.price)})`).join('\n') +
                    `\n\n*Total: ${formatIDR(cartItems.reduce((acc, item) => acc + (item.price || 0), 0))}*\n\nPlease assist me with the availability.`
                  );
                  window.open(`https://wa.me/6285174119423?text=${message}`, '_blank');
                  import('@/lib/cart').then(mod => mod.clearCart());
                  setCartOpen(false);
                }}
                className="w-full py-4 bg-primary text-white rounded-2xl font-black text-[15px] shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
              >
                Checkout via WhatsApp <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    )}
    
    {/* Sidebar Component */}
    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
