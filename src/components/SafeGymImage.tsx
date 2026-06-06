/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Dumbbell, Activity, ShieldCheck } from 'lucide-react';

interface SafeGymImageProps {
  src: string;
  alt: string;
  className?: string;
  categoryHint?: string;
}

function getUnsplashFallback(url: string, alt: string, categoryHint?: string): string {
  const lowercaseAlt = alt.toLowerCase();
  const lowercaseUrl = url.toLowerCase();
  
  if (lowercaseAlt.includes('smith') || lowercaseAlt.includes('machine') || lowercaseUrl.includes('smith')) {
    return 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercaseAlt.includes('interior') || lowercaseAlt.includes('gym') || lowercaseUrl.includes('interior')) {
    return 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercaseAlt.includes('ayush') || lowercaseAlt.includes('manu') || lowercaseAlt.includes('owner') || lowercaseAlt.includes('founder') || lowercaseUrl.includes('ayush') || lowercaseUrl.includes('owner')) {
    // Elegant athletic training/trainer photo
    return 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80';
  }
  if (lowercaseAlt.includes('trainer') || lowercaseAlt.includes('coach') || lowercaseUrl.includes('trainer')) {
    return 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80';
  }
  
  // Gallery images / photo caption phrases
  if (lowercaseAlt.includes('transform')) {
    return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercaseAlt.includes('strength') || lowercaseAlt.includes('dedication')) {
    return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercaseAlt.includes('train hard') || lowercaseAlt.includes('stay strong')) {
    return 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercaseAlt.includes('beyond limits') || lowercaseAlt.includes('limits')) {
    return 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercaseAlt.includes('building') || lowercaseAlt.includes('better bodies')) {
    return 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercaseAlt.includes('journey')) {
    return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercaseAlt.includes('elevate') || lowercaseAlt.includes('game') || lowercaseAlt.includes('fitness game')) {
    return 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercaseAlt.includes('stronger')) {
    return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercaseAlt.includes('push')) {
    return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercaseAlt.includes('motivation') || lowercaseAlt.includes('zone')) {
    return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80';
  }

  // General category fallbacks
  if (categoryHint === 'Strength' || categoryHint === 'Free Weights' || categoryHint === 'Cables') {
    return 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80';
  }
  if (categoryHint === 'Cardio') {
    return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80';
  }
  
  return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80';
}

export default function SafeGymImage({ src, alt, className = 'w-full h-full object-cover', categoryHint }: SafeGymImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Synchronize when src prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setFallbackAttempted(false);
    setLoading(true);
  }, [src]);

  const handleError = () => {
    if (!fallbackAttempted) {
      setFallbackAttempted(true);
      const fallbackUrl = getUnsplashFallback(src, alt, categoryHint);
      setCurrentSrc(fallbackUrl);
    } else {
      setHasError(true);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full relative bg-zinc-950 flex items-center justify-center overflow-hidden">
      {/* Biomechanical Blueprint Grid lines */}
      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>

      {loading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 z-10">
          <Activity className="h-5 w-5 text-red-500/30 animate-pulse" />
        </div>
      )}

      {!hasError ? (
        <img
          src={currentSrc}
          alt={alt}
          className={`${className} ${loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} transition-all duration-500`}
          onLoad={() => setLoading(false)}
          onError={handleError}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-4 text-center space-y-2.5 z-10 w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-900 rounded-xl">
          <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-full">
            <Dumbbell className="h-5 w-5 text-red-500 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <span className="block text-[9px] font-mono text-red-500 tracking-widest font-semibold uppercase">
              BIOMECHANICAL {categoryHint ? categoryHint.toUpperCase() : 'COACHING_TRACK'}
            </span>
            <span className="block text-xs font-mono text-zinc-300 uppercase tracking-wide max-w-[170px] truncate mx-auto">
              {alt}
            </span>
          </div>
          <div className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest flex items-center justify-center gap-1">
            <ShieldCheck className="h-3 w-3 text-red-500/40" />
            <span>CALIBRATED ACTIVE LOAD</span>
          </div>
        </div>
      )}
    </div>
  );
}
