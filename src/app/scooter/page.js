"use client";

import React, { useEffect, useState } from "react";
import CampaignServiceShowcase from "@/components/campaign/CampaignServiceShowcase";
import { getCampaignSettings, DEFAULT_CAMPAIGNS } from "@/lib/campaigns";

export default function ScooterPage() {
  const [campaign, setCampaign] = useState(DEFAULT_CAMPAIGNS.scooter);

  useEffect(() => {
    const data = getCampaignSettings();
    if (data?.scooter) {
      setCampaign(data.scooter);
    }

    const handleUpdate = (e) => {
      if (e.detail?.scooter) setCampaign(e.detail.scooter);
    };

    window.addEventListener("balance_island_campaigns_changed", handleUpdate);
    return () => window.removeEventListener("balance_island_campaigns_changed", handleUpdate);
  }, []);

  return (
    <div className="w-full pt-28 pb-20 bg-[#fafafa] min-h-screen">
      <CampaignServiceShowcase campaign={campaign} serviceName="Scooter" />
    </div>
  );
}
