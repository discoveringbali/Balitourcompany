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
    <div className="min-h-[100dvh] bg-[#000000] pb-32 font-sans font-medium text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-md shadow-sm border-b border-white/10 px-6 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => router.back()} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft size={24} className="text-white" strokeWidth={2.5} />
          </button>
          <span className="font-extrabold text-[17px] text-white absolute left-1/2 -translate-x-1/2">Personal Info</span>
          <button type="button" onClick={handleSave} className="font-bold text-white px-4 py-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2">
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="px-6 py-6 bg-white/5 border-b border-white/10 flex gap-4 items-start">
        <ShieldCheck size={24} className="text-white shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-bold text-white">Secure & Confidential</p>
          <p className="text-[12px] font-medium text-white/70 mt-1 leading-relaxed">
            This information is securely auto-filled for faster checkouts. Your data is saved locally on your device for your privacy.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="px-6 pt-6 max-w-2xl mx-auto">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          
          <div className="bg-[#1c1c1c] rounded-3xl p-6 shadow-xl border border-white/10 flex flex-col gap-5">
            <h2 className="text-[16px] font-bold text-white mb-1">Basic Details</h2>
            
            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[13px] font-bold text-white/70 pl-1">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-[15px] text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-gray-500" 
                  placeholder="e.g. John" 
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[13px] font-bold text-white/70 pl-1">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-[15px] text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-gray-500" 
                  placeholder="e.g. Doe" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-white/70 pl-1">Email Address</label>
              <input 
                type="email" 
                defaultValue={session?.user?.email || ""}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-[15px] text-white/50 cursor-not-allowed" 
              />
              <span className="text-[11px] text-white/40 pl-1">Connected via your Google Account.</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[13px] font-bold text-white/70 pl-1">Phone Number (WhatsApp)</label>
                <div className="flex">
                  <div className="flex items-center justify-center px-4 bg-white/5 border border-white/10 border-r-0 rounded-l-xl text-white/50 font-bold text-[15px]">
                    +
                  </div>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-r-xl px-4 py-3.5 text-[15px] text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-gray-500" 
                    placeholder="123 456 7890" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[13px] font-bold text-white/70 pl-1">Nationality</label>
                <input 
                  type="text" 
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-[15px] text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-gray-500" 
                  placeholder="e.g. Australian" 
                />
              </div>
            </div>
          </div>


          <button 
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#ffffff] hover:bg-[#e0e0e0] text-[#000000] font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg mt-4"
          >
            <Save size={20} />
            {isSaving ? "Saving details..." : "Save Personal Information"}
          </button>

        </form>
      </div>
    </div>
  );
}
