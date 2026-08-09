"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  X, ArrowLeft, Save, Image as ImageIcon, MapPin, DollarSign, Clock, Tag, Plus, Target, Star, Trash2,
  Compass, Map, Camera, Footprints, Droplet, Sparkles, Heart, Activity,
  Bike, Zap, Shield, Car, Navigation, Users, SunMedium, CheckCircle2, Calendar, ChevronDown, Info, Layers, Check
} from "lucide-react";

export default function EditListingModal({ item, activeTab, onClose, onSave }) {
  // Core Info
  const [formData, setFormData] = useState({
    title: item.title || "",
    location: item.location || "",
    duration: item.duration || "",
    category: item.category || "",
    status: item.status || "Active",
    image: item.image || "",
    company: item.company || "",
    spaSetting: item.spaSetting || "Real Spa",
    serviceType: item.service || activeTab
  });

  const [pins, setPins] = useState({
    isCampaignPinned: item.isCampaignPinned || false,
    campaignTitle: item.campaignTitle || "",
    campaignDescription: item.campaignDescription || "",
    campaignLabel: item.campaignLabel || "",
    isBestTripPinned: item.isBestTripPinned || false
  });

  const [itinerary, setItinerary] = useState(item.itinerary || [{ title: '', description: '' }]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Rich Text Fields
  const [details, setDetails] = useState({
    description: item.description || "",
    highlights: item.highlights || "",
    included: item.included || "",
    excluded: item.excluded || ""
  });

  const [gallery, setGallery] = useState(item.gallery || ["", "", "", "", "", "", "", ""]);

  const categoryOptions = {
    Tour: [
      { name: "Island Tour", icon: Compass },
      { name: "Trekking", icon: Footprints },
      { name: "Show & Culture", icon: Map },
      { name: "Nature", icon: SunMedium },
      { name: "Sightseeing", icon: Camera },
      { name: "Adventure", icon: Target }
    ],
    Activities: [
      { name: "Water Sports", icon: Droplet },
      { name: "Wellness", icon: Heart },
      { name: "Cultural", icon: Map },
      { name: "Extreme", icon: Zap }
    ],
    Transport: [
      { name: "Transfer", icon: Navigation },
      { name: "Private Booking", icon: Car },
      { name: "Hourly Rental", icon: Clock },
      { name: "Group Van", icon: Users }
    ]
  };

  /* -- Pricing Logic States -- */
  // Tour & Activity Pricing
  const [tourPricingType, setTourPricingType] = useState(item.pricingType || "Per Person"); // 'Per Person' or 'Per Group'
  const [groupPricingMode, setGroupPricingMode] = useState(item.groupPricingMode || (item.groupTiers && item.groupTiers.length > 0 ? "tiered" : "flat")); // 'tiered' or 'flat'
  const [groupPrice, setGroupPrice] = useState(item.groupPrice || item.price || "");
  const [minGroupPax, setMinGroupPax] = useState(item.minGroupPax || 1);
  const [maxGroupPax, setMaxGroupPax] = useState(item.maxGroupPax || 12);
  
  // Group Tiers: specific price per group size (e.g. 1-2 pax -> 650k, 3-4 pax -> 850k, etc.)
  const [groupTiers, setGroupTiers] = useState(
    item.groupTiers && item.groupTiers.length > 0
      ? item.groupTiers
      : [
          { minPax: 1, maxPax: 2, price: item.price || "", label: "Small Group (1-2 Pax)" },
          { minPax: 3, maxPax: 4, price: "", label: "Medium Group (3-4 Pax)" },
          { minPax: 5, maxPax: 7, price: "", label: "Standard Van (5-7 Pax)" }
        ]
  );

  // Per Person Tiers
  const [tourTiers, setTourTiers] = useState(item.tourTiers || [{ pax: 1, price: item.price || "" }]);
  
  // All Inclusive Package
  const [hasAllInclusive, setHasAllInclusive] = useState(!!item.allInclusiveSurcharge || (item.allInclusiveTiers && item.allInclusiveTiers.length > 0));
  const [allInclusiveTiers, setAllInclusiveTiers] = useState(item.allInclusiveTiers || [{ pax: 1, price: item.allInclusiveSurcharge || "" }]);
  const [inclusiveTitle, setInclusiveTitle] = useState(item.inclusiveTitle || "");
  const [inclusiveIncluded, setInclusiveIncluded] = useState(item.inclusiveIncluded || "");
  const [inclusiveExcluded, setInclusiveExcluded] = useState(item.inclusiveExcluded || "");

  // Scooter Pricing
  const [scooterPrices, setScooterPrices] = useState({
    daily: item.dailyPrice || item.price || "",
    weekly: item.weeklyPrice || "",
    monthly: item.monthlyPrice || ""
  });

  // Spa Pricing
  const [spaPrices, setSpaPrices] = useState({
    min60: item.min60 || "",
    min90: item.min90 || "",
    min120: item.min120 || ""
  });

  // Transport Pricing
  const [transportPricePerKm, setTransportPricePerKm] = useState(item.pricePerKm || "");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleDetailChange = (e) => setDetails({ ...details, [e.target.name]: e.target.value });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `cover_images/${fileName}`;

      const { error } = await supabase.storage
        .from('discovering_bali_images')
        .upload(filePath, file);

      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('discovering_bali_images').getPublicUrl(filePath);

      setFormData({ ...formData, image: publicUrl });
    } catch (err) {
      if (err.message.includes('Bucket not found')) {
        alert("Action Required: Please create a public storage bucket named 'discovering_bali_images' in your Supabase dashboard to enable image uploads.");
      } else {
        alert("Error uploading cover image: " + err.message);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    setIsUploading(true);
    try {
            const newUrls = await Promise.all(files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'discovering_bali_images');
        formData.append('filePath', filePath);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        });
        
        const data = await res.json();
        
        if (!res.ok) {
           throw new Error(data.error || 'Failed to upload image via server');
        }
        
        return data.url;
      }));

      const updatedGallery = [...gallery];
      let newUrlsQueue = [...newUrls];
      
      for(let i = 0; i < updatedGallery.length; i++) {
        if(updatedGallery[i] === "" && newUrlsQueue.length > 0) {
           updatedGallery[i] = newUrlsQueue.shift();
        }
      }
      while(newUrlsQueue.length > 0 && updatedGallery.length < 8) {
         updatedGallery.push(newUrlsQueue.shift());
      }
      setGallery(updatedGallery);
    } catch (err) {
       if (err.message.includes('Bucket not found')) {
         alert("Action Required: Please create a public storage bucket named 'discovering_bali_images' in your Supabase dashboard to enable image uploads.");
       } else {
         alert("Error uploading gallery: " + err.message);
       }
    } finally {
       setIsUploading(false);
    }
  };

  const handleAddGroupTier = () => {
    const lastTier = groupTiers[groupTiers.length - 1];
    const newMin = lastTier ? Number(lastTier.maxPax || lastTier.minPax || 1) + 1 : 1;
    const newMax = newMin + 2;
    setGroupTiers([
      ...groupTiers,
      {
        minPax: newMin,
        maxPax: newMax,
        price: "",
        label: `Group (${newMin}-${newMax} Pax)`
      }
    ]);
  };

  const handleAutoSaveAndClose = () => {
    const isNew = !item.id || item.id.toString().startsWith("temp-");
    handleSave(isNew ? "Draft" : null);
    onClose();
  };

  const handleSave = (forcedStatus = null) => {
    const finalItem = {
      ...item,
      ...formData,
      status: typeof forcedStatus === 'string' ? forcedStatus : formData.status,
      service: formData.serviceType || activeTab,
      ...details,
      ...pins,
      itinerary: itinerary.filter(it => it.title?.trim() || it.description?.trim()),
      gallery: gallery.filter(link => link && link.trim() !== "")
    };

    if (activeTab === "Scooter") {
      finalItem.dailyPrice = scooterPrices.daily;
      finalItem.weeklyPrice = scooterPrices.weekly;
      finalItem.monthlyPrice = scooterPrices.monthly;
      finalItem.price = scooterPrices.daily;
    } else if (activeTab === "Spa") {
      finalItem.min60 = spaPrices.min60;
      finalItem.min90 = spaPrices.min90;
      finalItem.min120 = spaPrices.min120;
      finalItem.price = spaPrices.min60 || spaPrices.min90;
    } else if (activeTab === "Transport") {
      finalItem.pricePerKm = transportPricePerKm;
      finalItem.price = transportPricePerKm;
    } else {
      finalItem.pricingType = tourPricingType;
      
      if (tourPricingType === "Per Group") {
        finalItem.groupPricingMode = groupPricingMode;
        finalItem.groupPrice = groupPrice;
        finalItem.minGroupPax = parseInt(minGroupPax) || 1;
        finalItem.maxGroupPax = parseInt(maxGroupPax) || 12;
        
        if (groupPricingMode === "tiered") {
          const validGroupTiers = groupTiers.filter(t => t.price && t.price.toString().trim() !== "");
          finalItem.groupTiers = validGroupTiers;
          finalItem.price = validGroupTiers[0]?.price || groupPrice || "";
        } else {
          finalItem.groupTiers = null;
          finalItem.price = groupPrice || "";
        }
      } else {
        finalItem.tourTiers = tourTiers;
        const validTier = tourTiers.find(t => t.price && t.price.toString().trim() !== "");
        finalItem.price = validTier ? validTier.price : "";
        finalItem.groupTiers = null;
      }

      finalItem.hasAllInclusive = hasAllInclusive;
      if (hasAllInclusive) {
        finalItem.allInclusiveTiers = allInclusiveTiers;
        finalItem.allInclusiveSurcharge = allInclusiveTiers[0]?.price || "";
      } else {
        finalItem.allInclusiveTiers = null;
        finalItem.allInclusiveSurcharge = "";
      }
      finalItem.inclusiveTitle = inclusiveTitle;
      finalItem.inclusiveIncluded = inclusiveIncluded;
      finalItem.inclusiveExcluded = inclusiveExcluded;
    }

    onSave(finalItem);
  };

  const isEditing = item.id && !item.id.toString().startsWith("temp-");

  return (
    <div className="fixed inset-0 z-[200] bg-[#f8f9fb] flex flex-col overflow-hidden text-neutral-900 animate-in fade-in duration-200">
      
      {/* Sticky Full-Screen Top Header Bar */}
      <header className="h-16 sm:h-20 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-8 flex items-center justify-between z-30 shrink-0 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button 
            onClick={handleAutoSaveAndClose} 
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-colors shrink-0"
            title="Save and close"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>
          <div className="h-6 w-px bg-gray-200 hidden sm:block" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-md">
                {activeTab} Listing
              </span>
              {isEditing && (
                <span className="text-[10px] sm:text-[11px] font-bold text-gray-400">
                  ID: #{item.id}
                </span>
              )}
            </div>
            <h1 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight truncate mt-0.5">
              {formData.title || (isEditing ? `Edit ${activeTab} Listing` : `Create New ${activeTab} Product`)}
            </h1>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center bg-gray-100 p-1 rounded-xl mr-2">
            <button 
              type="button"
              onClick={() => setFormData({ ...formData, status: "Active" })}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${formData.status === "Active" ? "bg-black text-white shadow-sm" : "text-gray-500 hover:text-black"}`}
            >
              Active
            </button>
            <button 
              type="button"
              onClick={() => setFormData({ ...formData, status: "Draft" })}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${formData.status === "Draft" ? "bg-black text-white shadow-sm" : "text-gray-500 hover:text-black"}`}
            >
              Draft
            </button>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            className="hidden sm:inline-flex px-4 py-2 text-xs font-bold text-gray-500 hover:text-black bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Discard
          </button>
          
          <button 
            type="button"
            onClick={handleSave} 
            className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm text-white bg-black hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
          >
            <Check size={16} strokeWidth={3} />
            <span>Publish Configuration</span>
          </button>
        </div>
      </header>

      {/* Main Full-Screen Scrollable Canvas */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 scroll-smooth">
        <div className="max-w-5xl mx-auto w-full space-y-8 pb-28">

          {/* CARD 1: HERO CAMPAIGN & PROMOTIONS */}
          <section className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200/90 shadow-sm">
            <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-6">
              <div>
                <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <Target size={18} className="text-black" /> Hero Campaign & Spotlight
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Promote this product on the massive cinematic homepage hero slider.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campaign Slider Pin */}
              <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-neutral-900 block">Pin to Hero Slider</span>
                    <span className="text-[11px] text-gray-500 font-medium">Display in the homepage carousel</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPins({ ...pins, isCampaignPinned: !pins.isCampaignPinned })}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${pins.isCampaignPinned ? 'bg-black' : 'bg-gray-200'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${pins.isCampaignPinned ? 'translate-x-6' : ''}`} />
                  </button>
                </div>

                {pins.isCampaignPinned && (
                  <div className="space-y-3 pt-2 animate-in fade-in">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1 block">Custom Campaign Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. VIP Private Island Tour" 
                        value={pins.campaignTitle} 
                        onChange={(e) => setPins({ ...pins, campaignTitle: e.target.value })} 
                        className="w-full bg-white text-xs font-bold text-neutral-900 rounded-xl px-3 py-2.5 border border-gray-200 focus:border-black outline-none" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1 block">Campaign Subtitle</label>
                      <textarea
                        rows={2}
                        placeholder="Short compelling description..."
                        value={pins.campaignDescription}
                        onChange={(e) => setPins({ ...pins, campaignDescription: e.target.value })}
                        className="w-full bg-white text-xs font-medium text-neutral-900 rounded-xl px-3 py-2 border border-gray-200 focus:border-black outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1 block">Campaign Badge</label>
                      <select
                        value={pins.campaignLabel}
                        onChange={(e) => setPins({ ...pins, campaignLabel: e.target.value })}
                        className="w-full bg-white text-xs font-bold text-neutral-900 rounded-xl px-3 py-2 border border-gray-200 focus:border-black outline-none"
                      >
                        <option value="">No Label</option>
                        <option value="Exclusive">Exclusive</option>
                        <option value="Best Deal">Best Deal</option>
                        <option value="Limited Time">Limited Time</option>
                        <option value="20% OFF">20% OFF</option>
                        <option value="Most Popular">Most Popular</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Best Trips Spotlight Pin */}
              <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-neutral-900 block flex items-center gap-1.5">
                        <Star size={14} className="text-black" /> Best Trips Recommended
                      </span>
                      <span className="text-[11px] text-gray-500 font-medium">Highlight in the Best Bali Trips feed</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPins({ ...pins, isBestTripPinned: !pins.isBestTripPinned })}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${pins.isBestTripPinned ? 'bg-black' : 'bg-gray-200'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${pins.isBestTripPinned ? 'translate-x-6' : ''}`} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                    When enabled, this listing gets a priority verified badge and top placement in the curated recommendation section.
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200/60 flex items-center justify-between text-xs font-bold text-gray-600">
                  <span>Product Status</span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${formData.status === 'Active' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {formData.status}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* CARD 2: BASIC PRODUCT INFORMATION */}
          <section className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200/90 shadow-sm space-y-6">
            <div className="pb-4 border-b border-gray-100">
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <Tag size={18} className="text-black" /> Product Details & Metadata
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Core titles, categories, duration, and geographic location.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2 block">
                  {activeTab === "Transport" ? "Vehicle Model / Name" : "Listing Title"}
                </label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  placeholder={activeTab === "Transport" ? "e.g. Toyota Alphard Luxury Van" : "e.g. Nusa Penida Island Highlights Tour"}
                  className="w-full bg-gray-50 text-sm font-bold text-neutral-900 rounded-2xl px-4 py-3 border border-gray-200 focus:border-black focus:bg-white outline-none transition-all" 
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2 block">Category</label>
                <div className="relative">
                  <button 
                    type="button" 
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="w-full bg-gray-50 text-sm font-bold text-neutral-900 rounded-2xl px-4 py-3 border border-gray-200 flex items-center justify-between outline-none"
                  >
                    <span>{formData.category || "Select Category"}</span>
                    <ChevronDown size={16} />
                  </button>
                  {isCategoryDropdownOpen && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in">
                      {(categoryOptions[activeTab] || []).map((cat) => (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, category: cat.name });
                            setIsCategoryDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-neutral-800 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <cat.icon size={14} className="text-gray-400" />
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2 block">Duration</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    name="duration" 
                    value={formData.duration} 
                    onChange={handleChange} 
                    placeholder="e.g. 10 Hours / Full Day"
                    className="w-full bg-gray-50 text-sm font-bold text-neutral-900 rounded-2xl pl-11 pr-4 py-3 border border-gray-200 focus:border-black focus:bg-white outline-none transition-all" 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2 block">Location / Region</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    placeholder="e.g. Ubud & Gianyar"
                    className="w-full bg-gray-50 text-sm font-bold text-neutral-900 rounded-2xl pl-11 pr-4 py-3 border border-gray-200 focus:border-black focus:bg-white outline-none transition-all" 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2 block">Partner / Operator</label>
                <input 
                  type="text" 
                  name="company" 
                  value={formData.company} 
                  onChange={handleChange} 
                  placeholder="e.g. Balance Island Premium"
                  className="w-full bg-gray-50 text-sm font-bold text-neutral-900 rounded-2xl px-4 py-3 border border-gray-200 focus:border-black focus:bg-white outline-none transition-all" 
                />
              </div>
            </div>
          </section>

          {/* CARD 3: DYNAMIC PRICING CONFIGURATION */}
          <section className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200/90 shadow-sm space-y-6">
            <div className="pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <DollarSign size={18} className="text-black" /> Pricing Configuration & Dynamic Engine
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Configure Per Person vs Per Group rates, minimum person requirements, and custom group size tiers.
                </p>
              </div>

              {(activeTab === "Tour" || activeTab === "Activities") && (
                <div className="flex bg-gray-100 p-1.5 rounded-2xl self-start sm:self-auto">
                  <button 
                    type="button"
                    onClick={() => setTourPricingType("Per Person")} 
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${tourPricingType === "Per Person" ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-black'}`}
                  >
                    Per Person
                  </button>
                  <button 
                    type="button"
                    onClick={() => setTourPricingType("Per Group")} 
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${tourPricingType === "Per Group" ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-black'}`}
                  >
                    Per Group Pricing
                  </button>
                </div>
              )}
            </div>

            {/* TOUR & ACTIVITY PRICING ENGINE */}
            {(activeTab === "Tour" || activeTab === "Activities") && (
              <div className="space-y-6">
                
                {/* PER GROUP PRICING ENGINE */}
                {tourPricingType === "Per Group" && (
                  <div className="space-y-6 animate-in fade-in">
                    
                    {/* Group Mode Switch & Controls */}
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/80 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-black uppercase tracking-wider text-neutral-900 block">Group Pricing Structure</span>
                          <span className="text-[11px] text-gray-500 font-medium">Choose between a flat rate or specific pricing per group size</span>
                        </div>
                        <div className="flex bg-white p-1 rounded-xl border border-gray-200">
                          <button
                            type="button"
                            onClick={() => setGroupPricingMode("tiered")}
                            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${groupPricingMode === "tiered" ? "bg-black text-white shadow-sm" : "text-gray-500 hover:text-black"}`}
                          >
                            Tiered by Group Size
                          </button>
                          <button
                            type="button"
                            onClick={() => setGroupPricingMode("flat")}
                            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${groupPricingMode === "flat" ? "bg-black text-white shadow-sm" : "text-gray-500 hover:text-black"}`}
                          >
                            Single Flat Rate
                          </button>
                        </div>
                      </div>

                      {/* Global Group Capacity Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-200/60">
                        <div>
                          <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1.5 block">
                            Minimum Persons Required (Min Pax)
                          </label>
                          <input 
                            type="number" 
                            min="1"
                            value={minGroupPax} 
                            onChange={(e) => setMinGroupPax(e.target.value)} 
                            placeholder="e.g. 1 or 2"
                            className="w-full bg-white text-sm font-bold text-neutral-900 rounded-xl px-4 py-2.5 border border-gray-200 focus:border-black outline-none" 
                          />
                          <p className="text-[10px] text-gray-400 mt-1">Customers cannot select fewer guests than this number.</p>
                        </div>
                        <div>
                          <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1.5 block">
                            Maximum Group Capacity (Max Pax)
                          </label>
                          <input 
                            type="number" 
                            min="1"
                            value={maxGroupPax} 
                            onChange={(e) => setMaxGroupPax(e.target.value)} 
                            placeholder="e.g. 12"
                            className="w-full bg-white text-sm font-bold text-neutral-900 rounded-xl px-4 py-2.5 border border-gray-200 focus:border-black outline-none" 
                          />
                          <p className="text-[10px] text-gray-400 mt-1">Maximum passengers per private vehicle or tour group.</p>
                        </div>
                      </div>
                    </div>

                    {/* TIERED GROUP SIZE BUILDER */}
                    {groupPricingMode === "tiered" ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-black uppercase tracking-wider text-neutral-900 block">
                              Group Size Tiers & Specific Prices (IDR)
                            </span>
                            <span className="text-[11px] text-gray-500 font-medium">
                              Set specific total group price based on number of persons (e.g. 1-2 pax vs 3-4 pax).
                            </span>
                          </div>
                          <button 
                            type="button"
                            onClick={handleAddGroupTier}
                            className="px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-black hover:bg-neutral-800 transition-all flex items-center gap-1.5 shadow-sm"
                          >
                            <Plus size={14} /> Add Group Tier
                          </button>
                        </div>

                        <div className="space-y-3">
                          {groupTiers.map((tier, index) => (
                            <div key={index} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/90 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                              <div className="w-full sm:w-32 flex items-center gap-1.5">
                                <div className="flex-1">
                                  <label className="text-[9px] font-black uppercase text-gray-400 block mb-0.5">Min Pax</label>
                                  <input 
                                    type="number" 
                                    min="1"
                                    value={tier.minPax} 
                                    onChange={(e) => {
                                      const updated = [...groupTiers];
                                      updated[index].minPax = e.target.value;
                                      setGroupTiers(updated);
                                    }}
                                    className="w-full bg-white text-xs font-bold text-center text-neutral-900 rounded-lg py-1.5 border border-gray-200 outline-none focus:border-black" 
                                  />
                                </div>
                                <span className="text-gray-400 font-black text-xs pt-3">-</span>
                                <div className="flex-1">
                                  <label className="text-[9px] font-black uppercase text-gray-400 block mb-0.5">Max Pax</label>
                                  <input 
                                    type="number" 
                                    min="1"
                                    value={tier.maxPax} 
                                    onChange={(e) => {
                                      const updated = [...groupTiers];
                                      updated[index].maxPax = e.target.value;
                                      setGroupTiers(updated);
                                    }}
                                    className="w-full bg-white text-xs font-bold text-center text-neutral-900 rounded-lg py-1.5 border border-gray-200 outline-none focus:border-black" 
                                  />
                                </div>
                              </div>

                              <div className="flex-1">
                                <label className="text-[9px] font-black uppercase text-gray-400 block mb-0.5">Tier Label</label>
                                <input 
                                  type="text" 
                                  value={tier.label || ""} 
                                  placeholder="e.g. Small Group (1-2 Pax)" 
                                  onChange={(e) => {
                                    const updated = [...groupTiers];
                                    updated[index].label = e.target.value;
                                    setGroupTiers(updated);
                                  }}
                                  className="w-full bg-white text-xs font-bold text-neutral-900 rounded-lg px-3 py-1.5 border border-gray-200 outline-none focus:border-black" 
                                />
                              </div>

                              <div className="w-full sm:w-48">
                                <label className="text-[9px] font-black uppercase text-gray-400 block mb-0.5">Total Group Price</label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">Rp</span>
                                  <input 
                                    type="number" 
                                    placeholder="Total Price" 
                                    value={tier.price} 
                                    onChange={(e) => {
                                      const updated = [...groupTiers];
                                      updated[index].price = e.target.value;
                                      setGroupTiers(updated);
                                    }}
                                    className="w-full bg-white text-xs font-black text-neutral-900 rounded-lg pl-9 pr-3 py-1.5 border border-gray-200 outline-none focus:border-black" 
                                  />
                                </div>
                              </div>

                              <button 
                                type="button"
                                onClick={() => setGroupTiers(groupTiers.filter((_, i) => i !== index))} 
                                className="w-8 h-8 rounded-xl bg-white text-gray-400 hover:text-black flex items-center justify-center border border-gray-200 hover:bg-gray-100 self-end sm:self-center transition-colors shrink-0"
                                title="Remove Tier"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* SINGLE FLAT RATE */
                      <div>
                        <label className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2 block">
                          Flat Rate Price Per Group (IDR)
                        </label>
                        <div className="relative max-w-md">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">Rp</span>
                          <input 
                            type="number" 
                            value={groupPrice} 
                            onChange={(e) => setGroupPrice(e.target.value)} 
                            placeholder="e.g. 750000"
                            className="w-full bg-gray-50 text-sm font-black text-neutral-900 rounded-2xl pl-12 pr-4 py-3 border border-gray-200 focus:border-black focus:bg-white outline-none transition-all" 
                          />
                        </div>
                        <p className="text-xs text-gray-400 font-medium mt-2">
                          This flat rate will apply regardless of group size within the minimum and maximum persons.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* PER PERSON PRICING ENGINE */}
                {tourPricingType === "Per Person" && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-neutral-900 block">Person Tiers (IDR)</span>
                        <span className="text-[11px] text-gray-500 font-medium">Define price per person for each guest count</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setTourTiers([...tourTiers, { pax: tourTiers.length + 1, price: "" }])} 
                        className="px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-black hover:bg-neutral-800 transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus size={14} /> Add Person Tier
                      </button>
                    </div>

                    <div className="space-y-3">
                      {tourTiers.map((tier, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-32 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-black text-gray-700">
                            Person {tier.pax}
                          </div>
                          <div className="relative flex-1">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">Rp</span>
                            <input 
                              type="number" 
                              placeholder="Price per person" 
                              value={tier.price} 
                              onChange={(e) => {
                                const newTiers = [...tourTiers];
                                newTiers[index].price = e.target.value;
                                setTourTiers(newTiers);
                              }}
                              className="w-full bg-white text-xs font-black text-neutral-900 rounded-xl pl-9 pr-4 py-2.5 border border-gray-200 focus:border-black outline-none" 
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => setTourTiers(tourTiers.filter((_, i) => i !== index))} 
                            className="w-9 h-9 rounded-xl bg-gray-50 text-gray-400 hover:text-black flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ALL INCLUSIVE PACKAGE CONTROLS */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-neutral-900 block">Enable All-Inclusive Package</span>
                      <p className="text-[11px] text-gray-500 font-medium mt-0.5">Allows travelers to upgrade to an all-inclusive VIP package covering entrance fees & meals.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHasAllInclusive(!hasAllInclusive)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${hasAllInclusive ? 'bg-black' : 'bg-gray-200'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${hasAllInclusive ? 'translate-x-6' : ''}`} />
                    </button>
                  </div>

                  {hasAllInclusive && (
                    <div className="p-5 bg-gray-50 border border-gray-200/90 rounded-2xl space-y-4 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs font-black uppercase tracking-wider text-gray-700 block">All-Inclusive Tiers (IDR per person)</label>
                          <span className="text-[11px] text-gray-500 font-medium">All-Inclusive upgrades are calculated per guest.</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setAllInclusiveTiers([...allInclusiveTiers, { pax: allInclusiveTiers.length + 1, price: "" }])}
                          className="text-xs font-black text-black bg-white border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-all flex items-center gap-1"
                        >
                          <Plus size={14} /> Add AI Tier
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {allInclusiveTiers.map((tier, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-32 bg-white px-3 py-2 rounded-xl border border-gray-200 text-xs font-black text-gray-700">
                              Person {tier.pax}
                            </div>
                            <div className="relative flex-1">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">Rp</span>
                              <input 
                                type="number" 
                                placeholder="Total AI Price" 
                                value={tier.price} 
                                onChange={(e) => {
                                  const newTiers = [...allInclusiveTiers];
                                  newTiers[index].price = e.target.value;
                                  setAllInclusiveTiers(newTiers);
                                }}
                                className="w-full bg-white text-xs font-black text-neutral-900 rounded-xl pl-9 pr-4 py-2 border border-gray-200 focus:border-black outline-none" 
                              />
                            </div>
                            <button 
                              type="button"
                              onClick={() => setAllInclusiveTiers(allInclusiveTiers.filter((_, i) => i !== index))} 
                              className="w-8 h-8 rounded-xl bg-white text-gray-400 hover:text-black flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1 block">What's Covered in All-Inclusive</label>
                          <textarea 
                            rows={2} 
                            value={inclusiveIncluded} 
                            onChange={(e) => setInclusiveIncluded(e.target.value)} 
                            placeholder="All entrance tickets, buffet lunch, mineral water..." 
                            className="w-full bg-white text-xs font-medium text-neutral-900 rounded-xl p-3 border border-gray-200 outline-none focus:border-black resize-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1 block">What's Excluded in All-Inclusive</label>
                          <textarea 
                            rows={2} 
                            value={inclusiveExcluded} 
                            onChange={(e) => setInclusiveExcluded(e.target.value)} 
                            placeholder="Personal expenses, alcoholic beverages..." 
                            className="w-full bg-white text-xs font-medium text-neutral-900 rounded-xl p-3 border border-gray-200 outline-none focus:border-black resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* SCOOTER PRICING */}
            {activeTab === "Scooter" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5 block">Daily Rate (IDR)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">Rp</span>
                    <input 
                      type="number" 
                      value={scooterPrices.daily} 
                      onChange={(e) => setScooterPrices({ ...scooterPrices, daily: e.target.value })} 
                      className="w-full bg-gray-50 text-sm font-black text-neutral-900 rounded-xl pl-9 pr-4 py-2.5 border border-gray-200 outline-none focus:border-black" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5 block">Weekly Rate (IDR)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">Rp</span>
                    <input 
                      type="number" 
                      value={scooterPrices.weekly} 
                      onChange={(e) => setScooterPrices({ ...scooterPrices, weekly: e.target.value })} 
                      className="w-full bg-gray-50 text-sm font-black text-neutral-900 rounded-xl pl-9 pr-4 py-2.5 border border-gray-200 outline-none focus:border-black" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5 block">Monthly Rate (IDR)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">Rp</span>
                    <input 
                      type="number" 
                      value={scooterPrices.monthly} 
                      onChange={(e) => setScooterPrices({ ...scooterPrices, monthly: e.target.value })} 
                      className="w-full bg-gray-50 text-sm font-black text-neutral-900 rounded-xl pl-9 pr-4 py-2.5 border border-gray-200 outline-none focus:border-black" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SPA PRICING */}
            {activeTab === "Spa" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5 block">60 Min Treatment (IDR)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">Rp</span>
                    <input 
                      type="number" 
                      value={spaPrices.min60} 
                      onChange={(e) => setSpaPrices({ ...spaPrices, min60: e.target.value })} 
                      className="w-full bg-gray-50 text-sm font-black text-neutral-900 rounded-xl pl-9 pr-4 py-2.5 border border-gray-200 outline-none focus:border-black" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5 block">90 Min Treatment (IDR)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">Rp</span>
                    <input 
                      type="number" 
                      value={spaPrices.min90} 
                      onChange={(e) => setSpaPrices({ ...spaPrices, min90: e.target.value })} 
                      className="w-full bg-gray-50 text-sm font-black text-neutral-900 rounded-xl pl-9 pr-4 py-2.5 border border-gray-200 outline-none focus:border-black" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5 block">120 Min Treatment (IDR)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">Rp</span>
                    <input 
                      type="number" 
                      value={spaPrices.min120} 
                      onChange={(e) => setSpaPrices({ ...spaPrices, min120: e.target.value })} 
                      className="w-full bg-gray-50 text-sm font-black text-neutral-900 rounded-xl pl-9 pr-4 py-2.5 border border-gray-200 outline-none focus:border-black" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TRANSPORT PRICING */}
            {activeTab === "Transport" && (
              <div className="max-w-md">
                <label className="text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5 block">Price Per Kilometer (IDR/Km)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">Rp</span>
                  <input 
                    type="number" 
                    value={transportPricePerKm} 
                    onChange={(e) => setTransportPricePerKm(e.target.value)} 
                    placeholder="e.g. 15000"
                    className="w-full bg-gray-50 text-sm font-black text-neutral-900 rounded-xl pl-9 pr-4 py-2.5 border border-gray-200 outline-none focus:border-black" 
                  />
                </div>
              </div>
            )}

          </section>

          {/* CARD 4: DESCRIPTION & INCLUSIONS */}
          <section className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200/90 shadow-sm space-y-6">
            <div className="pb-4 border-b border-gray-100">
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <Sparkles size={18} className="text-black" /> Description, Highlights & Features
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Detailed customer-facing itinerary, inclusions, exclusions, and key highlights.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2 block">Full Description</label>
                <textarea 
                  rows={4} 
                  name="description" 
                  value={details.description} 
                  onChange={handleDetailChange} 
                  placeholder="Comprehensive description of the tour and experience..."
                  className="w-full bg-gray-50 text-sm font-medium text-neutral-900 rounded-2xl p-4 border border-gray-200 focus:border-black focus:bg-white outline-none transition-all resize-y"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2 block">Highlights (One per line)</label>
                <textarea 
                  rows={3} 
                  name="highlights" 
                  value={details.highlights} 
                  onChange={handleDetailChange} 
                  placeholder="Private luxury air-conditioned vehicle&#10;English speaking private driver & guide&#10;Flexible pickup & customizable schedule"
                  className="w-full bg-gray-50 text-sm font-medium text-neutral-900 rounded-2xl p-4 border border-gray-200 focus:border-black focus:bg-white outline-none transition-all resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2 block">Standard Inclusions</label>
                  <textarea 
                    rows={3} 
                    name="included" 
                    value={details.included} 
                    onChange={handleDetailChange} 
                    placeholder="Private car, driver, fuel, hotel pickup/dropoff, parking fees..."
                    className="w-full bg-gray-50 text-sm font-medium text-neutral-900 rounded-2xl p-4 border border-gray-200 focus:border-black focus:bg-white outline-none transition-all resize-y"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2 block">Standard Exclusions</label>
                  <textarea 
                    rows={3} 
                    name="excluded" 
                    value={details.excluded} 
                    onChange={handleDetailChange} 
                    placeholder="Entrance fees (covered in all-inclusive), personal meals, tipping..."
                    className="w-full bg-gray-50 text-sm font-medium text-neutral-900 rounded-2xl p-4 border border-gray-200 focus:border-black focus:bg-white outline-none transition-all resize-y"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* CARD 5: ITINERARY BUILDER (For Tours & Activities) */}
          {(activeTab === "Tour" || activeTab === "Activities") && (
            <section className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200/90 shadow-sm space-y-6">
              <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                    <Map size={18} className="text-black" /> Tour Itinerary Schedule
                  </h2>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Step-by-step stops and timeline for the tour day.
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => setItinerary([...itinerary, { title: '', description: '' }])}
                  className="px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-black hover:bg-neutral-800 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus size={14} /> Add Stop
                </button>
              </div>

              <div className="space-y-3">
                {itinerary.map((step, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <div className="w-8 h-8 rounded-full bg-black text-white text-xs font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 w-full space-y-2 sm:space-y-0 sm:flex sm:gap-3">
                      <input 
                        type="text" 
                        placeholder="Stop Title (e.g. 08:30 AM Hotel Pickup)" 
                        value={step.title} 
                        onChange={(e) => {
                          const updated = [...itinerary];
                          updated[idx].title = e.target.value;
                          setItinerary(updated);
                        }} 
                        className="w-full sm:w-1/3 bg-white text-xs font-bold text-neutral-900 rounded-xl px-3 py-2 border border-gray-200 outline-none focus:border-black" 
                      />
                      <input 
                        type="text" 
                        placeholder="Stop Details / Description..." 
                        value={step.description} 
                        onChange={(e) => {
                          const updated = [...itinerary];
                          updated[idx].description = e.target.value;
                          setItinerary(updated);
                        }} 
                        className="w-full sm:flex-1 bg-white text-xs font-medium text-neutral-900 rounded-xl px-3 py-2 border border-gray-200 outline-none focus:border-black" 
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => setItinerary(itinerary.filter((_, i) => i !== idx))} 
                      className="w-8 h-8 rounded-xl bg-white text-gray-400 hover:text-black flex items-center justify-center border border-gray-200 hover:bg-gray-100 transition-colors shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CARD 6: MEDIA & GALLERY */}
          <section className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200/90 shadow-sm space-y-6">
            <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <ImageIcon size={18} className="text-black" /> Photos & Media Gallery
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Upload a high-resolution 16:9 main cover image and supplementary gallery shots.
                </p>
              </div>

              {activeTab !== "Transport" && (
                <div className="relative overflow-hidden">
                  <button 
                    type="button" 
                    disabled={isUploading} 
                    className="px-4 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-black flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <Plus size={14} /> {isUploading ? "Uploading..." : "Add Gallery Shots"}
                  </button>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleGalleryUpload} 
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* Main Cover Image Block */}
              <div className="col-span-2 sm:col-span-2 md:col-span-2 row-span-2 relative group overflow-hidden bg-gray-50 rounded-2xl border-2 border-black/20 border-dashed aspect-[16/10] flex flex-col items-center justify-center">
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Main Cover" className="w-full h-full object-cover rounded-xl" />
                    <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md">
                      Main Cover
                    </div>
                    
                    <div className="absolute right-3 top-3 flex items-center gap-2">
                      <div className="relative overflow-hidden w-9 h-9 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-white text-gray-700">
                        <Camera size={16} />
                        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, image: "" })} 
                        className="w-9 h-9 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-md text-gray-700 hover:text-black transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 hover:text-black transition-colors hover:bg-gray-100/50">
                    <Camera size={36} className="mb-2 opacity-60" />
                    <p className="text-xs font-black text-neutral-800">Upload High-Res Cover Image</p>
                    <p className="text-[10px] font-medium text-gray-400 mt-1">16:9 ratio recommended</p>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                )}
              </div>

              {/* Gallery Photos */}
              {activeTab !== "Transport" && gallery.map((url, index) => {
                return url ? (
                  <div key={index} className="relative group overflow-hidden bg-gray-100 rounded-2xl border border-gray-200 aspect-[16/10]">
                    <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => {
                        const newG = [...gallery];
                        newG[index] = "";
                        setGallery(newG);
                      }} 
                      className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:text-black text-gray-600 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ) : null;
              })}
              
              {/* Empty Gallery Slots */}
              {activeTab !== "Transport" && Array.from({ length: Math.max(0, 8 - gallery.filter(Boolean).length) }).map((_, emptyIndex) => (
                <div key={`empty-${emptyIndex}`} className="relative group overflow-hidden bg-white rounded-2xl border border-gray-200 border-dashed aspect-[16/10] flex flex-col items-center justify-center text-gray-300 hover:text-black transition-colors hover:bg-gray-50">
                  <Plus size={20} className="mb-1" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Slot {gallery.filter(Boolean).length + emptyIndex + 1}</span>
                  <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} disabled={isUploading} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* Mobile-Only Sticky Bottom Bar for quick publishing */}
      <footer className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-3 z-30 shadow-lg pb-safe">
        <button 
          type="button"
          onClick={onClose} 
          className="flex-1 py-3 text-xs font-black text-gray-600 bg-gray-100 rounded-xl text-center"
        >
          Discard
        </button>
        <button 
          type="button"
          onClick={handleSave} 
          className="flex-[2] py-3 text-xs font-black text-white bg-black rounded-xl text-center shadow-md flex items-center justify-center gap-1.5"
        >
          <Check size={16} strokeWidth={3} />
          <span>Save Changes</span>
        </button>
      </footer>

    </div>
  );
}
