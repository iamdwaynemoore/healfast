
import React, { useRef, useEffect, useState } from 'react';

export default function VimeoBackgroundVideo() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false); // This state is declared but not used in the provided outline or the original code. Keeping it as per original.
  const containerRef = useRef(null);

  useEffect(() => {
    // Fallback to a direct video file if available
    const fallbackVideoUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/d645f5242_AdobeStock_270633465.mp4";
    
    // Try to load Vimeo video first, fallback to direct video
    const tryDirectVideo = () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <video
            autoplay
            loop
            muted
            playsinline
            style="
              width: 100%;
              height: 100%;
              object-fit: cover;
              opacity: 0.4;
              position: absolute;
              top: 40%;
              left: 50%;
              transform: translate(-50%, -50%) scale(1.5);
            "
          >
            <source src="${fallbackVideoUrl}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        `;
        setIsLoaded(true);
      }
    };

    // Load Vimeo Player API
    if (!window.Vimeo) {
      const script = document.createElement('script');
      script.src = 'https://player.vimeo.com/api/player.js';
      script.onload = () => {
        initVimeoPlayer();
      };
      script.onerror = () => {
        console.warn('Failed to load Vimeo API, using fallback video');
        tryDirectVideo();
      };
      document.head.appendChild(script);
    } else {
      initVimeoPlayer();
    }

    function initVimeoPlayer() {
      if (containerRef.current) {
        try {
          // Create Vimeo player
          const iframe = document.createElement('iframe');
          iframe.src = 'https://player.vimeo.com/video/1104350476?autoplay=1&loop=1&muted=1&controls=0&background=1&quality=720p';
          iframe.style.cssText = `
            width: 100%;
            height: 100%;
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%) scale(1.6);
            opacity: 0.4;
            pointer-events: none;
            border: none;
          `;
          iframe.setAttribute('frameborder', '0');
          iframe.setAttribute('allow', 'autoplay; fullscreen');
          
          iframe.onload = () => setIsLoaded(true);
          iframe.onerror = () => {
            console.warn('Vimeo iframe failed to load, using fallback');
            tryDirectVideo();
          };
          
          containerRef.current.appendChild(iframe);
        } catch (err) {
          console.warn('Error creating Vimeo player:', err);
          tryDirectVideo();
        }
      }
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      <div ref={containerRef} className="w-full h-full relative" />
      
      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Overlay to reduce video intensity */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
