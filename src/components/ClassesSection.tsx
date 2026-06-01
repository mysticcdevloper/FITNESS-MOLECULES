/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CLASSES } from '../data/gymData';
import { GymClass, Trainer } from '../types';
import { Clock, Layers, Flame, Star, ChevronRight, Check } from 'lucide-react';
import SafeGymImage from './SafeGymImage';

interface ClassesSectionProps {
  onBookClassClick: (gymClass: GymClass, trainer: Trainer) => void;
}

export default function ClassesSection({ onBookClassClick }: ClassesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedClassId, setExpandedClassId] = useState<string | null>(CLASSES[0].id);

  const categories = ['All', 'Strength', 'Functional', 'Flexibility', 'Cardio'];

  const filteredClasses = selectedCategory === 'All'
    ? CLASSES
    : CLASSES.filter(c => c.category === selectedCategory);

  return (
    <section className="py-20 bg-zinc-950 text-white" id="classes-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono tracking-widest text-red-500 bg-red-500/10 px-3.5 py-1.5 rounded-full uppercase">
            Active Disciplines
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-white mt-4 tracking-tight leading-none">
            CURATED CLASS <span className="text-red-500">INDEX</span>
          </h2>
          <p className="text-zinc-400 mt-4 text-sm sm:text-base leading-relaxed font-sans">
            Every session is governed by expert biomechanical coaches, limiting attendance numbers to guarantee close performance feedback.
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-200 border cursor-pointer uppercase ${
                selectedCategory === category
                  ? 'bg-red-500 border-red-500 text-white font-bold'
                  : 'bg-zinc-900/60 border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Layout: Interactive List on Left, Active Selected Details or Detailed Cards on right */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Classes Catalog */}
          <div className="lg:col-span-6 space-y-4">
            {filteredClasses.map((gymClass) => {
              const works = expandedClassId === gymClass.id;
              return (
                <div
                  key={gymClass.id}
                  onClick={() => setExpandedClassId(gymClass.id)}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
                    works
                      ? 'bg-zinc-900 border-red-500/60 shadow-lg'
                      : 'bg-zinc-900/40 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/70'
                  }`}
                  id={`class-item-${gymClass.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-red-500 bg-red-500/5 border border-red-500/15 px-2 py-0.5 rounded uppercase">
                        {gymClass.category}
                      </span>
                      <h3 className="font-display font-bold text-lg text-white mt-2">
                        {gymClass.name}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-3 text-zinc-500 font-mono text-xs">
                      <span className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1 text-zinc-500" />
                        {gymClass.duration}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-zinc-400 text-xs sm:text-sm mt-3 line-clamp-2 leading-relaxed">
                    {gymClass.description}
                  </p>

                  <div className="flex items-center justify-between mt-4 border-t border-zinc-900/60 pt-3">
                    <span className="text-[11px] font-mono text-zinc-500">
                      Coaches: {gymClass.trainers.map(t => t.name.split(' ').pop()).join(' & ')}
                    </span>
                    <span className={`text-[11px] font-mono flex items-center ${works ? 'text-red-500 font-bold' : 'text-zinc-500'}`}>
                      View Details & Book
                      <ChevronRight className={`h-3 w-3 ml-0.5 transform transition-transform duration-200 ${works ? 'translate-x-1' : ''}`} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Active Class Panel showcasing assigned multiple trainers */}
          <div className="lg:col-span-6 sticky top-28">
            {(() => {
              const activeClass = CLASSES.find(c => c.id === expandedClassId) || CLASSES[0];
              return (
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="relative h-48 sm:h-56">
                    <SafeGymImage
                      src={activeClass.image}
                      alt={activeClass.name}
                      className="w-full h-full object-cover"
                      categoryHint={activeClass.level}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent pointer-events-none"></div>
                    <div className="absolute top-4 left-4">
                      <span className="text-xs font-mono tracking-widest text-white bg-red-500 font-black px-3.5 py-1.5 rounded-full uppercase shadow">
                        {activeClass.level} Level
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-5 right-5">
                      <h4 className="text-2xl sm:text-3xl font-display font-medium text-white leading-none">
                        {activeClass.name}
                      </h4>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Schedule times block */}
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">Available Slots</span>
                      <div className="flex flex-wrap gap-2.5">
                        {activeClass.scheduleTimes.map((time, i) => (
                          <span key={i} className="bg-zinc-950 text-zinc-300 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs font-mono">
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Class Bio */}
                    <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-850">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1">Outline Profile</span>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                        {activeClass.description}
                      </p>
                    </div>

                    {/* Highly Detailed assigned multiple trainers */}
                    <div>
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-red-500 font-bold">Assigned Elite Trainers</span>
                        <span className="text-[10px] font-mono text-zinc-500">Multi-Coach Supervision</span>
                      </div>

                      <div className="space-y-4">
                        {activeClass.trainers.map((trainer) => (
                          <div key={trainer.id} className="bg-zinc-950 border border-zinc-850 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group">
                            
                            {/* Trainer Profile Card compact line */}
                            <div className="flex items-center space-x-3.5">
                              <img
                                src={trainer.photo}
                                alt={trainer.name}
                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-zinc-800"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <h5 className="text-white font-medium text-sm group-hover:text-red-500 transition-colors">
                                  {trainer.name}
                                </h5>
                                <span className="text-xs text-zinc-500 font-mono tracking-wide">
                                  {trainer.role} • {trainer.experience} Experience
                                </span>
                                
                                {/* specializations list */}
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {trainer.specializations.slice(0, 2).map((s, idx) => (
                                    <span key={idx} className="bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 px-1.5 py-0.5 rounded">
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Book coach button */}
                            <button
                              onClick={() => onBookClassClick(activeClass, trainer)}
                              className="w-full sm:w-auto bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-bold py-2 px-4 rounded-xl transition-all duration-300 shrink-0 border border-red-500/20 hover:border-red-500 cursor-pointer text-center"
                              id={`book-class-btn-${activeClass.id}-${trainer.id}`}
                            >
                              Book Class Spot
                            </button>

                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })()}
          </div>

        </div>

      </div>
    </section>
  );
}
