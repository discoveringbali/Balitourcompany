import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Help Center | Balance Island",
  description: "Information about help center at Balance Island."
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-10">
      <div className="max-w-4xl mx-auto w-full px-6 py-12 flex-grow">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors">
          <ChevronLeft size={20} className="mr-1" />
          Back to Home
        </Link>
        <h1 className="text-[32px] md:text-[40px] font-black text-gray-900 mb-6 tracking-tight">Help Center</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <p className="text-gray-500 leading-relaxed text-[15px] md:text-[16px]">
            This section is currently being updated by our team. Check back soon for comprehensive information regarding <strong>Help Center</strong>. 
          </p>
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-gray-900 font-bold mb-2">Need immediate assistance?</h3>
            <p className="text-gray-500 text-[14px]">
              Please contact our 24/7 support team via WhatsApp for any urgent queries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
