/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import heroLogo from '../assets/images/regenerated_image_1780904015224.png';
import navbarLogo from '../assets/images/regenerated_image_1780904018339.png';

interface FMLogoProps {
  className?: string;
  size?: number | string;
  glow?: boolean;
  variant?: 'hero' | 'navbar';
}

export default function FMLogo({ className = '', size = '100%', glow = true, variant }: FMLogoProps) {
  const sizeWithUnit = typeof size === 'number' ? `${size}px` : size;

  // Decide logo source
  let logoSrc = heroLogo;
  if (variant === 'navbar') {
    logoSrc = navbarLogo;
  } else if (variant === 'hero') {
    logoSrc = heroLogo;
  } else {
    // Auto-detect based on size (e.g. Navbar is size 46, Hero is size 100%)
    const parsedSize = typeof size === 'number' ? size : parseInt(String(size), 10);
    if (!isNaN(parsedSize) && parsedSize < 100) {
      logoSrc = navbarLogo;
    }
  }

  const isHero = variant === 'hero' || size === '100%' || (typeof size === 'number' && size >= 100);

  return (
    <div 
      className={`relative select-none flex items-center justify-center rounded-full ${
        isHero 
          ? 'border border-red-500/40 bg-zinc-950 p-1 shadow-[0_0_30px_rgba(239,68,68,0.3)]' 
          : 'border border-red-500/20 bg-zinc-950 p-0.5 shadow-[0_0_10px_rgba(239,68,68,0.15)]'
      } ${className}`}
      style={{ width: sizeWithUnit, height: sizeWithUnit }}
      id="fitness-molecule-brand-logo"
    >
      {isHero && (
        <>
          <div className="absolute inset-0 rounded-full border border-red-500/20 pointer-events-none animate-pulse"></div>
          <div className="absolute -inset-1 rounded-full border border-zinc-800/30 pointer-events-none"></div>
        </>
      )}
      <div className="w-full h-full rounded-full overflow-hidden bg-zinc-950 flex items-center justify-center">
        <img
          src={logoSrc}
          alt="Fitness Molecule Gym Logo"
          className="w-full h-full object-cover rounded-full select-none transition-transform duration-300 hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}

