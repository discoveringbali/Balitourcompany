"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, Save, ShieldCheck, Camera, User } from "lucide-react";
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
    emergencyPhone: "",
    image: ""
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        setFormData(prev => ({ ...prev, image: dataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
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
    <div className="min-h-[100dvh] bg-[#000000] pb-10 font-sans font-medium text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#000000] border-b border-white/10 px-4 h-14 flex items-center justify-between">
        <button type="button" onClick={() => router.back()} className="w-10 h-10 -ml-2 flex items-center justify-center hover:bg-white/10 transition-colors rounded-full">
          <ChevronLeft size={24} className="text-white" strokeWidth={2.5} />
        </button>
        <span className="font-bold text-[17px] text-white">Personal Info</span>
        <div className="w-10 h-10"></div>
      </div>

      <div className="max-w-xl mx-auto w-full">
        <form onSubmit={handleSave} className="flex flex-col">
          
          {/* Profile Image Uploader */}
          <div className="flex flex-col items-center justify-center gap-2 py-8">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden border border-white/20 bg-[#1c1c1c] flex items-center justify-center">
                {formData.image ? (
                  <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={36} className="text-white/30" strokeWidth={1.5} />
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-sm border border-black/10">
                <Camera size={13} className="text-black" strokeWidth={2.5} />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            <span className="text-[12px] font-medium text-white/50">Edit photo</span>
          </div>

          <div className="bg-[#1c1c1c] rounded-2xl overflow-hidden border border-white/10 mx-4 sm:mx-0 shadow-sm">
            <div className="flex items-center px-4 py-3.5 border-b border-white/10">
              <label className="text-[15px] w-28 shrink-0 font-medium text-white">First Name</label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="flex-1 min-w-0 bg-transparent text-white text-[15px] focus:outline-none placeholder:text-white/30" 
                placeholder="John" 
              />
            </div>
            <div className="flex items-center px-4 py-3.5 border-b border-white/10">
              <label className="text-[15px] w-28 shrink-0 font-medium text-white">Last Name</label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="flex-1 min-w-0 bg-transparent text-white text-[15px] focus:outline-none placeholder:text-white/30" 
                placeholder="Doe" 
              />
            </div>
            <div className="flex items-center px-4 py-3.5 border-b border-white/10">
              <label className="text-[15px] w-28 shrink-0 font-medium text-white">Email</label>
              <input 
                type="email" 
                defaultValue={session?.user?.email || ""}
                disabled
                className="flex-1 min-w-0 bg-transparent text-white/50 text-[15px] focus:outline-none" 
              />
            </div>
            <div className="flex items-center px-4 py-3.5 border-b border-white/10">
              <label className="text-[15px] w-28 shrink-0 font-medium text-white">WhatsApp</label>
              <span className="text-white/50 mr-1 text-[15px]">+</span>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="flex-1 min-w-0 bg-transparent text-white text-[15px] focus:outline-none placeholder:text-white/30" 
                placeholder="123 456 7890" 
              />
            </div>
            <div className="flex items-center px-4 py-3.5">
              <label className="text-[15px] w-28 shrink-0 font-medium text-white">Nationality</label>
              <input 
                type="text" 
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="flex-1 min-w-0 bg-transparent text-white text-[15px] focus:outline-none placeholder:text-white/30" 
                placeholder="e.g. Australian" 
              />
            </div>
          </div>
          <p className="px-5 text-[11px] text-white/40 mt-3 text-center leading-relaxed">
            This information is securely auto-filled for faster checkouts and saved locally on your device for your privacy.
          </p>

          <div className="px-4 sm:px-0 mt-8">
            <button 
              type="submit"
              disabled={isSaving}
              className="w-full bg-[#ffffff] hover:bg-[#e0e0e0] text-[#000000] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
            >
              <Save size={18} />
              {isSaving ? "Saving details..." : "Save Information"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
