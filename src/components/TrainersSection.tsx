/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TRAINERS } from '../data/gymData';
import { Trainer } from '../types';
import { Star, Award, CircleDot, Mail, CalendarDays } from 'lucide-react';

interface TrainersSectionProps {
  onBookTrainerClick: (trainer: Trainer) => void;
}

export default function TrainersSection({ onBookTrainerClick }: TrainersSectionProps) {
  return (
    <section className="py-20 bg-zinc-950 text-white" id="trainers-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-red-500 bg-red-500/10 px-3.5 py-1.5 rounded-full uppercase">
            Scientific Faculty
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-white mt-4 tracking-tight leading-none">
            ELITE FITNESS <span className="text-red-500">COACHES</span>
          </h2>
          <p className="text-zinc-400 mt-4 text-sm sm:text-base leading-relaxed font-sans">
            Our faculty isn't composed of casual reps counters. They are physical therapists, nutrition experts, and athletes with deep expertise in human biomechanics.
          </p>
        </div>

        {/* Trainers Grid Layout */}
        <div className={TRAINERS.length === 1 ? "flex justify-center" : "grid md:grid-cols-2 lg:grid-cols-3 gap-8"}>
          {TRAINERS.map((trainer) => (
            <div
              key={trainer.id}
              className="bg-zinc-900 border border-zinc-900 rounded-3xl overflow-hidden shadow-xl hover:border-zinc-800 hover:bg-zinc-900/60 transition-all duration-300 flex flex-col group max-w-md w-full"
              id={`trainer-card-${trainer.id}`}
            >
              {/* Profile Photo */}
              <div className="relative h-72 w-full overflow-hidden">
                <img
                  src={trainer.photo}
                  alt={trainer.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {/* Visual Gradient to dark */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                
                {/* Meta details absolute badge */}
                <div className="absolute bottom-4 left-5 right-5 flex justify-between items-center bg-zinc-950/80 border border-zinc-800/60 backdrop-blur-md px-4 py-2.5 rounded-xl">
                  <div>
                    <span className="text-red-500 font-mono text-xs font-bold block leading-none">
                      {trainer.experience} Experience
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 font-mono text-xs">
                    <Star className="h-3.5 w-3.5 fill-red-500 text-red-500 shrink-0" />
                    <span className="text-white font-medium">{trainer.rating}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-display font-bold text-white group-hover:text-red-500 transition-colors">
                    {trainer.name}
                  </h3>
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block font-medium mt-1">
                    {trainer.role}
                  </span>

                  {/* Biography snippet */}
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mt-4 mb-5 font-sans italic">
                    "{trainer.biography}"
                  </p>

                  {/* Specializations Tags block */}
                  <div className="space-y-2 mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">Core Area Focus</span>
                    <div className="flex flex-wrap gap-1.5">
                      {trainer.specializations.map((spec, idx) => (
                        <span
                          key={idx}
                          className="bg-zinc-950 border border-zinc-850 text-zinc-400 px-2.5 py-1 rounded-lg text-xs font-sans flex items-center"
                        >
                          <CircleDot className="h-2.5 w-2.5 text-red-500 mr-1.5" />
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Booking Call-to-Action */}
                <div className="pt-4 border-t border-zinc-950 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => onBookTrainerClick(trainer)}
                    className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold py-2.5 px-4 rounded-xl text-center text-xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                    id={`book-trainer-btn-${trainer.id}`}
                  >
                    <CalendarDays className="h-4 w-4" />
                    <span>Book Training Session</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
