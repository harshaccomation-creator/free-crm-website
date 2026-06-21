import React, { useState } from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  variant?: 'horizontal' | 'badge';
  forceSvg?: boolean;
}

export default function BrandLogo({ size = 'md', theme = 'dark', variant = 'horizontal', forceSvg = false }: BrandLogoProps) {
  const sources = ['/logo.png', '/logo.jpg', '/logo.jpeg'];
  const [srcIndex, setSrcIndex] = useState(0);
  const [showFallback, setShowFallback] = useState(false);

  const handleLogoError = () => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex(srcIndex + 1);
    } else {
      setShowFallback(true);
    }
  };

  // The premium logo image file is loaded from the public directory (tries /logo.png, then /logo.jpg, then /logo.jpeg)
  if (!showFallback && !forceSvg) {
    const imgHeightClass = 
      size === 'sm' ? 'h-8 md:h-9' : 
      size === 'lg' ? 'h-20 md:h-24' : 
      'h-11 md:h-12'; // Restored to standard height classes to fit perfectly and prevent clipping

    if (variant === 'badge') {
      const badgeSizeClass = 
        size === 'sm' ? 'w-24 h-24' : 
        size === 'lg' ? 'w-56 h-56' : 
        'w-40 h-40';
      return (
        <div className={`aspect-square rounded-full flex flex-col items-center justify-center bg-[#020b18] text-center p-3 select-none shrink-0 border border-white/5 shadow-2xl ${badgeSizeClass}`}>
          <img 
            src={sources[srcIndex]} 
            alt="SalesFlow Hub Logo" 
            className="w-full h-full object-contain"
            onError={handleLogoError}
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }

    return (
      <div className="flex items-center select-none shrink-0">
        <img 
          src={sources[srcIndex]} 
          alt="SalesFlow Hub Logo" 
          className={`${imgHeightClass} w-auto object-contain`}
          onError={handleLogoError}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Fallback: If variant is 'badge' and PNG is not available, render the safe circular badge SVG representation
  if (variant === 'badge') {
    const badgeSizeClass = 
      size === 'sm' ? 'w-24 h-24' : 
      size === 'lg' ? 'w-56 h-56' : 
      'w-40 h-40';
    
    const iconSize = 
      size === 'sm' ? 'h-10 w-10' : 
      size === 'lg' ? 'h-24 w-24' : 
      'h-16 w-16';

    const textClass = 
      size === 'sm' ? 'text-[11px]' : 
      size === 'lg' ? 'text-[24px]' : 
      'text-[18px]';

    const subtitleSizeClass = 
      size === 'sm' ? 'text-[5px] tracking-[0.25em]' : 
      size === 'lg' ? 'text-[11px] tracking-[0.3em] mt-1' : 
      'text-[8px] tracking-[0.28em] mt-0.5';

    return (
      <div className={`aspect-square rounded-full flex flex-col items-center justify-center bg-[#020b18] text-center p-3 select-none shrink-0 border border-white/5 shadow-2xl ${badgeSizeClass}`}>
        {/* Symmetrical interlocking logo symbol with absolute drop-shadow fidelity */}
        <div className={`${iconSize} flex items-center justify-center mb-1.5`}>
          <svg className="w-full h-full" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="badgeLogoShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.45"/>
              </filter>
            </defs>
            <g transform="rotate(45 60 60)">
              {/* Hook 2 (Bottom-Right loop, drawn first so it passes under the center white square) */}
              <path 
                d="M 72,34 H 50 A 16,16 0 0,0 34,50 V 70 A 16,16 0 0,0 50,86 H 58 A 12,12 0 0,0 70,74" 
                stroke="#ff7a00" 
                strokeWidth="15" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none" 
                transform="rotate(180 60 60)"
                filter="url(#badgeLogoShadow)"
              />
              {/* White diamond centerpiece nestled perfectly in the weave */}
              <rect 
                x="48" 
                y="48" 
                width="24" 
                height="24" 
                rx="5.5" 
                fill="#ffffff" 
                filter="url(#badgeLogoShadow)"
              />
              {/* Hook 1 (Top-Left loop, drawn last to sit on top of the diamond) */}
              <path 
                d="M 72,34 H 50 A 16,16 0 0,0 34,50 V 70 A 16,16 0 0,0 50,86 H 58 A 12,12 0 0,0 70,74" 
                stroke="#ff7a00" 
                strokeWidth="15" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none" 
                filter="url(#badgeLogoShadow)"
              />
            </g>
          </svg>
        </div>
        
        {/* Brand typography stacked inside circle */}
        <div className="flex flex-col text-left leading-none mt-1">
          <span className={`font-sans font-black tracking-tight select-none text-white whitespace-nowrap ${textClass}`}>
            Sales<span className="text-[#ff7a00]">Flow</span>
          </span>
          <div className="flex justify-end pr-1">
            <span className={`font-sans font-black uppercase text-slate-300 ${subtitleSizeClass}`}>
              Hub
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render standard horizontal layout (such as for sidebars or page headers)
  const logoHeight = size === 'sm' ? 'h-6' : size === 'lg' ? 'h-16' : 'h-10';
  const textClass = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-3xl' : 'text-xl';
  const subtitleClass = size === 'sm' ? 'text-[6px] mt-0.5' : size === 'lg' ? 'text-[10px] mt-1.5' : 'text-[8px] mt-1';
  const gapClass = size === 'sm' ? 'gap-2' : 'gap-3';
  const isDark = theme === 'dark';
  const primaryTextColor = isDark ? 'text-white' : 'text-[#0f172a]';
  const subtitleColor = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`flex items-center ${gapClass} select-none shrink-0`}>
      <div className={`relative ${logoHeight} aspect-square flex items-center justify-center shrink-0`}>
        <svg className={`${logoHeight} aspect-square`} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="brandLogoShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.45"/>
            </filter>
          </defs>
          <g transform="rotate(45 60 60)">
            {/* Hook 2 (Bottom-Right loop) */}
            <path 
              d="M 72,34 H 50 A 16,16 0 0,0 34,50 V 70 A 16,16 0 0,0 50,86 H 58 A 12,12 0 0,0 70,74" 
              stroke="#ff7a00" 
              strokeWidth="15" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="none" 
              transform="rotate(180 60 60)"
              filter="url(#brandLogoShadow)"
            />
            {/* White diamond centerpiece */}
            <rect 
              x="48" 
              y="48" 
              width="24" 
              height="24" 
              rx="5.5" 
              fill="#ffffff" 
              filter="url(#brandLogoShadow)"
            />
            {/* Hook 1 (Top-Left loop) */}
            <path 
              d="M 72,34 H 50 A 16,16 0 0,0 34,50 V 70 A 16,16 0 0,0 50,86 H 58 A 12,12 0 0,0 70,74" 
              stroke="#ff7a00" 
              strokeWidth="15" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="none" 
              filter="url(#brandLogoShadow)"
            />
          </g>
        </svg>
      </div>
      <div className="flex flex-col text-left leading-none line-clamp-1">
        <span className={`font-black tracking-tight select-none leading-none ${primaryTextColor} ${textClass}`}>
          Sales<span className="text-[#ff7a00]">Flow</span>
        </span>
        <div className="flex justify-end pr-0.5">
          <span className={`font-black tracking-[0.3em] uppercase leading-none ${subtitleColor} ${subtitleClass}`}>
            Hub
          </span>
        </div>
      </div>
    </div>
  );
}
