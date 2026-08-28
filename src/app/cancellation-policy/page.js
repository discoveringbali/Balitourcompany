"use client";

import React from 'react';
import Footer from '@/components/Footer';

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col pt-32 pb-16">
      <div className="container mx-auto px-6 flex-grow max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-primary tracking-tight mb-4">Cancellation & Refund Policy</h1>
          <p className="text-text-secondary font-medium">Last Updated: 28 August 2026</p>
        </div>

        <div className="w-full">
          <div className="text-text-secondary space-y-6">
            <p>
              At <strong className="text-primary font-bold">Balance Island</strong>, we understand that travel plans can change. We aim to keep our cancellation and refund process fair, transparent, and easy to understand.
            </p>
            <p>
              By making a booking with Balance Island, you agree to the following Cancellation & Refund Policy.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">1. Customer Cancellation</h2>
            <p>
              Customers may cancel their booking by contacting Balance Island through the contact details provided on our website or booking confirmation.
            </p>
            <p>
              Unless a different cancellation policy is stated for a specific service, the following standard policy applies:
            </p>
            <div className="overflow-x-auto my-6">
              <table className="w-full text-left border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 p-4 font-bold text-primary">Cancellation Time</th>
                    <th className="border border-gray-200 p-4 font-bold text-primary text-right">Refund</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 p-4 font-medium text-primary">48 hours or more before the scheduled service</td>
                    <td className="border border-gray-200 p-4 font-bold text-primary text-right">100% refund</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 p-4 font-medium text-primary">24–48 hours before the scheduled service</td>
                    <td className="border border-gray-200 p-4 font-bold text-primary text-right">50% refund</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 p-4 font-medium text-primary">Less than 24 hours before the scheduled service</td>
                    <td className="border border-gray-200 p-4 font-bold text-primary text-right">No refund</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 p-4 font-medium text-primary">No-show</td>
                    <td className="border border-gray-200 p-4 font-bold text-primary text-right">No refund</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              The cancellation time is calculated based on the scheduled service time and the local time in <strong className="text-primary font-bold">Bali, Indonesia (WITA / UTC+8)</strong>.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">2. Changes to Your Booking</h2>
            <p>
              If you need to change your booking date, time, number of guests, or other booking details, please contact us as soon as possible.
            </p>
            <p>We will try to accommodate your request, subject to availability.</p>
            <p>
              A booking change may be treated as a cancellation and new booking if the requested change cannot be accommodated.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">3. Cancellation by Balance Island</h2>
            <p>
              If Balance Island needs to cancel a booking due to circumstances within our control, we will provide either:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>A <strong className="text-primary font-bold">full refund</strong> of the amount paid; or</li>
              <li>An alternative date or service, subject to your agreement.</li>
            </ul>
            <p>
              We will communicate with you as soon as reasonably possible if we need to cancel or significantly change your booking.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">4. Weather, Natural Events & Unforeseen Circumstances</h2>
            <p>
              Some activities may be affected by circumstances outside our reasonable control, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Severe weather</li>
              <li>Natural disasters</li>
              <li>Volcanic activity</li>
              <li>Government restrictions</li>
              <li>Road closures</li>
              <li>Port or airport closures</li>
              <li>Safety conditions</li>
              <li>Other events that make the service unsafe or impossible to operate</li>
            </ul>
            <p>Where reasonably possible, Balance Island may offer:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>A <strong className="text-primary font-bold">free date change</strong>, or</li>
              <li>An <strong className="text-primary font-bold">alternative service</strong>, or</li>
              <li>A <strong className="text-primary font-bold">refund</strong>, depending on the circumstances and any non-refundable costs already incurred with third-party suppliers.</li>
            </ol>
            <p>We will assess each situation fairly and communicate the available options to the customer.</p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">5. No-Show & Late Arrival</h2>
            <p>
              A <strong className="text-primary font-bold">no-show</strong> means the customer does not arrive at the agreed meeting point or is unavailable for the service at the scheduled time without prior notice.
            </p>
            <p>No-shows are generally <strong className="text-primary font-bold">non-refundable</strong>.</p>
            <p>
              If you are running late, please contact us immediately. We will make reasonable efforts to accommodate you, but the service duration may be reduced and a refund may not be available.
            </p>
            <p>
              For tours involving transportation, the vehicle or guide may not be able to wait beyond the agreed waiting period.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">6. Third-Party Services</h2>
            <p>
              Some Balance Island bookings may include services provided by third parties, such as:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Boat or ferry operators</li>
              <li>Transportation providers</li>
              <li>Attractions</li>
              <li>Hotels or accommodation providers</li>
              <li>Activity operators</li>
              <li>Other local suppliers</li>
            </ul>
            <p>
              Where a third-party supplier has its own cancellation conditions, those conditions may apply to the relevant part of your booking. Any special cancellation conditions will be communicated to you before or during the booking process where applicable.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">7. Refund Processing</h2>
            <p>Approved refunds will be processed using the original payment method where reasonably possible.</p>
            <p>Balance Island will initiate eligible refunds as soon as reasonably practicable after the cancellation has been approved.</p>
            <p>The time for the funds to appear in your account may depend on your bank, card issuer, payment provider, or other financial institution.</p>
            <p>Any applicable transaction, payment-processing, or third-party fees that are genuinely non-refundable may be deducted where this was clearly disclosed before payment.</p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">8. Special & Promotional Bookings</h2>
            <p>
              Certain promotional offers, discounted rates, special packages, or third-party services may have different cancellation conditions.
            </p>
            <p>
              If different terms apply, the specific terms shown during the booking process or in your booking confirmation will take priority over this standard policy.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">9. How to Request a Cancellation</h2>
            <p>To cancel your booking, please contact Balance Island as soon as possible and provide:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Booking name</li>
              <li>Booking reference number</li>
              <li>Scheduled service date</li>
              <li>Reason for cancellation (if applicable)</li>
            </ul>
            <p>We recommend requesting cancellation through an official Balance Island communication channel so that your cancellation request can be properly recorded.</p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">10. Fair & Transparent Policy</h2>
            <p>
              Balance Island is committed to treating customers fairly and providing clear information about prices, services, cancellation conditions, and refunds.
            </p>
            <p>
              Nothing in this policy is intended to remove or restrict any mandatory rights or protections available to consumers under applicable Indonesian law.
            </p>
            <p>If you have any questions about a cancellation or refund, please contact our customer support team.</p>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="font-bold text-primary">Balance Island</p>
              <p>Bali, Indonesia</p>
            </div>
          </div>
        </div>

      </div>
      
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}
