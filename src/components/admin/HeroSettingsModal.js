"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Save, Upload, Trash2, Video, Globe, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCampaignSettings, saveCampaignSettings, DEFAULT_CAMPAIGNS } from "@/lib/campaigns";

export default function HeroSettingsModal({ onClose }) {
  const [heroSettings, setHeroSettings] = useState({
    campaignVideo: "",
    campaignYoutubeLink: ""
  });
  const [campaigns, setCampaigns] = useState(DEFAULT_CAMPAIGNS);
  const [isHeroUploading, setIsHeroUploading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadingFor, setUploadingFor] = useState(null);
  const [savedToast, setSavedToast] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchSettings();
    setCampaigns(getCampaignSettings());
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('homepage_settings').select('*').eq('id', 1).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setHeroSettings({
          campaignVideo: data.campaign_video || "",
          campaignYoutubeLink: data.campaign_youtube_link || ""
        });
      }
    } catch (err) {
      console.error("Error fetching homepage settings:", err.message);
    }
  };

  const handleHeroVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsHeroUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `campaigns/hero_${Date.now()}.${fileExt}`;
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'discovering_bali_images');
      formData.append('filePath', fileName);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setHeroSettings(prev => ({ ...prev, campaignVideo: data.url }));
    } catch (err) {
      alert("Video upload failed: " + err.message);
    } finally {
      setIsHeroUploading(false);
    }
  };

  const handleCardImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingImage(true);
    setUploadingFor(type);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `campaigns/partner_${type}_${Date.now()}.${fileExt}`;
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'discovering_bali_images');
      formData.append('filePath', fileName);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setCampaigns(prev => ({
        ...prev,
        [type]: {
          ...(prev[type] || DEFAULT_CAMPAIGNS[type]),
          image: data.url
        }
      }));
    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally {
      setIsUploadingImage(false);
      setUploadingFor(null);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        id: 1,
        campaign_video: heroSettings.campaignVideo,
        campaign_youtube_link: heroSettings.campaignYoutubeLink,
        updated_at: new Date().toISOString()
      };
      const res = await fetch('/api/admin/homepage-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');

      // Save campaign card settings
      saveCampaignSettings(campaigns);

      setSavedToast(true);
      window.dispatchEvent(new Event("homepage_hero_settings_changed"));
      setTimeout(() => {
        setSavedToast(false);
        onClose();
      }, 800);
    } catch (err) {
      alert("Failed to save settings: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center font-sans px-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90dvh] border border-[#eaeaea]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-[#eaeaea] shrink-0">
          <div>
            <h2 className="text-xl font-black text-[#1c1c1c] tracking-tight">Homepage Hero & Campaign Cards</h2>
            <p className="text-xs font-medium text-gray-500 mt-0.5">
              Manage hero media and partner campaign cards (Scooter & Home Service Spa).
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-200 transition-colors">
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Section 1: Hero Media Background */}
          <div className="bg-[#fafafa] p-5 rounded-2xl border border-[#eaeaea] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-xs uppercase tracking-wider text-gray-700 flex items-center gap-2">
                <Video size={16} className="text-black" /> Hero Background Media
              </h3>
            </div>
            
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5 block">
                YouTube Showcase URL (Takes Priority)
              </label>
              <input 
                type="text" 
                placeholder="https://www.youtube.com/watch?v=..." 
                value={heroSettings.campaignYoutubeLink} 
                onChange={(e) => setHeroSettings({ ...heroSettings, campaignYoutubeLink: e.target.value })} 
                className="w-full bg-white text-sm font-bold text-[#1c1c1c] rounded-xl px-4 py-2.5 border border-[#eaeaea] focus:border-black outline-none transition-colors" 
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">OR DIRECT MP4</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5 block">
                Direct Video URL or Upload
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="https://.../video.mp4" 
                  value={heroSettings.campaignVideo} 
                  onChange={(e) => setHeroSettings({ ...heroSettings, campaignVideo: e.target.value })} 
                  className="flex-1 bg-white text-sm font-bold text-[#1c1c1c] rounded-xl px-4 py-2.5 border border-[#eaeaea] focus:border-black outline-none transition-colors" 
                />
                <label className="px-4 py-2.5 bg-black text-white rounded-xl text-xs font-black hover:bg-neutral-800 transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                  <Upload size={14} /> {isHeroUploading ? "Uploading..." : "Upload MP4"}
                  <input type="file" accept="video/*" onChange={handleHeroVideoUpload} className="hidden" disabled={isHeroUploading} />
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Scooter Campaign Card */}
          <div className="bg-[#fafafa] p-5 rounded-2xl border border-[#eaeaea] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-[#1c1c1c] flex items-center gap-2">
                  <Globe size={16} className="text-black" /> Scooter Campaign Card
                </h3>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                  Appears as a campaign slide on the homepage hero. Opens the partner link in a new tab.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCampaigns(prev => ({
                  ...prev,
                  scooter: { ...prev.scooter, active: !prev.scooter?.active }
                }))}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${campaigns.scooter?.active !== false ? 'bg-black' : 'bg-gray-300'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${campaigns.scooter?.active !== false ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1 block">Card Title</label>
                <input 
                  type="text" 
                  value={campaigns.scooter?.title || ""} 
                  onChange={(e) => setCampaigns(prev => ({
                    ...prev,
                    scooter: { ...prev.scooter, title: e.target.value }
                  }))}
                  placeholder="Scooter Rental Bali"
                  className="w-full bg-white text-xs font-bold text-[#1c1c1c] rounded-xl px-3.5 py-2.5 border border-[#eaeaea] focus:border-black outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1 block">Badge / Label</label>
                <input 
                  type="text" 
                  value={campaigns.scooter?.badge || ""} 
                  onChange={(e) => setCampaigns(prev => ({
                    ...prev,
                    scooter: { ...prev.scooter, badge: e.target.value }
                  }))}
                  placeholder="Scooter Rental"
                  className="w-full bg-white text-xs font-bold text-[#1c1c1c] rounded-xl px-3.5 py-2.5 border border-[#eaeaea] focus:border-black outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1 block">Website Link (Opens in New Tab)</label>
              <input 
                type="text" 
                value={campaigns.scooter?.externalUrl || ""} 
                onChange={(e) => setCampaigns(prev => ({
                  ...prev,
                  scooter: { ...prev.scooter, externalUrl: e.target.value }
                }))}
                placeholder="https://thebikebali.com"
                className="w-full bg-white text-xs font-bold text-[#1c1c1c] rounded-xl px-3.5 py-2.5 border border-[#eaeaea] focus:border-black outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1 block">Card Image</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={campaigns.scooter?.image || ""} 
                  onChange={(e) => setCampaigns(prev => ({
                    ...prev,
                    scooter: { ...prev.scooter, image: e.target.value }
                  }))}
                  placeholder="https://..."
                  className="flex-1 bg-white text-xs font-bold text-[#1c1c1c] rounded-xl px-3.5 py-2.5 border border-[#eaeaea] focus:border-black outline-none"
                />
                <label className="px-3.5 py-2 bg-black text-white rounded-xl text-xs font-black hover:bg-neutral-800 transition-all cursor-pointer inline-flex items-center gap-1 shrink-0">
                  <Upload size={13} /> {isUploadingImage && uploadingFor === 'scooter' ? "Uploading..." : "Upload Image"}
                  <input type="file" accept="image/*" onChange={(e) => handleCardImageUpload(e, 'scooter')} className="hidden" disabled={isUploadingImage} />
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Spa (Home Service) Campaign Card */}
          <div className="bg-[#fafafa] p-5 rounded-2xl border border-[#eaeaea] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-[#1c1c1c] flex items-center gap-2">
                  <Globe size={16} className="text-black" /> Spa Campaign Card (Home Service Only)
                </h3>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                  Appears as a campaign slide on the homepage hero. Opens the partner link in a new tab.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCampaigns(prev => ({
                  ...prev,
                  spa: { ...prev.spa, active: !prev.spa?.active }
                }))}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${campaigns.spa?.active !== false ? 'bg-black' : 'bg-gray-300'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${campaigns.spa?.active !== false ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1 block">Card Title</label>
                <input 
                  type="text" 
                  value={campaigns.spa?.title || ""} 
                  onChange={(e) => setCampaigns(prev => ({
                    ...prev,
                    spa: { ...prev.spa, title: e.target.value }
                  }))}
                  placeholder="Home Service Spa Bali"
                  className="w-full bg-white text-xs font-bold text-[#1c1c1c] rounded-xl px-3.5 py-2.5 border border-[#eaeaea] focus:border-black outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1 block">Badge / Label</label>
                <input 
                  type="text" 
                  value={campaigns.spa?.badge || ""} 
                  onChange={(e) => setCampaigns(prev => ({
                    ...prev,
                    spa: { ...prev.spa, badge: e.target.value }
                  }))}
                  placeholder="Home Service Spa"
                  className="w-full bg-white text-xs font-bold text-[#1c1c1c] rounded-xl px-3.5 py-2.5 border border-[#eaeaea] focus:border-black outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1 block">Website Link (Opens in New Tab)</label>
              <input 
                type="text" 
                value={campaigns.spa?.externalUrl || ""} 
                onChange={(e) => setCampaigns(prev => ({
                  ...prev,
                  spa: { ...prev.spa, externalUrl: e.target.value }
                }))}
                placeholder="https://ubudtranquilityspa.com"
                className="w-full bg-white text-xs font-bold text-[#1c1c1c] rounded-xl px-3.5 py-2.5 border border-[#eaeaea] focus:border-black outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1 block">Card Image</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={campaigns.spa?.image || ""} 
                  onChange={(e) => setCampaigns(prev => ({
                    ...prev,
                    spa: { ...prev.spa, image: e.target.value }
                  }))}
                  placeholder="https://..."
                  className="flex-1 bg-white text-xs font-bold text-[#1c1c1c] rounded-xl px-3.5 py-2.5 border border-[#eaeaea] focus:border-black outline-none"
                />
                <label className="px-3.5 py-2 bg-black text-white rounded-xl text-xs font-black hover:bg-neutral-800 transition-all cursor-pointer inline-flex items-center gap-1 shrink-0">
                  <Upload size={13} /> {isUploadingImage && uploadingFor === 'spa' ? "Uploading..." : "Upload Image"}
                  <input type="file" accept="image/*" onChange={(e) => handleCardImageUpload(e, 'spa')} className="hidden" disabled={isUploadingImage} />
                </label>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 bg-white border-t border-[#eaeaea] shrink-0 flex items-center justify-between">
          <div>
            {savedToast && (
              <span className="text-xs font-extrabold text-black flex items-center gap-1">
                <Check size={14} /> Settings Saved Successfully!
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-extrabold text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="px-6 py-2.5 rounded-xl font-extrabold text-xs text-white bg-black hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-sm">
              <Save size={15} /> Save All Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
