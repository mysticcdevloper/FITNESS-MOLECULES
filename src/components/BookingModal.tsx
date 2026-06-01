/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Trainer, GymClass, PersonalTrainerBooking, ClassBooking } from '../types';
import { TRAINERS, CLASSES } from '../data/gymData';
import { X, CheckCircle, Calendar, Users, Briefcase } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTrainer: Trainer | null;
  initialClass: GymClass | null;
  onPersonalTrainerBooking: (booking: Omit<PersonalTrainerBooking, 'id' | 'createdAt'>) => void;
  onClassBooking: (booking: Omit<ClassBooking, 'id' | 'createdAt'>) => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  initialTrainer,
  initialClass,
  onPersonalTrainerBooking,
  onClassBooking
}: BookingModalProps) {
  const [bookingType, setBookingType] = useState<'trainer' | 'class'>('trainer');
  
  // Client general details
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Trainer specific details
  const [selectedTrainerId, setSelectedTrainerId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [notes, setNotes] = useState('');

  // Class specific details
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedClassTrainerName, setSelectedClassTrainerName] = useState('');
  const [classSessionTime, setClassSessionTime] = useState('');

  useEffect(() => {
    if (initialClass) {
      setBookingType('class');
      setSelectedClassId(initialClass.id);
      if (initialClass.trainers && initialClass.trainers.length > 0) {
        setSelectedClassTrainerName(initialClass.trainers[0].name);
      }
      if (initialClass.scheduleTimes && initialClass.scheduleTimes.length > 0) {
        setClassSessionTime(initialClass.scheduleTimes[0]);
      }
    } else if (initialTrainer) {
      setBookingType('trainer');
      setSelectedTrainerId(initialTrainer.id);
      if (initialTrainer.schedule && initialTrainer.schedule.length > 0) {
        setBookingTime(initialTrainer.schedule[0]);
      }
    } else {
      // Default fallback
      if (TRAINERS.length > 0) {
        setSelectedTrainerId(TRAINERS[0].id);
        if (TRAINERS[0].schedule.length > 0) {
          setBookingTime(TRAINERS[0].schedule[0]);
        }
      }
      if (CLASSES.length > 0) {
        setSelectedClassId(CLASSES[0].id);
        if (CLASSES[0].trainers.length > 0) {
          setSelectedClassTrainerName(CLASSES[0].trainers[0].name);
        }
        if (CLASSES[0].scheduleTimes.length > 0) {
          setClassSessionTime(CLASSES[0].scheduleTimes[0]);
        }
      }
    }
  }, [initialTrainer, initialClass, isOpen]);

  // Handle trainer change to update available times automatically
  useEffect(() => {
    if (bookingType === 'trainer' && selectedTrainerId) {
      const match = TRAINERS.find(t => t.id === selectedTrainerId);
      if (match && match.schedule.length > 0) {
        setBookingTime(match.schedule[0]);
      }
    }
  }, [selectedTrainerId, bookingType]);

  // Handle class change to update trainers and schedule selections automatically
  useEffect(() => {
    if (bookingType === 'class' && selectedClassId) {
      const gClass = CLASSES.find(c => c.id === selectedClassId);
      if (gClass) {
        if (gClass.trainers && gClass.trainers.length > 0) {
          setSelectedClassTrainerName(gClass.trainers[0].name);
        }
        if (gClass.scheduleTimes && gClass.scheduleTimes.length > 0) {
          setClassSessionTime(gClass.scheduleTimes[0]);
        }
      }
    }
  }, [selectedClassId, bookingType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (bookingType === 'trainer') {
      const trainerObj = TRAINERS.find(t => t.id === selectedTrainerId) || TRAINERS[0];
      onPersonalTrainerBooking({
        trainerId: trainerObj.id,
        trainerName: trainerObj.name,
        clientName,
        clientEmail,
        clientPhone,
        bookingDate: bookingDate || new Date().toISOString().split('T')[0],
        bookingTime,
        notes
      });
    } else {
      const classObj = CLASSES.find(c => c.id === selectedClassId) || CLASSES[0];
      onClassBooking({
        classId: classObj.id,
        className: classObj.name,
        trainerName: selectedClassTrainerName,
        clientName,
        clientEmail,
        clientPhone,
        sessionTime: classSessionTime
      });
    }

    // Reset inputs
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setNotes('');
    onClose();
  };

  const activeTrainer = TRAINERS.find(t => t.id === selectedTrainerId) || TRAINERS[0];
  const activeClass = CLASSES.find(c => c.id === selectedClassId) || CLASSES[0];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200 lg:py-10"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 overflow-hidden shadow-2xl relative my-auto animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close button */}
        <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-950 border border-zinc-800 transition-colors"
            aria-label="Close"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Scrollable Context Box */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-6">
          
          {/* Header titles */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-500 font-bold block mb-1">
              {bookingType === 'trainer' ? '1-on-1 Personal Training' : 'Reserved Group Access'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-medium text-white leading-tight">
              Book Your Workout Slot
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans mt-1">
              Select your parameters to synchronize performance timers in the club roster.
            </p>
          </div>

          {/* Tab Selection (only visible if neither trainer nor class was preset forcibly) */}
          {!initialClass && !initialTrainer && (
            <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-850">
              <button
                type="button"
                onClick={() => setBookingType('trainer')}
                className={`py-2 px-3 rounded-lg text-xs font-mono tracking-wider transition-colors flex items-center justify-center space-x-1.5 ${
                  bookingType === 'trainer'
                    ? 'bg-zinc-900 text-red-500 font-bold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Briefcase className="h-3.5 w-3.5" />
                <span>Coach Booking</span>
              </button>
              <button
                type="button"
                onClick={() => setBookingType('class')}
                className={`py-2 px-3 rounded-lg text-xs font-mono tracking-wider transition-colors flex items-center justify-center space-x-1.5 ${
                  bookingType === 'class'
                    ? 'bg-zinc-900 text-red-500 font-bold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>Class Slots</span>
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Sector Section based on Booking Type */}
            {bookingType === 'trainer' ? (
              <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-2xl space-y-4">
                {/* Select Trainer */}
                <div>
                  <label htmlFor="trainer-select" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Assigned Personal Coach</label>
                  <select
                    id="trainer-select"
                    value={selectedTrainerId}
                    onChange={(e) => setSelectedTrainerId(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
                  >
                    {TRAINERS.map((t) => (
                      <option key={t.id} value={t.id} className="bg-zinc-950 text-white">
                        {t.name} ({t.role} • {t.experience})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Select Date */}
                  <div>
                    <label htmlFor="trainer-booking-date" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Schedule Date *</label>
                    <input
                      id="trainer-booking-date"
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  {/* Select Time from Roster */}
                  <div>
                    <label htmlFor="trainer-booking-time" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Coach Available Roster *</label>
                    <select
                      id="trainer-booking-time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
                    >
                      {activeTrainer?.schedule?.map((time) => (
                        <option key={time} value={time} className="bg-zinc-950 text-white">
                          {time}
                        </option>
                      )) || <option>08:00 AM</option>}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-2xl space-y-4">
                {/* Select Class */}
                <div>
                  <label htmlFor="class-select" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Class Program</label>
                  <select
                    id="class-select"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
                  >
                    {CLASSES.map((c) => (
                      <option key={c.id} value={c.id} className="bg-zinc-950 text-white">
                        {c.name} ({c.category} • {c.duration})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Select Coach assigned to this class */}
                  <div>
                    <label htmlFor="class-trainer-select" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Select Instructor *</label>
                    <select
                      id="class-trainer-select"
                      value={selectedClassTrainerName}
                      onChange={(e) => setSelectedClassTrainerName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
                    >
                      {activeClass?.trainers?.map((t) => (
                        <option key={t.id} value={t.name} className="bg-zinc-950 text-white">
                          {t.name} — {t.role}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Session Time based on Class Schedule */}
                  <div>
                    <label htmlFor="class-session-time" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Class Schedule Slots *</label>
                    <select
                      id="class-session-time"
                      value={classSessionTime}
                      onChange={(e) => setClassSessionTime(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
                    >
                      {activeClass?.scheduleTimes?.map((time) => (
                        <option key={time} value={time} className="bg-zinc-950 text-white">
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Client Information */}
            <div className="space-y-4 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">Personal Verification Credentials</span>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="booking-client-name" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Full Name *</label>
                  <input
                    id="booking-client-name"
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Rupesh Kumar"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="booking-client-email" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Email Address *</label>
                  <input
                    id="booking-client-email"
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="e.g. user@gmail.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                {/* Phone Number */}
                <div className="sm:col-span-2">
                  <label htmlFor="booking-client-phone" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Phone Number *</label>
                  <input
                    id="booking-client-phone"
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="e.g. +91 99999 88888"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Conditionally add notes for trainer booking */}
            {bookingType === 'trainer' && (
              <div>
                <label htmlFor="booking-notes" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Special Biomechanical Requests or Notes</label>
                <textarea
                  id="booking-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Target hyper-focused lower back posture correction..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500 transition-colors resize-none"
                ></textarea>
              </div>
            )}

            {/* CTA action buttons */}
            <div className="pt-3 border-t border-zinc-855 flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white font-bold py-3 px-4 rounded-xl text-center text-sm transition-colors cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-4 rounded-xl text-center text-sm transition-all duration-300 cursor-pointer shadow-lg shadow-red-500/10"
                id="booking-submit-confirm"
              >
                Confirm Spot
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
