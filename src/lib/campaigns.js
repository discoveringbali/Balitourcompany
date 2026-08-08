export const DEFAULT_CAMPAIGNS = {
  scooter: {
    id: "scooter",
    title: "Scooter & Motorbike Rental",
    subtitle: "Direct booking for premium automatic scooters with 2 helmets & delivery.",
    badge: "OFFICIAL PARTNER",
    externalUrl: "https://thebikebali.com",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
    active: true
  },
  spa: {
    id: "spa",
    title: "Home Service Spa Bali",
    subtitle: "Relaxing massage & wellness treatments delivered directly to your villa.",
    badge: "OFFICIAL PARTNER",
    externalUrl: "https://ubudtranquilityspa.com",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    active: true
  }
};

export const getCampaignSettings = () => {
  if (typeof window === 'undefined') return DEFAULT_CAMPAIGNS;
  try {
    const saved = localStorage.getItem('balance_island_campaign_links');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        scooter: { ...DEFAULT_CAMPAIGNS.scooter, ...(parsed.scooter || {}) },
        spa: { ...DEFAULT_CAMPAIGNS.spa, ...(parsed.spa || {}) }
      };
    }
  } catch (e) {
    console.error("Error reading campaign settings", e);
  }
  return DEFAULT_CAMPAIGNS;
};

export const saveCampaignSettings = (campaigns) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('balance_island_campaign_links', JSON.stringify(campaigns));
      window.dispatchEvent(new CustomEvent('balance_island_campaigns_changed', { detail: campaigns }));
    } catch (e) {
      console.error("Error saving campaign settings", e);
    }
  }
};

export const updateSingleCampaign = (campaignId, data) => {
  const current = getCampaignSettings();
  const updated = {
    ...current,
    [campaignId]: {
      ...current[campaignId],
      ...data
    }
  };
  saveCampaignSettings(updated);
  return updated;
};
