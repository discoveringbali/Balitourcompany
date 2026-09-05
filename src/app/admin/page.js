"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Users, DollarSign, Calendar, MapPin, TrendingUp, ChevronRight, Activity, 
  ExternalLink, Edit3, Globe, CheckCircle2, ArrowUpRight, Plus, Trash2, 
  Tag, Percent, Check, AlertCircle, Copy, Upload, Image as ImageIcon, Video, Save, Clock, Eye, Sparkles, X
} from "lucide-react";
import { getCampaignSettings, saveCampaignSettings, DEFAULT_CAMPAIGNS } from "@/lib/campaigns";
import { getDiscountCodes, saveDiscountCodes } from "@/lib/discounts";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

export default function AdminDashboard() {
  // Main Section Navigation: 'overview' | 'hero' | 'discounts'
  const [activeSection, setActiveSection] = useState("overview");

  // Overview Data
  const [activeCategory, setActiveCategory] = useState("Tour");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hero & Campaign Cards Data (Dedicated Private Section)
  const [heroSettings, setHeroSettings] = useState({
    campaignVideo: "",
    campaignYoutubeLink: "",
    promoCode: "BALI2026"
  });
  const [campaigns, setCampaigns] = useState(DEFAULT_CAMPAIGNS);
  const [flashSale, setFlashSale] = useState({
    active: false,
    title: "",
    discountText: "",
    endTime: "",
    image: "",
    linkUrl: ""
  });
  const [isHeroUploading, setIsHeroUploading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadingFor, setUploadingFor] = useState(null);
  const [heroSavedToast, setHeroSavedToast] = useState(false);

  // Discounts Data (Dedicated Private Section)
  const [discountCodes, setDiscountCodes] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [newDiscount, setNewDiscount] = useState({
    code: "",
    type: "percent",
    value: 10,
    active: true,
    isSecret: false
  });
  const [discountSavedToast, setDiscountSavedToast] = useState(false);

  // Initialize
  useEffect(() => {
    fetchBookings();
    loadDiscounts();
    loadHeroAndCampaigns();

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

  const loadHeroAndCampaigns = async () => {
    try {
      const { data, error } = await supabase.from('homepage_settings').select('*').eq('id', 1).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setHeroSettings({
          campaignVideo: data.campaign_video || "",
          campaignYoutubeLink: data.campaign_youtube_link || "",
          promoCode: data.metadata?.promoCode || "BALI2026"
        });
        if (data.metadata?.campaigns) {
          setCampaigns(data.metadata.campaigns);
          saveCampaignSettings(data.metadata.campaigns);
        } else {
          setCampaigns(getCampaignSettings());
        }
        if (data.metadata?.flashSale) {
          setFlashSale(data.metadata.flashSale);
        }
      } else {
        setCampaigns(getCampaignSettings());
      }
    } catch (err) {
      console.error("Error loading hero settings:", err.message);
      setCampaigns(getCampaignSettings());
    }
  };

  const loadDiscounts = async () => {
    try {
      const res = await fetch('/api/discounts', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setDiscountCodes(data || []);
      } else {
        setDiscountCodes(getDiscountCodes()); // Fallback
      }
    } catch (err) {
      console.error("Failed to fetch discounts", err);
      setDiscountCodes(getDiscountCodes()); // Fallback
    }
  };

  const syncDiscountsToApi = async (updated) => {
    saveDiscountCodes(updated); // Keep local storage sync as backup
    try {
      await fetch('/api/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error("Failed to sync discounts to API:", err);
    }
  };

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
      setAllBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Confirmed' } : b));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(prev => ({ ...prev, status: 'Confirmed' }));
      }
    } catch (err) {
      alert("Failed to confirm booking: " + err.message);
    }
  };

  // Discount Actions
  const handleAddDiscount = (e) => {
    e.preventDefault();
    if (!newDiscount.code.trim()) return;
    const cleanCode = newDiscount.code.trim().toUpperCase();
    const entry = {
      code: cleanCode,
      type: newDiscount.type,
      value: Number(newDiscount.value) || 0,
      active: true,
      isSecret: newDiscount.isSecret || false
    };
    const updated = [entry, ...discountCodes];
    setDiscountCodes(updated);
    syncDiscountsToApi(updated);
    setNewDiscount({ code: "", type: "percent", value: 10, active: true, isSecret: false });
    setDiscountSavedToast(true);
    setTimeout(() => setDiscountSavedToast(false), 3000);
  };

  const handleDeleteDiscount = (idx) => {
    const updated = discountCodes.filter((_, i) => i !== idx);
    setDiscountCodes(updated);
    syncDiscountsToApi(updated);
  };

  const handleToggleDiscount = (idx) => {
    const updated = [...discountCodes];
    updated[idx].active = !updated[idx].active;
    setDiscountCodes(updated);
    syncDiscountsToApi(updated);
  };

  const handleToggleDiscountSecret = (idx) => {
    const updated = [...discountCodes];
    updated[idx].isSecret = !updated[idx].isSecret;
    setDiscountCodes(updated);
    syncDiscountsToApi(updated);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Hero Actions
  const handleHeroSave = async (e) => {
    if (e) e.preventDefault();
    try {
      const { data: existingData } = await supabase.from('homepage_settings').select('metadata').eq('id', 1).single();
      const metadata = existingData?.metadata || {};

      const payload = {
        id: 1,
        campaign_video: heroSettings.campaignVideo,
        campaign_youtube_link: heroSettings.campaignYoutubeLink,
        metadata: { ...metadata, campaigns: campaigns, promoCode: heroSettings.promoCode, flashSale: flashSale },
        updated_at: new Date().toISOString()
      };
      
      const res = await fetch('/api/admin/homepage-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save settings");
      }

      // Save campaigns to local storage and sync
      saveCampaignSettings(campaigns);

      setHeroSavedToast(true);
      window.dispatchEvent(new Event("homepage_hero_settings_changed"));
      setTimeout(() => setHeroSavedToast(false), 3000);
    } catch (err) {
      alert("Error saving hero settings: " + err.message);
    }
  };

  const handleHeroVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsHeroUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('campaigns')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('campaigns')
        .getPublicUrl(fileName);

      setHeroSettings(prev => ({ ...prev, campaignVideo: publicUrl }));
    } catch (err) {
      alert("Video upload failed: " + err.message);
    } finally {
      setIsHeroUploading(false);
    }
  };

  const handleCampaignImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingFor(type);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('campaigns')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('campaigns').getPublicUrl(fileName);
      
      if (type === 'flashSale') {
        setFlashSale({ ...flashSale, image: publicUrl });
      } else {
        setCampaigns({
          ...campaigns,
          [type]: { ...campaigns[type], image: publicUrl }
        });
      }
    } catch (err) {
      alert(`Error uploading image: ${err.message}`);
    } finally {
      setUploadingFor(null);
    }
  };

  // Stats for Overview
  const getStats = (category) => {
    const categoryBookings = allBookings.filter(b => 
       category === "Tour" ? (b.category === "Tour" || !b.category) : b.category === category
    );
    const confirmed = categoryBookings.filter(b => b.status === "Confirmed" || b.status === "Completed");
    const revenue = confirmed.reduce((sum, b) => {
      const cleanAmount = String(b.amount).replace(/[^0-9]/g, '');
      return sum + (parseInt(cleanAmount) || 0);
    }, 0);
    const participants = categoryBookings.reduce((sum, b) => {
       const pax = parseInt(b.details?.guests || b.details?.pax || 1);
       return sum + (isNaN(pax) ? 1 : pax);
    }, 0);

    return [
      { label: `Total ${category} Revenue`, value: formatIDR(revenue), icon: DollarSign },
      { label: `Confirmed ${category} Bookings`, value: confirmed.length.toString(), icon: CheckCircle2 },
      { label: `Total Travelers`, value: participants.toString(), icon: Users },
      { label: `Inquiries & Pending`, value: (categoryBookings.length - confirmed.length).toString(), icon: Clock },
    ];
  };

  const filteredBookings = allBookings.filter(b => 
    activeCategory === "Tour" ? (b.category === "Tour" || !b.category) : b.category === activeCategory
  );

  const currentStats = getStats(activeCategory);

  return (
    <div className="w-full min-h-screen bg-[#fafafa] pb-24 font-sans text-[#1c1c1c] space-y-6 sm:space-y-8">
      
      {/* Private Section Switcher Pills */}
      <div className="px-4 pt-4 sm:pt-6 max-w-7xl mx-auto">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "overview", label: "Dashboard Overview", icon: Activity },
            { id: "hero", label: "Homepage Hero & Campaigns", icon: Video },
            { id: "discounts", label: "Discount Codes", icon: Tag }
          ].map((sec) => {
            const Icon = sec.icon;
            const isSelected = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all shrink-0 cursor-pointer ${
                  isSelected 
                    ? "bg-black text-white shadow-sm" 
                    : "bg-white text-gray-600 hover:text-black border border-[#eaeaea] hover:border-gray-300"
                }`}
              >
                <Icon size={15} strokeWidth={isSelected ? 2.5 : 2} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="max-w-7xl mx-auto px-4">
        
        {/* ========================================================================= */}
        {/* SECTION 1: DASHBOARD OVERVIEW */}
        {/* ========================================================================= */}
        {activeSection === "overview" && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            
            {/* Category Tabs: Tour vs Activities */}
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveCategory("Tour")}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${activeCategory === "Tour" ? "bg-black text-white" : "bg-white text-gray-500 border border-[#eaeaea] hover:bg-gray-50"}`}
              >
                Tours Portfolio
              </button>
              <button 
                onClick={() => setActiveCategory("Activities")}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${activeCategory === "Activities" ? "bg-black text-white" : "bg-white text-gray-500 border border-[#eaeaea] hover:bg-gray-50"}`}
              >
                Activities Portfolio
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="p-5 rounded-2xl bg-white border border-[#eaeaea] shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between text-gray-400 mb-3">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">{stat.label}</span>
                      <div className="w-8 h-8 rounded-lg bg-[#fafafa] border border-[#eaeaea] flex items-center justify-center text-black">
                        <Icon size={16} strokeWidth={2.5} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-[#1c1c1c] tracking-tight">{stat.value}</h3>
                  </div>
                );
              })}
            </div>

            {/* Bookings & Inquiries Table */}
            <div className="bg-white rounded-2xl border border-[#eaeaea] overflow-hidden shadow-xs">
              <div className="p-5 border-b border-[#eaeaea] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#1c1c1c]">{activeCategory} Booking Ledger</h3>
                  <p className="text-xs text-gray-500 font-medium">Real-time status updates and guest inquiry management.</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-[#fafafa] border border-[#eaeaea] rounded-lg text-gray-600 self-start sm:self-auto">
                  {filteredBookings.length} Total Records
                </span>
              </div>

              {loading ? (
                <div className="p-12 text-center text-gray-400 font-bold text-sm">
                  Loading database ledger...
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="p-12 text-center text-gray-400 font-bold text-sm">
                  No bookings or inquiries found for {activeCategory}.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#fafafa] border-b border-[#eaeaea] text-gray-500 font-black uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4 sm:px-6">Customer</th>
                        <th className="py-3.5 px-4 sm:px-6">Item / Service</th>
                        <th className="py-3.5 px-4 sm:px-6">Date</th>
                        <th className="py-3.5 px-4 sm:px-6">Amount</th>
                        <th className="py-3.5 px-4 sm:px-6">Status</th>
                        <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eaeaea]">
                      {filteredBookings.map((b) => {
                        const isConfirmed = b.status === "Confirmed" || b.status === "Completed";
                        return (
                          <tr key={b.id} className="hover:bg-[#fafafa] transition-colors">
                            <td className="py-4 px-4 sm:px-6 font-bold">
                              <div className="text-sm font-black text-[#1c1c1c]">{b.user_name || "Guest Traveler"}</div>
                              <div className="text-xs text-gray-400 font-medium">{b.user_email || b.user_phone || "No direct contact"}</div>
                            </td>
                            <td className="py-4 px-4 sm:px-6">
                              <span className="font-bold text-[#1c1c1c]">{b.item_title}</span>
                            </td>
                            <td className="py-4 px-4 sm:px-6 text-gray-600 font-medium">
                              {b.booking_date || new Date(b.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4 sm:px-6 font-black text-[#1c1c1c]">
                              {b.amount ? (String(b.amount).startsWith("Rp") ? b.amount : formatIDR(b.amount)) : "IDR 0"}
                            </td>
                            <td className="py-4 px-4 sm:px-6">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider ${
                                isConfirmed 
                                  ? "bg-black text-white" 
                                  : "bg-gray-100 text-gray-700 border border-gray-200"
                              }`}>
                                {b.status || "Pending"}
                              </span>
                            </td>
                            <td className="py-4 px-4 sm:px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {!isConfirmed && (
                                  <button
                                    onClick={() => handleConfirmBooking(b.id)}
                                    className="px-3 py-1.5 bg-black text-white text-xs font-black rounded-lg hover:bg-neutral-800 transition-all cursor-pointer"
                                  >
                                    Confirm
                                  </button>
                                )}
                                <button
                                  onClick={() => setSelectedBooking(b)}
                                  className="p-1.5 text-gray-400 hover:text-black rounded-lg transition-colors cursor-pointer"
                                  title="View Details"
                                >
                                  <Eye size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: HOMEPAGE HERO & PARTNER CAMPAIGNS */}
        {/* ========================================================================= */}
        {activeSection === "hero" && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#1c1c1c]">Homepage Hero & Campaign Cards</h2>
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                  Configure your hero background video and the Scooter & Home Service Spa campaign cards.
                </p>
              </div>
              {heroSavedToast && (
                <div className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-extrabold shadow-sm animate-in fade-in">
                  <Check size={14} /> Hero & Campaign Settings Saved!
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Form Column */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Part 0: Header Promo Code */}
                <div className="bg-white rounded-2xl border border-[#eaeaea] p-6 space-y-5 shadow-xs">
                  <h3 className="text-base font-black text-[#1c1c1c] flex items-center gap-2">
                    <Tag size={18} /> Header Promo Code
                  </h3>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                      Promo Code Text
                    </label>
                    <input 
                      type="text" 
                      value={heroSettings.promoCode}
                      onChange={(e) => setHeroSettings({ ...heroSettings, promoCode: e.target.value.toUpperCase() })}
                      placeholder="BALI2026"
                      className="w-full px-4 py-3 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] outline-none"
                    />
                  </div>
                </div>

                {/* Part 1: Hero Media Background */}
                <div className="bg-white rounded-2xl border border-[#eaeaea] p-6 space-y-5 shadow-xs">
                  <h3 className="text-base font-black text-[#1c1c1c] flex items-center gap-2">
                    <Video size={18} /> Hero Background Media
                  </h3>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                      YouTube Showcase URL (Takes Priority)
                    </label>
                    <input 
                      type="text" 
                      value={heroSettings.campaignYoutubeLink}
                      onChange={(e) => setHeroSettings({ ...heroSettings, campaignYoutubeLink: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-3 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">OR DIRECT MP4</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                      Direct Video MP4 / WebM Link
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={heroSettings.campaignVideo}
                        onChange={(e) => setHeroSettings({ ...heroSettings, campaignVideo: e.target.value })}
                        placeholder="https://.../video.mp4"
                        className="flex-1 px-4 py-3 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] outline-none"
                      />
                      <label className="px-4 py-2 bg-black text-white rounded-xl text-xs font-black hover:bg-neutral-800 transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                        <Upload size={14} /> {isHeroUploading ? "Uploading..." : "Upload MP4"}
                        <input type="file" accept="video/*" onChange={handleHeroVideoUpload} className="hidden" disabled={isHeroUploading} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Part 2: Scooter Campaign Card */}
                <div className="bg-white rounded-2xl border border-[#eaeaea] p-6 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-[#1c1c1c] flex items-center gap-2">
                        <Globe size={18} /> Scooter Campaign Card
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        Card on Homepage Hero. Clicking card or button opens partner link in new tab.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCampaigns(prev => ({
                        ...prev,
                        scooter: { ...prev.scooter, active: !prev.scooter?.active }
                      }))}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${campaigns.scooter?.active !== false ? 'bg-black' : 'bg-gray-300'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${campaigns.scooter?.active !== false ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-500">Card Title</label>
                      <input 
                        type="text" 
                        value={campaigns.scooter?.title || ""} 
                        onChange={(e) => setCampaigns(prev => ({
                          ...prev,
                          scooter: { ...prev.scooter, title: e.target.value }
                        }))}
                        placeholder="Scooter Rental Bali"
                        className="w-full px-4 py-2.5 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-500">Badge Label</label>
                      <input 
                        type="text" 
                        value={campaigns.scooter?.badge || ""} 
                        onChange={(e) => setCampaigns(prev => ({
                          ...prev,
                          scooter: { ...prev.scooter, badge: e.target.value }
                        }))}
                        placeholder="Scooter Rental"
                        className="w-full px-4 py-2.5 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-500">Website Link (Opens in New Tab)</label>
                    <input 
                      type="text" 
                      value={campaigns.scooter?.externalUrl || ""} 
                      onChange={(e) => setCampaigns(prev => ({
                        ...prev,
                        scooter: { ...prev.scooter, externalUrl: e.target.value }
                      }))}
                      placeholder="https://thebikebali.com"
                      className="w-full px-4 py-2.5 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-500">Card Image</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={campaigns.scooter?.image || ""} 
                        onChange={(e) => setCampaigns(prev => ({
                          ...prev,
                          scooter: { ...prev.scooter, image: e.target.value }
                        }))}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 px-4 py-2.5 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] outline-none"
                      />
                      <label className="px-4 py-2.5 bg-black text-white rounded-xl text-xs font-black hover:bg-neutral-800 transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                        <Upload size={14} /> {isUploadingImage && uploadingFor === 'scooter' ? "Uploading..." : "Upload Image"}
                        <input type="file" accept="image/*" onChange={(e) => handleCampaignImageUpload(e, 'scooter')} className="hidden" disabled={isUploadingImage} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Part 3: Spa (Home Service) Campaign Card */}
                <div className="bg-white rounded-2xl border border-[#eaeaea] p-6 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-[#1c1c1c] flex items-center gap-2">
                        <Globe size={18} /> Spa Campaign Card (Home Service Only)
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        Card on Homepage Hero. Simple home service setup with new-tab website redirect.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCampaigns(prev => ({
                        ...prev,
                        spa: { ...prev.spa, active: !prev.spa?.active }
                      }))}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${campaigns.spa?.active !== false ? 'bg-black' : 'bg-gray-300'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${campaigns.spa?.active !== false ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-500">Card Title</label>
                      <input 
                        type="text" 
                        value={campaigns.spa?.title || ""} 
                        onChange={(e) => setCampaigns(prev => ({
                          ...prev,
                          spa: { ...prev.spa, title: e.target.value }
                        }))}
                        placeholder="Home Service Spa Bali"
                        className="w-full px-4 py-2.5 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-500">Badge Label</label>
                      <input 
                        type="text" 
                        value={campaigns.spa?.badge || ""} 
                        onChange={(e) => setCampaigns(prev => ({
                          ...prev,
                          spa: { ...prev.spa, badge: e.target.value }
                        }))}
                        placeholder="Home Service Spa"
                        className="w-full px-4 py-2.5 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-500">Website Link (Opens in New Tab)</label>
                    <input 
                      type="text" 
                      value={campaigns.spa?.externalUrl || ""} 
                      onChange={(e) => setCampaigns(prev => ({
                        ...prev,
                        spa: { ...prev.spa, externalUrl: e.target.value }
                      }))}
                      placeholder="https://ubudtranquilityspa.com"
                      className="w-full px-4 py-2.5 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-500">Card Image</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={campaigns.spa?.image || ""} 
                        onChange={(e) => setCampaigns(prev => ({
                          ...prev,
                          spa: { ...prev.spa, image: e.target.value }
                        }))}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 px-4 py-2.5 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] outline-none"
                      />
                      <label className="px-4 py-2.5 bg-black text-white rounded-xl text-xs font-black hover:bg-neutral-800 transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                        <Upload size={14} /> {isUploadingImage && uploadingFor === 'spa' ? "Uploading..." : "Upload Image"}
                        <input type="file" accept="image/*" onChange={(e) => handleCampaignImageUpload(e, 'spa')} className="hidden" disabled={isUploadingImage} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Flash Sale Configuration */}
                <div className="bg-white rounded-[24px] p-6 lg:p-8 border border-[#eaeaea] shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                      <Tag size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-[#1c1c1c]">Flash Sale Settings</h3>
                      <p className="text-xs font-semibold text-gray-500">Configure the limited time offer banner.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div>
                        <span className="font-bold text-sm block">Enable Flash Sale</span>
                        <span className="text-xs text-gray-500">Show the flash sale card on the homepage.</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={flashSale.active} onChange={(e) => setFlashSale({ ...flashSale, active: e.target.checked })} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Title</label>
                        <input type="text" value={flashSale.title} onChange={(e) => setFlashSale({ ...flashSale, title: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-black transition-colors" placeholder="e.g. Secret Bali Deal" />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Discount Text</label>
                        <input type="text" value={flashSale.discountText} onChange={(e) => setFlashSale({ ...flashSale, discountText: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-black transition-colors" placeholder="e.g. 20% OFF" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">End Time</label>
                        <input type="datetime-local" value={flashSale.endTime ? new Date(flashSale.endTime).toISOString().slice(0, 16) : ""} onChange={(e) => setFlashSale({ ...flashSale, endTime: new Date(e.target.value).toISOString() })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-black transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Link URL</label>
                        <input type="text" value={flashSale.linkUrl} onChange={(e) => setFlashSale({ ...flashSale, linkUrl: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-black transition-colors" placeholder="e.g. /tours" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Image</label>
                      <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
                        <input type="text" value={flashSale.image || ""} readOnly className="flex-1 bg-transparent px-2 text-xs font-medium text-gray-600 outline-none truncate" placeholder="No image uploaded" />
                        <label className="px-4 py-2.5 bg-black text-white rounded-xl text-xs font-black hover:bg-neutral-800 transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                          <Upload size={14} /> {isUploadingImage && uploadingFor === 'flashSale' ? "Uploading..." : "Upload Image"}
                          <input type="file" accept="image/*" onChange={(e) => handleCampaignImageUpload(e, 'flashSale')} className="hidden" disabled={isUploadingImage} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Master Save Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleHeroSave}
                    className="w-full bg-black text-white py-4 rounded-xl font-black text-sm hover:bg-neutral-800 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save size={16} /> Save Hero & Campaign Settings
                  </button>
                </div>

              </div>

              {/* Live Preview Column */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 h-fit pb-12">
                <span className="text-xs font-black uppercase tracking-wider text-gray-500 block">Campaign Cards Preview</span>
                
                {/* Scooter Card Preview */}
                <div className="bg-white rounded-2xl p-5 border border-[#eaeaea] shadow-xs space-y-3">
                  <div className="flex items-center justify-between text-xs font-black text-gray-500 uppercase">
                    <span>Scooter Card</span>
                    <span className={campaigns.scooter?.active !== false ? "text-black" : "text-gray-400"}>
                      {campaigns.scooter?.active !== false ? "Active" : "Disabled"}
                    </span>
                  </div>
                  {campaigns.scooter?.image && (
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 relative">
                      <img src={campaigns.scooter.image} alt="Scooter" className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-white/90 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-xs">
                        {campaigns.scooter?.badge || "Scooter Rental"}
                      </div>
                    </div>
                  )}
                  <div className="font-black text-base text-[#1c1c1c]">{campaigns.scooter?.title || "Scooter Rental Bali"}</div>
                  <a
                    href={campaigns.scooter?.externalUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-black text-white text-xs font-black rounded-lg flex items-center justify-center gap-1 hover:bg-neutral-800 transition-all"
                  >
                    Test Link ↗
                  </a>
                </div>

                {/* Spa Card Preview */}
                <div className="bg-white rounded-2xl p-5 border border-[#eaeaea] shadow-xs space-y-3">
                  <div className="flex items-center justify-between text-xs font-black text-gray-500 uppercase">
                    <span>Spa Card (Home Service)</span>
                    <span className={campaigns.spa?.active !== false ? "text-black" : "text-gray-400"}>
                      {campaigns.spa?.active !== false ? "Active" : "Disabled"}
                    </span>
                  </div>
                  {campaigns.spa?.image && (
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 relative">
                      <img src={campaigns.spa.image} alt="Spa" className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-white/90 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-xs">
                        {campaigns.spa?.badge || "Home Service Spa"}
                      </div>
                    </div>
                  )}
                  <div className="font-black text-base text-[#1c1c1c]">{campaigns.spa?.title || "Home Service Spa Bali"}</div>
                  <a
                    href={campaigns.spa?.externalUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-black text-white text-xs font-black rounded-lg flex items-center justify-center gap-1 hover:bg-neutral-800 transition-all"
                  >
                    Test Link ↗
                  </a>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: DISCOUNT CODES */}
        {/* ========================================================================= */}
        {activeSection === "discounts" && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#1c1c1c]">Manage Discount Codes</h2>
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                  Generate coupons, set percentage or fixed discounts, and track usage.
                </p>
              </div>
              {discountSavedToast && (
                <div className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-extrabold shadow-sm animate-in fade-in">
                  <Check size={14} /> Discount Code Saved!
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Create Code Form */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-[#eaeaea] p-6 space-y-5 h-fit shadow-xs">
                <h3 className="text-base font-black text-[#1c1c1c]">Create New Coupon</h3>
                
                <form onSubmit={handleAddDiscount} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-500">Promo Code</label>
                    <input 
                      type="text" 
                      value={newDiscount.code}
                      onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. BALI2026"
                      className="w-full px-4 py-3 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] uppercase outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-500">Type</label>
                      <select
                        value={newDiscount.type}
                        onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value })}
                        className="w-full px-4 py-3 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] outline-none"
                      >
                        <option value="percent">Percentage (%)</option>
                        <option value="fixed">Fixed IDR (Rp)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-500">Value</label>
                      <input 
                        type="number" 
                        value={newDiscount.value}
                        onChange={(e) => setNewDiscount({ ...newDiscount, value: e.target.value })}
                        placeholder={newDiscount.type === "percent" ? "10" : "50000"}
                        className="w-full px-4 py-3 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#fafafa] border border-[#eaeaea] rounded-xl cursor-pointer hover:border-gray-300 transition-colors" onClick={() => setNewDiscount({ ...newDiscount, isSecret: !newDiscount.isSecret })}>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-[#1c1c1c] block">Secret Promo</span>
                      <span className="text-[10px] text-gray-500 font-bold">Hide from main website list</span>
                    </div>
                    <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${newDiscount.isSecret ? 'bg-black' : 'bg-gray-300'}`}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${newDiscount.isSecret ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3.5 rounded-xl font-black text-sm hover:bg-neutral-800 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus size={16} /> Add Discount Code
                  </button>
                </form>
              </div>

              {/* Existing Codes List */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-[#eaeaea] p-6 space-y-4 shadow-xs">
                <h3 className="text-base font-black text-[#1c1c1c]">Active Discount Coupons ({discountCodes.length})</h3>

                {discountCodes.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 font-bold text-sm bg-[#fafafa] rounded-xl border border-dashed border-[#eaeaea]">
                    No active discount codes. Create your first coupon on the left.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {discountCodes.map((code, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-[#eaeaea] hover:border-gray-300 transition-all bg-[#fafafa]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                            {code.type === "percent" ? <Percent size={18} /> : <Tag size={18} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-sm text-[#1c1c1c] tracking-wider">{code.code}</span>
                              <button 
                                onClick={() => handleCopyCode(code.code)}
                                className="text-gray-400 hover:text-black transition-colors cursor-pointer"
                                title="Copy code"
                              >
                                {copiedCode === code.code ? <Check size={13} className="text-black" /> : <Copy size={13} />}
                              </button>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {code.isSecret && (
                                <span className="bg-[#1c1c1c] text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm">Secret</span>
                              )}
                              <span className="text-xs font-bold text-gray-500">
                                {code.type === "percent" ? `${code.value}% Discount` : `${formatIDR(code.value)} Off`}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleDiscountSecret(idx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                              code.isSecret ? "bg-[#1c1c1c] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {code.isSecret ? "Secret" : "Public"}
                          </button>
                          <button
                            onClick={() => handleToggleDiscount(idx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                              code.active ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {code.active ? "Active" : "Inactive"}
                          </button>
                          <button
                            onClick={() => handleDeleteDiscount(idx)}
                            className="p-2 text-gray-400 hover:text-black rounded-lg transition-colors cursor-pointer"
                            title="Delete code"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-[#eaeaea]">
              <div className="flex items-center justify-between pb-4 border-b border-[#eaeaea]">
                <div>
                  <h3 className="text-lg font-black text-[#1c1c1c]">Booking Information</h3>
                  <p className="text-xs text-gray-400 font-bold mt-0.5">Reference ID: #{selectedBooking.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="bg-[#fafafa] p-4 rounded-xl space-y-2 border border-[#eaeaea]">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-500">Customer Name:</span>
                    <span className="font-black text-[#1c1c1c]">{selectedBooking.user_name || "Guest"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-500">Email:</span>
                    <span className="font-black text-[#1c1c1c]">{selectedBooking.user_email || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-500">Phone / WhatsApp:</span>
                    <span className="font-black text-[#1c1c1c]">{selectedBooking.user_phone || "N/A"}</span>
                  </div>
                </div>

                <div className="bg-[#fafafa] p-4 rounded-xl space-y-2 border border-[#eaeaea]">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-500">Item Booked:</span>
                    <span className="font-black text-[#1c1c1c]">{selectedBooking.item_title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-500">Scheduled Date:</span>
                    <span className="font-black text-[#1c1c1c]">{selectedBooking.booking_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-500">Amount:</span>
                    <span className="font-black text-[#1c1c1c]">{selectedBooking.amount ? (String(selectedBooking.amount).startsWith("Rp") ? selectedBooking.amount : formatIDR(selectedBooking.amount)) : "IDR 0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-500">Status:</span>
                    <span className="font-black uppercase text-black">{selectedBooking.status || "Pending"}</span>
                  </div>
                </div>

                {selectedBooking.details && (
                  <div className="bg-[#fafafa] p-4 rounded-xl space-y-1 border border-[#eaeaea]">
                    <span className="font-bold text-gray-500 block mb-1">Additional Details:</span>
                    <pre className="text-[11px] font-mono text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(selectedBooking.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                {selectedBooking.status !== "Confirmed" && (
                  <button
                    onClick={() => handleConfirmBooking(selectedBooking.id)}
                    className="flex-1 bg-black text-white py-3 rounded-xl font-black text-xs hover:bg-neutral-800 transition-all shadow-sm cursor-pointer"
                  >
                    Confirm Booking
                  </button>
                )}
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-black text-xs hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
