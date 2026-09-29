import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Refund Policy | Balance Island",
  description: "Learn about our cancellation and refund policies."
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-10">
      <div className="max-w-4xl mx-auto w-full px-6 py-12 flex-grow">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors">
          <ChevronLeft size={20} className="mr-1" />
          Back to Home
        </Link>
        <h1 className="text-[32px] md:text-[40px] font-black text-gray-900 mb-6 tracking-tight">Refund & Cancellation Policy</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="prose prose-gray max-w-none text-gray-600 space-y-6">
            <p>At Balance Island, we understand that travel plans can change. We aim to provide a fair and flexible refund policy for all our customers.</p>
            
            <h3 className="text-gray-900 font-bold text-lg mt-8">Standard Cancellation</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Up to 24 hours before the start time:</strong> Full 100% refund on most day tours and private driver bookings.</li>
              <li><strong>Less than 24 hours before the start time:</strong> No refund can be provided, as operators have already allocated their time and resources.</li>
            </ul>

            <h3 className="text-gray-900 font-bold text-lg mt-8">Weather-Dependent Activities</h3>
            <p>If an activity (such as a fast boat to Nusa Penida or a Mt. Batur trek) is canceled by the operator or local authorities due to unsafe weather conditions, you will be offered the choice to reschedule or receive a <strong>full refund</strong>.</p>

            <h3 className="text-gray-900 font-bold text-lg mt-8">No-Shows</h3>
            <p>If you fail to show up for your tour without prior notice, no refund will be issued.</p>

            <h3 className="text-gray-900 font-bold text-lg mt-8">How to Request a Refund</h3>
            <p>To cancel a booking and request a refund, please contact our support team via WhatsApp or email with your Booking ID. Refunds are typically processed back to your original payment method within 3-7 business days.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
