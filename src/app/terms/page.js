"use client";

import React from 'react';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col pt-32 pb-16">
      <div className="container mx-auto px-6 flex-grow max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-primary tracking-tight mb-4">Terms & Conditions</h1>
          <p className="text-text-secondary font-medium">Last Updated: 28 August 2026</p>
        </div>

        <div className="w-full">
          <div className="text-text-secondary space-y-6">
            <p>
              Welcome to <strong className="text-primary font-bold">Balance Island</strong>. These Terms & Conditions govern your use of our website and your purchase or booking of tours, activities, transportation, experiences, and other travel-related services.
            </p>
            <p>
              By accessing our website or making a booking, you agree to these Terms & Conditions.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">1. About Balance Island</h2>
            <p>
              Balance Island is a travel and experience service provider offering tourism-related products and services in Bali, Indonesia.
            </p>
            <p>
              Depending on the service booked, certain activities or services may be operated directly by Balance Island or by independent third-party suppliers and partners.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">2. Booking & Confirmation</h2>
            <p>
              When making a booking, you agree to provide accurate and complete information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your full name</li>
              <li>Contact details</li>
              <li>Number of guests</li>
              <li>Selected date and time</li>
              <li>Meeting point or accommodation details</li>
              <li>Any other information required for the service</li>
            </ul>
            <p>
              A booking is considered confirmed once you receive a booking confirmation from Balance Island or the applicable payment has been successfully received.
            </p>
            <p>
              Please check your booking confirmation carefully and contact us immediately if any information is incorrect.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">3. Prices & Payment</h2>
            <p>
              All prices displayed on our website are stated in the currency shown at the time of booking.
            </p>
            <p>
              Prices may include or exclude certain items such as entrance tickets, meals, transportation, activity fees, or other additional costs. Any inclusions and exclusions will be clearly stated in the relevant booking or service description.
            </p>
            <p>
              Balance Island reserves the right to correct pricing or listing errors. If an incorrect price has been displayed, we will contact you before processing the booking where reasonably possible.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">4. Customer Responsibilities</h2>
            <p>Customers are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing accurate booking information</li>
              <li>Arriving at the agreed meeting point on time</li>
              <li>Following reasonable instructions from guides, drivers, and activity operators</li>
              <li>Respecting local laws, customs, people, property, and the environment</li>
              <li>Ensuring that they are physically and otherwise able to participate in the selected activity</li>
              <li>Informing Balance Island of any relevant requirements that may affect the service</li>
            </ul>
            <p>
              Customers must not engage in illegal, abusive, threatening, dangerous, or disruptive behavior during any Balance Island service.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">5. Health, Fitness & Activity Requirements</h2>
            <p>
              Some activities may involve physical activity, uneven terrain, water activities, walking, climbing, or other physical requirements.
            </p>
            <p>
              Customers are responsible for determining whether an activity is suitable for them.
            </p>
            <p>
              Where an activity has specific age, health, fitness, swimming, weight, or other participation requirements, these requirements will apply to the booking.
            </p>
            <p>
              Balance Island may refuse participation where reasonably necessary for the safety of the customer, staff, guides, drivers, or other participants.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">6. Children & Minors</h2>
            <p>
              Customers are responsible for ensuring that children and minors participating in an activity meet the applicable age and participation requirements.
            </p>
            <p>
              A parent, legal guardian, or responsible adult may be required to accompany minors depending on the activity.
            </p>
            <p>
              Specific age restrictions will be communicated where applicable.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">7. Transportation</h2>
            <p>
              Where transportation is included in a booking, the type of vehicle and transportation arrangements will depend on the service booked.
            </p>
            <p>
              Customers must follow reasonable safety instructions and use seat belts where provided.
            </p>
            <p>
              Balance Island is not responsible for delays caused by traffic, road conditions, accidents, government restrictions, weather, or other circumstances outside our reasonable control.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">8. Meeting Points & Pick-Up</h2>
            <p>
              Customers are responsible for providing an accurate pick-up location where pick-up is included.
            </p>
            <p>
              Customers should be ready at the agreed pick-up time.
            </p>
            <p>
              Additional waiting, changes to the pick-up location, or delays caused by the customer may result in additional charges or a reduction in the available service time where applicable.
            </p>
            <p>
              If you cannot locate your driver or guide, please contact Balance Island immediately using the contact information provided in your booking confirmation.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">9. Changes to Your Booking</h2>
            <p>
              Requests to change a booking are subject to availability.
            </p>
            <p>
              Balance Island will make reasonable efforts to accommodate changes to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Date</li>
              <li>Time</li>
              <li>Number of participants</li>
              <li>Pick-up location</li>
              <li>Selected service</li>
            </ul>
            <p>
              Changes may result in additional charges if the new service has a higher price.
            </p>
            <p>
              Certain bookings may have specific change restrictions, which will be communicated before or at the time of booking.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">10. Cancellation & Refunds</h2>
            <p>
              Cancellation and refund conditions are governed by our <strong className="text-primary font-bold">Cancellation & Refund Policy</strong>.
            </p>
            <p>
              Different cancellation conditions may apply to promotional bookings, special offers, accommodation, transportation, activities, or services provided by third-party suppliers.
            </p>
            <p>
              Where specific cancellation terms are displayed during the booking process, those terms will apply to the relevant booking.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">11. Third-Party Suppliers</h2>
            <p>
              Some services booked through Balance Island may be provided by independent third-party operators.
            </p>
            <p>These may include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Boat and ferry operators</li>
              <li>Drivers and transportation providers</li>
              <li>Tour guides</li>
              <li>Activity operators</li>
              <li>Attractions</li>
              <li>Restaurants</li>
              <li>Hotels and accommodation providers</li>
              <li>Other tourism service providers</li>
            </ul>
            <p>
              Third-party suppliers may have their own operating rules, safety requirements, and cancellation conditions.
            </p>
            <p>
              Customers are required to comply with reasonable rules established by the relevant supplier.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">12. Changes or Cancellation by Balance Island</h2>
            <p>
              Balance Island may modify, reschedule, or cancel a service when reasonably necessary due to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Weather or safety conditions</li>
              <li>Natural disasters</li>
              <li>Government restrictions</li>
              <li>Road or transport closures</li>
              <li>Operational problems</li>
              <li>Supplier availability</li>
              <li>Insufficient availability</li>
              <li>Other circumstances outside our reasonable control</li>
            </ul>
            <p>
              Where a significant change or cancellation occurs, Balance Island will communicate the available options, which may include rescheduling, an alternative service, or a refund where applicable.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">13. Force Majeure</h2>
            <p>
              Balance Island will not be considered responsible for failure or delay in providing a service when caused by circumstances beyond our reasonable control.
            </p>
            <p>
              Such circumstances may include natural disasters, severe weather, volcanic activity, pandemics, government actions, civil disturbances, strikes, transportation disruptions, road closures, or other extraordinary events.
            </p>
            <p>
              We will make reasonable efforts to assist affected customers and provide available alternatives where possible.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">14. Personal Belongings</h2>
            <p>
              Customers are responsible for their personal belongings during tours, activities, transportation, and other services.
            </p>
            <p>
              Balance Island is not responsible for lost, stolen, or damaged personal belongings unless liability cannot legally be excluded under applicable law.
            </p>
            <p>
              Customers should take reasonable care of valuables such as passports, phones, cameras, wallets, and other personal items.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">15. Photography & Media</h2>
            <p>
              During some activities, photographs or videos may be taken by Balance Island or its service partners for operational, promotional, or marketing purposes.
            </p>
            <p>
              Where required by applicable law, appropriate consent will be obtained.
            </p>
            <p>
              Customers may contact Balance Island if they have questions or concerns regarding the use of their image.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">16. Website Information</h2>
            <p>
              We make reasonable efforts to ensure that information on the Balance Island website is accurate and up to date.
            </p>
            <p>
              However, descriptions, photographs, itineraries, schedules, availability, prices, and other information may occasionally change due to operational circumstances.
            </p>
            <p>
              Photographs are intended to provide a general representation of the experience and may not always exactly represent the conditions on the day of your visit.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">17. Website Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the website for unlawful purposes</li>
              <li>Provide false or misleading information</li>
              <li>Attempt to interfere with the website's operation or security</li>
              <li>Copy or reproduce website content without permission</li>
              <li>Use the website to distribute harmful or malicious material</li>
              <li>Attempt to gain unauthorized access to our systems or accounts</li>
            </ul>
            <p>
              Balance Island reserves the right to restrict or terminate access to the website where necessary to protect our services, customers, or systems.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">18. Intellectual Property</h2>
            <p>
              Unless otherwise stated, the content on the Balance Island website, including text, logos, graphics, photographs, designs, and other materials, belongs to Balance Island or its respective licensors.
            </p>
            <p>
              You may not reproduce, distribute, modify, sell, or commercially use our content without prior written permission.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">19. Limitation of Liability</h2>
            <p>
              Balance Island will take reasonable care in providing or arranging the services offered through our platform.
            </p>
            <p>
              To the extent permitted by applicable Indonesian law, Balance Island will not be responsible for losses arising from circumstances outside our reasonable control or from the actions or omissions of independent third-party suppliers.
            </p>
            <p>
              Nothing in these Terms & Conditions excludes or limits liability that cannot legally be excluded or limited under applicable law.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">20. Complaints & Customer Support</h2>
            <p>
              If you experience a problem with a service, please contact Balance Island as soon as reasonably possible so that we have an opportunity to assist you during your trip.
            </p>
            <p>
              We encourage customers to report issues promptly, particularly where immediate assistance may resolve the problem.
            </p>
            <p>
              Complaints can be submitted through the official Balance Island contact channels provided on our website or booking confirmation.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">21. Privacy</h2>
            <p>
              Your personal information will be handled in accordance with our Privacy Policy.
            </p>
            <p>
              By making a booking, you acknowledge that certain information is required to process your booking, provide the requested services, communicate with you, and meet applicable legal or operational requirements.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">22. Governing Law</h2>
            <p>
              These Terms & Conditions are governed by the laws of the <strong className="text-primary font-bold">Republic of Indonesia</strong>.
            </p>
            <p>
              Any dispute will first be addressed through good-faith communication between the customer and Balance Island.
            </p>
            <p>
              Nothing in these Terms & Conditions is intended to remove or restrict any mandatory consumer rights or protections provided under applicable Indonesian law.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">23. Changes to These Terms</h2>
            <p>
              Balance Island may update these Terms & Conditions from time to time to reflect changes to our services, business practices, or applicable legal requirements.
            </p>
            <p>
              The updated version will be published on our website with the latest revision date.
            </p>
            <p>
              Your continued use of our website or services after an updated version has been published constitutes acceptance of the updated Terms & Conditions, to the extent permitted by applicable law.
            </p>

            <h2 className="text-2xl font-black text-primary mt-10 mb-4">24. Contact Us</h2>
            <p>
              If you have any questions regarding these Terms & Conditions, your booking, or our services, please contact Balance Island through the official contact details provided on our website.
            </p>
            
            <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="font-bold text-primary mb-4">Thank you for choosing Balance Island.</p>
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
