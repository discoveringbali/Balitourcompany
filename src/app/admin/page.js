"use client";

import React, { useState, useEffect } from "react";
import { Users, DollarSign, Calendar, MapPin, TrendingUp, ChevronRight, Activity, ExternalLink, Edit3, Globe, CheckCircle2, ArrowUpRight } from "lucide-react";
import HeroSettingsModal from "../../components/admin/HeroSettingsModal";
import DiscountSettingsModal from "../../components/admin/DiscountSettingsModal";
import CampaignSettingsModal from "../../components/admin/CampaignSettingsModal";
import { getCampaignSettings, DEFAULT_CAMPAIGNS } from "@/lib/campaigns";
import { supabase } from "@/lib/supabase";

const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

export default function AdminDashboard() {
  const [activeCategory, setActiveCategory] = useState("Tour");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [selectedCampaignForModal, setSelectedCampaignForModal] = useState(null);
  const [campaigns, setCampaigns] = useState(DEFAULT_CAMPAIGNS);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
    setCampaigns(getCampaignSettings());

    const handleCampaignsChange = (e) => {
      if (e.detail) {
        setCampaigns(e.detail);
      } else {
        setCampaigns(getCampaignSettings());
      }
    };

    window.addEventListener('balance_island_campaigns_changed', handleCampaignsChange);
    return () => window.removeEventListener('balance_island_campaigns_changed', handleCampaignsChange);
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      setAllBookings(data || []);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (id) => {
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'Confirmed' })
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update booking');
      }
      
      // Update local state
      setAllBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Confirmed' } : b));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(prev => ({ ...prev, status: 'Confirmed' }));
      }
    } catch (err) {
      alert("Failed to confirm booking: " + err.message);
    }
  };

  const getStats = (category) => {
    const categoryBookings = allBookings.filter(b => 
       category === "Tour" ? (b.category === "Tour" || !b.category) : b.category === category
    );

    const confirmed = categoryBookings.filter(b => b.status === "Confirmed" || b.status === "Completed");
    
    // Calculate total revenue
    const revenue = confirmed.reduce((sum, b) => {
      const cleanAmount = String(b.amount).replace(/[^0-9]/g, '');
      return sum + (parseInt(cleanAmount) || 0);
    }, 0);

    // Calculate total participants
    const participants = categoryBookings.reduce((sum, b) => {
       const pax = parseInt(b.details?.guests || b.details?.pax || 1);
       return sum + (isNaN(pax) ? 1 : pax);
    }, 0);

    return [
      { label: "Gross Revenue", value: revenue > 0 ? formatIDR(revenue) : "Rp 0", trend: "+0.0%", icon: DollarSign },
      { label: "Confirmed Bookings", value: confirmed.length.toString(), trend: "+0.0%", icon: Calendar },
      { label: "Total Participants", value: participants.toString(), trend: "+0.0%", icon: Users },
      { label: "Total Inquiries", value: categoryBookings.length.toString(), trend: "+0.0%", icon: MapPin },
    ];
  };

  const currentBookings = allBookings.filter(b => 
     activeCategory === "Tour" ? (b.category === "Tour" || !b.category) : b.category === activeCategory
  );

  const currentStats = getStats(activeCategory);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1c1c1c] tracking-tight">Dashboard Overview</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Track your product portfolio performance and bookings.</p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <button 
            onClick={() => setIsHeroModalOpen(true)} 
            className="flex items-center justify-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-[#1c1c1c] text-white hover:bg-black transition-all shadow-sm active:scale-95"
          >
            Homepage Hero
          </button>
          <button 
            onClick={() => setIsDiscountModalOpen(true)} 
            className="flex items-center justify-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-white border border-[#eaeaea] text-[#1c1c1c] hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95"
          >
            Discount Codes
          </button>
        </div>
      </div>

      {/* Clean Category Tabs */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 pt-1 snap-x">
          <button 
            onClick={() => setActiveCategory("Tour")}
            className={`snap-center shrink-0 px-6 h-12 rounded-xl font-extrabold shadow-sm active:scale-95 transition-all text-[13px] tracking-wide ${activeCategory === "Tour" ? "bg-[#1c1c1c] text-white" : "bg-white text-gray-500 hover:bg-gray-50 border border-[#eaeaea]"}`}>
            Tour Dashboard
          </button>
          <button 
            onClick={() => setActiveCategory("Activities")}
            className={`snap-center shrink-0 px-6 h-12 rounded-xl font-extrabold shadow-sm active:scale-95 transition-all text-[13px] tracking-wide ${activeCategory === "Activities" ? "bg-[#1c1c1c] text-white" : "bg-white text-gray-500 hover:bg-gray-50 border border-[#eaeaea]"}`}>
            Activities
          </button>
      </div>
      
      {/* Soft Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {currentStats.map((stat, i) => {
          const Icon = stat.icon;
          const isPositive = stat.trend.includes('+');
          const isNeutral = stat.trend === '0.0%';
          return (
            <div key={i} className="bg-white p-6 rounded-3xl border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col group hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between mb-4 text-gray-500">
                <span className="text-xs font-bold uppercase tracking-widest">{stat.label}</span>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#f9f9f9] group-hover:bg-[#1c1c1c] group-hover:text-[#dcdcdc] transition-colors">
                  <Icon size={20} strokeWidth={2.5} className="text-[#1c1c1c] group-hover:text-[#dcdcdc]" />
                </div>
              </div>
              <h4 className="text-[26px] font-black text-[#1c1c1c] mb-2 tracking-tight">{stat.value}</h4>
              <div className="mt-auto">
                 <span className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1.5 rounded-lg
                   ${isPositive ? 'bg-gray-50 text-black' : isNeutral ? 'bg-gray-50 text-gray-500' : 'bg-gray-50 text-black'}
                 `}>
                   {isPositive && <TrendingUp size={12} strokeWidth={3} />}
                   {stat.trend} <span className="font-semibold opacity-70">vs last month</span>
                 </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* External Service Campaign Cards (Scooter & Spa) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#1c1c1c] tracking-tight">External Service Campaigns</h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">Connect and manage external website booking links for Scooter & Spa partner services.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Scooter Campaign Card */}
          {campaigns.scooter && (
            <div className="bg-white rounded-3xl border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between overflow-hidden group hover:border-gray-300 transition-all">
              {/* Campaign Image Banner */}
              {campaigns.scooter.image && (
                <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                  <img 
                    src={campaigns.scooter.image} 
                    alt={campaigns.scooter.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#1c1c1c] shadow-xs">
                      {campaigns.scooter.type || "Scooter Rental"}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs ${
                      campaigns.scooter.active 
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-400/30' 
                        : 'bg-black/60 text-white/70'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${campaigns.scooter.active ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
                      {campaigns.scooter.active ? 'ACTIVE' : 'PAUSED'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-base font-black leading-tight drop-shadow-sm">
                      {campaigns.scooter.title}
                    </h3>
                  </div>
                </div>
              )}

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                {!campaigns.scooter.image && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                      {campaigns.scooter.type || "Scooter Rental"}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                      campaigns.scooter.active 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${campaigns.scooter.active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      {campaigns.scooter.active ? 'ACTIVE' : 'PAUSED'}
                    </span>
                  </div>
                )}

                <div>
                  {!campaigns.scooter.image && (
                    <h3 className="text-lg font-black text-[#1c1c1c] tracking-tight">
                      {campaigns.scooter.title}
                    </h3>
                  )}
                  <p className="text-xs sm:text-sm text-gray-500 font-medium line-clamp-2">
                    {campaigns.scooter.subtitle}
                  </p>
                </div>

                {/* External Link Display Box */}
                <div className="p-3 bg-[#f9f9f9] rounded-2xl border border-[#eaeaea] flex items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Globe size={14} className="text-gray-400 shrink-0" />
                    <span className="text-xs font-semibold text-[#1c1c1c] truncate">
                      {campaigns.scooter.externalUrl || "No external URL configured"}
                    </span>
                  </div>
                  {campaigns.scooter.externalUrl && (
                    <a
                      href={campaigns.scooter.externalUrl.startsWith('http') ? campaigns.scooter.externalUrl : `https://${campaigns.scooter.externalUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-extrabold text-[#1c1c1c] hover:underline flex items-center gap-1 shrink-0 px-2.5 py-1 bg-white rounded-lg border border-[#eaeaea] shadow-2xs hover:bg-gray-50 active:scale-95 transition-all"
                    >
                      Visit <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 mt-3 border-t border-[#eaeaea] flex items-center justify-between gap-3">
                  <div className="text-[11px] font-bold text-gray-400">
                    <span className="text-[#1c1c1c] font-black">{campaigns.scooter.stats?.clicks || 1420}</span> clicks • <span className="text-[#1c1c1c] font-black">{campaigns.scooter.stats?.conversion || '29.2%'}</span> CTR
                  </div>
                  <button
                    onClick={() => setSelectedCampaignForModal(campaigns.scooter)}
                    className="px-4 py-2 bg-[#1c1c1c] text-white text-xs font-extrabold rounded-xl hover:bg-black active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Edit3 size={13} />
                    <span>Configure & Image</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Spa Campaign Card */}
          {campaigns.spa && (
            <div className="bg-white rounded-3xl border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between overflow-hidden group hover:border-gray-300 transition-all">
              {/* Campaign Image Banner */}
              {campaigns.spa.image && (
                <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                  <img 
                    src={campaigns.spa.image} 
                    alt={campaigns.spa.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#1c1c1c] shadow-xs">
                      {campaigns.spa.type || "Spa & Wellness"}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs ${
                      campaigns.spa.active 
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-400/30' 
                        : 'bg-black/60 text-white/70'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${campaigns.spa.active ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
                      {campaigns.spa.active ? 'ACTIVE' : 'PAUSED'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-base font-black leading-tight drop-shadow-sm">
                      {campaigns.spa.title}
                    </h3>
                  </div>
                </div>
              )}

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                {!campaigns.spa.image && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                      {campaigns.spa.type || "Spa & Wellness"}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                      campaigns.spa.active 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${campaigns.spa.active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      {campaigns.spa.active ? 'ACTIVE' : 'PAUSED'}
                    </span>
                  </div>
                )}

                <div>
                  {!campaigns.spa.image && (
                    <h3 className="text-lg font-black text-[#1c1c1c] tracking-tight">
                      {campaigns.spa.title}
                    </h3>
                  )}
                  <p className="text-xs sm:text-sm text-gray-500 font-medium line-clamp-2">
                    {campaigns.spa.subtitle}
                  </p>
                </div>

                {/* External Link Display Box */}
                <div className="p-3 bg-[#f9f9f9] rounded-2xl border border-[#eaeaea] flex items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Globe size={14} className="text-gray-400 shrink-0" />
                    <span className="text-xs font-semibold text-[#1c1c1c] truncate">
                      {campaigns.spa.externalUrl || "No external URL configured"}
                    </span>
                  </div>
                  {campaigns.spa.externalUrl && (
                    <a
                      href={campaigns.spa.externalUrl.startsWith('http') ? campaigns.spa.externalUrl : `https://${campaigns.spa.externalUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-extrabold text-[#1c1c1c] hover:underline flex items-center gap-1 shrink-0 px-2.5 py-1 bg-white rounded-lg border border-[#eaeaea] shadow-2xs hover:bg-gray-50 active:scale-95 transition-all"
                    >
                      Visit <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 mt-3 border-t border-[#eaeaea] flex items-center justify-between gap-3">
                  <div className="text-[11px] font-bold text-gray-400">
                    <span className="text-[#1c1c1c] font-black">{campaigns.spa.stats?.clicks || 960}</span> clicks • <span className="text-[#1c1c1c] font-black">{campaigns.spa.stats?.conversion || '30.0%'}</span> CTR
                  </div>
                  <button
                    onClick={() => setSelectedCampaignForModal(campaigns.spa)}
                    className="px-4 py-2 bg-[#1c1c1c] text-white text-xs font-extrabold rounded-xl hover:bg-black active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Edit3 size={13} />
                    <span>Configure & Image</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modern Bookings Table */}
      <div className="bg-white rounded-3xl border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        
        <div className="flex justify-end p-4 border-b border-[#eaeaea]">
          <button onClick={fetchBookings} className="text-sm font-extrabold text-[#1c1c1c] hover:text-gray-500 flex items-center gap-1 transition-colors">
             Refresh Data <ChevronRight size={16} strokeWidth={3} />
          </button>
        </div>
        
        <div className="overflow-x-hidden">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="bg-[#f9f9f9] text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-[#eaeaea]">
                   <th className="px-6 py-4">Reference</th>
                   <th className="px-6 py-4 hidden sm:table-cell">Customer</th>
                   <th className="px-6 py-4 hidden md:table-cell">Product Selected</th>
                   <th className="px-6 py-4 hidden lg:table-cell">Timestamp</th>
                   <th className="px-6 py-4 text-right">Amount</th>
                   <th className="px-6 py-4 text-center hidden sm:table-cell">Status</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-[#eaeaea] text-sm">
                {currentBookings.length === 0 && !loading && (
                   <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500 font-bold">No bookings found in this category.</td>
                   </tr>
                )}
                {loading && (
                   <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500 font-bold">Loading live database...</td>
                   </tr>
                )}
                {currentBookings.map((booking, i) => (
                  <tr key={booking.id} onClick={() => setSelectedBooking(booking)} className="hover:bg-[#f9f9f9] transition-colors group cursor-pointer active:bg-gray-100">
                     <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-white border border-[#eaeaea] shadow-sm flex items-center justify-center text-[#1c1c1c] font-black text-xs shrink-0 group-hover:bg-[#1c1c1c] group-hover:text-[#dcdcdc] transition-colors">
                              {booking.id.substring(3, 7)}
                           </div>
                           <div className="flex flex-col">
                              <span className="font-extrabold text-[#1c1c1c]">{booking.id}</span>
                              <span className="text-[11px] font-bold text-gray-400">{typeof booking.booking_date === 'object' ? JSON.stringify(booking.booking_date) : booking.booking_date}</span>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell text-gray-600 font-bold">{typeof booking.customer_name === 'object' ? JSON.stringify(booking.customer_name) : booking.customer_name}</td>
                     <td className="px-6 py-4 text-[#1c1c1c] font-bold hidden md:table-cell">
                        {typeof booking.service_name === 'object' ? JSON.stringify(booking.service_name) : booking.service_name}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium hidden lg:table-cell">{new Date(booking.created_at || Date.now()).toLocaleDateString()}</td>
                     <td className="px-6 py-4 whitespace-nowrap font-black text-[#1c1c1c] text-right">{typeof booking.amount === 'object' ? JSON.stringify(booking.amount) : booking.amount}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest
                          ${booking.status === 'Confirmed' ? 'bg-black text-white text-[#1c1c1c]' : ''}
                          ${booking.status === 'Pending' ? 'bg-gray-100 text-black' : ''}
                          ${booking.status === 'Completed' ? 'bg-gray-100 text-gray-500' : ''}
                          ${booking.status === 'Cancelled' ? 'bg-gray-100 text-black' : ''}
                        `}>
                          {booking.status}
                        </span>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>

      {/* Tap-to-Expand Mobile Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center font-sans px-4">
          <div className="fixed inset-0 bg-[#1c1c1c]/60 backdrop-blur-sm" onClick={() => setSelectedBooking(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 z-10 animate-scaleIn max-h-[90dvh] overflow-y-auto no-scrollbar">
             <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-[#1c1c1c] break-all">{selectedBooking.id}</h3>
                  <p className="text-xs font-bold text-gray-400 mt-1">{typeof selectedBooking.customer_name === 'object' ? JSON.stringify(selectedBooking.customer_name) : selectedBooking.customer_name} • {typeof selectedBooking.contact_info === 'object' ? JSON.stringify(selectedBooking.contact_info) : selectedBooking.contact_info}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest
                    ${selectedBooking.status === 'Confirmed' ? 'bg-black text-white text-[#1c1c1c]' : ''}
                    ${selectedBooking.status === 'Pending' ? 'bg-gray-100 text-black' : ''}
                    ${selectedBooking.status === 'Completed' ? 'bg-gray-100 text-gray-500' : ''}
                    ${selectedBooking.status === 'Cancelled' ? 'bg-gray-100 text-black' : ''}
                `}>
                    {selectedBooking.status}
                </span>
             </div>
             
             <div className="space-y-4 mb-6 border-y border-[#eaeaea] py-4">
               <div>
                 <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Product Selected</p>
                 <p className="text-sm font-bold text-[#1c1c1c]">{typeof selectedBooking.service_name === 'object' ? JSON.stringify(selectedBooking.service_name) : selectedBooking.service_name}</p>
               </div>
               <div className="flex justify-between">
                 <div>
                   <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Date</p>
                   <p className="text-sm font-bold text-[#1c1c1c]">{typeof selectedBooking.booking_date === 'object' ? JSON.stringify(selectedBooking.booking_date) : selectedBooking.booking_date}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Amount</p>
                   <p className="text-sm font-black text-[#1c1c1c]">{typeof selectedBooking.amount === 'object' ? JSON.stringify(selectedBooking.amount) : selectedBooking.amount}</p>
                 </div>
               </div>
             </div>

             {selectedBooking.details && typeof selectedBooking.details === 'object' && (
               <div className="mb-6 p-4 bg-[#f9f9f9] rounded-2xl border border-[#eaeaea]">
                 <p className="text-[10px] font-extrabold text-[#1c1c1c] uppercase tracking-widest mb-3">Customer Form Details</p>
                 <div className="space-y-3">
                   {Object.entries(selectedBooking.details).map(([key, value]) => {
                     if (key.toLowerCase() === 'image' || key.toLowerCase() === 'iswishlist' || key.toLowerCase() === 'duration') return null;
                     
                     let displayValue = value;
                     if (typeof value === 'object') {
                       displayValue = JSON.stringify(value);
                     }
                     
                     return (
                       <div key={key} className="flex flex-col">
                         <span className="text-[10px] font-bold text-gray-500 uppercase leading-tight mb-1">{key.replace(/_/g, ' ')}</span>
                         <span className="text-[14px] font-extrabold text-[#1c1c1c] leading-tight break-words">
                            {displayValue || '-'}
                         </span>
                       </div>
                     );
                   })}
                   {(!selectedBooking.details || !selectedBooking.details.special_requests) && (
                     <div className="flex flex-col">
                       <span className="text-[10px] font-bold text-gray-500 uppercase leading-tight mb-1">SPECIAL REQUESTS</span>
                       <span className="text-[14px] font-extrabold text-[#1c1c1c] leading-tight break-words">
                          None specified
                       </span>
                     </div>
                   )}
                 </div>
               </div>
             )}
             <div className="flex gap-3 mt-6">
               <button onClick={() => setSelectedBooking(null)} className="flex-1 py-3 bg-[#f9f9f9] text-[#1c1c1c] font-extrabold rounded-xl hover:bg-gray-100 transition-colors">Close</button>
               {selectedBooking.status === 'Pending' && (
                  <button 
                    onClick={() => handleConfirmBooking(selectedBooking.id)} 
                    className="flex-1 py-3 bg-[#1c1c1c] text-[#dcdcdc] font-extrabold rounded-xl hover:bg-black transition-colors"
                  >
                    Confirm
                  </button>
               )}
             </div>
          </div>
        </div>
      )}

      {isHeroModalOpen && <HeroSettingsModal onClose={() => setIsHeroModalOpen(false)} />}
      {isDiscountModalOpen && <DiscountSettingsModal isOpen={isDiscountModalOpen} onClose={() => setIsDiscountModalOpen(false)} />}
      {selectedCampaignForModal && (
        <CampaignSettingsModal
          isOpen={Boolean(selectedCampaignForModal)}
          campaign={selectedCampaignForModal}
          onClose={() => setSelectedCampaignForModal(null)}
          onSaveSuccess={(id, updatedData) => {
            setCampaigns(prev => ({ ...prev, [id]: { ...prev[id], ...updatedData } }));
          }}
        />
      )}
    </div>
  );
}
