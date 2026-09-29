import React from "react";
import Link from "next/link";
import { ChevronLeft, CarFront, UserCheck, HeartPulse } from "lucide-react";

export const metadata = {
  title: "Safety & Trust | Balance Island",
  description: "Your safety is our priority in Bali."
};

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-10">
      <div className="max-w-4xl mx-auto w-full px-6 py-12 flex-grow">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors">
          <ChevronLeft size={20} className="mr-1" />
          Back to Home
        </Link>
        <h1 className="text-[32px] md:text-[40px] font-black text-gray-900 mb-6 tracking-tight">Safety & Trust</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <p className="text-gray-600 mb-10 text-[16px] leading-relaxed">
            Bali is a beautiful and welcoming island, but navigating the roads and tourist spots requires local expertise. Your safety is the core foundation of PT BALANCE ISLAND INDONESIA.
          </p>
          
          <div className="space-y-8">
            <div className="flex gap-5 items-start">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600 shrink-0">
                <CarFront size={24} />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-gray-900 mb-2">Road & Vehicle Safety</h3>
                <p className="text-gray-600 text-[15px] leading-relaxed">
                  Traffic in Bali can be chaotic. All vehicles provided by Balance Island are well-maintained, regularly serviced, and fully air-conditioned. Our drivers prioritize safe, smooth driving over rushing.
                </p>
              </div>
            </div>
            
            <div className="flex gap-5 items-start">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600 shrink-0">
                <UserCheck size={24} />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-gray-900 mb-2">Vetted Professionals</h3>
                <p className="text-gray-600 text-[15px] leading-relaxed">
                  We don't work with random street vendors. Every guide and driver is interviewed, vetted, and monitored based on consistent customer feedback to ensure they meet international hospitality standards.
                </p>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600 shrink-0">
                <HeartPulse size={24} />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-gray-900 mb-2">24/7 Emergency Support</h3>
                <p className="text-gray-600 text-[15px] leading-relaxed">
                  If you feel unwell, lose an item, or face any emergency during a tour, our 24/7 local support team and your dedicated guide will assist you immediately, coordinating with local authorities or clinics if necessary.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
