/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MembershipPlan, MembershipRegistration } from '../types';
import { PLANS } from '../data/gymData';
import { X, Check, CreditCard, ShieldCheck } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: MembershipPlan | null;
  onRegisterSubmit: (registration: Omit<MembershipRegistration, 'id' | 'createdAt'>) => void;
  currentUser?: { displayName?: string | null; email?: string | null; } | null;
}

export default function RegistrationModal({ isOpen, onClose, selectedPlan, onRegisterSubmit, currentUser }: RegistrationModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash_at_gym');
  const [activePlanId, setActivePlanId] = useState<string>('');

  useEffect(() => {
    if (selectedPlan) {
      setActivePlanId(selectedPlan.id);
    } else if (PLANS.length > 0) {
      setActivePlanId(PLANS[0].id);
    }
  }, [selectedPlan]);

  useEffect(() => {
    if (isOpen && currentUser) {
      if (currentUser.displayName) {
        setFullName(currentUser.displayName);
      }
      if (currentUser.email) {
        setEmail(currentUser.email);
      }
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const currentPlan = PLANS.find(p => p.id === activePlanId) || PLANS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onRegisterSubmit({
      planId: currentPlan.id,
      planName: currentPlan.name,
      planDuration: currentPlan.duration,
      planPrice: currentPlan.price,
      fullName,
      email,
      phone,
      startDate: startDate || new Date().toISOString().split('T')[0],
      paymentMethod
    });

    // Reset fields
    setFullName('');
    setEmail('');
    setPhone('');
    setStartDate('');
    setPaymentMethod('cash_at_gym');
    onClose();
  };

  const paymentOptions = [
    { value: 'cash_at_gym', label: 'Cash or Point-of-Sale (In-Gym)', icon: '🏪' },
    { value: 'upi_phonepe', label: 'Instant Mobile UPI (GPay/PhonePe)', icon: '📱' },
    { value: 'credit_card', label: 'Credit or Debit Card', icon: '💳' }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200 lg:py-10"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 overflow-hidden shadow-2xl relative my-auto animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header absolute close */}
        <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-950 border border-zinc-800 transition-colors"
            aria-label="Close"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-6">
          
          {/* Header Title */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-500 font-bold block mb-1">Online Admission Desk</span>
            <h3 className="text-2xl sm:text-3xl font-display font-medium text-white leading-tight">
              Register Your Membership Plan
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans mt-1">
              Finalize your credentials to enroll dynamically in the Fitness Molecule database.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Choose Plan Sector */}
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-850">
              <label htmlFor="reg-plan-select" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Selected Membership Bracket</label>
              <select
                id="reg-plan-select"
                value={activePlanId}
                onChange={(e) => setActivePlanId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
              >
                {PLANS.map((plan) => (
                  <option key={plan.id} value={plan.id} className="bg-zinc-950 text-white">
                    {plan.name} — {plan.duration} ({plan.price})
                  </option>
                ))}
              </select>

              {/* Selected Plan Details snippet */}
              <div className="mt-3.5 border-t border-zinc-900 pt-3 flex flex-wrap items-center justify-between text-xs font-mono text-zinc-500">
                <span>VALIDITY FRAME: {currentPlan.duration}</span>
                <span className="text-red-500 font-bold">FEES: {currentPlan.price}</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label htmlFor="reg-fullname" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Full Name *</label>
                <input
                  id="reg-fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rupesh Kumar"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="reg-email" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Email Address *</label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@gmail.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {/* Telephone */}
              <div>
                <label htmlFor="reg-phone" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Telephone Number *</label>
                <input
                  id="reg-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 99999 88888"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {/* Activation Date */}
              <div>
                <label htmlFor="reg-startdate" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Activation Date *</label>
                <input
                  id="reg-startdate"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            {/* Simulated Payment Area */}
            <div>
              <label className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Simulated Payment Method</label>
              <div className="space-y-2">
                {paymentOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === opt.value
                        ? 'bg-red-500/5 border-red-500/80 text-white'
                        : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg shrink-0">{opt.icon}</span>
                      <span className="text-xs sm:text-sm font-medium">{opt.label}</span>
                    </div>
                    <input
                      type="radio"
                      name="payment_method"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value)}
                      className="accent-red-500 h-4 w-4"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Security Guarantee banner */}
            <div className="bg-zinc-950 flex items-start space-x-2.5 p-3 rounded-xl border border-zinc-850">
              <ShieldCheck className="h-5 w-5 text-red-500 shrink-0" />
              <span className="text-[11px] font-sans text-zinc-400 leading-normal">
                Admissions processing is secure offline. No instantaneous billing calculations are made until physical biomechanical verification at Patel Nagar club floor.
              </span>
            </div>

            {/* CTA action buttons */}
            <div className="pt-3 border-t border-zinc-850 flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white font-bold py-3 px-4 rounded-xl text-center text-sm transition-colors cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-4 rounded-xl text-center text-sm transition-colors cursor-pointer shadow-lg shadow-red-500/10"
                id="membership-register-submit"
              >
                Confirm Enrollment
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
