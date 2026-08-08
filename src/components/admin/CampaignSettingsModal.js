"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, ExternalLink, Globe, Save, Upload, Image as ImageIcon, Trash2, Check } from "lucide-react";
import { updateSingleCampaign } from "@/lib/campaigns";

export default function CampaignSettingsModal({ isOpen, onClose, campaign, onSaveSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    badge: "",
    externalUrl: "",
    image: "",
    active: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (campaign) {
      setFormData({
        title: campaign.title || "",
        subtitle: campaign.subtitle || "",
        badge: campaign.badge || "",
        externalUrl: campaign.externalUrl || "",
        image: campaign.image || "",
        active: campaign.active !== undefined ? campaign.active : true
      });
    }
  }, [campaign, isOpen]);

  if (!isOpen || !campaign) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // Compress using canvas to avoid large localStorage payload
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

        setFormData(prev => ({ ...prev, image: dataUrl }));
        setIsUploading(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    let formattedUrl = formData.externalUrl.trim();
    if (formattedUrl && !formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }

    const updatedData = {
      ...formData,
      externalUrl: formattedUrl
    };

    updateSingleCampaign(campaign.id, updatedData);
    
    if (onSaveSuccess) {
      onSaveSuccess(campaign.id, updatedData);
    }
    
    setIsSaving(false);
    onClose();
  };

  const isScooter = campaign.id === 'scooter';

  const defaultPresets = isScooter ? [
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80"
  ] : [
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80"
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-[#eaeaea] overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#eaeaea] flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-gray-100 text-[#1c1c1c]">
                {campaign.type || (isScooter ? 'Scooter Rental' : 'Spa & Wellness')}
              </span>
              <span className="text-xs text-gray-400 font-bold">• Campaign Integration</span>
            </div>
            <h3 className="text-lg font-black text-[#1c1c1c] tracking-tight">
              Edit {campaign.type || (isScooter ? 'Scooter' : 'Spa')} Campaign
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1 no-scrollbar">
          
          {/* Active Status Switch */}
          <div className="flex items-center justify-between p-4 bg-[#f9f9f9] border border-[#eaeaea] rounded-2xl">
            <div>
              <span className="text-sm font-black text-[#1c1c1c] block">Live Status</span>
              <span className="text-xs text-gray-500 font-medium">
                {formData.active ? 'Active — Direct partner link is active on website' : 'Paused — Campaign card is disabled'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, active: !formData.active })}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                formData.active 
                  ? 'bg-[#1c1c1c] text-white shadow-sm' 
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {formData.active ? 'ACTIVE' : 'PAUSED'}
            </button>
          </div>

          {/* Image Upload & Management */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                Campaign Photo / Cover Image
              </label>
              {formData.image && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: "" })}
                  className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1"
                >
                  <Trash2 size={12} /> Remove
                </button>
              )}
            </div>

            {/* Image Preview & Upload Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {formData.image ? (
                <div className="relative w-full sm:w-48 h-32 rounded-2xl overflow-hidden border border-[#eaeaea] bg-gray-100 shrink-0 group">
                  <img 
                    src={formData.image} 
                    alt="Campaign preview" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white text-[#1c1c1c] text-xs font-extrabold rounded-lg shadow-sm"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-48 h-32 rounded-2xl border-2 border-dashed border-gray-200 hover:border-gray-400 bg-[#f9f9f9] flex flex-col items-center justify-center cursor-pointer transition-colors shrink-0 p-4 text-center"
                >
                  <ImageIcon size={24} className="text-gray-400 mb-1" />
                  <span className="text-xs font-bold text-gray-600">Upload Image</span>
                  <span className="text-[10px] text-gray-400 font-medium">PNG, JPG up to 10MB</span>
                </div>
              )}

              <div className="flex-1 space-y-2 w-full">
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full py-2.5 px-4 bg-white border border-[#eaeaea] hover:bg-gray-50 rounded-xl text-xs font-extrabold text-[#1c1c1c] flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <Upload size={14} />
                  <span>{isUploading ? "Processing..." : "Select File From Device"}</span>
                </button>

                <div>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Or paste external image URL (https://...)"
                    className="w-full px-3.5 py-2 bg-[#f9f9f9] border border-[#eaeaea] focus:border-[#1c1c1c] focus:bg-white rounded-xl text-xs font-medium text-[#1c1c1c] outline-none transition-all"
                  />
                </div>

                {/* Preset Suggestions */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Presets:</span>
                  {defaultPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: preset })}
                      className="w-6 h-6 rounded-md overflow-hidden border border-[#eaeaea] hover:scale-110 transition-transform"
                    >
                      <img src={preset} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* External Website URL */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center justify-between">
              <span>External Website / Booking Partner URL</span>
              {formData.externalUrl && (
                <a 
                  href={formData.externalUrl.startsWith('http') ? formData.externalUrl : `https://${formData.externalUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-[#1c1c1c] hover:underline inline-flex items-center gap-1"
                >
                  Test Link <ExternalLink size={12} />
                </a>
              )}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Globe size={16} />
              </div>
              <input 
                type="text"
                value={formData.externalUrl}
                onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                placeholder={isScooter ? "https://scooter.yourdomain.com or https://thebikebali.com" : "https://spa.yourdomain.com or https://ubudtranquilityspa.com"}
                className="w-full pl-10 pr-4 py-3 bg-[#f9f9f9] border border-[#eaeaea] focus:border-[#1c1c1c] focus:bg-white rounded-xl text-sm font-semibold text-[#1c1c1c] outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Campaign Headline */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-gray-500">
              Display Headline / Title
            </label>
            <input 
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Scooter & Motorbike Rental"
              className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#eaeaea] focus:border-[#1c1c1c] focus:bg-white rounded-xl text-sm font-semibold text-[#1c1c1c] outline-none transition-all"
              required
            />
          </div>

          {/* Subtitle / Description */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-gray-500">
              Description / Value Proposition
            </label>
            <textarea 
              rows={2}
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Brief summary of what the customer gets upon clicking..."
              className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#eaeaea] focus:border-[#1c1c1c] focus:bg-white rounded-xl text-sm font-medium text-[#1c1c1c] outline-none transition-all resize-none"
            />
          </div>

          {/* Badge Tag */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-gray-500">
              Badge Label
            </label>
            <input 
              type="text"
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              placeholder="e.g. Official Partner, Instant Delivery, VIP Healing"
              className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#eaeaea] focus:border-[#1c1c1c] focus:bg-white rounded-xl text-sm font-semibold text-[#1c1c1c] outline-none transition-all"
            />
          </div>

          {/* Live Preview Card */}
          <div className="pt-2">
            <span className="text-xs font-black uppercase tracking-wider text-gray-500 block mb-2">Live Card Preview</span>
            <div className="p-4 rounded-2xl bg-white border border-[#eaeaea] shadow-sm flex flex-col sm:flex-row gap-4 overflow-hidden">
              {formData.image && (
                <div className="w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img src={formData.image} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-gray-100 text-[#1c1c1c]">
                      {formData.badge || "Official Partner"}
                    </span>
                    <span className="text-[11px] font-extrabold text-emerald-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Connected
                    </span>
                  </div>
                  <h4 className="text-base font-black text-[#1c1c1c] line-clamp-1">
                    {formData.title || "Campaign Title"}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium line-clamp-2 mt-0.5">
                    {formData.subtitle || "Description will appear here."}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 mt-2 border-t border-gray-100">
                  <span className="font-mono text-gray-400 text-[11px] truncate max-w-[200px]">
                    {formData.externalUrl || "https://..."}
                  </span>
                  <span className="font-extrabold text-[#1c1c1c] flex items-center gap-1">
                    Visit <ExternalLink size={12} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="pt-4 border-t border-[#eaeaea] flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-[#1c1c1c] hover:bg-black transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Save size={16} />
              <span>Save Campaign</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
