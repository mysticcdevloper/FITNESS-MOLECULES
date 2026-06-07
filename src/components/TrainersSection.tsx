/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TRAINERS } from '../data/gymData';
import { Trainer } from '../types';
import { Star, Award, CircleDot, Mail, CalendarDays, Eye, X } from 'lucide-react';

interface TrainersSectionProps {
  onBookTrainerClick: (trainer: Trainer) => void;
}

export default function TrainersSection({ onBookTrainerClick }: TrainersSectionProps) {
  const [activeCertificate, setActiveCertificate] = React.useState<{ url: string; title: string; badge: string } | null>(null);

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TRAINERS.map((trainer) => {
            const isMaster = trainer.id === "t0";
            return (
              <div
                key={trainer.id}
                className={`bg-zinc-900 rounded-3xl overflow-hidden shadow-xl transition-all duration-500 flex flex-col group relative ${
                  isMaster 
                    ? "border-2 border-red-500/50 hover:border-red-500 hover:shadow-red-950/20 shadow-red-950/10 scale-[1.01] hover:scale-[1.03]" 
                    : "border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/60"
                }`}
                id={`trainer-card-${trainer.id}`}
              >
                {isMaster && (
                  <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-red-600 to-amber-500 text-white font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
                    <Award className="h-3 w-3" />
                    <span>FOUNDER / CHIEF DIETICIAN & NUTRITIONIST</span>
                  </div>
                )}

                {/* Profile Photo */}
                <div className="relative aspect-[1327/900] w-full overflow-hidden bg-zinc-950">
                  <img
                    src={trainer.photo}
                    alt={trainer.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                    <h3 className="text-2xl font-display font-black text-white leading-tight group-hover:text-red-500 transition-colors uppercase">
                      {trainer.name}
                    </h3>
                    <span className="text-xs font-mono text-indigo-400 hover:text-red-400 transition-colors uppercase tracking-widest block font-bold mt-1.5">
                      {trainer.role}
                    </span>

                    {/* Biography snippet */}
                    <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mt-4 mb-5 font-sans italic">
                      "{trainer.biography}"
                    </p>

                    {/* Specializations Tags block */}
                    <div className="space-y-2 mb-6">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block font-bold">
                        Specialist Areas & Credentials
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {trainer.specializations.map((spec, idx) => (
                          <span
                            key={idx}
                            className="bg-zinc-950 border border-zinc-850 text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg text-xs font-sans font-medium flex items-center transition-colors"
                          >
                            <CircleDot className="h-2.5 w-2.5 text-red-500 mr-1.5 flex-shrink-0" />
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Certification Section */}
                    {trainer.certificationImage && (
                      <div className="mt-6 mb-6 pt-5 border-t border-zinc-800/60 pb-1 animate-in fade-in duration-300">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block font-bold mb-3">
                          {trainer.certificationTitle || "Certification"}
                        </span>
                        <div 
                          onClick={() => setActiveCertificate({ 
                            url: trainer.certificationImage!, 
                            title: trainer.name, 
                            badge: trainer.certificationBadge || "CPR • First Aid • AED Certified" 
                          })}
                          className="group/cert relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-850 p-3.5 flex items-center gap-4 hover:border-red-500/50 transition-all duration-300 hover:bg-zinc-950/80 hover:shadow-lg hover:shadow-red-950/5"
                        >
                          {/* Image Thumbnail with zoom effect */}
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800">
                            <img 
                              src={trainer.certificationImage} 
                              alt="Certification Thumbnail" 
                              className="h-full w-full object-cover transition-transform duration-500 group-hover/cert:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cert:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <Eye className="h-4 w-4 text-white" />
                            </div>
                          </div>

                          {/* Badge & Text */}
                          <div className="flex-1 min-w-0">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono tracking-wider font-bold text-red-500 bg-red-500/10 border border-red-500/20 uppercase mb-1">
                              {trainer.certificationBadge || "CPR • First Aid • AED Certified"}
                            </span>
                            <span className="block text-xs text-zinc-400 font-sans group-hover/cert:text-zinc-200 transition-colors truncate">
                              Click to view verification certificate
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Booking Call-to-Action */}
                  <div className="pt-4 border-t border-zinc-950 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => onBookTrainerClick(trainer)}
                      className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold py-2.5 px-4 rounded-xl text-center text-xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-lg shadow-red-500/10"
                      id={`book-trainer-btn-${trainer.id}`}
                    >
                      <CalendarDays className="h-4 w-4" />
                      <span>Book Training Session</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Certificate Modal Lightbox */}
      {activeCertificate && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-300 animate-out fade-out duration-250"
          onClick={() => setActiveCertificate(null)}
        >
          {/* Close button */}
          <button 
            onClick={() => setActiveCertificate(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-zinc-900 border border-zinc-800 text-white p-3 rounded-full hover:bg-red-500 hover:border-red-500 cursor-pointer hover:scale-105 transition-all duration-200 shadow-2xl z-50"
            aria-label="Close certificate viewer"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Modal Container */}
          <div 
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* The Image */}
            <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden p-2 sm:p-3 shadow-2xl flex items-center justify-center max-h-[75vh] w-auto">
              <img 
                src={activeCertificate.url} 
                alt={`${activeCertificate.title} Certificate`}
                className="max-w-full max-h-[70vh] object-contain rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Bottom details bar */}
            <div className="text-center mt-5 max-w-xl px-4 animate-in slide-in-from-bottom-4 duration-300">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-mono tracking-widest font-bold text-red-500 bg-red-500/10 border border-red-500/20 uppercase mb-2">
                {activeCertificate.badge}
              </span>
              <h4 className="text-white font-display font-medium text-lg sm:text-xl uppercase tracking-wide">
                {activeCertificate.title}
              </h4>
              <p className="text-zinc-400 text-xs mt-1.5 font-sans">
                Official Certification of Physical Conditioning & Medical First-Response
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
