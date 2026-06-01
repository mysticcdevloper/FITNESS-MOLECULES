/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Award, ShieldCheck, Heart, Facebook, Instagram, Youtube } from 'lucide-react';

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

        {/* Dynamic Interactive Owner Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Premium Framing of Owners Image */}
          <div className="lg:col-span-6 relative group flex justify-center">
            {/* Red decorative neon glow background bleed */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-red-500/30 via-rose-600/10 to-transparent rounded-[32px] blur-xl opacity-75 group-hover:opacity-100 transition duration-700"></div>
            
            {/* Glass-styled container frame */}
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-[28px] overflow-hidden p-3.5 shadow-2xl max-w-md sm:max-w-lg w-full">
              <div className="relative aspect-auto rounded-[20px] overflow-hidden bg-zinc-950">
                <img 
                  src="/src/assets/images/ayush_and_manu_original_1780322411044.png" 
                  alt="Ayush and Manu - Founders of Fitness Molecule" 
                  className="w-full h-auto object-cover rounded-[18px] transition-transform duration-700 group-hover:scale-[1.03] filter brightness-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual subtle shadow gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent"></div>
                
                {/* Floating Meta tags absolute badges */}
                <div className="absolute bottom-5 left-5 right-5 flex flex-wrap justify-between items-center gap-3 bg-zinc-950/85 border border-zinc-800 backdrop-blur-md px-4 py-3 rounded-xl">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Operational base</span>
                    <span className="text-white font-bold block text-sm">Ghaziabad, UP</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-red-500/20">
                    <Award className="h-4 w-4" />
                    <span>ELITE ATHLETES</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Attractive Typography Bio Entry */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block">Founders & Directors of Performance</span>
              
              {/* Premium names styling with neon layout */}
              <div className="relative inline-block">
                <h3 className="text-5xl sm:text-6xl font-display font-black text-white tracking-tight uppercase leading-none">
                  AYUSH <span className="text-zinc-500">&</span> <span className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.25)]">MANU</span>
                </h3>
              </div>

              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed font-sans italic border-l-2 border-red-500 pl-4 font-normal">
                "We don't simply count casual reps; we calibrate precise, cellular-level human adaptations. Fitness Molecule is our blueprints for your ultimate kinetic potential."
              </p>
            </div>

            <div className="space-y-4 font-sans text-sm sm:text-base text-zinc-400 leading-relaxed">
              <p>
                As dedicated fitness practitioners and elite biomechanical architects, <span className="text-white font-semibold">Ayush and Manu</span> designed <span className="text-red-500 font-semibold">Fitness Molecule</span> to demolish low-quality, generic gym setups. Under their direction, every single bar, rack, and workout template is strictly engineered to load target muscular tissue optimally while completely safeguarding joint integrity and postural health.
              </p>
              <p>
                By linking advanced neuromotor pathways, progressive intensity load profiling, and deep clinical nutrition, they guide athletes, local business professionals, and fitness enthusiasts to build pristine physical hypertrophy and long-term athletic health.
              </p>
            </div>

            {/* Founders Core Pillars */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 bg-zinc-900 border border-zinc-900 rounded-xl p-3.5 hover:border-zinc-800 transition-colors">
                <ShieldCheck className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium text-xs sm:text-sm">Scientific Hypertyophy</h4>
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
            <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Connect directly with them:</span>
                <div className="flex space-x-3">
                  <a 
                    href="https://www.facebook.com/Fitnessmolecule" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-2 bg-zinc-900 hover:bg-red-500 text-zinc-400 hover:text-white rounded-lg border border-zinc-850 hover:border-red-400 transition-all cursor-pointer hover:-translate-y-0.5"
                    title="Follow on Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a 
                    href="https://www.instagram.com/fitnessmoleculeofficial/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-2 bg-zinc-900 hover:bg-red-500 text-zinc-400 hover:text-white rounded-lg border border-zinc-850 hover:border-red-400 transition-all cursor-pointer hover:-translate-y-0.5"
                    title="Follow on Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a 
                    href="http://www.youtube.com/@fitnessmoleculeAyush" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-2 bg-zinc-900 hover:bg-red-500 text-zinc-400 hover:text-white rounded-lg border border-zinc-850 hover:border-red-400 transition-all cursor-pointer hover:-translate-y-0.5"
                    title="Follow on YouTube"
                  >
                    <Youtube className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
