/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Award, ShieldCheck, Heart, Facebook, Instagram, Youtube } from 'lucide-react';
const ownerImg = '/assets/images/regenerated_image_1780324236893.jpg';

export default function OwnersSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white relative overflow-hidden" id="founders-showcase">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center space-x-1 border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-mono uppercase tracking-widest px-4 py-1.5 rounded-full">
            <Sparkles className="h-3 w-3" />
            <span>The Driving Powerhouse</span>
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-white mt-4 tracking-tight uppercase leading-none">
            Meet the <span className="text-red-500 font-bold">Founding Visionaries</span>
          </h2>
          <p className="text-zinc-400 mt-4 text-sm sm:text-base leading-relaxed font-sans">
            Dismantling outdated routines and replacing them with premium, science-proven kinesiological adaptations.
          </p>
        </div>

        {/* Dynamic Centered Owner Layout */}
        <div className="flex flex-col items-center">
          
          {/* Centered Premium Framing of Owners Image */}
          <div className="relative group flex justify-center mb-12 max-w-xs sm:max-w-sm w-full">
            {/* Red decorative neon glow background bleed */}
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-red-500/20 via-rose-600/10 to-transparent rounded-[24px] blur-lg opacity-75 group-hover:opacity-100 transition duration-700"></div>
            
            {/* Glass-styled container frame */}
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-[22px] overflow-hidden p-2.5 shadow-2xl w-full">
              <div className="relative aspect-auto rounded-[16px] overflow-hidden bg-zinc-950 flex justify-center items-center">
                <img 
                  src={ownerImg} 
                  alt="Ayush and Manu - Founders of Fitness Molecule" 
                  className="w-full h-auto max-h-[360px] object-contain rounded-[14px] transition-transform duration-700 group-hover:scale-[1.02] filter brightness-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual subtle shadow gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/10 to-transparent pointer-events-none"></div>
                
                {/* Floating Meta tags absolute badges */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-between items-center gap-2 bg-zinc-950/90 border border-zinc-800/80 backdrop-blur-md px-3 py-2 rounded-lg">
                  <div className="text-left">
                    <span className="text-[9px] font-mono uppercase text-zinc-400 tracking-wider">Operational base</span>
                    <span className="text-white font-bold block text-xs">Ghaziabad, UP</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg shadow-red-500/20">
                    <Award className="h-3 w-3" />
                    <span>ELITE ATHLETES</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Symmetrical Centered Bio Info */}
          <div className="w-full max-w-3xl space-y-8 text-center">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block">Founders & Directors of Performance</span>
              
              {/* Premium names styling with neon layout */}
              <div className="relative inline-block">
                <h3 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white tracking-tight uppercase leading-none">
                  AYUSH <span className="text-zinc-500">&</span> <span className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.25)]">MANU</span>
                </h3>
              </div>

              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed font-sans italic border-y border-red-500/20 py-4 px-6 font-normal max-w-2xl mx-auto">
                "We don't simply count casual reps; we calibrate precise, cellular-level human adaptations. Fitness Molecule is our blueprints for your ultimate kinetic potential."
              </p>
            </div>

            <div className="space-y-4 font-sans text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              <p>
                As dedicated fitness practitioners and elite biomechanical architects, <span className="text-white font-semibold">Ayush and Manu</span> designed <span className="text-red-500 font-semibold">Fitness Molecule</span> to demolish low-quality, generic gym setups. Under their direction, every single bar, rack, and workout template is strictly engineered to load target muscular tissue optimally while completely safeguarding joint integrity and postural health.
              </p>
              <p className="hidden sm:block">
                By linking advanced neuromotor pathways, progressive intensity load profiling, and deep clinical nutrition, they guide athletes, local business professionals, and fitness enthusiasts to build pristine physical hypertrophy and long-term athletic health.
              </p>
            </div>

            {/* Founders Core Pillars */}
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
              <div className="flex items-start space-x-3 bg-zinc-900 border border-zinc-900 rounded-xl p-3.5 hover:border-zinc-800 transition-colors">
                <ShieldCheck className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium text-xs sm:text-sm">Scientific Hypertrophy</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5 font-sans leading-relaxed">Advanced progressive load mechanics designed specifically for cell enlargement.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-zinc-900 border border-zinc-900 rounded-xl p-3.5 hover:border-zinc-800 transition-colors">
                <Heart className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium text-xs sm:text-sm">Postural Re-balancing</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5 font-sans leading-relaxed">Spinal decompression protocols countering corporate desk-job slouch postures.</p>
                </div>
              </div>
            </div>

            {/* Direct Connect Action */}
            <div className="pt-8 border-t border-zinc-900/60 flex flex-col items-center justify-center gap-4">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Connect directly with them:</span>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/Fitnessmolecule" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-3 bg-zinc-900 hover:bg-red-500 text-zinc-400 hover:text-white rounded-xl border border-zinc-850 hover:border-red-400 transition-all cursor-pointer hover:-translate-y-0.5 shadow-lg"
                  title="Follow on Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.instagram.com/fitnessmoleculeofficial/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-3 bg-zinc-900 hover:bg-red-500 text-zinc-400 hover:text-white rounded-xl border border-zinc-850 hover:border-red-400 transition-all cursor-pointer hover:-translate-y-0.5 shadow-lg"
                  title="Follow on Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="http://www.youtube.com/@fitnessmoleculeAyush" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-3 bg-zinc-900 hover:bg-red-500 text-zinc-400 hover:text-white rounded-xl border border-zinc-850 hover:border-red-400 transition-all cursor-pointer hover:-translate-y-0.5 shadow-lg"
                  title="Follow on YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
