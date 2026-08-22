"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, MapPin, Globe, Menu, Bell, Settings2, ChevronDown, User, Map, Sparkles, CircleDollarSign } from "lucide-react";
import { ScooterIcon, SpaIcon, TowelsIcon } from "@/components/icons/CategoryIcons";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [greeting, setGreeting] = useState("Good Day");
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);
  
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [filterOpen, setFilterOpen] = useState(false);
  const [activeService, setActiveService] = useState("Tour");
  
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
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

  // Hide the global Navbar on the tours page, individual tour detail pages, the map page, or blog pages
  if (pathname.startsWith('/tours') || pathname === '/map' || pathname.startsWith('/blog') || pathname.startsWith('/profile')) return null;

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("balance_island_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.image) {
          setProfileImage(parsed.image);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <header className={`fixed z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] left-1/2 -translate-x-1/2 ${
      isScrolled 
        ? "top-2 w-[95%] max-w-[95%] rounded-full bg-white/20 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-white/20 py-2.5 md:top-4 md:w-[85%] md:max-w-[1000px] md:bg-[#111111]/80 md:shadow-[inset_1px_1px_2px_rgba(255,255,255,0.05),0_8px_30px_rgba(0,0,0,0.5)] md:border-white/10" 
        : "top-0 w-full bg-transparent pt-4 pb-4 md:w-[95%] md:max-w-[1400px] md:py-5"
    }`}>
      
      {/* MOBILE LAYOUT */}
      <div className="md:hidden px-5 sm:px-6 flex items-center justify-between">
        
        {/* Left Side: Profile Icon & Greeting */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/profile/personal-info" className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-[#111111] border border-white/10 flex items-center justify-center text-white active:scale-95 transition-all shadow-sm hover:bg-white/5 overflow-hidden">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={18} strokeWidth={2.5} className="text-white" />
            )}
          </Link>
          <div className="flex flex-col justify-center px-1">
            <span className="text-[10px] sm:text-[11px] font-bold leading-tight drop-shadow-sm" style={{ color: '#000000', opacity: 0.8 }}>{mounted ? greeting : "Good Day"}</span>
            <span className="text-[11px] sm:text-[12px] font-extrabold leading-tight mt-[1px] drop-shadow-sm" style={{ color: '#000000' }}>Bali, Indonesia</span>
          </div>
        </div>

        {/* Right Side: Currency & Language */}
        <div className="flex items-center gap-1.5 sm:gap-2 relative z-50">
          <div className="relative">
            <button 
              onClick={() => { setCurrencyDropdownOpen(!currencyDropdownOpen); setLangDropdownOpen(false); }}
              className="px-2.5 sm:px-3.5 h-9 sm:h-10 bg-[#000000] text-[#ffffff] rounded-full flex items-center gap-1.5 justify-center hover:bg-neutral-800 shadow-soft font-extrabold text-[11px] sm:text-[13px] transition-colors"
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
              onClick={() => { setLangDropdownOpen(!langDropdownOpen); setCurrencyDropdownOpen(false); }}
              className="px-2.5 sm:px-3.5 h-9 sm:h-10 bg-[#000000] text-[#ffffff] rounded-full flex items-center gap-1.5 justify-center hover:bg-neutral-800 shadow-soft font-extrabold text-[11px] sm:text-[13px] transition-colors"
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
          <Link href="/about" className={`text-[13px] font-bold px-5 py-2.5 rounded-full transition-colors duration-500 ${isScrolled ? 'text-primary hover:bg-black/5' : 'text-white hover:bg-white/20'}`}>
            Become a Partner
          </Link>
          <div className="relative">
            <button 
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
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
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
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
  );
}
