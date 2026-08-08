"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCampaignSettings, DEFAULT_CAMPAIGNS } from "@/lib/campaigns";

export default function SpaPage() {
  const router = useRouter();

  useEffect(() => {
    const data = getCampaignSettings();
    const target = data?.spa?.externalUrl || DEFAULT_CAMPAIGNS.spa.externalUrl;
    if (target) {
      window.location.href = target;
    } else {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white font-sans">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-gray-500">Redirecting to Spa Partner...</p>
      </div>
    </div>
  );
}
