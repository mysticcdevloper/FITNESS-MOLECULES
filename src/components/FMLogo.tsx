/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface FMLogoProps {
  className?: string;
  size?: number | string;
  glow?: boolean;
}

export default function FMLogo({ className = '', size = '100%', glow = true }: FMLogoProps) {
  return (
    <div 
      className={`relative select-none flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full drop-shadow-[0_0_20px_rgba(255,165,0,0.15)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Neon Glow Filters */}
          {glow && (
            <>
              {/* Yellow outer ring filter */}
              <filter id="neon-yellow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur1" />
                <feGaussianBlur stdDeviation="16" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Red heart filter */}
              <filter id="neon-red" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur1" />
                <feGaussianBlur stdDeviation="14" result="blur2" />
                <feGaussianBlur stdDeviation="28" result="blur3" />
                <feMerge>
                  <feMergeNode in="blur3" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Pink 'I' filter */}
              <filter id="neon-pink" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur1" />
                <feGaussianBlur stdDeviation="10" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* White 'FM' filter */}
              <filter id="neon-white" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur1" />
                <feGaussianBlur stdDeviation="8" result="glow" />
                <feComponentTransfer in="glow" result="brightGlow">
                  <feFuncA type="linear" slope="0.7"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode in="brightGlow" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </>
          )}
        </defs>

        {/* Ambient Dark Concrete Backing (Subtle Texture Radial Gradient) */}
        <radialGradient id="backingGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#121214" />
          <stop offset="100%" stopColor="#050506" />
        </radialGradient>
        <circle cx="250" cy="250" r="240" fill="url(#backingGrad)" stroke="#1a1a1f" strokeWidth="4" />
        
        {/* Subtle background mesh representing concrete texture */}
        <circle cx="250" cy="250" r="230" fill="none" stroke="#222226" strokeWidth="1" strokeDasharray="4 8" opacity="0.4" />

        {/* Double Glowing Yellow Neon Outer Rings */}
        {/* Deep background neon bleed */}
        <circle 
          cx="250" 
          cy="250" 
          r="205" 
          fill="none" 
          stroke="#ff8c00" 
          strokeWidth="12" 
          opacity="0.4"
          filter="url(#neon-yellow)" 
        />
        {/* Core brightly lit neon tube */}
        <circle 
          cx="250" 
          cy="250" 
          r="205" 
          fill="none" 
          stroke="#ffa500" 
          strokeWidth="6" 
          filter="url(#neon-yellow)" 
        />
        {/* Core hot white tube center */}
        <circle 
          cx="250" 
          cy="250" 
          r="205" 
          fill="none" 
          stroke="#fffff0" 
          strokeWidth="2" 
          opacity="0.9"
        />

        {/* Decorative horizontal lines flanking the upper section */}
        {/* Left Side Lines */}
        <path d="M 180 190 L 210 190" stroke="#ffffff" strokeWidth="3" opacity="0.6" filter="url(#neon-white)" />
        <path d="M 180 195 L 205 195" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />
        
        {/* Right Side Lines */}
        <path d="M 355 185 L 390 185" stroke="#ffffff" strokeWidth="3" opacity="0.6" filter="url(#neon-white)" />
        <path d="M 365 192 L 390 192" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />

        {/* --- Pink-Red "I" (Left Side) --- */}
        {/* Deep background glow */}
        <text 
          x="155" 
          y="235" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontWeight="900" 
          fontSize="95" 
          fill="none" 
          stroke="#ff007f" 
          strokeWidth="10" 
          strokeLinecap="round"
          strokeLinejoin="round" 
          filter="url(#neon-pink)" 
          textAnchor="middle"
          opacity="0.8"
        >
          I
        </text>
        {/* Core glow */}
        <text 
          x="155" 
          y="235" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontWeight="900" 
          fontSize="95" 
          fill="#ff007f" 
          stroke="#ff66b2" 
          strokeWidth="3" 
          strokeLinecap="round"
          strokeLinejoin="round" 
          filter="url(#neon-pink)" 
          textAnchor="middle"
        >
          I
        </text>
        {/* Inner white light filament */}
        <text 
          x="155" 
          y="235" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontWeight="900" 
          fontSize="95" 
          fill="#ffffff" 
          textAnchor="middle"
        >
          I
        </text>

        {/* --- Glowing Red Heart (Right Center) --- */}
        {/* Path for a perfectly proportioned heart */}
        <g transform="translate(200, 110) scale(1.1)">
          {/* Deep red ambient aura */}
          <path 
            d="M 60,40 C 50,15 10,15 10,42.5 C 10,65 60,95 60,95 C 60,95 110,65 110,42.5 C 110,15 70,15 60,40 Z" 
            fill="none" 
            stroke="#ff0000" 
            strokeWidth="15" 
            strokeLinejoin="round"
            filter="url(#neon-red)" 
            opacity="0.8"
          />
          {/* Hot red core glow */}
          <path 
            d="M 60,40 C 50,15 10,15 10,42.5 C 10,65 60,95 60,95 C 60,95 110,65 110,42.5 C 110,15 70,15 60,40 Z" 
            fill="#ff1e1e" 
            stroke="#ff6666" 
            strokeWidth="4" 
            strokeLinejoin="round"
            filter="url(#neon-red)" 
          />
          {/* Pure white/pink center hot filament */}
          <path 
            d="M 60,42 C 51,18 13,18 13,42.5 C 13,63 60,91 60,91 C 60,91 107,63 107,42.5 C 107,18 69,18 60,42 Z" 
            fill="#fff0f5" 
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity="0.95"
          />
        </g>

        {/* Horizontal right side short line next to FM */}
        <path d="M 370 262 L 415 262" stroke="#ffffff" strokeWidth="3" opacity="0.6" filter="url(#neon-white)" />

        {/* --- White-Hot "FM" (Bottom Center) --- */}
        <g>
          {/* Deep white/blue background glow */}
          <text 
            x="250" 
            y="410" 
            fontFamily="system-ui, -apple-system, 'Arial Black', sans-serif" 
            fontWeight="900" 
            fontSize="145" 
            fill="none" 
            stroke="#1a1a24" 
            strokeWidth="24"
            textAnchor="middle" 
            letterSpacing="6"
          >
            FM
          </text>
          <text 
            x="250" 
            y="410" 
            fontFamily="system-ui, -apple-system, 'Arial Black', sans-serif" 
            fontWeight="900" 
            fontSize="145" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="12" 
            strokeLinejoin="round"
            filter="url(#neon-white)" 
            textAnchor="middle" 
            letterSpacing="6"
            opacity="0.9"
          >
            FM
          </text>
          {/* Center pure white sharp text */}
          <text 
            x="250" 
            y="410" 
            fontFamily="system-ui, -apple-system, 'Arial Black', sans-serif" 
            fontWeight="900" 
            fontSize="145" 
            fill="#050508" 
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinejoin="round"
            textAnchor="middle" 
            letterSpacing="6"
          >
            FM
          </text>
          
          {/* Center core illumination */}
          <text 
            x="250" 
            y="410" 
            fontFamily="system-ui, -apple-system, 'Arial Black', sans-serif" 
            fontWeight="900" 
            fontSize="145" 
            fill="#ffffff" 
            textAnchor="middle" 
            letterSpacing="6"
            opacity="0.9"
          >
            FM
          </text>
        </g>
      </svg>

      {/* Realistic blinking/humming ambient style effect */}
      <style>{`
        @keyframes hum-pulse {
          0%, 100% { opacity: 0.95; }
          45% { opacity: 1; }
          50% { opacity: 0.88; }
          55% { opacity: 0.98; }
          80% { opacity: 0.94; }
          82% { opacity: 1; }
        }
        svg {
          animation: hum-pulse 4s infinite alternate ease-in-out;
        }
      `}</style>
    </div>
  );
}
