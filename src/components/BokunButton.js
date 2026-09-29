'use client';

import Script from 'next/script';

export default function BokunButton() {
  return (
    <>
      {/* Bokun Widget Loader Script */}
      <Script 
        src="https://widgets.bokun.io/assets/javascripts/apps/build/BokunWidgetsLoader.js?bookingChannelUUID=039484dd-d42f-4290-a8d5-35030bc80466" 
        strategy="lazyOnload" 
      />

      {/* Scoped CSS for the button */}
      <style jsx>{`
        #bokun_f7622b8e_c6c8_4464_aa2d_3d7e65dcad4c { 
          display: inline-block; 
          padding: 10px 20px; 
          background: #408C3D; 
          border-radius: 5px; 
          box-shadow: none; 
          font-weight: 600; 
          font-size: 16px; 
          text-decoration: none; 
          text-align: center; 
          color: #FFFFFF; 
          border: none; 
          cursor: pointer; 
          transition: background .2s ease; 
        } 
        #bokun_f7622b8e_c6c8_4464_aa2d_3d7e65dcad4c:hover { 
          background: #285726; 
        } 
        #bokun_f7622b8e_c6c8_4464_aa2d_3d7e65dcad4c:active { 
          background: #30682e; 
        }
      `}</style>

      {/* The Button */}
      <button 
        className="bokunButton" 
        disabled 
        id="bokun_f7622b8e_c6c8_4464_aa2d_3d7e65dcad4c" 
        data-src="https://widgets.bokun.io/online-sales/039484dd-d42f-4290-a8d5-35030bc80466/experience/1317970?partialView=1" 
        data-testid="widget-book-button" 
      > 
        Book now 
      </button>
    </>
  );
}
