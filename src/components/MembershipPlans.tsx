/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PLANS } from '../data/gymData';
import { MembershipPlan } from '../types';
import { Check, Flame, Trophy, ShieldAlert, Sparkles } from 'lucide-react';

interface MembershipPlansProps {
  onJoinClick: (plan: MembershipPlan) => void;
}

export default function MembershipPlans({ onJoinClick }: MembershipPlansProps) {
  
  const getHeaderIcon = (planName: string) => {
    if (planName.toLowerCase().includes('annual')) {
      return <Trophy className="h-6 w-6 text-yellow-400" />;
    }
    if (planName.toLowerCase().includes('semi-annual')) {
      return <Flame className="h-6 w-6 text-red-500" />;
    }
    return <Sparkles className="h-6 w-6 text-zinc-400" />;
  };

  return (
    <section className="py-20 bg-zinc-950 text-white" id="plans-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-red-500 bg-red-500/10 px-3.5 py-1.5 rounded-full uppercase">
            Membership Plans & Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-white mt-4 tracking-tight leading-none">
            CHOOSE YOUR <span className="text-red-500">FORMULA</span>
          </h2>
          <p className="text-zinc-400 mt-4 text-sm sm:text-base leading-relaxed font-sans">
            Transparent pricing structured to your routine frequency. No hidden surcharges, no entry taxes. Cancel or pause anytime on premium brackets.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PLANS.map((plan) => {
            return (
              <div
                key={plan.id}
                className={`flex flex-col relative rounded-3xl p-6 transition-all duration-300 border ${
                  plan.popular 
                    ? 'bg-zinc-900 border-red-500 shadow-2xl shadow-red-500/10 scale-103 z-10' 
                    : 'bg-zinc-900/40 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900'
                }`}
                id={`plan-card-${plan.id}`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <span className={`absolute -top-3.5 left-6 text-[10px] font-mono tracking-wider px-3.5 py-1 rounded-full uppercase font-bold border ${
                    plan.popular
                      ? 'bg-red-500 text-white border-red-500 animate-pulse'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                  }`}>
                    {plan.badge}
                  </span>
                )}

                {/* Header info */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-lg text-white">
                    {plan.name}
                  </h3>
                  <div className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800">
                    {getHeaderIcon(plan.name)}
                  </div>
                </div>

                {/* Duration */}
                <div className="text-zinc-400 text-xs font-mono tracking-wide uppercase mb-4">
                  Validity: {plan.duration}
                </div>

                {/* Price block */}
                <div className="mb-6 flex flex-col justify-end">
                  {plan.originalPrice && (
                    <span className="text-sm font-sans line-through text-zinc-500 mb-0.5">
                      {plan.originalPrice}
                    </span>
                  )}
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl sm:text-4xl font-display font-black text-white">{plan.price}</span>
                    <span className="text-zinc-500 text-xs font-mono">INR</span>
                  </div>
                </div>

                {/* Feature checklist */}
                <ul className="space-y-3.5 mb-8 text-sm flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5 mr-2.5 stroke-[3]" />
                      <span className="text-zinc-300 text-xs sm:text-sm font-sans leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <button
                  onClick={() => onJoinClick(plan)}
                  className={`w-full font-bold py-3 px-4 rounded-xl text-center text-sm transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer ${
                    plan.popular
                      ? 'bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/10 hover:shadow-red-500/20'
                      : 'bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white'
                  }`}
                  id={`join-btn-${plan.id}`}
                >
                  Join Now
                </button>
              </div>
            );
          })}
        </div>

        {/* Guarantee footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-zinc-900/30 border border-zinc-900 px-5 py-2.5 rounded-full text-xs text-zinc-500 font-mono">
            <ShieldAlert className="h-4 w-4 text-zinc-500" />
            <span>All semi-annual and annual plans back a strict 14-day hassle-free transition safety refund.</span>
          </div>
        </div>

      </div>
    </section>
  );
}
