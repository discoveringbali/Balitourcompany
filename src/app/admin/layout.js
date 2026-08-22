"use client";

import React, { useState } from "react";
import { 
  Calendar, MapPin, Settings, LogOut, 
  Briefcase, Users, Newspaper, Home, Menu, X, Bell, Search, ChevronDown, Activity, Smartphone, Tag, Plus
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import HeroSettingsModal from "@/components/admin/HeroSettingsModal";
import DiscountSettingsModal from "@/components/admin/DiscountSettingsModal";

function AdminLoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    
    if (cleanEmail === "putuedosantika@gmail.com" && cleanPassword === "Poiuytrewq123") {
      localStorage.setItem("admin_auth", "true");
      onLogin();
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="admin-wrapper min-h-screen bg-[#f9f9f9] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-[#eaeaea]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1c1c1c] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-[#dcdcdc] font-black text-2xl tracking-tighter">BI</span>
          </div>
          <h1 className="text-2xl font-black text-[#1c1c1c]">Balance Island</h1>
          <p className="text-sm font-bold text-gray-500 mt-1">Secure administrator login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 ml-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#f9f9f9] border border-[#eaeaea] rounded-xl px-4 py-3 mt-1 text-sm font-bold outline-none focus:border-[#1c1c1c] transition-colors"
              placeholder="putuedosantika@gmail.com"
              required 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#f9f9f9] border border-[#eaeaea] rounded-xl px-4 py-3 mt-1 text-sm font-bold outline-none focus:border-[#1c1c1c] transition-colors"
              placeholder="••••••••••••"
              required 
            />
          </div>
          
          {error && <p className="text-xs font-bold text-black text-center bg-gray-50 py-2 rounded-lg">{error}</p>}
          
          <button type="submit" className="w-full mt-6 py-3.5 bg-[#1c1c1c] text-white font-extrabold rounded-xl hover:bg-black transition-colors">
            Secure Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  
  // All Hooks MUST be at the top level before any early returns
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  React.useEffect(() => {
    if (localStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Early returns (MUST be after all hooks)
  if (isChecking) {
    return (
      <div className="fixed inset-0 bg-[#f9f9f9] z-[200] flex flex-col items-center justify-center gap-4">
         <div className="w-10 h-10 border-4 border-gray-200 border-t-[#dcdcdc] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  // Handlers
  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    } else {
      setShowInstallModal(true);
    }
  };

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Manage Bookings", href: "/admin/bookings", icon: Calendar },
    { name: "Products & Tours", href: "/admin/listings", icon: MapPin },
    { name: "Content & SEO", href: "/admin/places", icon: Newspaper }
  ];

  return (
    <div className="admin-wrapper fixed inset-0 z-[100] bg-[#f9f9f9] flex overflow-hidden font-sans text-[#1c1c1c]">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-[#1c1c1c]/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Native Aesthetic Sidebar - Light */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-[260px] bg-white border-r border-[#eaeaea] text-[#1c1c1c] z-50 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} shadow-2xl lg:shadow-none`}>
        
        {/* Brand Header */}
        <div className="h-20 px-6 border-b border-[#eaeaea] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <span className="font-black text-lg tracking-tight">Balance Island</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-[#1c1c1c] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Global Action Button */}
        <div className="p-4 border-b border-[#eaeaea]">
          <Link 
            href="/admin/listings" 
            onClick={() => setIsSidebarOpen(false)}
            className="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-neutral-800 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95"
          >
             <Plus size={16} strokeWidth={3} />
             <span>Create New Product</span>
          </Link>
        </div>

        {/* Navigation Map */}
        <div className="flex-1 overflow-y-auto py-5">
          <p className="px-6 text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-3">Management</p>
          <nav className="flex flex-col gap-1 px-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name}
                  href={link.href} 
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-black text-white' : 'text-gray-500 hover:text-[#1c1c1c] hover:bg-[#f9f9f9]'}`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : 'text-gray-400'} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <p className="px-6 text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mt-6 mb-3">Quick Actions</p>
          <div className="flex flex-col gap-1 px-4">
            <button 
              onClick={() => {
                setIsHeroModalOpen(true);
                setIsSidebarOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-[#1c1c1c] hover:bg-[#f9f9f9] transition-all text-left w-full"
            >
              <Home size={18} strokeWidth={2} className="text-gray-400" />
              Homepage Hero
            </button>
            <button 
              onClick={() => {
                setIsDiscountModalOpen(true);
                setIsSidebarOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-[#1c1c1c] hover:bg-[#f9f9f9] transition-all text-left w-full"
            >
              <Tag size={18} strokeWidth={2} className="text-gray-400" />
              Discount Codes
            </button>
          </div>
        </div>

        {/* System Settings */}
        <div className="p-5 border-t border-[#eaeaea] flex flex-col gap-1">
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-sm font-bold text-[#1c1c1c] hover:bg-[#f9f9f9] transition-all">
              <LogOut size={18} /> Log Out
            </button>
        </div>
      </aside>

      {/* Main Content Space */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Dynamic Nested Content */}
        <div className="flex-1 overflow-y-auto pb-28 lg:pb-0">
          {children}
        </div>

      </main>

    {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-[#eaeaea] flex justify-between px-6 py-4 z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] pb-safe rounded-t-[32px]">
        <Link href="/admin" className={`flex flex-col items-center gap-1.5 transition-colors ${pathname === '/admin' ? 'text-[#1c1c1c]' : 'text-gray-400 hover:text-[#1c1c1c]'} group`}>
          <div className="relative">
            <Activity size={22} strokeWidth={pathname === '/admin' ? 3 : 2.5} />
            {pathname === '/admin' && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black text-white rounded-full"></div>}
          </div>
          <span className="text-[10px] font-extrabold transition-colors">Overview</span>
        </Link>
        <Link href="/admin/bookings" className={`flex flex-col items-center gap-1.5 transition-colors ${pathname === '/admin/bookings' ? 'text-[#1c1c1c]' : 'text-gray-400 hover:text-[#1c1c1c]'} group`}>
          <div className="relative">
             <Calendar size={22} strokeWidth={pathname === '/admin/bookings' ? 3 : 2.5} />
             {pathname === '/admin/bookings' && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black text-white rounded-full"></div>}
          </div>
          <span className="text-[10px] font-bold">Bookings</span>
        </Link>
        <Link href="/admin/listings" className={`flex flex-col items-center gap-1.5 transition-colors ${pathname === '/admin/listings' ? 'text-[#1c1c1c]' : 'text-gray-400 hover:text-[#1c1c1c]'}`}>
          <div className="relative">
             <MapPin size={22} strokeWidth={pathname === '/admin/listings' ? 3 : 2.5} />
             {pathname === '/admin/listings' && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black text-white rounded-full"></div>}
          </div>
          <span className="text-[10px] font-bold">Listings</span>
        </Link>
        <button onClick={() => setIsSidebarOpen(true)} className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-black transition-colors">
          <Menu size={22} strokeWidth={2.5} />
          <span className="text-[10px] font-bold">Menu</span>
        </button>
      </div>

      {/* iOS / Fallback Install Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:px-4 pb-0 sm:pb-4">
          <div className="fixed inset-0 bg-[#1c1c1c]/60 backdrop-blur-sm" onClick={() => setShowInstallModal(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl p-6 z-10 animate-slideUp sm:animate-scaleIn">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-[#1c1c1c]">Install App</h3>
                <button onClick={() => setShowInstallModal(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                  <X size={16} strokeWidth={3} />
                </button>
             </div>
             
             <div className="space-y-6">
               <div className="flex items-center gap-4 bg-[#f9f9f9] p-4 rounded-2xl border border-[#eaeaea]">
                 <img src="/icon.png" alt="Logo" className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                 <div>
                   <p className="text-sm font-black text-[#1c1c1c]">Balance Island Admin</p>
                   <p className="text-[11px] font-bold text-gray-500">Add to Home Screen</p>
                 </div>
               </div>

               <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">iOS (iPhone & iPad)</h4>
                    <ol className="text-sm font-bold text-gray-600 space-y-1.5 ml-2 border-l-2 border-[#eaeaea] pl-3">
                      <li>1. Open this page in Safari</li>
                      <li>2. Tap the Share icon <span className="inline-block bg-gray-100 px-1 rounded text-xs leading-none py-0.5">↗</span> at the bottom</li>
                      <li>3. Scroll down and tap <span className="text-[#1c1c1c]">"Add to Home Screen"</span></li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 mt-5">Android</h4>
                    <ol className="text-sm font-bold text-gray-600 space-y-1.5 ml-2 border-l-2 border-[#eaeaea] pl-3">
                      <li>1. Open this page in Chrome</li>
                      <li>2. Tap the 3-dot menu <span className="inline-block bg-gray-100 px-1 rounded text-xs leading-none py-0.5">⋮</span> at the top</li>
                      <li>3. Tap <span className="text-[#1c1c1c]">"Install app"</span> or <span className="text-[#1c1c1c]">"Add to Home Screen"</span></li>
                    </ol>
                  </div>
               </div>
             </div>
             
             <button onClick={() => setShowInstallModal(false)} className="w-full mt-8 py-3.5 bg-[#1c1c1c] text-white font-extrabold rounded-xl hover:bg-black transition-colors">
               Got it
             </button>
          </div>
        </div>
      )}

      {/* Homepage Hero Modal */}
      {isHeroModalOpen && (
        <HeroSettingsModal onClose={() => setIsHeroModalOpen(false)} />
      )}

      {/* Discount Codes Management Modal */}
      {isDiscountModalOpen && (
        <DiscountSettingsModal 
          isOpen={isDiscountModalOpen} 
          onClose={() => setIsDiscountModalOpen(false)} 
        />
      )}

    </div>
  );
}
