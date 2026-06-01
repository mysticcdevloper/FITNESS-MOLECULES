/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MembershipRegistration, PersonalTrainerBooking, ClassBooking, EnquirySubmission } from '../types';
import { Award, Calendar, CheckSquare, MessageSquare, Trash, ShoppingBag, MapPin, Sparkles } from 'lucide-react';
import { GYM_LOCATION } from '../data/gymData';

interface UserDashboardProps {
  registrations: MembershipRegistration[];
  trainerBookings: PersonalTrainerBooking[];
  classBookings: ClassBooking[];
  enquiries: EnquirySubmission[];
  onCancelRegistration: (id: string) => void;
  onCancelTrainerBooking: (id: string) => void;
  onCancelClassBooking: (id: string) => void;
  onCancelEnquiry: (id: string) => void;
}

export default function UserDashboard({
  registrations,
  trainerBookings,
  classBookings,
  enquiries,
  onCancelRegistration,
  onCancelTrainerBooking,
  onCancelClassBooking,
  onCancelEnquiry
}: UserDashboardProps) {

  const totalActions = registrations.length + trainerBookings.length + classBookings.length + enquiries.length;

  return (
    <section className="py-20 bg-zinc-950 text-white min-h-[80vh]" id="user-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Dashboard panel */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-zinc-900 pb-8">
          <div>
            <span className="text-xs font-mono tracking-widest text-red-500 bg-red-500/10 px-3.5 py-1.5 rounded-full uppercase">
              Member Area Dashboard
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-medium text-white mt-4">
              WELCOME TO YOUR <span className="text-red-500">FITNESS HUB</span>
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Track your reservations, membership status, and electronic enquiries in real-time.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center space-x-6">
            <div className="text-center">
              <span className="block text-2xl font-black text-red-500 font-display">{totalActions}</span>
              <span className="block text-[10px] font-mono tracking-wider font-medium text-zinc-500 uppercase">Active Slots</span>
            </div>
            <div className="border-l border-zinc-800 pl-6 space-y-0.5 text-xs">
              <p className="text-zinc-500 font-mono">Location Status: <span className="text-white">Active</span></p>
              <p className="text-zinc-500 font-mono">Hub ID: <span className="text-red-500">#FM-RU99</span></p>
            </div>
          </div>
        </div>

        {totalActions === 0 ? (
          <div className="bg-zinc-900/30 border border-zinc-900 rounded-3xl p-12 text-center max-w-xl mx-auto py-20">
            <ShoppingBag className="h-16 w-16 text-zinc-700 mx-auto mb-5 stroke-[1.5]" />
            <h3 className="text-white text-lg font-display font-medium">Your Performance Hub is Empty</h3>
            <p className="text-zinc-500 text-sm mt-2 leading-relaxed font-sans">
              You haven't scheduled any personal training classes, registered plans, or submitted enquiries. Go to other sections above to create active slots.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Active Memberships */}
            {registrations.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-red-500 mb-2.5">
                  <Award className="h-5 w-5" />
                  <h3 className="font-display font-bold text-lg text-white">Active Memberships ({registrations.length})</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {registrations.map((reg) => (
                    <div key={reg.id} className="bg-zinc-900 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between" id={`reg-dash-${reg.id}`}>
                      {/* Popular badge design */}
                      <span className="absolute top-4 right-4 bg-red-500 text-white font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                        ENROLLED
                      </span>

                      <div>
                        <h4 className="text-white text-xl font-display font-medium">{reg.planName}</h4>
                        <p className="text-zinc-500 text-xs font-mono mt-0.5 uppercase tracking-wider">
                          Duration: {reg.planDuration} • Fees: {reg.planPrice}
                        </p>

                        <div className="mt-4 space-y-1.5 text-xs sm:text-sm font-sans border-t border-zinc-850 pt-4 text-zinc-300">
                          <p><span className="text-zinc-500 font-mono">Holder:</span> {reg.fullName}</p>
                          <p><span className="text-zinc-500 font-mono">Email:</span> {reg.email}</p>
                          <p><span className="text-zinc-500 font-mono">Phone:</span> {reg.phone}</p>
                          <p><span className="text-zinc-500 font-mono">Activation Date:</span> {reg.startDate}</p>
                          <p>
                            <span className="text-zinc-500 font-mono">Payment Mode:</span>{' '}
                            <span className="text-red-500 capitalize">{reg.paymentMethod.replace(/_/g, ' ')}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onCancelRegistration(reg.id)}
                        className="mt-6 flex items-center justify-center space-x-1 border border-rose-500/10 hover:bg-rose-500/10 text-rose-400 text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer w-full uppercase tracking-wider"
                      >
                        <Trash className="h-3.5 w-3.5" />
                        <span>Cancel Membership Application</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 1-on-1 Personal Trainer Sessions */}
            {trainerBookings.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-red-500 mb-2.5">
                  <Calendar className="h-5 w-5" />
                  <h3 className="font-display font-bold text-lg text-white">Trainer Bookings ({trainerBookings.length})</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {trainerBookings.map((b) => (
                    <div key={b.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between" id={`trainer-dash-${b.id}`}>
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">1-ON-1 COACHING</span>
                            <h4 className="text-white text-lg font-display font-bold mt-1 text-red-500">{b.trainerName}</h4>
                          </div>
                          <span className="text-xs text-zinc-400 font-mono text-right shrink-0">
                            {b.bookingDate} <br />
                            <span className="text-red-500 font-bold">{b.bookingTime}</span>
                          </span>
                        </div>

                        <div className="mt-4 space-y-1 text-xs font-sans text-zinc-400 border-t border-zinc-850 pt-4">
                          <p><span className="text-zinc-500 font-mono">Client:</span> {b.clientName}</p>
                          <p><span className="text-zinc-500 font-mono">Contact:</span> {b.clientPhone} • {b.clientEmail}</p>
                          {b.notes && (
                            <p className="mt-2 bg-zinc-950 p-2.5 rounded-lg border border-zinc-850 italic text-zinc-300">
                              <span className="text-zinc-500 font-mono not-italic block mb-0.5 text-[10px] uppercase">Notes:</span>
                              "{b.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onCancelTrainerBooking(b.id)}
                        className="mt-6 flex items-center justify-center space-x-1 border border-zinc-800 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/10 text-zinc-400 text-xs font-bold py-2 px-4 rounded-xl transition-all cursor-pointer w-full uppercase"
                      >
                        <Trash className="h-3.5 w-3.5" />
                        <span>Cancel Session Reservation</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reserved Class Access */}
            {classBookings.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-red-500 mb-2.5">
                  <CheckSquare className="h-5 w-5" />
                  <h3 className="font-display font-bold text-lg text-white">Class Slots Bookings ({classBookings.length})</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {classBookings.map((b) => (
                    <div key={b.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between" id={`class-dash-${b.id}`}>
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">GROUP CLASS PROGRAM</span>
                            <h4 className="text-white text-lg font-display font-bold mt-1 text-red-500">{b.className}</h4>
                          </div>
                          <span className="text-xs text-red-500 font-mono text-right shrink-0 bg-red-500/5 px-2.5 py-1 border border-red-500/10 rounded-lg">
                            {b.sessionTime}
                          </span>
                        </div>

                        <div className="mt-4 space-y-1.5 text-xs font-sans text-zinc-400 border-t border-zinc-850 pt-4">
                          <p><span className="text-zinc-500 font-mono">Assigned Roster Instructor:</span> {b.trainerName}</p>
                          <p><span className="text-zinc-500 font-mono">Reserved Name:</span> {b.clientName}</p>
                          <p><span className="text-zinc-500 font-mono">Email / Phone:</span> {b.clientEmail} • {b.clientPhone}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => onCancelClassBooking(b.id)}
                        className="mt-6 flex items-center justify-center space-x-1 border border-zinc-800 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/10 text-zinc-400 text-xs font-bold py-2 px-4 rounded-xl transition-all cursor-pointer w-full uppercase"
                      >
                        <Trash className="h-3.5 w-3.5" />
                        <span>Cancel Class Spot</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Electronic Enquiries Submitted */}
            {enquiries.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-red-500 mb-2.5">
                  <MessageSquare className="h-5 w-5" />
                  <h3 className="font-display font-bold text-lg text-white">My Diagnostics Enquiries ({enquiries.length})</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {enquiries.map((e) => (
                    <div key={e.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between" id={`enq-dash-${e.id}`}>
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">ELECTRONIC ADVISORY TICKET</span>
                            <h4 className="text-white text-md font-sans font-bold mt-1">Submitted Diagnostics</h4>
                          </div>
                          <span className="text-[10px] text-zinc-600 font-mono shrink-0">
                            {e.createdAt}
                          </span>
                        </div>

                        <div className="mt-4 space-y-1.5 text-xs font-sans text-zinc-400 border-t border-zinc-850 pt-4">
                          <p><span className="text-zinc-500 font-mono">Patient / User:</span> {e.name} ({e.age} y/o)</p>
                          <p><span className="text-zinc-500 font-mono">Goal Selected:</span> <span className="text-white capitalize">{e.fitnessGoal?.replace(/_/g, ' ')}</span></p>
                          <p><span className="text-zinc-500 font-mono">Contact Details:</span> {e.phone} • {e.email}</p>
                          {e.message && (
                            <p className="mt-2 bg-zinc-950 p-2.5 rounded-lg border border-zinc-850 italic text-zinc-300">
                              <span className="text-zinc-500 font-mono not-italic block mb-0.5 text-[10px] uppercase">Message:</span>
                              "{e.message}"
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onCancelEnquiry(e.id)}
                        className="mt-6 flex items-center justify-center space-x-1 border border-zinc-800 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/10 text-zinc-400 text-xs font-bold py-2 px-4 rounded-xl transition-all cursor-pointer w-full uppercase"
                      >
                        <Trash className="h-3.5 w-3.5" />
                        <span>Withdraw Advisory Enquiry</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Member Instructions Footer block */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col sm:flex-row gap-6 items-center justify-between">
              <div className="flex items-start space-x-4">
                <MapPin className="h-8 w-8 text-red-500 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white font-medium text-sm sm:text-base">Ready for Physical Induction?</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed max-w-xl">
                    Bring your Hub ID (#FM-RU99) or booking printout to Patel Nagar 3, Ghaziabad and get complimentary postural kinetic diagnostics upon physical arrival.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  const url = `https://www.google.com/maps/search/?api=1&query=MCGG%2BQ3G+Patel+Nagar+Ghaziabad+Uttar+Pradesh`;
                  window.open(url, '_blank');
                }}
                className="bg-red-500 hover:bg-red-400 text-white font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm self-start sm:self-center transition-colors shadow-lg shrink-0 cursor-pointer text-center"
              >
                Get Directions
              </button>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
