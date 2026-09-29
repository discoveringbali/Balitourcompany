import React from "react";
import Link from "next/link";
import { ChevronLeft, ShieldCheck, CheckCircle2, Lock } from "lucide-react";

export const metadata = {
  title: "Anti-Scam Guarantee | Balance Island",
  description: "Book with confidence. Read about our Anti-Scam Guarantee."
};

export default function GuaranteePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-10">
      <div className="max-w-4xl mx-auto w-full px-6 py-12 flex-grow">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors">
          <ChevronLeft size={20} className="mr-1" />
          Back to Home
        </Link>
        <h1 className="text-[32px] md:text-[40px] font-black text-gray-900 mb-6 tracking-tight">100% Anti-Scam Guarantee</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-green-100 p-3 rounded-full text-green-700">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="text-[22px] font-bold text-gray-900">Your Booking is Protected</h2>
              <p className="text-gray-500">Zero hidden fees. Zero scams. 100% verified operators.</p>
            </div>
          </div>
          
          <div className="prose prose-gray max-w-none text-gray-600">
            <p className="mb-4">
              Tourism in Bali is incredible, but travelers occasionally encounter unofficial "guides," hidden fees, or overpriced transport. Balance Island was built to solve exactly this problem. 
            </p>
            <p className="mb-8">
              Under the legal entity <strong>PT BALANCE ISLAND INDONESIA</strong>, we strictly regulate our operators. When you book through us, you are fully shielded from local tourism scams.
            </p>
            
            <div className="flex flex-col gap-6 mt-8">
              <div className="flex gap-4">
                <CheckCircle2 className="text-green-500 shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Fixed & Transparent Pricing</h3>
                  <p className="text-[14px]">The price you see is exactly what you pay. There are no sudden extra charges, "mandatory" donations, or surprise parking fees during your tour.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="text-green-500 shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Verified Local Operators</h3>
                  <p className="text-[14px]">We personally vet every driver and tour guide. They are legally registered, thoroughly background-checked, and required to meet our strict hospitality standards.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Lock className="text-green-500 shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Secure Payments</h3>
                  <p className="text-[14px]">Your money is held securely. If a tour operator fails to deliver the promised service, you are entitled to an immediate review and refund under our guarantee policy.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
