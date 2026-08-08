"use client";

import React, { useEffect, useState } from "react";
import CampaignServiceShowcase from "@/components/campaign/CampaignServiceShowcase";
import { getCampaignSettings, DEFAULT_CAMPAIGNS } from "@/lib/campaigns";

export default function SpaPage() {
  const [campaign, setCampaign] = useState(DEFAULT_CAMPAIGNS.spa);

  useEffect(() => {
    const data = getCampaignSettings();
    if (data?.spa) {
      setCampaign(data.spa);
    }

    const handleUpdate = (e) => {
      if (e.detail?.spa) setCampaign(e.detail.spa);
    };

    window.addEventListener("balance_island_campaigns_changed", handleUpdate);
    return () => window.removeEventListener("balance_island_campaigns_changed", handleUpdate);
  }, []);

  return (
    <div className="w-full pt-28 pb-20 bg-[#fafafa] min-h-screen">
      <CampaignServiceShowcase campaign={campaign} serviceName="Spa" />
    </div>
  );
}
