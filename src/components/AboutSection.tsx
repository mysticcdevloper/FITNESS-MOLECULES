/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Sparkles, Award, Zap, CheckCircle2, Heart } from 'lucide-react';
import { GYM_LOCATION } from '../data/gymData';

export default function AboutSection() {
  const pillars = [
    {
      icon: Award,
      title: "Biomechanical Accuracy",
      description: "Our training is designed around proven neuromuscular principles. Every session is structured to load muscles optimally while protecting your joints."
    },
    {
      icon: Shield,
      title: "Clinical-Grade Hygiene",
      description: "We maintain air filtration standards, anti-pathogen coating, and pristine dressing suite disinfection cycles for an absolutely immaculate workout arena."
    },
    {
      icon: Heart,
      title: "Integrated Dietary Science",
      description: "Nutrition isn't a mock template here. Our clinical dieticians calculate active metabolic rates and cell chemistry values to program delicious, sustainable food regimes."
    },
    {
      icon: Zap,
      title: "Elite Community & Atmosphere",
      description: "Work out alongside motivated professionals, local entrepreneurs, and active sports competitors in an inviting, high-energy environment built on mutual support."
    }
  ];

  const statistics = [
    { value: "10,000+", label: "Sq. Ft. Premium Turf" },
    { value: "12+", label: "Certified Scientists & Coaches" },
    { value: "3,500+", label: "Successful Body Transformations" },
    { value: "4.9/5", label: "Average Google Maps Rating" }
  ];

  return (
    <section className="py-20 bg-zinc-950 text-white" id="about-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-red-500 bg-red-500/10 px-3.5 py-1.5 rounded-full uppercase">
            Our DNA
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mt-4 tracking-tight leading-none text-white">
            WE ARE <span className="text-red-500">FITNESS MOLECULE</span>
          </h2>
          <p className="text-zinc-400 mt-4 text-base sm:text-lg leading-relaxed font-sans">
            Founded with the singular purpose of dismantling low-quality, cookie-cutter gym routines. 
            We view fitness as an elegant chain of biological reactions — where heavy physics meets cellular chemistry to engineer the ultimate version of you.
          </p>
        </div>

        {/* Brand Core Story Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-red-500 to-rose-600 rounded-3xl blur opacity-30 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden p-3 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80" 
                alt="Fitness Molecule Interior" 
                className="w-full h-[400px] object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-zinc-950/95 border border-zinc-800/80 backdrop-blur-md p-5 rounded-xl">
                <span className="text-red-500 font-mono text-xs uppercase tracking-wider block mb-1">State-of-the-Art Arsenal</span>
                <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                  Equipped with premium line machinery featuring electronic biological tracking and Olympic-standard free weights.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block">The Philosophy</span>
              <h3 className="text-2xl sm:text-3xl font-display font-medium text-white mt-1">
                Where Kinetic Energy Meets Metabolic Adaptability
              </h3>
              <p className="text-zinc-400 mt-3 text-sm sm:text-base leading-relaxed">
                Whether you live in Ghaziabad or work remotely as a software architect, our programs fit into your weekly timeline. We combine traditional weightlifting, highly agile functional cross-turbines, and recovery sciences into a unified fitness molecule that compounds day after day.
              </p>
            </div>

            {/* List of features */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3.5">
                <CheckCircle2 className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium text-sm">Doctor-Supervised Bio-reconciliations</h4>
                  <p className="text-xs text-zinc-400 mt-1">Expert guidance to recover from postural issues and back aches smoothly.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <CheckCircle2 className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium text-sm">Flexible Facility Suspension</h4>
                  <p className="text-xs text-zinc-400 mt-1">Freeze your annual membership up to 30 days when travelling, hassle-free.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <CheckCircle2 className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium text-sm">Absolute Carbon Air Sanitation</h4>
                  <p className="text-xs text-zinc-400 mt-1">Multi-stage filtration keeps high oxygen purity inside, accelerating fat oxidation.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <CheckCircle2 className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium text-sm">Humble & Zero-Intrusion Space</h4>
                  <p className="text-xs text-zinc-400 mt-1">Zero aggressive marketing or hyperactive sales pitches. Only pure training support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars / Features Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={i} 
                className="bg-zinc-90 w-full p-6 bg-zinc-900 border border-zinc-900 rounded-2xl hover:border-zinc-800 hover:bg-zinc-900/60 duration-300 transition-all shadow-lg flex flex-col group"
              >
                <div className="text-red-400 bg-red-500/5 group-hover:bg-red-500 group-hover:text-white p-3 rounded-xl w-fit transition-all duration-300">
                  <Icon className="h-6 w-6 stroke-[1.5]" />
                </div>
                <h4 className="text-white font-display text-lg font-medium mt-5 mb-2 group-hover:text-red-500 transition-all duration-300">
                  {pillar.title}
                </h4>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mt-auto font-sans">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Section with sleek layout */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
            {statistics.map((stat, i) => (
              <div key={i} className={`pt-6 lg:pt-0 ${i === 0 ? 'pt-0' : ''}`}>
                <span className="block text-3xl sm:text-4xl lg:text-5.51xl font-display font-black text-red-500 tracking-tight">
                  {stat.value}
                </span>
                <span className="block text-zinc-400 text-xs sm:text-sm font-mono tracking-wider mt-2 uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
