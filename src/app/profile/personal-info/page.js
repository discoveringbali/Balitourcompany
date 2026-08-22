"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, Save, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function PersonalInfoPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    nationality: "",
    emergencyName: "",
    emergencyPhone: ""
  });

  // Load from LocalStorage or Session on mount
  useEffect(() => {
    const savedData = localStorage.getItem("balance_island_profile");
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse profile data");
      }
    } else if (session?.user?.name) {
      const names = session.user.name.split(" ");
      setFormData(prev => ({
        ...prev,
        firstName: names[0] || "",
        lastName: names.slice(1).join(" ") || ""
      }));
    }
    setIsLoaded(true);
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Save to local storage
    localStorage.setItem("balance_island_profile", JSON.stringify(formData));

    // Mock save delay
    setTimeout(() => {
      setIsSaving(false);
      router.back();
    }, 800);
  };

  if (!isLoaded) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-[100dvh] bg-[#fafafa] pb-32 font-sans font-medium">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-border px-6 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => router.back()} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
            <ChevronLeft size={24} className="text-primary" strokeWidth={2.5} />
          </button>
          <span className="font-extrabold text-[17px] text-primary absolute left-1/2 -translate-x-1/2">Personal Info</span>
          <button type="button" onClick={handleSave} className="font-bold text-accent px-4 py-2 hover:bg-accent/10 rounded-full transition-colors flex items-center gap-2">
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="px-6 py-6 bg-gray-50/50 border-b border-gray-300 flex gap-4 items-start">
        <ShieldCheck size={24} className="text-black shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-bold text-black">Secure & Confidential</p>
          <p className="text-[12px] font-medium text-black/80 mt-1 leading-relaxed">
            This information is securely auto-filled for faster checkouts. Your data is automatically purged 7 days after your tour ends for your privacy.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="px-6 pt-6 max-w-2xl mx-auto">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-border flex flex-col gap-5">
            <h2 className="text-[15px] font-bold text-primary mb-1">Basic Details</h2>
            
            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[13px] font-bold text-text-secondary pl-1">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-[#fafafa] border border-border rounded-xl px-4 py-3.5 text-[15px] text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-gray-400" 
                  placeholder="e.g. John" 
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[13px] font-bold text-text-secondary pl-1">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-[#fafafa] border border-border rounded-xl px-4 py-3.5 text-[15px] text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-gray-400" 
                  placeholder="e.g. Doe" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-text-secondary pl-1">Email Address</label>
              <input 
                type="email" 
                defaultValue={session?.user?.email || ""}
                disabled
                className="w-full bg-gray-100 border border-border rounded-xl px-4 py-3.5 text-[15px] text-text-secondary opacity-70 cursor-not-allowed" 
              />
              <span className="text-[11px] text-gray-400 pl-1">Connected via your Google Account.</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[13px] font-bold text-text-secondary pl-1">Phone Number (WhatsApp)</label>
                <div className="flex">
                  <div className="flex items-center justify-center px-4 bg-[#f4f4f4] border border-border border-r-0 rounded-l-xl text-text-secondary font-bold text-[15px]">
                    +
                  </div>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-[#fafafa] border border-border rounded-r-xl px-4 py-3.5 text-[15px] text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-gray-400" 
                    placeholder="123 456 7890" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[13px] font-bold text-text-secondary pl-1">Nationality</label>
                <input 
                  type="text" 
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full bg-[#fafafa] border border-border rounded-xl px-4 py-3.5 text-[15px] text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-gray-400" 
                  placeholder="e.g. Australian" 
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-border flex flex-col gap-5">
            <h2 className="text-[15px] font-bold text-primary mb-1">Emergency Contact</h2>
            <p className="text-[13px] text-text-secondary leading-relaxed -mt-4 mb-2">Required for adventure tours like Mt. Batur Trekking.</p>
            
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-text-secondary pl-1">Contact Name & Relationship</label>
              <input 
                type="text" 
                name="emergencyName"
                value={formData.emergencyName}
                onChange={handleChange}
                className="w-full bg-[#fafafa] border border-border rounded-xl px-4 py-3.5 text-[15px] text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-gray-400" 
                placeholder="e.g. Jane Doe (Wife)" 
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-text-secondary pl-1">Contact Phone Number</label>
              <input 
                type="tel" 
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleChange}
                className="w-full bg-[#fafafa] border border-border rounded-xl px-4 py-3.5 text-[15px] text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-gray-400" 
                placeholder="Include country code" 
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSaving}
            className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-black/5 mt-4"
          >
            <Save size={20} />
            {isSaving ? "Saving details..." : "Save Personal Information"}
          </button>

        </form>
      </div>
    </div>
  );
}
