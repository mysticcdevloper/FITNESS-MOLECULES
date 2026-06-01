/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Dumbbell, Activity, ShieldCheck } from 'lucide-react';

interface SafeGymImageProps {
  src: string;
  alt: string;
  className?: string;
  categoryHint?: string;
}

export default function SafeGymImage({ src, alt, className = 'w-full h-full object-cover', categoryHint }: SafeGymImageProps) {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

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
          src={src}
          alt={alt}
          className={`${className} ${loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} transition-all duration-500`}
          onLoad={() => setLoading(false)}
          onError={() => setHasError(true)}
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
