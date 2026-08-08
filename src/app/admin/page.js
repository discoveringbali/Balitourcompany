"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Users, DollarSign, Calendar, MapPin, TrendingUp, ChevronRight, Activity, 
  ExternalLink, Edit3, Globe, CheckCircle2, ArrowUpRight, Plus, Trash2, 
  Tag, Percent, Check, AlertCircle, Copy, Upload, Image as ImageIcon, Video, Save, Clock, Eye, Sparkles
} from "lucide-react";
import { getCampaignSettings, updateSingleCampaign, DEFAULT_CAMPAIGNS } from "@/lib/campaigns";
import { getDiscountCodes, saveDiscountCodes } from "@/lib/discounts";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

export default function AdminDashboard() {
  // Main Section Navigation: 'overview' | 'campaigns' | 'discounts' | 'hero'
  const [activeSection, setActiveSection] = useState("overview");

  // Overview Data
  const [activeCategory, setActiveCategory] = useState("Tour");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Campaigns Data (Dedicated Private Section)
  const [campaigns, setCampaigns] = useState(DEFAULT_CAMPAIGNS);
  const [selectedCampaignTab, setSelectedCampaignTab] = useState("scooter");
  const [campaignFormData, setCampaignFormData] = useState({
    title: "",
    subtitle: "",
    badge: "",
    externalUrl: "",
    image: "",
    active: true
  });
  const [campaignSavedToast, setCampaignSavedToast] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Discounts Data (Dedicated Private Section)
  const [discountCodes, setDiscountCodes] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [newDiscount, setNewDiscount] = useState({
    code: "",
    type: "percent",
    value: 10,
    active: true
  });
  const [discountSavedToast, setDiscountSavedToast] = useState(false);

  // Hero Settings Data (Dedicated Private Section)
  const [heroSettings, setHeroSettings] = useState({
    campaignVideo: "",
    campaignYoutubeLink: "",
    campaignRecommendation: "",
    campaignIgLink: "",
    campaignRecommendation2: "",
    campaignIgLink2: ""
  });
  const [isHeroUploading, setIsHeroUploading] = useState(false);
  const [heroSavedToast, setHeroSavedToast] = useState(false);

  // Initialize
  useEffect(() => {
    fetchBookings();
    loadCampaigns();
    loadDiscounts();
    loadHeroSettings();

    const handleCampaignsChange = (e) => {
      if (e.detail) {
        setCampaigns(e.detail);
      } else {
        loadCampaigns();
      }
    };

    window.addEventListener('balance_island_campaigns_changed', handleCampaignsChange);
    return () => window.removeEventListener('balance_island_campaigns_changed', handleCampaignsChange);
  }, []);

  // Update Campaign Form when tab changes
  useEffect(() => {
    const active = campaigns[selectedCampaignTab] || DEFAULT_CAMPAIGNS[selectedCampaignTab];
    if (active) {
      setCampaignFormData({
        title: active.title || "",
        subtitle: active.subtitle || "",
        badge: active.badge || "",
        externalUrl: active.externalUrl || "",
        image: active.image || "",
        active: active.active !== undefined ? active.active : true
      });
    }
  }, [selectedCampaignTab, campaigns]);

  const loadCampaigns = () => {
    const loaded = getCampaignSettings();
    setCampaigns(loaded);
  };

  const loadDiscounts = () => {
    setDiscountCodes(getDiscountCodes());
  };

  const loadHeroSettings = async () => {
    try {
      const { data, error } = await supabase.from('homepage_settings').select('*').eq('id', 1).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setHeroSettings({
          campaignVideo: data.campaign_video || "",
          campaignYoutubeLink: data.campaign_youtube_link || "",
          campaignRecommendation: data.campaign_recommendation || "",
          campaignIgLink: data.campaign_ig_link || "",
          campaignRecommendation2: data.campaign_recommendation_2 || "",
          campaignIgLink2: data.campaign_ig_link_2 || ""
        });
      }
    } catch (err) {
      console.error("Error loading hero settings:", err.message);
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

  // Campaign Save Handler
  const handleSaveCampaign = (e) => {
    e.preventDefault();
    let formattedUrl = campaignFormData.externalUrl.trim();
    if (formattedUrl && !formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }

    const updated = {
      ...campaignFormData,
      externalUrl: formattedUrl
    };

    updateSingleCampaign(selectedCampaignTab, updated);
    setCampaigns(prev => ({ ...prev, [selectedCampaignTab]: { ...prev[selectedCampaignTab], ...updated } }));
    setCampaignSavedToast(true);
    setTimeout(() => setCampaignSavedToast(false), 3000);
  };

  // Image Upload for Campaign
  const handleCampaignImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

        setCampaignFormData(prev => ({ ...prev, image: dataUrl }));
        setIsUploadingImage(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
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
      active: true
    };
    const updated = [entry, ...discountCodes];
    setDiscountCodes(updated);
    saveDiscountCodes(updated);
    setNewDiscount({ code: "", type: "percent", value: 10, active: true });
    setDiscountSavedToast(true);
    setTimeout(() => setDiscountSavedToast(false), 3000);
  };

  const handleDeleteDiscount = (idx) => {
    const updated = discountCodes.filter((_, i) => i !== idx);
    setDiscountCodes(updated);
    saveDiscountCodes(updated);
  };

  const handleToggleDiscount = (idx) => {
    const updated = [...discountCodes];
    updated[idx].active = !updated[idx].active;
    setDiscountCodes(updated);
    saveDiscountCodes(updated);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Hero Actions
  const handleHeroSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        id: 1,
        campaign_video: heroSettings.campaignVideo,
        campaign_youtube_link: heroSettings.campaignYoutubeLink,
        campaign_recommendation: heroSettings.campaignRecommendation,
        campaign_ig_link: heroSettings.campaignIgLink,
        campaign_recommendation_2: heroSettings.campaignRecommendation2,
        campaign_ig_link_2: heroSettings.campaignIgLink2
      };
      const { error } = await supabase.from('homepage_settings').upsert(payload, { onConflict: 'id' });
      if (error) throw error;
      setHeroSavedToast(true);
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
      { label: "Gross Revenue", value: revenue > 0 ? formatIDR(revenue) : "Rp 0", icon: DollarSign },
      { label: "Confirmed Bookings", value: confirmed.length.toString(), icon: Calendar },
      { label: "Total Participants", value: participants.toString(), icon: Users },
      { label: "Total Inquiries", value: categoryBookings.length.toString(), icon: MapPin },
    ];
  };

  const currentBookings = allBookings.filter(b => 
     activeCategory === "Tour" ? (b.category === "Tour" || !b.category) : b.category === activeCategory
  );
  const currentStats = getStats(activeCategory);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans text-[#1c1c1c]">
      
      {/* Top Header & Private Section Selector */}
      <div className="flex flex-col gap-4 border-b border-[#eaeaea] pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1c1c1c]">Admin Workspace</h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              Select a dedicated private section to manage your business operations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href="/admin/listings" 
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-black text-white hover:bg-neutral-800 transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              <Plus size={15} /> Add Tour / Product
            </Link>
          </div>
        </div>

        {/* Private Section Switcher Pills (Each has its OWN PRIVATE VIEW) */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pt-2">
          {[
            { id: "overview", label: "Dashboard Overview", icon: Activity },
            { id: "campaigns", label: "Partner Campaigns", icon: Globe },
            { id: "discounts", label: "Discount Codes", icon: Tag },
            { id: "hero", label: "Homepage Hero", icon: Video }
          ].map((sec) => {
            const Icon = sec.icon;
            const isSelected = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
                  isSelected 
                    ? "bg-black text-white shadow-sm" 
                    : "bg-white text-gray-600 hover:text-black border border-[#eaeaea] hover:border-gray-300"
                }`}
              >
                <Icon size={16} strokeWidth={isSelected ? 2.5 : 2} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PRIVATE SECTION 1: DASHBOARD OVERVIEW */}
      {/* ========================================================================= */}
      {activeSection === "overview" && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
          
          {/* Category Tabs: Tour vs Activities */}
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveCategory("Tour")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${activeCategory === "Tour" ? "bg-black text-white" : "bg-white text-gray-500 border border-[#eaeaea] hover:bg-gray-50"}`}
            >
              Tours Portfolio
            </button>
            <button 
              onClick={() => setActiveCategory("Activities")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${activeCategory === "Activities" ? "bg-black text-white" : "bg-white text-gray-500 border border-[#eaeaea] hover:bg-gray-50"}`}
            >
              Activities Portfolio
            </button>
          </div>

          {/* Minimalist Stats Grid */}
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
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#1c1c1c] tracking-tight">{stat.value}</h3>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Inquiries & Bookings List */}
          <div className="bg-white rounded-2xl border border-[#eaeaea] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-black text-[#1c1c1c]">Recent {activeCategory} Inquiries</h3>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Real-time inquiries and booking reservations from customers</p>
              </div>
              <Link href="/admin/bookings" className="text-xs font-extrabold text-black hover:underline flex items-center gap-1">
                View All Bookings <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-gray-400 font-bold text-sm">Loading bookings...</div>
            ) : currentBookings.length === 0 ? (
              <div className="py-12 text-center text-gray-400 font-bold text-sm">No bookings recorded for this category yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#eaeaea] text-gray-400 uppercase text-[10px] font-extrabold tracking-wider">
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Service</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eaeaea]">
                    {currentBookings.slice(0, 8).map((b) => (
                      <tr key={b.id} className="hover:bg-[#fafafa] transition-colors">
                        <td className="py-3.5 font-extrabold text-[#1c1c1c]">
                          <div>{b.customer_name || "Guest Customer"}</div>
                          <div className="text-[11px] font-medium text-gray-400">{b.contact_info || "No phone"}</div>
                        </td>
                        <td className="py-3.5 font-bold text-gray-600 max-w-[200px] truncate">
                          {b.service_name || "Custom Tour"}
                        </td>
                        <td className="py-3.5 font-semibold text-gray-500">
                          {b.booking_date || "Flexible"}
                        </td>
                        <td className="py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            b.status === "Confirmed" ? "bg-black text-white" : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}>
                            {b.status || "Pending"}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          {b.status !== "Confirmed" && (
                            <button
                              onClick={() => handleConfirmBooking(b.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-black bg-black text-white hover:bg-neutral-800 transition-all active:scale-95"
                            >
                              Confirm
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* PRIVATE SECTION 2: PARTNER CAMPAIGNS (SCOOTER & SPA) */}
      {/* ========================================================================= */}
      {activeSection === "campaigns" && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1c1c1c]">Partner Campaigns Integration</h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                Manage your dedicated Scooter and Spa partner profile pages and new-tab booking redirects.
              </p>
            </div>
            {campaignSavedToast && (
              <div className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-extrabold shadow-sm animate-in fade-in">
                <Check size={14} /> Campaign Settings Saved!
              </div>
            )}
          </div>

          {/* Sub Tab Switcher: Scooter vs Spa */}
          <div className="flex gap-2 border-b border-[#eaeaea] pb-4">
            <button
              onClick={() => setSelectedCampaignTab("scooter")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                selectedCampaignTab === "scooter" 
                  ? "bg-black text-white" 
                  : "bg-white text-gray-600 border border-[#eaeaea] hover:bg-gray-50"
              }`}
            >
              Scooter Partner Integration
            </button>
            <button
              onClick={() => setSelectedCampaignTab("spa")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                selectedCampaignTab === "spa" 
                  ? "bg-black text-white" 
                  : "bg-white text-gray-600 border border-[#eaeaea] hover:bg-gray-50"
              }`}
            >
              Spa & Wellness Partner Integration
            </button>
          </div>

          {/* Partner Editor Form & Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form Column */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#eaeaea] p-6 space-y-5">
              
              {/* Active Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#fafafa] border border-[#eaeaea]">
                <div>
                  <h4 className="text-sm font-black text-[#1c1c1c]">Live Campaign Status</h4>
                  <p className="text-xs text-gray-500 font-medium">When active, users can view and book via the dedicated page.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCampaignFormData(prev => ({ ...prev, active: !prev.active }))}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${campaignFormData.active ? 'bg-black' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${campaignFormData.active ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Destination External URL */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Target Booking URL (External Website)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Globe size={16} />
                  </div>
                  <input 
                    type="text"
                    value={campaignFormData.externalUrl}
                    onChange={(e) => setCampaignFormData(prev => ({ ...prev, externalUrl: e.target.value }))}
                    placeholder={selectedCampaignTab === 'scooter' ? "https://thebikebali.com" : "https://ubudtranquilityspa.com"}
                    className="w-full pl-10 pr-4 py-3 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] outline-none transition-all"
                  />
                </div>
                <p className="text-[11px] text-gray-400 font-medium">
                  When customers click &quot;Book Online&quot;, they will be redirected to this address in a new browser tab.
                </p>
              </div>

              {/* Headline Title */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Company / Brand Title
                </label>
                <input 
                  type="text"
                  value={campaignFormData.title}
                  onChange={(e) => setCampaignFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={selectedCampaignTab === 'scooter' ? "The Bike Bali" : "Ubud Tranquility Spa"}
                  className="w-full px-4 py-3 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] outline-none transition-all"
                />
              </div>

              {/* Subtitle / Description */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Short Tagline (1-2 Sentences)
                </label>
                <textarea 
                  rows={2}
                  value={campaignFormData.subtitle}
                  onChange={(e) => setCampaignFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Clean and concise company summary..."
                  className="w-full px-4 py-3 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-medium text-[#1c1c1c] outline-none transition-all resize-none"
                />
              </div>

              {/* Badge Label */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Badge Label
                </label>
                <input 
                  type="text"
                  value={campaignFormData.badge}
                  onChange={(e) => setCampaignFormData(prev => ({ ...prev, badge: e.target.value }))}
                  placeholder="Official Partner"
                  className="w-full px-4 py-3 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] outline-none transition-all"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Cover Image
                </label>
                <div className="flex gap-3 items-center">
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl text-xs font-black hover:bg-neutral-800 active:scale-95 transition-all shadow-xs cursor-pointer"
                  >
                    <Upload size={14} />
                    {isUploadingImage ? "Optimizing..." : "Upload New Image"}
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleCampaignImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  {campaignFormData.image && (
                    <button 
                      type="button" 
                      onClick={() => setCampaignFormData(prev => ({ ...prev, image: "" }))}
                      className="text-xs text-gray-400 hover:text-black font-bold flex items-center gap-1"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleSaveCampaign}
                  className="flex-1 bg-black text-white py-3.5 rounded-xl font-black text-sm hover:bg-neutral-800 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save size={16} /> Save Campaign Settings
                </button>
              </div>

            </div>

            {/* Live Preview Column */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-gray-500 block">Live Preview</span>
              
              <div className="bg-white rounded-3xl p-6 border border-[#eaeaea] shadow-md space-y-5">
                {campaignFormData.image && (
                  <div className="w-full h-44 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 relative">
                    <img src={campaignFormData.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute bottom-3 left-3 bg-black/80 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded">
                      {campaignFormData.badge || "Official Partner"}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-black text-[#1c1c1c]">{campaignFormData.title || "Company Name"}</h3>
                  <p className="text-xs font-medium text-gray-500 mt-1">{campaignFormData.subtitle || "Company summary and value proposition..."}</p>
                </div>

                <div className="pt-2">
                  <a
                    href={campaignFormData.externalUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-black text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 text-xs no-underline hover:bg-neutral-800 transition-all shadow-xs"
                  >
                    <span>Test Partner Link ↗</span>
                  </a>
                </div>

                <div className="pt-2 border-t border-[#eaeaea]">
                  <Link 
                    href={selectedCampaignTab === 'scooter' ? '/scooter' : '/spa'} 
                    target="_blank" 
                    className="text-xs font-extrabold text-black hover:underline flex items-center justify-center gap-1.5"
                  >
                    <Eye size={14} /> Open Dedicated /{selectedCampaignTab} Page ↗
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* PRIVATE SECTION 3: DISCOUNT CODES */}
      {/* ========================================================================= */}
      {activeSection === "discounts" && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1c1c1c]">Discount & Promo Codes</h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                Create promotional coupons and voucher codes for customer checkout.
              </p>
            </div>
            {discountSavedToast && (
              <div className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-extrabold shadow-sm animate-in fade-in">
                <Check size={14} /> Promo Codes Updated!
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Create Code Form */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#eaeaea] p-6 space-y-4">
              <h3 className="text-base font-black text-[#1c1c1c]">Create New Discount Code</h3>
              
              <form onSubmit={handleAddDiscount} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-gray-500">Coupon Code</label>
                  <input 
                    type="text" 
                    value={newDiscount.code} 
                    onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. BALISUMMER20" 
                    className="w-full px-4 py-3 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-black text-[#1c1c1c] uppercase outline-none transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-500">Discount Type</label>
                    <select 
                      value={newDiscount.type} 
                      onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value })}
                      className="w-full px-3 py-3 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] outline-none"
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
                      className="w-full px-4 py-3 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] outline-none"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-black text-white py-3.5 rounded-xl font-black text-sm hover:bg-neutral-800 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Plus size={16} /> Add Promo Code
                </button>
              </form>
            </div>

            {/* Active Codes List */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#eaeaea] p-6 space-y-4">
              <h3 className="text-base font-black text-[#1c1c1c]">Active Discount Codes ({discountCodes.length})</h3>
              
              {discountCodes.length === 0 ? (
                <div className="py-12 text-center text-gray-400 font-bold text-sm">No discount codes created yet.</div>
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
                              className="text-gray-400 hover:text-black transition-colors"
                              title="Copy code"
                            >
                              {copiedCode === code.code ? <Check size={13} className="text-black" /> : <Copy size={13} />}
                            </button>
                          </div>
                          <span className="text-xs font-bold text-gray-500">
                            {code.type === "percent" ? `${code.value}% Discount` : `${formatIDR(code.value)} Off`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleDiscount(idx)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                            code.active ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {code.active ? "Active" : "Inactive"}
                        </button>
                        <button
                          onClick={() => handleDeleteDiscount(idx)}
                          className="p-2 text-gray-400 hover:text-black rounded-lg transition-colors"
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

      {/* ========================================================================= */}
      {/* PRIVATE SECTION 4: HOMEPAGE HERO MEDIA */}
      {/* ========================================================================= */}
      {activeSection === "hero" && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1c1c1c]">Homepage Hero Banners & Video</h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                Customize the main visual background and recommendations on your landing page.
              </p>
            </div>
            {heroSavedToast && (
              <div className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-extrabold shadow-sm animate-in fade-in">
                <Check size={14} /> Hero Settings Saved!
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-[#eaeaea] p-6 space-y-6 max-w-3xl">
            <form onSubmit={handleHeroSave} className="space-y-5">
              
              {/* Campaign Video Upload / URL */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Hero Video MP4 / WebM Link
                </label>
                <input 
                  type="text" 
                  value={heroSettings.campaignVideo}
                  onChange={(e) => setHeroSettings({ ...heroSettings, campaignVideo: e.target.value })}
                  placeholder="https://.../video.mp4"
                  className="w-full px-4 py-3 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] outline-none"
                />
                <div className="flex gap-2 items-center mt-2">
                  <label className="px-4 py-2 bg-black text-white rounded-xl text-xs font-black hover:bg-neutral-800 transition-all cursor-pointer inline-flex items-center gap-1.5">
                    <Upload size={14} /> {isHeroUploading ? "Uploading Video..." : "Upload MP4 Video"}
                    <input type="file" accept="video/*" onChange={handleHeroVideoUpload} className="hidden" disabled={isHeroUploading} />
                  </label>
                </div>
              </div>

              {/* YouTube Link */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  YouTube Showcase URL
                </label>
                <input 
                  type="text" 
                  value={heroSettings.campaignYoutubeLink}
                  onChange={(e) => setHeroSettings({ ...heroSettings, campaignYoutubeLink: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] outline-none"
                />
              </div>

              {/* Influencer Recommendation 1 */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Featured Recommendation Headline #1
                </label>
                <input 
                  type="text" 
                  value={heroSettings.campaignRecommendation}
                  onChange={(e) => setHeroSettings({ ...heroSettings, campaignRecommendation: e.target.value })}
                  placeholder="e.g. Recommended by Top Bali Travelers"
                  className="w-full px-4 py-3 bg-[#fafafa] border border-[#eaeaea] focus:border-black focus:bg-white rounded-xl text-sm font-bold text-[#1c1c1c] outline-none"
                />
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3.5 rounded-xl font-black text-sm hover:bg-neutral-800 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save size={16} /> Save Hero Settings
                </button>
              </div>

            </form>
          </div>

        </div>
      )}

    </div>
  );
}
