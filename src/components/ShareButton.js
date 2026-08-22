"use client";

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function ShareButton({ title, text, url, className }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Determine the URL to share
    const shareUrl = url || window.location.href;
    const shareTitle = title || document.title;
    
    const shareData = {
      title: shareTitle,
      text: text || `Check out ${shareTitle} on Balance Island!`,
      url: shareUrl,
    };

    try {
      // First try native Web Share API (Mobile & some Desktop)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else if (navigator.share) {
        // Fallback for older Safari that doesn't support canShare but supports share
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard (Desktop)
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      // User cancelled share or it failed, just ignore
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <button onClick={handleShare} className={className} aria-label="Share">
      {copied ? <Check size={18} /> : <Share2 size={18} />}
    </button>
  );
}
