"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Calendar, MapPin, Users, Phone, User, Clock, ArrowRight, ChevronLeft, Minus, Plus, Check, Info, MessageSquare } from "lucide-react";
import WeeklyCalendar from "./WeeklyCalendar";
import LocationAutocomplete from "./LocationAutocomplete";
import { supabase } from "@/lib/supabase";
import { useSession } from "next-auth/react";
import { calculateDiscount } from "@/lib/discounts";
import { saveBooking } from "@/lib/bookings";
import { useCurrency } from "@/lib/currency";


export default function BookingModal({ isOpen, onClose, serviceData, initialPax = 1, initialDate = "", startStep = 1, onPackageChange, onPaxChange, onDateChange }) {
  const formatIDR = (num) => `IDR ${Number(num).toLocaleString('id-ID')}`;
  const [mounted, setMounted] = useState(false);
  const { formatPrice } = useCurrency();
  const [step, setStep] = useState(1);
  const [localPackage, setLocalPackage] = useState("Standard");
  const { data: session } = useSession();
  
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showAgreementError, setShowAgreementError] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('savedPromoCode');
    if (saved) {
      setPromoCode(saved);
    }
  }, []);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: String(initialPax),
    duration: "1",
    pickupLocation: { name: "", url: "" },
    dropoffLocation: { name: "", url: "" },
    notes: "",
  });

  const initializedSession = useRef(false);

  useEffect(() => {
    if (isOpen && !initializedSession.current) {
      setStep((serviceData?.type === "tour" || serviceData?.type === "activities") && (serviceData?.hasAllInclusive || serviceData?.allInclusiveSurcharge) ? 0 : startStep);
      setAgreedToTerms(false);
      setShowAgreementError(false);
      const minP = serviceData?.minPax || 1;
      
      // Auto-fill from local profile
      let savedName = "";
      let savedPhone = "";
      try {
        const savedProfile = localStorage.getItem("balance_island_profile");
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          savedName = `${parsed.firstName || ""} ${parsed.lastName || ""}`.trim();
          savedPhone = parsed.phone || "";
        }
      } catch (e) {
        // ignore parse error
      }

      setFormData(prev => ({ 
        ...prev, 
        guests: String(Math.max(minP, initialPax)),
        date: initialDate || prev.date,
        name: prev.name || savedName,
        phone: prev.phone || savedPhone
      }));
      setLocalPackage(serviceData?.selectedPackage || "Standard");
      initializedSession.current = true;
    } else if (!isOpen) {
      initializedSession.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handlePackageSelect = (pkg) => {
    setLocalPackage(pkg);
    if (onPackageChange) onPackageChange(pkg);
  };

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuestsChange = (newGuests) => {
    const minP = serviceData?.minGroupPax || serviceData?.minPax || 1;
    const maxP = serviceData?.maxGroupPax || serviceData?.maxPax || 99;
    const finalGuests = Math.min(maxP, Math.max(minP, newGuests));
    setFormData(prev => ({ ...prev, guests: String(finalGuests) }));
    if (onPaxChange) onPaxChange(finalGuests);
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setAppliedDiscount(null);
      setPromoError('');
      return;
    }
    
    try {
      const res = await fetch('/api/discounts');
      const codes = await res.json();
      const found = codes.find(c => c.code.toUpperCase() === promoCode.trim().toUpperCase() && c.active);
      
      if (found) {
        if (found.applicableTours && found.applicableTours.length > 0 && !found.applicableTours.includes(serviceData?.id)) {
           setAppliedDiscount(null);
           setPromoError('This promo code is not valid for this tour.');
           return;
        }

        setAppliedDiscount(found);
        setPromoError('');
      } else {
        setAppliedDiscount(null);
        setPromoError('Invalid or inactive code');
      }
    } catch(err) {
      console.error(err);
      setPromoError('Error verifying code');
    }
  };

  const getMultiplierPrice = (p) => {
    if (!p) return 0;
    return Math.floor(p > 1000 ? p : p * 1000);
  };

  const getPerPersonPrice = () => {
    let pax = parseInt(formData.guests) || 1;
    let basePrice = getMultiplierPrice(serviceData?.price);
    
    if (localPackage === 'All Inclusive') {
       basePrice = getMultiplierPrice(serviceData?.allInclusiveSurcharge) || basePrice;
       if (serviceData?.allInclusiveTiers && serviceData.allInclusiveTiers.length > 0) {
          let sortedTiers = [...serviceData.allInclusiveTiers].sort((a, b) => Number(b.pax) - Number(a.pax));
          let applicableTier = sortedTiers.find(t => pax >= Number(t.pax));
          if (applicableTier) basePrice = getMultiplierPrice(applicableTier.price);
       }
    } else if (serviceData?.pricingType === "Per Group") {
       if (serviceData.groupPricingMode !== "flat" && serviceData.groupTiers && serviceData.groupTiers.length > 0) {
          const matchedTier = serviceData.groupTiers.find(t => {
             const min = Number(t.minPax || 1);
             const max = t.maxPax ? Number(t.maxPax) : 999;
             return pax >= min && pax <= max;
          }) || serviceData.groupTiers[serviceData.groupTiers.length - 1];
          if (matchedTier && matchedTier.price) {
             basePrice = getMultiplierPrice(matchedTier.price);
          }
       } else if (serviceData.groupPrice) {
          basePrice = getMultiplierPrice(serviceData.groupPrice);
       }
    } else if (serviceData?.tourTiers && serviceData.tourTiers.length > 0) {
       let sortedTiers = [...serviceData.tourTiers].sort((a, b) => Number(b.pax) - Number(a.pax));
       let applicableTier = sortedTiers.find(t => pax >= Number(t.pax));
       if (applicableTier) basePrice = getMultiplierPrice(applicableTier.price);
    }
    return basePrice;
  };

  const getBaseTotal = () => {
    if (!serviceData) return 0;
    
    let pax = parseInt(formData.guests) || 1;
    let basePrice = getPerPersonPrice();
    
    if (serviceData.type === 'scooter') {
       return basePrice * (parseInt(formData.duration) || 1);
    } else if (["tour", "spa", "transport", "activities"].includes(serviceData?.type?.toLowerCase())) {
       if (localPackage === 'All Inclusive') {
          return basePrice; // All inclusive is a flat group fee
       } else if (serviceData?.pricingType === "Per Group") {
          if (serviceData.groupPricingMode === "flat") {
              return basePrice;
          } else {
              return basePrice * pax;
          }
       } else if (serviceData?.tourTiers && serviceData.tourTiers.length > 0) {
          return basePrice * pax;
       } else {
          return basePrice * pax;
       }
    }
    return basePrice;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    const baseTotal = getBaseTotal();
    const discountAmt = calculateDiscount(baseTotal, appliedDiscount, parseInt(formData.guests) || 1);
    const total = baseTotal - discountAmt;
    
    // Generate Random Booking ID
    const bookingId = `BI-${Math.floor(100000 + Math.random() * 900000)}`;
    const sType = serviceData?.type?.toUpperCase() || "SERVICE";
    const sTitle = serviceData?.title?.toUpperCase() || "UNKNOWN";
    const divider = "━━━━━━━━━━━━━━━━━━━━━━";
    
    let messageDetails = `*BALANCE ISLAND BOOKING*\n${divider}\n*SERVICE:* ${sType}\n*TITLE:* ${sTitle}\n*PACKAGE:* ${localPackage}\n${divider}\n*NAME:* ${formData.name}\n*DATE:* ${formData.date}`;
    
    if (serviceData?.type === "tour") {
      messageDetails += `\n*GUESTS:* ${formData.guests} Pax\n*PICKUP:* ${formData.pickupLocation.name}`;
    } else if (serviceData?.type === "spa") {
      messageDetails += `\n*TIME:* ${formData.time}\n*GUESTS:* ${formData.guests} Pax\n*LOCATION:* ${formData.pickupLocation.name}`;
    } else if (serviceData?.type === "scooter") {
      messageDetails += `\n*DURATION:* ${formData.duration} Days\n*DELIVERY LOC:* ${formData.pickupLocation.name}`;
    } else if (serviceData?.type === "transport") {
      messageDetails += `\n*TIME:* ${formData.time}\n*PASSENGERS:* ${formData.guests} Pax\n*PICKUP:* ${formData.pickupLocation.name}`;
      messageDetails += `\n*DROPOFF:* ${formData.dropoffLocation.name}`;
    }

    if (formData.notes) {
      messageDetails += `\n*NOTES:* ${formData.notes}`;
    }

    messageDetails += `\n${divider}`;
    if (appliedDiscount) {
      messageDetails += `\n*ORIGINAL PRICE:* ${formatIDR(baseTotal)}`;
      messageDetails += `\n*DISCOUNT:* -${formatIDR(discountAmt)}`;
      messageDetails += `\n*TOTAL ESTIMATE:* ${formatIDR(total)} (Code: ${appliedDiscount.code})`;
    } else {
      messageDetails += `\n*TOTAL ESTIMATE:* ${formatIDR(total)}`;
    }

    const waUrl = `https://wa.me/6285174119423?text=${encodeURIComponent(messageDetails)}`;
    
    try {
      const { error } = await supabase.from('bookings').insert({
        id: bookingId,
        customer_name: formData.name,
        contact_info: formData.phone,
        service_name: sTitle,
        booking_date: formData.date,
        amount: formatIDR(total),
        status: 'Pending',
        category: serviceData?.type === "tour" ? "Tour" : serviceData?.type === "transport" ? "Transport" : "Activities",
        details: {
          guests: formData.guests,
          package: localPackage,
          time: formData.time,
          duration: formData.duration,
          pickup_location: formData.pickupLocation.name,
          dropoff_location: formData.dropoffLocation.name,
          notes: formData.notes,
          customer_email: session?.user?.email || null,
          image: serviceData?.image || null
        }
      });
      if (error) {
        console.error("Failed to save booking to Supabase:", error);
      } else {
        saveBooking(bookingId);
      }
    } catch (err) {
      console.error("Booking save error:", err);
    }

    window.location.href = waUrl;
    onClose();
  };

  // --- Display Math Logic ---
  const paxCount = parseInt(formData.guests) || 1;
  const calcBaseTotal = getBaseTotal();
  const calcTotalDiscount = appliedDiscount ? calculateDiscount(calcBaseTotal, appliedDiscount, paxCount) : 0;
  const calcFinalTotal = calcBaseTotal - calcTotalDiscount;

  const isPerPersonDisplay = true;
  const displayBasePrice = calcBaseTotal / paxCount;
  const displayDiscount = calcTotalDiscount / paxCount;
  const finalDisplayPrice = displayBasePrice - displayDiscount;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in transition-opacity" onClick={onClose} />
      
      {/* Modal Surface */}
      <div className="relative w-full h-[100dvh] md:h-auto md:max-h-[90dvh] md:w-[500px] bg-white rounded-none md:rounded-[32px] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          {(step === 2 || step === 3 || (step === 1 && (serviceData?.hasAllInclusive || serviceData?.allInclusiveSurcharge))) ? (
            <button type="button" onClick={() => setStep(step - 1)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-primary active:scale-95">
              <ChevronLeft size={20} strokeWidth={2.5} className="pr-0.5" />
            </button>
          ) : (
            <div className="w-8 h-8" />
          )}
          <h2 className="text-[18px] md:text-[20px] font-extrabold text-primary">{step === 0 ? 'Select Your Experience' : step === 1 ? 'Select Participants' : step === 2 ? 'Booking Details' : 'Review Details'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-primary active:scale-95">
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content/Form (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
          
          {/* Service Summary snippet */}
          {serviceData && (
            <div className="flex gap-4 items-center mb-8 bg-gray-50 p-3 pl-4 rounded-2xl">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                <Calendar className="text-primary" size={24} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{serviceData.type}</p>
                <h3 
                   onClick={onClose}
                   className="font-extrabold text-[15px] text-primary truncate leading-tight cursor-pointer hover:text-accent hover:underline decoration-accent underline-offset-2 transition-all"
                   title="Click to view full details"
                >
                   {localPackage === 'All Inclusive' && serviceData.inclusiveTitle ? serviceData.inclusiveTitle : serviceData.baseTitle || serviceData.title}
                </h3>
                {localPackage === 'All Inclusive' && step > 0 && (
                  <span className="inline-block mt-1 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded border border-green-200">
                    ALL-INCLUSIVE SELECTED
                  </span>
                )}
              </div>
            </div>
          )}

          <form onSubmit={
            step === 0 ? (e) => { e.preventDefault(); setStep(1); } : 
            step === 1 ? (e) => { e.preventDefault(); setStep(2); } : 
            step === 2 ? (e) => { e.preventDefault(); setStep(3); } : 
            handleCheckout
          } id="bookingForm" className="flex flex-col gap-5">
            
            {/* STEP 0: EXPERIENCE SELECTION */}
            {step === 0 && (
              <div className="flex flex-col gap-5">
                {(() => {
                  const parseList = (text, fallback) => {
                    if (!text) return fallback;
                    if (Array.isArray(text)) return text.length > 0 ? text : fallback;
                    if (typeof text !== 'string') return fallback;
                    // Try parsing as JSON array if it's stored that way, otherwise split by newline
                    try {
                      if (text.trim().startsWith('[')) {
                        const parsed = JSON.parse(text);
                        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                      }
                    } catch (e) {}
                    return text.split(/\n/).map(s => s.trim().replace(/^- /g, '')).filter(s => s.length > 0);
                  };
                  
                  const stdIncluded = parseList(serviceData?.included, ['Private air-conditioned vehicle & driver', 'Professional English-speaking guide', 'Hotel pickup & drop-off']);
                  const stdExcluded = parseList(serviceData?.excluded, ['All entrance fees & activity tickets', 'Meals & beverages', 'Personal expenses', 'Souvenirs', 'Alcoholic drinks', 'Optional activities', 'Tips and gratuities', 'Professional photos']);
                  const allIncIncluded = parseList(serviceData?.inclusiveIncluded, ['Private air-conditioned vehicle & driver', 'Professional English-speaking guide', 'All entrance fees & activity tickets', 'Meals (if applicable)']);
                  const commonExcluded = ['Personal expenses', 'Souvenirs', 'Alcoholic drinks', 'Optional activities', 'Tips and gratuities', 'Professional photos'];
                  
                  return (
                    <div className="flex flex-col gap-4">
                      {/* Standard Journey */}
                      <div 
                         onClick={() => handlePackageSelect('Standard')}
                         className={`p-5 rounded-3xl border-2 cursor-pointer transition-all bg-white ${localPackage === 'Standard' ? 'border-black shadow-md' : 'border-gray-200 hover:border-gray-300 shadow-sm'}`}
                      >
                         <div className="flex justify-between items-start mb-2">
                            <span className="font-black text-[18px] text-primary">Standard Journey</span>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-2 transition-colors ${localPackage === 'Standard' ? 'border-black bg-black' : 'border-gray-300 bg-transparent'}`}>
                              {localPackage === 'Standard' && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                            </div>
                         </div>
                         <p className="text-[13px] font-medium leading-relaxed mb-5 text-gray-500">Essential driver and guide service. Entrance fees are not included.</p>
                         
                         <div className="flex flex-col gap-2.5">
                           <span className="text-[11px] font-bold uppercase tracking-wider mb-0.5 text-gray-400">Included</span>
                           <ul className="flex flex-col gap-1.5 pl-4 list-disc text-primary marker:text-gray-300">
                             {stdIncluded.map((item, idx) => (
                               <li key={`inc-${idx}`} className="text-[13px] font-medium pl-1 leading-snug">{item}</li>
                             ))}
                           </ul>
                           
                           <div className="h-px w-full my-1.5 bg-gray-100" />
                           <span className="text-[11px] font-bold uppercase tracking-wider mb-0.5 text-gray-400">Not Included</span>
                           
                           <ul className="flex flex-col gap-1.5 pl-4 list-disc text-gray-500 marker:text-gray-200">
                             {stdExcluded.map((item, idx) => (
                               <li key={`exc-${idx}`} className="text-[13px] font-medium pl-1 leading-snug">{item}</li>
                             ))}
                           </ul>
                         </div>
                      </div>

                      {/* All Inclusive Experience */}
                      <div 
                         onClick={() => handlePackageSelect('All Inclusive')}
                         className={`p-5 rounded-3xl border-2 cursor-pointer transition-all bg-white ${localPackage === 'All Inclusive' ? 'border-black shadow-md' : 'border-gray-200 hover:border-gray-300 shadow-sm'}`}
                      >
                         <div className="flex justify-between items-start mb-2">
                            <span className="font-black text-[18px] text-primary pr-2">All-Inclusive Experience</span>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-2 transition-colors ${localPackage === 'All Inclusive' ? 'border-black bg-black' : 'border-gray-300 bg-transparent'}`}>
                                {localPackage === 'All Inclusive' && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                              </div>
                            </div>
                         </div>
                         <div className="mb-4">
                            <span className="inline-block text-[13px] font-extrabold text-primary bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                              {(() => {
                                const getMultiplierPrice = (rawPrice) => {
                                  const p = Number(rawPrice);
                                  if (!p) return 0;
                                  return Math.floor(p > 1000 ? p : p * 1000);
                                };
                                let minPrice = getMultiplierPrice(serviceData.allInclusiveSurcharge);
                                
                                let tiers = serviceData.allInclusiveTiers;
                                if (typeof tiers === 'string') {
                                  try {
                                    tiers = JSON.parse(tiers);
                                  } catch(e) {
                                    tiers = [];
                                  }
                                }
                                
                                if (Array.isArray(tiers) && tiers.length > 0) {
                                  minPrice = Math.min(...tiers.map(t => getMultiplierPrice(t.price)));
                                }
                                return formatIDR(minPrice);
                              })()}
                            </span>
                         </div>

                         <p className="text-[13px] font-medium leading-relaxed mb-5 text-gray-500">Everything taken care of. Includes all required tickets and fees for a seamless day.</p>
                         
                         <div className="flex flex-col gap-2.5">
                           <span className="text-[11px] font-bold uppercase tracking-wider mb-0.5 text-gray-400">Included</span>
                           
                           <ul className="flex flex-col gap-1.5 pl-4 list-disc text-primary marker:text-gray-300">
                             {allIncIncluded.map((item, idx) => (
                               <li key={`ainc-${idx}`} className="text-[13px] font-medium pl-1 leading-snug">{item}</li>
                             ))}
                           </ul>
                           
                           <div className="h-px w-full my-1.5 bg-gray-100" />
                           <span className="text-[11px] font-bold uppercase tracking-wider mb-0.5 text-gray-400">Not Included</span>
                           
                           <ul className="flex flex-col gap-1.5 pl-4 list-disc text-gray-500 marker:text-gray-200">
                             {commonExcluded.map((item, idx) => (
                               <li key={`aexc-${idx}`} className="text-[13px] font-medium pl-1 leading-snug">{item}</li>
                             ))}
                           </ul>
                         </div>
                      </div>
                    </div>
                  );
                })()}
                
                <div className="mt-4 pb-4">
                  <button type="button" onClick={() => setStep(1)} className="w-full bg-[#1c1c1c] text-white rounded-xl py-4 text-[16px] font-bold shadow-md hover:bg-black transition-colors active:scale-95 flex items-center justify-center gap-2">
                    Continue <ArrowRight size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 1: PARTICIPANTS & OPTIONS */}
            {step === 1 && (
              <>
                <div className="flex flex-col gap-5">
                  <div className="w-full flex-shrink-0">
                     <WeeklyCalendar value={formData.date} onChange={(dateStr) => {
                       handleInputChange({ target: { name: 'date', value: dateStr }});
                       if (onDateChange) onDateChange(dateStr);
                     }} />
                  </div>

                  {/* Time (for Spa, Transport) */}
                  {(serviceData?.type === "spa" || serviceData?.type === "transport") && (
                    <div className="flex-1 flex flex-col gap-2 relative">
                       <label className="text-[13px] font-bold text-primary ml-1">Preferred Time</label>
                       <div className="relative flex items-center">
                         <Clock className="absolute left-4 text-gray-400" size={18} />
                         <input required type="time" name="time" value={formData.time} onChange={handleInputChange} className="w-full bg-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-[15px] font-medium text-primary outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none" style={{ colorScheme: 'light' }} />
                       </div>
                    </div>
                  )}
                </div>


                {/* Guests / Pax */}
                {(["tour", "spa", "transport"].includes(serviceData?.type)) && (
                   <div className="flex items-center justify-between mt-1 bg-white/5 p-3 rounded-2xl border border-transparent hover:border-gray-200 transition-colors">
                     <div className="flex items-center gap-3">
                       <div className="bg-white p-2 rounded-xl shadow-sm">
                         <Users className="text-primary" size={18} />
                       </div>
                       <span className="font-bold text-primary text-[14px]">Number of Pax</span>
                     </div>
                     <div className="flex items-center gap-4 mr-1">
                       <button 
                         type="button"
                         onClick={() => handleGuestsChange(parseInt(formData.guests || 1) - 1)} 
                         className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-primary shadow-sm hover:bg-white/20 active:scale-95 transition-all"
                       >
                         <Minus size={16} strokeWidth={3} />
                       </button>
                       <span className="font-extrabold text-primary text-[16px] w-4 text-center">{formData.guests}</span>
                       <button 
                         type="button"
                         onClick={() => handleGuestsChange(parseInt(formData.guests || 1) + 1)} 
                         className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-primary shadow-sm hover:bg-white/20 active:scale-95 transition-all"
                       >
                         <Plus size={16} strokeWidth={3} />
                       </button>
                     </div>
                   </div>
                )}

                 {/* VW Notification */}
                 {serviceData?.title?.toLowerCase().includes('vw') && parseInt(formData.guests) > 3 && (
                   <div className="bg-gray-50 border border-gray-300 p-3 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 mt-1 shadow-sm">
                     <div className="bg-gray-100 p-1.5 rounded-full shrink-0"><Info className="text-black" size={16} strokeWidth={2.5} /></div>
                     <p className="text-[12px] font-bold text-black leading-snug pt-0.5">A classic VW Safari fits max 3 passengers. Your group will get multiple cars to travel in a fun convoy!</p>
                   </div>
                 )}

                {/* Duration (Scooter) */}
                {(serviceData?.type === "scooter") && (
                   <div className="flex items-center justify-between mt-1 bg-white/5 p-3 rounded-2xl border border-transparent hover:border-gray-200 transition-colors">
                     <div className="flex items-center gap-3">
                       <div className="bg-white p-2 rounded-xl shadow-sm">
                         <Clock className="text-primary" size={18} />
                       </div>
                       <span className="font-bold text-primary text-[14px]">Rental Duration (Days)</span>
                     </div>
                     <div className="flex items-center gap-4 mr-1">
                       <button 
                         type="button"
                         onClick={() => setFormData(p => ({...p, duration: String(Math.max(1, parseInt(p.duration || 1) - 1))}))} 
                         className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-primary shadow-sm hover:bg-white/20 active:scale-95 transition-all"
                       >
                         <Minus size={16} strokeWidth={3} />
                       </button>
                       <span className="font-extrabold text-primary text-[16px] w-4 text-center">{formData.duration}</span>
                       <button 
                         type="button"
                         onClick={() => setFormData(p => ({...p, duration: String(parseInt(p.duration || 1) + 1)}))} 
                         className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-primary shadow-sm hover:bg-white/20 active:scale-95 transition-all"
                       >
                         <Plus size={16} strokeWidth={3} />
                       </button>
                     </div>
                   </div>
                )}
              </>
            )}

            {/* STEP 2: PERSONAL & BOOKING DETAILS */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col gap-5">
                <div className="flex flex-col gap-2 relative">
                   <label className="text-[13px] font-bold text-primary ml-1">Full Name</label>
                   <div className="relative flex items-center">
                     <User className="absolute left-4 text-gray-400" size={18} />
                     <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="w-full bg-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-[15px] font-medium text-primary outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400" />
                   </div>
                </div>

                {/* Location (Pickup, Villa, Delivery) */}
                <div className="flex flex-col gap-2 relative mt-1">
                   <label className="text-[13px] font-bold text-primary ml-1">Hotel / Villa</label>
                   <LocationAutocomplete 
                     value={formData.pickupLocation.name}
                     onChange={(val) => setFormData(p => ({ ...p, pickupLocation: val }))}
                     placeholder="e.g. Grand Hyatt Nusa Dua"
                     icon={MapPin}
                   />
                </div>

                {/* Dropoff Location (Transport only) */}
                {(serviceData?.type === "transport") && (
                   <div className="flex flex-col gap-2 relative mt-1">
                     <label className="text-[13px] font-bold text-primary ml-1">Drop-off Location</label>
                     <LocationAutocomplete 
                       value={formData.dropoffLocation.name}
                       onChange={(val) => setFormData(p => ({ ...p, dropoffLocation: val }))}
                       placeholder="e.g. Ngurah Rai Airport"
                       icon={MapPin}
                     />
                   </div>
                )}


                {/* Notes to driver / guide */}
                <div className="flex flex-col gap-2 relative mt-1">
                   <label className="text-[13px] font-bold text-primary ml-1">Note to the driver or guide (Optional)</label>
                   <div className="relative flex items-start">
                     <MessageSquare className="absolute left-4 top-4 text-gray-400" size={18} />
                     <textarea 
                       name="notes" 
                       value={formData.notes || ""} 
                       onChange={handleInputChange} 
                       placeholder="e.g. Please bring a baby seat, I am celebrating an anniversary..." 
                       className="w-full bg-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-[15px] font-medium text-primary outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400 min-h-[100px] resize-none border border-transparent hover:border-gray-100" 
                     />
                   </div>
                </div>

              </div>
            )}

            {/* STEP 3: REVIEW DETAILS */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col gap-4 pb-4">
                <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 flex flex-col gap-4 shadow-sm relative overflow-hidden">
                   
                   {/* Background accent */}
                   <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

                   <div className="flex flex-col gap-1 pb-4 border-b border-gray-100 relative z-10">
                     <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Customer</span>
                     <span className="text-[15px] font-black text-primary">{formData.name}</span>
                   </div>
                   
                   {(serviceData?.type === "tour" || serviceData?.type === "spa" || serviceData?.type === "transport") && (
                     <div className="flex flex-col gap-1 pb-4 border-b border-gray-100 relative z-10">
                       <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Hotel / Villa</span>
                       <span className="text-[15px] font-bold text-primary">{formData.pickupLocation.name || '-'}</span>
                     </div>
                   )}
                   
                   <div className="flex justify-between items-center pb-4 border-b border-gray-100 relative z-10">
                     <div className="flex flex-col gap-1">
                       <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</span>
                       <span className="text-[15px] font-bold text-primary">{formData.date}</span>
                     </div>
                     {(serviceData?.type === "tour" || serviceData?.type === "activities") && (
                       <div className="flex flex-col gap-1 items-end">
                         <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Participants</span>
                         <span className="text-[15px] font-bold text-primary">{formData.guests} Pax</span>
                       </div>
                     )}
                   </div>

                   <div className="flex flex-col gap-2 pt-1 relative z-10">
                     <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Trip Summary</span>
                     <span className="text-[15px] font-black text-primary leading-snug">
                       {serviceData.title} <span className="text-gray-500 font-bold ml-1">({localPackage})</span>
                     </span>
                     
                     {formData.notes && (
                       <div className="mt-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                         <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Notes</span>
                         <span className="text-[13px] text-gray-600 font-medium leading-relaxed">{formData.notes}</span>
                       </div>
                     )}
                     
                     <div className="mt-3 bg-[#111111] p-4 rounded-2xl flex items-start gap-3 border border-black/10 shadow-md">
                       <div className="bg-white/10 p-1.5 rounded-full shrink-0 mt-0.5">
                         <Info size={16} className="text-white" strokeWidth={2.5} />
                       </div>
                       <span className="text-[13px] font-bold text-white leading-snug">
                         Exact pickup time will be confirmed securely with you via WhatsApp.
                       </span>
                     </div>
                   </div>
                </div>
              </div>
            )}

          </form>
        </div>

        {/* Footer / Actions */}
        {step > 0 && (
          <div className="p-6 border-t border-white/5 shrink-0 bg-transparent rounded-b-[32px] mt-auto">
             {serviceData && (
             <>
               {step === 1 && (
                 <div className="mb-6 px-1">
                   <div className="flex items-center gap-2 mb-2">
                      <input 
                        type="text" 
                        placeholder="Promo Code" 
                        value={promoCode} 
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())} 
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-1 text-sm font-bold text-primary placeholder:text-gray-400 outline-none focus:border-black uppercase transition-colors"
                      />
                      <button 
                        type="button" 
                        onClick={handleApplyPromo}
                        className="bg-[#1c1c1c] text-white px-5 py-3 rounded-xl font-bold text-sm shrink-0"
                      >
                        Apply
                      </button>
                   </div>
                   {promoError && <p className="text-red-500 text-xs font-bold">{promoError}</p>}
                   {appliedDiscount && <p className="text-green-600 text-xs font-bold">Discount applied: {appliedDiscount.code}</p>}
                 </div>
               )}
               
               {step === 1 && (
                  <div className="flex justify-between items-center mb-6 px-1">
                    <span className="text-[14px] font-bold text-gray-500">
                      {isPerPersonDisplay ? "Price per person" : "Expected Total"}
                    </span>
                    <div className="flex flex-col items-end">
                       {appliedDiscount && (
                         <span className="text-[12px] font-bold text-gray-400 line-through mb-0.5">
                           {formatPrice(displayBasePrice)}
                         </span>
                       )}
                       <span className="text-[22px] font-black tracking-tight text-[#1c1c1c]">
                         {formatPrice(finalDisplayPrice)}
                       </span>
                    </div>
                  </div>
                )}
             </>
           )}
           {step === 3 && (
             <div className="flex justify-between items-center mb-6 px-1 py-4 border-y border-gray-100">
               <span className="text-[14px] font-bold text-gray-500">Total Price</span>
               <div className="flex flex-col items-end">
                  {appliedDiscount && (
                    <span className="text-[12px] font-bold text-gray-400 line-through mb-0.5">
                      {formatPrice(calcBaseTotal)}
                    </span>
                  )}
                  <span className="text-[22px] font-black tracking-tight text-primary">
                    {formatPrice(calcFinalTotal)}
                  </span>
               </div>
             </div>
           )}
           <button form="bookingForm" type="submit" className="w-full bg-black hover:bg-neutral-800 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white transition-all active:scale-95 text-[16px] shadow-sm">
             {step === 1 ? (
                isPerPersonDisplay ? 
                (serviceData ? `Continue • ${formatPrice(calcFinalTotal)}` : 'Continue to Details') : 
                'Continue to Details'
             ) : step === 2 ? 'Review Booking' : 'Confirm via WhatsApp'} <ArrowRight size={18} strokeWidth={2.5} />
           </button>
           {step === 3 && (
             <p className="text-center text-[12px] font-medium text-gray-400 mt-4 px-4 leading-snug">
               You will be redirected to WhatsApp to confirm details securely. No payment is required right now.
             </p>
           )}
          </div>
        )}

      </div>
    </div>
  );
}
