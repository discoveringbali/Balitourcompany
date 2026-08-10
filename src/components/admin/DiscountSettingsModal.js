"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Tag, Percent, Check, AlertCircle, Copy } from "lucide-react";

const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

export default function DiscountSettingsModal({ isOpen, onClose }) {
  const [codes, setCodes] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/discounts')
        .then(res => res.json())
        .then(data => {
           setCodes(Array.isArray(data) ? data : []);
        })
        .catch(err => console.error("Error fetching discounts:", err));
      setIsSaved(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      await fetch('/api/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(codes)
      });
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving discounts:", error);
    }
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const addCode = () => {
    const newEntry = {
      code: `PROMO${Math.floor(10 + Math.random() * 90)}`,
      type: "percent",
      value: 10,
      active: true
    };
    setCodes([newEntry, ...codes]);
  };

  const updateCode = (idx, field, val) => {
    const updated = [...codes];
    updated[idx][field] = val;
    setCodes(updated);
  };

  const deleteCode = (idx) => {
    setCodes(codes.filter((_, i) => i !== idx));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const activeCount = codes.filter(c => c.active).length;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#1c1c1c]/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Container (Bottom Sheet on Mobile, Centered Card on Desktop) */}
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl z-10 flex flex-col max-h-[92dvh] sm:max-h-[85vh] animate-slideUp sm:animate-scaleIn overflow-hidden">
        
        {/* Mobile Swipe / Drag Pill Handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#eaeaea] shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1c1c1c] flex items-center justify-center text-white shadow-sm shrink-0">
              <Tag size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-[#1c1c1c] tracking-tight">
                  Discount Codes
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-black text-white">
                  {activeCount} Active
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium">
                Set promo codes & fixed or percent discounts
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose} 
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1c1c1c] hover:bg-gray-200 transition-colors"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>
        
        {/* Scrollable Codes List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {codes.length === 0 ? (
            <div className="text-center py-12 px-4 bg-[#f9f9f9] rounded-2xl border border-dashed border-[#eaeaea]">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#eaeaea] flex items-center justify-center mx-auto mb-3 text-gray-400 shadow-sm">
                <Tag size={22} />
              </div>
              <h4 className="font-extrabold text-sm text-[#1c1c1c]">No Discount Codes Yet</h4>
              <p className="text-xs text-gray-400 font-medium mt-1 max-w-xs mx-auto">
                Create promotional discount codes for your customers to apply during checkout.
              </p>
              <button 
                onClick={addCode} 
                className="mt-4 inline-flex items-center gap-1.5 bg-[#1c1c1c] text-white px-4 py-2 rounded-xl text-xs font-extrabold hover:bg-black transition-all shadow-sm active:scale-95"
              >
                <Plus size={14} strokeWidth={3} /> Create First Code
              </button>
            </div>
          ) : (
            codes.map((c, idx) => (
              <div 
                key={idx} 
                className={`bg-[#f9f9f9] border rounded-2xl p-4 transition-all duration-200 ${
                  c.active ? "border-[#eaeaea] shadow-[0_2px_12px_rgba(0,0,0,0.02)]" : "border-gray-200 opacity-60 bg-gray-50/70"
                }`}
              >
                {/* Card Top Row: Code Name & Active Switch + Delete */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-200/60">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-black text-white text-[10px] font-black flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <input 
                        type="text" 
                        value={c.code}
                        onChange={(e) => updateCode(idx, "code", e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))}
                        className="w-full bg-white border border-[#eaeaea] rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-black text-[#1c1c1c] tracking-wider uppercase outline-none focus:border-[#1c1c1c] focus:ring-1 focus:ring-black"
                        placeholder="CODE"
                        maxLength={20}
                      />
                      <button
                        onClick={() => copyToClipboard(c.code)}
                        title="Copy promo code"
                        className="p-1.5 rounded-lg bg-white border border-[#eaeaea] text-gray-400 hover:text-[#1c1c1c] transition-colors shrink-0"
                      >
                        {copiedCode === c.code ? <Check size={13} className="text-black" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>

                  {/* Active Toggle & Delete */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateCode(idx, "active", !c.active)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black transition-colors ${
                        c.active 
                          ? "bg-black text-white hover:bg-neutral-800" 
                          : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${c.active ? "bg-white" : "bg-gray-400"}`} />
                      {c.active ? "Active" : "Off"}
                    </button>

                    <button 
                      onClick={() => deleteCode(idx)} 
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-colors"
                      title="Delete Code"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Card Bottom Row: Type selector & Value input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  {/* Segmented Type Control */}
                  <div>
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                      Discount Type
                    </label>
                    <div className="grid grid-cols-2 gap-1 bg-white border border-[#eaeaea] p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => updateCode(idx, "type", "percent")}
                        className={`py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                          c.type === "percent" 
                            ? "bg-[#1c1c1c] text-white shadow-sm" 
                            : "text-gray-500 hover:text-[#1c1c1c]"
                        }`}
                      >
                        Percent (%)
                      </button>
                      <button
                        type="button"
                        onClick={() => updateCode(idx, "type", "fixed")}
                        className={`py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                          c.type === "fixed" 
                            ? "bg-[#1c1c1c] text-white shadow-sm" 
                            : "text-gray-500 hover:text-[#1c1c1c]"
                        }`}
                      >
                        Fixed (IDR)
                      </button>
                    </div>
                  </div>

                  {/* Discount Value */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                        Discount Value
                      </label>
                      <span className="text-[10px] font-bold text-gray-500">
                        {c.type === "percent" ? `${c.value || 0}% Off` : formatIDR(c.value || 0)}
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-black text-gray-400 pointer-events-none">
                        {c.type === "percent" ? "%" : "Rp"}
                      </span>
                      <input 
                        type="number" 
                        inputMode="numeric"
                        min="1"
                        max={c.type === "percent" ? 100 : 100000000}
                        value={c.value === undefined ? "" : c.value}
                        onChange={(e) => updateCode(idx, "value", Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full bg-white border border-[#eaeaea] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm font-black text-[#1c1c1c] outline-none focus:border-[#1c1c1c] focus:ring-1 focus:ring-black"
                        placeholder={c.type === "percent" ? "10" : "50000"}
                      />
                    </div>
                  </div>
                </div>

                {/* Helper Preview Badge */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-500 font-medium bg-white/70 px-3 py-1.5 rounded-xl border border-gray-100">
                  <span>Customer checkout preview:</span>
                  <span className="font-extrabold text-[#1c1c1c]">
                    {c.type === "percent" ? `-${c.value || 0}% off total` : `-${formatIDR(c.value || 0)} off`}
                  </span>
                </div>

              </div>
            ))
          )}

          {codes.length > 0 && (
            <button 
              onClick={addCode} 
              className="w-full py-3 border-2 border-dashed border-gray-200 hover:border-gray-400 text-gray-600 font-extrabold rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-[0.99]"
            >
              <Plus size={16} strokeWidth={3} className="text-[#1c1c1c]" /> 
              <span>Add Another Promo Code</span>
            </button>
          )}
        </div>
        
        {/* Modal Sticky Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#eaeaea] bg-white shrink-0 flex gap-3 pb-8 sm:pb-5">
          <button 
            onClick={onClose} 
            className="flex-1 py-3.5 bg-gray-100 text-[#1c1c1c] font-extrabold text-xs sm:text-sm rounded-xl hover:bg-gray-200 transition-colors active:scale-95"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className={`flex-[2] py-3.5 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${
              isSaved ? "bg-black hover:bg-neutral-800" : "bg-[#1c1c1c] hover:bg-black"
            }`}
          >
            {isSaved ? (
              <>
                <Check size={16} strokeWidth={3} /> Saved Successfully
              </>
            ) : (
              <>
                Save Changes
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
