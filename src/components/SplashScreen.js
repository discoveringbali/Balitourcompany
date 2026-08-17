'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ children }) {
  const [showSplash, setShowSplash] = useState(false);
  const [targetProgress, setTargetProgress] = useState(0);
  const [progress, setProgress] = useState(0);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMobileDevice = window.innerWidth < 768;
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');

    if (isMobileDevice && !hasSeenSplash) {
      setShowSplash(true);
    } else {
      setContentVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!showSplash) return;

    let isReady = false;
    let minTimePassed = false;
    let unmounted = false;

    // Stage timers for artificial progress
    const t1 = setTimeout(() => !unmounted && setTargetProgress(25), 200);
    const t2 = setTimeout(() => !unmounted && setTargetProgress(45), 600);
    const t3 = setTimeout(() => !unmounted && setTargetProgress(80), 1500);

    const attemptDismiss = (force = false) => {
      if (unmounted) return;
      if ((isReady && minTimePassed) || force) {
        setTargetProgress(100);
        setTimeout(() => {
          if (unmounted) return;
          setShowSplash(false);
          setContentVisible(true);
          sessionStorage.setItem('hasSeenSplash', 'true');
        }, 600); 
      }
    };

    const minTimer = setTimeout(() => {
      minTimePassed = true;
      attemptDismiss();
    }, 2000); 

    const maxTimer = setTimeout(() => {
      isReady = true;
      attemptDismiss(true);
    }, 6000); 

    const checkReady = () => {
      if (document.readyState === 'complete') {
        const images = Array.from(document.images).filter(
          (img) => !img.hasAttribute('loading') || img.getAttribute('loading') !== 'lazy'
        );
        const allImagesLoaded = images.every((img) => img.complete);
        
        if (allImagesLoaded) {
          isReady = true;
          setTargetProgress((prev) => Math.max(prev, 92));
          attemptDismiss();
        }
      }
    };

    const pollInterval = setInterval(checkReady, 150);

    const handleLoad = () => {
      isReady = true;
      setTargetProgress((prev) => Math.max(prev, 92));
      attemptDismiss();
    };

    window.addEventListener('load', handleLoad);

    return () => {
      unmounted = true;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      clearInterval(pollInterval);
      window.removeEventListener('load', handleLoad);
    };
  }, [showSplash]);

  useEffect(() => {
    if (!showSplash) return;

    let animationFrameId;

    const updateProgress = () => {
      setProgress((prev) => {
        const diff = targetProgress - prev;
        if (Math.abs(diff) < 0.1) return targetProgress;
        return prev + diff * 0.08; 
      });
      animationFrameId = requestAnimationFrame(updateProgress);
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrameId);
  }, [showSplash, targetProgress]);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Ambient Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-white/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Bottom Progress UI */}
            <div className="absolute bottom-12 w-3/4 max-w-sm flex flex-col items-center gap-3 z-10">
              <span className="text-white/70 font-mono text-xs tracking-[0.2em] font-light">
                {Math.round(progress)}%
              </span>
              <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{
          visibility: contentVisible ? 'visible' : 'hidden',
          height: contentVisible ? 'auto' : '100vh',
          overflow: contentVisible ? 'visible' : 'hidden',
        }}
      >
        {children}
      </div>
    </>
  );
}
