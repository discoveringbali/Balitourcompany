"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Tag, Percent, DollarSign } from "lucide-react";
import { getDiscountCodes, saveDiscountCodes } from "@/lib/discounts";

export default function DiscountSettingsModal({ isOpen, onClose }) {
  const [codes, setCodes] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setCodes(getDiscountCodes());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveDiscountCodes(codes);
    onClose();
  };

  const addCode = () => {
    setCodes([{ code: "NEWCODE", type: "percent", value: 10, active: true }, ...codes]);
  };

  const updateCode = (idx, field, val) => {
    const updated = [...codes];
    updated[idx][field] = val;
    setCodes(updated);
  };

  const deleteCode = (idx) => {
    setCodes(codes.filter((_, i) => i !== idx));
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center font-sans px-4">
      <div className="fixed inset-0 bg-[#1c1c1c]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 z-10 flex flex-col max-h-[85vh]">
         <div className="flex justify-between items-center mb-6 shrink-0">
            <h3 className="text-xl font-black text-[#1c1c1c] flex items-center gap-2">
              <Tag size={20} className="text-accent" /> Manage Discount Codes
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-[#1c1c1c]">
              <X size={20} strokeWidth={3} />
            </button>
         </div>
         
         <div className="flex-1 overflow-y-auto space-y-4 pr-1">
           {codes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="font-bold text-sm">No discount codes configured.</p>
              </div>
           ) : (
             codes.map((c, idx) => (
               <div key={idx} className="bg-[#f9f9f9] border border-[#eaeaea] rounded-2xl p-4 space-y-3 relative">
                 <div className="flex justify-between items-start gap-4">
                   <div className="flex-1">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Promo Code</label>
                     <input 
                       type="text" 
                       value={c.code}
                       onChange={(e) => updateCode(idx, "code", e.target.value.toUpperCase())}
                       className="w-full bg-white border border-[#eaeaea] rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-[#1c1c1c] uppercase"
                     />
                   </div>
                   <div className="flex-1">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Type</label>
                     <select 
                       value={c.type}
                       onChange={(e) => updateCode(idx, "type", e.target.value)}
                       className="w-full bg-white border border-[#eaeaea] rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-[#1c1c1c]"
                     >
                       <option value="percent">Percentage (%)</option>
                       <option value="fixed">Fixed Amount (IDR)</option>
                     </select>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-4">
                   <div className="flex-1">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Value</label>
                     <div className="relative">
                       <span className="absolute left-3 top-2.5 text-gray-400">
                         {c.type === "percent" ? <Percent size={14} strokeWidth={3} /> : <DollarSign size={14} strokeWidth={3} />}
                       </span>
                       <input 
                         type="number" 
                         value={c.value}
                         onChange={(e) => updateCode(idx, "value", parseFloat(e.target.value))}
                         className="w-full bg-white border border-[#eaeaea] rounded-xl pl-9 pr-3 py-2 text-sm font-bold outline-none focus:border-[#1c1c1c]"
                       />
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-2 mt-5">
                     <label className="flex items-center gap-2 cursor-pointer">
                       <input 
                         type="checkbox" 
                         checked={c.active}
                         onChange={(e) => updateCode(idx, "active", e.target.checked)}
                         className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                       />
                       <span className="text-xs font-bold text-gray-600">Active</span>
                     </label>
                   </div>
                 </div>
                 
                 <button onClick={() => deleteCode(idx)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                   <Trash2 size={16} />
                 </button>
               </div>
             ))
           )}
           
           <button onClick={addCode} className="w-full py-3 border-2 border-dashed border-[#eaeaea] text-gray-500 font-bold rounded-2xl hover:bg-[#f9f9f9] hover:text-[#1c1c1c] transition-colors flex items-center justify-center gap-2 text-sm">
             <Plus size={16} strokeWidth={3} /> Add New Code
           </button>
         </div>
         
         <div className="pt-6 border-t border-[#eaeaea] mt-6 shrink-0 flex gap-3">
           <button onClick={onClose} className="flex-1 py-3.5 bg-gray-100 text-[#1c1c1c] font-extrabold rounded-xl hover:bg-gray-200 transition-colors">
             Cancel
           </button>
           <button onClick={handleSave} className="flex-[2] py-3.5 bg-[#1c1c1c] text-white font-extrabold rounded-xl hover:bg-black transition-colors">
             Save Changes
           </button>
         </div>
      </div>
    </div>
  );
}
