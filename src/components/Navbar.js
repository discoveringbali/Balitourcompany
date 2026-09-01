"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, MapPin, Globe, Menu, Bell, Settings2, ChevronDown, User, Map, Sparkles, CircleDollarSign, Gift, Tag } from "lucide-react";
import { ScooterIcon, SpaIcon, TowelsIcon } from "@/components/icons/CategoryIcons";
import Sidebar from "@/components/navigation/Sidebar";

export default function Navbar({ promoCode = "BALI2026" }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    fetch('/api/discounts')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPromos(data.filter(c => c.active));
        }
      })
      .catch(err => console.error(err));

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [filterOpen, setFilterOpen] = useState(false);
  const [activeService, setActiveService] = useState("Tour");
  
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [promoDropdownOpen, setPromoDropdownOpen] = useState(false);
  const [promos, setPromos] = useState([]);
  const [activeLang, setActiveLang] = useState("EN");
  const [isTranslating, setIsTranslating] = useState(false);
  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'FR', name: 'French' },
    { code: 'ES', name: 'Spanish' },
    { code: 'ID', name: 'Indonesia' }
  ];

  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState("IDR");
  const currencies = [
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'GBP', symbol: '£', name: 'British Pound' }
  ];

  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    if (match && match[1]) {
      setActiveLang(match[1].toUpperCase());
    }
    const savedCurrency = localStorage.getItem('balance_island_currency');
    if (savedCurrency) setActiveCurrency(savedCurrency);
  }, []);

  const handleCurrencyChange = (currCode) => {
    setActiveCurrency(currCode);
    setCurrencyDropdownOpen(false);
    localStorage.setItem('balance_island_currency', currCode);
    window.dispatchEvent(new CustomEvent('currencyChanged', { detail: currCode }));
  };

  const handleLanguageChange = (langCode) => {
    setActiveLang(langCode);
    setLangDropdownOpen(false);
    setIsTranslating(true);
    
    const code = langCode.toLowerCase();
    
    // Set google translate cookies with and without domain for broader compatibility
    document.cookie = `googtrans=/en/${code}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/en/${code}; path=/; domain=.${window.location.hostname}`;
    document.cookie = `googtrans=/en/${code}; path=/`;

    // Wait a brief moment to ensure cookie is set
    setTimeout(() => {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = code;
        select.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        setIsTranslating(false);
      } else {
        // Fallback: If combo box is not injected yet, reload the page so the script reads the newly set cookie
        window.location.reload();
      }
    }, 150);
  };
  
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
          <div className="relative">
            <button 
              onClick={() => { setPromoDropdownOpen(!promoDropdownOpen); setLangDropdownOpen(false); setCurrencyDropdownOpen(false); }}
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
                    <div key={idx} className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-3 flex flex-col items-center text-center relative overflow-hidden shrink-0">
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-r border-gray-200"></div>
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-l border-gray-200"></div>
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                        {promo.type === 'percent' ? `${promo.value}% OFF` : `Rp ${promo.value.toLocaleString('id-ID')} OFF`}
                      </span>
                      <span className="text-[18px] font-black tracking-widest text-primary">{promo.code}</span>
                      <span className="text-[10px] text-gray-400 mt-1 font-medium">Use at checkout</span>
                    </div>
                  )) : (
                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-3 flex flex-col items-center text-center shrink-0">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Current Code</span>
                      <span className="text-[18px] font-black tracking-widest text-primary">{promoCode || "BALI2026"}</span>
                      <span className="text-[10px] text-gray-400 mt-1 font-medium">Use at checkout</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button 
              onClick={() => { setCurrencyDropdownOpen(!currencyDropdownOpen); setLangDropdownOpen(false); setPromoDropdownOpen(false); }}
              className="px-2.5 sm:px-3.5 h-9 sm:h-10 bg-white/70 backdrop-blur-2xl border border-white/60 text-primary rounded-full flex items-center gap-1.5 justify-center hover:bg-white/90 shadow-sm font-extrabold text-[11px] sm:text-[13px] transition-colors"
            >
              <CircleDollarSign size={14} /> {activeCurrency}
            </button>
            {currencyDropdownOpen && (
              <div className="absolute top-12 right-0 bg-white/95 backdrop-blur-xl rounded-2xl p-2 shadow-2xl flex flex-col min-w-[140px] border border-border animate-in fade-in zoom-in-95 duration-200">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => handleCurrencyChange(curr.code)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-[13px] text-left transition-colors ${activeCurrency === curr.code ? 'bg-black text-white' : 'bg-transparent text-text-secondary hover:bg-gray-50 hover:text-primary'} outline-none`}
                  >
                    <span className="w-5 text-center">{curr.symbol}</span> {curr.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button 
              onClick={() => { setLangDropdownOpen(!langDropdownOpen); setCurrencyDropdownOpen(false); setPromoDropdownOpen(false); }}
              className="px-2.5 sm:px-3.5 h-9 sm:h-10 bg-white/70 backdrop-blur-2xl border border-white/60 text-primary rounded-full flex items-center gap-1.5 justify-center hover:bg-white/90 shadow-sm font-extrabold text-[11px] sm:text-[13px] transition-colors"
            >
              <Globe size={14} className={isTranslating ? 'animate-spin' : ''} /> {activeLang}
            </button>
            {langDropdownOpen && (
              <div className="absolute top-12 right-0 bg-white/95 backdrop-blur-xl rounded-2xl p-2 shadow-2xl flex flex-col min-w-[140px] border border-border animate-in fade-in zoom-in-95 duration-200">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-[13px] text-left transition-colors ${activeLang === lang.code ? 'bg-black text-white' : 'bg-transparent text-text-secondary hover:bg-gray-50 hover:text-primary'} outline-none`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
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
          <div className="flex items-center bg-white border border-border shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full pl-2 pr-2 py-1.5 cursor-pointer transition-all w-full max-w-[420px] relative hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
            <button 
              onClick={() => setFilterOpen(!filterOpen)} 
              className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full hover:bg-gray-50 text-primary active:scale-95 transition-all outline-none"
            >
              <span className="font-extrabold text-[13px] tracking-tight">{activeService}</span>
              <ChevronDown size={14} className={`text-text-secondary transition-transform duration-300 ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className="h-5 w-[1px] bg-border/80 mx-1 shrink-0"></div>
            <Search size={16} className="text-text-secondary mx-2" />
            <input 
              type="text" 
              placeholder={`Search ${activeService.toLowerCase()}s...`}
              onChange={(e) => window.dispatchEvent(new CustomEvent('searchQueryChanged', { detail: e.target.value }))}
              className="flex-1 outline-none text-[13px] font-medium bg-transparent text-primary placeholder:text-text-secondary min-w-0" 
            />
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center ml-2 shadow-sm transition-transform hover:scale-105 shrink-0">
              <Settings2 size={15} strokeWidth={2.5} className="text-white" />
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
                    <div key={idx} className="bg-[#fcfcfc] border border-gray-200 rounded-2xl p-4 flex flex-col relative overflow-hidden shrink-0 shadow-sm">
                      <div className="absolute -left-3 top-[35%] w-6 h-6 bg-white rounded-full border-r border-gray-200 shadow-[inset_2px_0_4px_rgba(0,0,0,0.02)]"></div>
                      <div className="absolute -right-3 top-[35%] w-6 h-6 bg-white rounded-full border-l border-gray-200 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.02)]"></div>
                      
                      <div className="flex flex-col px-2">
                        <span className="text-[14px] font-extrabold text-black">
                          {promo.type === 'percent' ? `Save ${promo.value}% on your booking` : `Save IDR ${promo.value.toLocaleString('id-ID')}${promo.scope === 'per_person' ? ' per person' : ' on your booking'}`}
                        </span>
                        <span className="text-[11px] font-bold text-gray-500 mt-0.5">
                          {(!promo.applicableTours || promo.applicableTours.length === 0) ? 'Applicable to all experiences.' : 'Applicable to selected experiences.'}
                        </span>
                      </div>
                      
                      <div className="border-t border-dashed border-gray-200 my-3"></div>
                      
                      <div className="flex items-center justify-between px-2">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Code</span>
                          <span className="text-[18px] font-black tracking-widest text-primary">{promo.code}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            localStorage.setItem('savedPromoCode', promo.code);
                            router.push(`/tours?promo=${promo.code}`);
                            setPromoDropdownOpen(false);
                          }}
                          className="bg-[#111111] text-white px-5 py-2.5 rounded-xl text-[11px] font-bold active:scale-95 transition-all shadow-md hover:bg-gray-800"
                        >
                          Apply Code
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="bg-[#fcfcfc] border border-gray-200 rounded-2xl p-4 flex flex-col relative overflow-hidden shrink-0 shadow-sm">
                      <div className="absolute -left-3 top-[35%] w-6 h-6 bg-white rounded-full border-r border-gray-200 shadow-[inset_2px_0_4px_rgba(0,0,0,0.02)]"></div>
                      <div className="absolute -right-3 top-[35%] w-6 h-6 bg-white rounded-full border-l border-gray-200 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.02)]"></div>
                      
                      <div className="flex flex-col px-2">
                        <span className="text-[14px] font-extrabold text-black">Special Promo</span>
                        <span className="text-[11px] font-bold text-gray-500 mt-0.5">Valid for all upcoming tours</span>
                      </div>
                      
                      <div className="border-t border-dashed border-gray-200 my-3"></div>
                      
                      <div className="flex items-center justify-between px-2">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Code</span>
                          <span className="text-[18px] font-black tracking-widest text-primary">{promoCode || "BALI2026"}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            localStorage.setItem('savedPromoCode', promoCode || "BALI2026");
                            router.push(`/tours?promo=${promoCode || "BALI2026"}`);
                            setPromoDropdownOpen(false);
                          }}
                          className="bg-[#111111] text-white px-5 py-2.5 rounded-xl text-[11px] font-bold active:scale-95 transition-all shadow-md hover:bg-gray-800"
                        >
                          Apply Code
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
              onClick={() => { setLangDropdownOpen(!langDropdownOpen); setPromoDropdownOpen(false); setCurrencyDropdownOpen(false); }}
              className={`px-3 h-9 border rounded-full flex items-center gap-1.5 justify-center transition-all duration-500 shadow-soft font-extrabold text-[12px] ${isScrolled ? 'border-border bg-white hover:bg-gray-50 text-primary' : 'border-white/30 bg-black/20 backdrop-blur-md hover:bg-white/20 text-white'}`}
            >
              <Globe size={14} className={`transition-colors duration-500 ${isScrolled ? 'text-primary' : 'text-white'} ${isTranslating ? 'animate-spin' : ''}`} /> {activeLang}
            </button>
            {langDropdownOpen && (
              <div className="absolute top-12 right-0 bg-white/95 backdrop-blur-xl rounded-2xl p-2 shadow-2xl flex flex-col min-w-[140px] border border-border animate-in fade-in zoom-in-95 duration-200 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-[13px] text-left transition-colors ${activeLang === lang.code ? 'bg-black text-white' : 'bg-transparent text-text-secondary hover:bg-gray-50 hover:text-primary'} outline-none`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="relative">
            <button 
              onClick={() => { setCurrencyDropdownOpen(!currencyDropdownOpen); setLangDropdownOpen(false); setPromoDropdownOpen(false); }}
              className={`px-3 h-9 border rounded-full flex items-center gap-1.5 justify-center transition-all duration-500 shadow-soft font-extrabold text-[12px] ${isScrolled ? 'border-border bg-white hover:bg-gray-50 text-primary' : 'border-white/30 bg-black/20 backdrop-blur-md hover:bg-white/20 text-white'}`}
            >
              <CircleDollarSign size={14} className={`transition-colors duration-500 ${isScrolled ? 'text-primary' : 'text-white'}`} /> {activeCurrency}
            </button>
            {currencyDropdownOpen && (
              <div className="absolute top-12 right-0 bg-white/95 backdrop-blur-xl rounded-2xl p-2 shadow-2xl flex flex-col min-w-[140px] border border-border animate-in fade-in zoom-in-95 duration-200 z-50">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => handleCurrencyChange(curr.code)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-[13px] text-left transition-colors ${activeCurrency === curr.code ? 'bg-black text-white' : 'bg-transparent text-text-secondary hover:bg-gray-50 hover:text-primary'} outline-none`}
                  >
                    <span className="w-5 text-center">{curr.symbol}</span> {curr.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>

    {/* Global Mobile Promo Bottom Sheet */}
    {promoDropdownOpen && (
      <div className="sm:hidden font-sans">
        <div className="fixed inset-0 bg-black/40 z-[990] backdrop-blur-sm animate-in fade-in" onClick={() => setPromoDropdownOpen(false)}></div>
        <div className="fixed bottom-0 left-0 w-full bg-white rounded-t-3xl p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] flex flex-col border-t border-border animate-in slide-in-from-bottom-10 duration-200 z-[1000]">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />
          <div className="flex items-center gap-2 mb-4">
            <Tag size={18} className="text-primary" />
            <span className="font-bold text-[16px]">Available Promos</span>
          </div>
          <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto hide-scroll pb-4">
            {promos.length > 0 ? promos.map((promo, idx) => (
              <div key={idx} className="bg-[#fcfcfc] border border-gray-200 rounded-2xl p-4 flex flex-col relative overflow-hidden shrink-0 shadow-sm">
                <div className="absolute -left-3 top-[35%] w-6 h-6 bg-white rounded-full border-r border-gray-200 shadow-[inset_2px_0_4px_rgba(0,0,0,0.02)]"></div>
                <div className="absolute -right-3 top-[35%] w-6 h-6 bg-white rounded-full border-l border-gray-200 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.02)]"></div>
                
                <div className="flex flex-col px-2">
                  <span className="text-[14px] font-extrabold text-black">
                    {promo.type === 'percent' ? `Save ${promo.value}% on your booking` : `Save IDR ${promo.value.toLocaleString('id-ID')}${promo.scope === 'per_person' ? ' per person' : ' on your booking'}`}
                  </span>
                  <span className="text-[11px] font-bold text-gray-500 mt-0.5">
                    {(!promo.applicableTours || promo.applicableTours.length === 0) ? 'Applicable to all experiences.' : 'Applicable to selected experiences.'}
                  </span>
                </div>
                
                <div className="border-t border-dashed border-gray-200 my-3"></div>
                
                <div className="flex items-center justify-between px-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Code</span>
                    <span className="text-[20px] font-black tracking-widest text-primary">{promo.code}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      localStorage.setItem('savedPromoCode', promo.code);
                      router.push(`/tours?promo=${promo.code}`);
                      setPromoDropdownOpen(false);
                    }}
                    className="bg-[#111111] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold active:scale-95 transition-all shadow-md hover:bg-gray-800"
                  >
                    Apply Code
                  </button>
                </div>
              </div>
            )) : (
              <div className="bg-[#fcfcfc] border border-gray-200 rounded-2xl p-4 flex flex-col relative overflow-hidden shrink-0 shadow-sm">
                <div className="absolute -left-3 top-[35%] w-6 h-6 bg-white rounded-full border-r border-gray-200 shadow-[inset_2px_0_4px_rgba(0,0,0,0.02)]"></div>
                <div className="absolute -right-3 top-[35%] w-6 h-6 bg-white rounded-full border-l border-gray-200 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.02)]"></div>
                
                <div className="flex flex-col px-2">
                  <span className="text-[14px] font-extrabold text-black">Special Promo</span>
                  <span className="text-[11px] font-bold text-gray-500 mt-0.5">Valid for all upcoming tours</span>
                </div>
                
                <div className="border-t border-dashed border-gray-200 my-3"></div>
                
                <div className="flex items-center justify-between px-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Code</span>
                    <span className="text-[20px] font-black tracking-widest text-primary">{promoCode || "BALI2026"}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      localStorage.setItem('savedPromoCode', promoCode || "BALI2026");
                      router.push(`/tours?promo=${promoCode || "BALI2026"}`);
                      setPromoDropdownOpen(false);
                    }}
                    className="bg-[#111111] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold active:scale-95 transition-all shadow-md hover:bg-gray-800"
                  >
                    Apply Code
                  </button>
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setPromoDropdownOpen(false)} className="mt-2 w-full py-3.5 bg-black text-white rounded-xl font-bold text-[15px] active:scale-95 transition-transform">
            Close
          </button>
        </div>
      </div>
    )}
    
    {/* Sidebar Component */}
    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
