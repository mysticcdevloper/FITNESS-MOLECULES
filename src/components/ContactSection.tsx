/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GYM_LOCATION } from '../data/gymData';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { EnquirySubmission } from '../types';

interface ContactSectionProps {
  onEnquirySubmit: (submission: Omit<EnquirySubmission, 'id' | 'createdAt'>) => void;
}

export default function ContactSection({ onEnquirySubmit }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('fat_loss');
  const [message, setMessage] = useState('');
  
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onEnquirySubmit({
      name,
      phone,
      email,
      age: parseInt(age) || 25,
      fitnessGoal,
      message
    });

    setIsSuccess(true);
    
    // Reset form
    setName('');
    setPhone('');
    setEmail('');
    setAge('');
    setFitnessGoal('fat_loss');
    setMessage('');

    setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
  };

  const goals = [
    { value: 'fat_loss', label: 'Fat loss & Body Composition' },
    { value: 'muscle_hypertrophy', label: 'Muscle Gaining (Hypertrophy)' },
    { value: 'strength_power', label: 'Powerlifting or Raw Strength' },
    { value: 'cross_conditioning', label: 'CrossFit & Agility Conditioning' },
    { value: 'injury_rehabilitation', label: 'Joint Longevity / Injury Rehab' },
    { value: 'general_wellbeing', label: 'General Endurance & Yoga' }
  ];

  return (
    <section className="py-20 bg-zinc-950 text-white" id="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Headings */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-red-500 bg-red-500/10 px-3.5 py-1.5 rounded-full uppercase">
            Let's Talk Fitness
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-white mt-4 tracking-tight leading-none">
            START YOUR <span className="text-red-500">ANALYSIS</span>
          </h2>
          <p className="text-zinc-400 mt-4 text-sm sm:text-base leading-relaxed font-sans">
            Ready to convert kinetic intent into real chemical milestones? Send us a message or walk right in for an orientation tour.
          </p>
        </div>

        {/* Main Grid Content */}
        <div className="grid lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left: Contact Info & Map Card */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-2xl font-display font-bold text-white mb-2">
                FITNESS MOLECULE HQ
              </h3>
              
              <div className="space-y-5">
                <div className="flex items-start">
                  <MapPin className="h-5.5 w-5.5 text-red-500 shrink-0 mt-0.5 mr-3.5" />
                  <div>
                    <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider block">Physical Coordinates</span>
                    <p className="text-zinc-300 text-sm mt-0.5 leading-relaxed font-sans">
                      {GYM_LOCATION.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start" id="contact-info-phone-container">
                  <Phone className="h-5.5 w-5.5 text-red-500 shrink-0 mt-0.5 mr-3.5" />
                  <div>
                    <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider block">Hotline Hotline</span>
                    <div className="text-zinc-300 text-sm mt-0.5 leading-relaxed font-sans flex flex-col space-y-1">
                      <a href={`tel:${GYM_LOCATION.phone}`} className="hover:text-red-500 transition-colors block" id="contact-phone-primary">
                        {GYM_LOCATION.phone}
                      </a>
                      <a href={`tel:${GYM_LOCATION.phoneSecondary}`} className="hover:text-red-500 transition-colors block" id="contact-phone-secondary">
                        {GYM_LOCATION.phoneSecondary}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-5.5 w-5.5 text-red-500 shrink-0 mt-0.5 mr-3.5" />
                  <div>
                    <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider block">Electronic Inbox</span>
                    <p className="text-zinc-300 text-sm mt-0.5 leading-relaxed font-sans">
                      {GYM_LOCATION.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5.5 w-5.5 text-red-500 shrink-0 mt-0.5 mr-3.5" />
                  <div>
                    <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider block">Operational Timeline</span>
                    <div className="space-y-1 mt-1 font-mono text-xs text-zinc-400">
                      {GYM_LOCATION.workingHours.map((wh, idx) => (
                        <p key={idx}>
                          <span className="text-white font-medium">{wh.days}:</span>{" "}
                          <span className="text-red-500 font-semibold">{wh.hours}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Google Maps Embedded IFrame / Indicator Block */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden p-2 h-64 sm:h-72">
              <iframe
                title="Fitness Molecule Gym Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.5905206306505!2d77.424!3d28.67!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDQwJzEyLjAiTiA3N8KwMjUnMjYuNCJF!5e0!3m2!1sen!2sin!4v1654000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 rounded-xl filter invert-90 grayscale contrast-110"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Right: Premium Gym Enquiry Form */}
          <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-display font-bold text-white mb-2">
                Electronic Enquiry Form
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans mb-8">
                Submit your diagnostics parameters to receive an invite to a physical biomechanical orientation.
              </p>

              {isSuccess ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center py-16 animate-in fade-in zoom-in-95 duration-300">
                  <div className="bg-red-500 text-white p-4 rounded-full w-fit mx-auto mb-5 shadow-lg shadow-red-500/20">
                    <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
                  </div>
                  <h4 className="text-white font-display font-medium text-xl">Enquiry Parameters Transferred!</h4>
                  <p className="text-zinc-400 text-sm max-w-sm mx-auto mt-2 leading-relaxed">
                    Thank you for applying. One of our biomechanical consultants will call you within 1-2 hours to finalize your tour parameters.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="enquiry-name" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Name *</label>
                      <input
                        id="enquiry-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rupesh Kumar"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="enquiry-email" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Email *</label>
                      <input
                        id="enquiry-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. user@gmail.com"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label htmlFor="enquiry-phone" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Phone Number *</label>
                      <input
                        id="enquiry-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 99999 88888"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>

                    {/* Age */}
                    <div>
                      <label htmlFor="enquiry-age" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Age *</label>
                      <input
                        id="enquiry-age"
                        type="number"
                        required
                        min="10"
                        max="100"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g. 26"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Fitness Goal Select Dropdown */}
                  <div>
                    <label htmlFor="enquiry-goal" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Fitness Goal *</label>
                    <select
                      id="enquiry-goal"
                      value={fitnessGoal}
                      onChange={(e) => setFitnessGoal(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors appearance-none cursor-pointer"
                    >
                      {goals.map((goal) => (
                        <option key={goal.value} value={goal.value} className="bg-zinc-950 text-white">
                          {goal.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message Area */}
                  <div>
                    <label htmlFor="enquiry-message" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Biometrical Notes & Questions</label>
                    <textarea
                      id="enquiry-message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="List any past sports achievements, ongoing back pain, or preferred timings here..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-3.5 px-6 rounded-xl text-center text-sm transition-colors cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-red-500/10"
                    id="enquiry-submit-btn"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Diagnostics Enquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
