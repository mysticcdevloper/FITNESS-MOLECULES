/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TRANSFORMATION_STORIES } from '../data/gymData';
import { ArrowLeftRight, TrendingDown, Clock, Dumbbell, Sparkles } from 'lucide-react';

export default function TransformationStories() {
  return (
    <section className="py-20 bg-zinc-950 text-white" id="transformation-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-red-500 bg-red-500/10 px-3.5 py-1.5 rounded-full uppercase">
            Proof of Concept
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-medium text-white mt-4 tracking-tight leading-none">
            BIOLOGICAL <span className="text-red-500">EVOLUTIONS</span>
          </h2>
          <p className="text-zinc-400 mt-4 text-sm sm:text-base leading-relaxed font-sans">
            Real adaptation achievements from real local members. Witness how disciplined biomechanical programming transforms lipid mass into pure lean muscle force.
          </p>
        </div>

        {/* Stories Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TRANSFORMATION_STORIES.map((story) => (
            <div
              key={story.id}
              className="bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-xl"
            >
              <div>
                {/* Header Profile Name */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">
                      {story.name}
                    </h3>
                    <span className="text-xs text-zinc-500 font-mono tracking-wider block">
                      Age: {story.age} • Target: {story.goal}
                    </span>
                  </div>
                  <span className="bg-red-500/10 text-red-500 text-xs font-mono px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
                    {story.duration}
                  </span>
                </div>

                {/* Metric comparisons side-by-side */}
                <div className="grid grid-cols-2 gap-3.5 bg-zinc-950 p-3.5 rounded-2xl border border-zinc-900 mb-5 relative">
                  <div className="text-center border-r border-zinc-900">
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
                      Before Density
                    </span>
                    <span className="block text-2xl font-display font-black text-rose-400 tracking-tight">
                      {story.beforeWeight}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
                      Current Output
                    </span>
                    <span className="block text-2xl font-display font-black text-red-500 tracking-tight">
                      {story.afterWeight}
                    </span>
                  </div>
                  
                  {/* Central decorator connection */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-900 p-1.5 rounded-full border border-zinc-800 text-red-500">
                    <ArrowLeftRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Testimonial Quote */}
                <div className="relative mb-6">
                  <span className="absolute -top-3.5 -left-1 text-5xl font-serif text-red-500/20 leading-none">“</span>
                  <p className="text-zinc-300 text-xs sm:text-sm italic leading-relaxed pt-2 font-sans relative z-10 pl-2">
                    {story.testimonial}
                  </p>
                </div>
              </div>

              {/* Workout program accent */}
              <div className="pt-4 border-t border-zinc-950/60 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span className="flex items-center text-red-500/80 font-bold">
                  <Dumbbell className="h-3.5 w-3.5 mr-1 text-red-500" />
                  Science-Driven Plan
                </span>
                <span className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {story.duration} Routine
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
