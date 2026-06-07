/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, AlertCircle, Trash2, CheckCircle2, Globe, Laptop, ArrowUpRight } from 'lucide-react';
import { Review } from '../types';
import { getAllReviews, saveReview, deleteReview } from '../lib/firebaseService';
import { isAdminEmail } from '../types';
import { AppUser } from '../App';

interface ReviewsDashboardProps {
  user: AppUser | null;
  onLoginRequired: () => void;
}

export default function ReviewsDashboard({ user, onLoginRequired }: ReviewsDashboardProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'google' | 'website'>('all');

  // New review form state
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formQuote, setFormQuote] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // Autofill name if logged in
  useEffect(() => {
    if (user && user.displayName) {
      setFormName(user.displayName);
    }
  }, [user]);

  // Load reviews on mount
  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await getAllReviews();
      // Sort: newest first
      setReviews(data);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    if (filter === 'google') return r.isGoogle;
    if (filter === 'website') return !r.isGoogle;
    return true;
  });

  // Handle Review Submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg(false);

    if (!formName.trim()) {
      setErrorMsg('Please specify your name for verification.');
      return;
    }
    if (!formQuote.trim()) {
      setErrorMsg('Please write your review feedback.');
      return;
    }

    setSubmitting(true);
    try {
      // Random professional avatar from unsplash as placeholder
      const randomAvatars = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
      ];
      const selectedAvatar = randomAvatars[Math.floor(Math.random() * randomAvatars.length)];

      const freshReview = await saveReview({
        userId: user ? user.uid : undefined,
        name: formName.trim(),
        role: formRole.trim() || (user ? 'Verified Club Member' : 'Guest Member'),
        quote: formQuote.trim(),
        rating: formRating,
        avatar: selectedAvatar,
        isGoogle: false
      });

      // Update reviews local state
      setReviews((prev) => [freshReview, ...prev]);
      
      // Reset non-primary states
      setFormQuote('');
      setFormRating(5);
      setSuccessMsg(true);

      // Auto clear success notice
      setTimeout(() => setSuccessMsg(false), 8000);
    } catch (err: any) {
      setErrorMsg('Review saving failed. Please check internet connection.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Admin Review Purge
  const handleDeleteReview = async (id: string) => {
    if (window.confirm("Perform administrative deletion on this review?")) {
      try {
        await deleteReview(id);
        setReviews((prev) => prev.filter((r) => r.id !== id));
      } catch (err) {
        console.error("Purging review failed:", err);
      }
    }
  };

  const mapsLocationLink = "https://www.google.com/maps/place/Fitness+molecules/@28.6762634,77.4293793,1455m/data=!3m1!1e3!4m10!1m2!2m1!1sfitness+molecules+gym+maps!3m6!1s0x390cf174bb3719af:0x6976ce4cfa4f5dac!8m2!3d28.6769479!4d77.4252033!15sChpmaXRuZXNzIG1vbGVjdWxlcyBneW0gbWFwc1oXIhVmaXRuZXNzIG1vbGVjdWxlcyBneW2SAQNneW2aASRDaGREU1VoTk1HOW5TMFZKUTBGblNVTktNbU5IY1d0UlJSQULgAQD6AQQIABBL!16s%2Fg%2F11v0vr__h2?entry=ttu";

  return (
    <section id="reviews" className="py-24 bg-zinc-950 text-white border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-red-500 bg-red-500/10 px-3.5 py-1.5 rounded-full uppercase">
            Community Metaphysics
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-white mt-4 uppercase">
            Google Maps & <span className="text-red-500">Local Reviews</span>
          </h2>
          <p className="text-zinc-400 mt-4 text-xs sm:text-sm leading-relaxed">
            Pristine physical results verified by software architects, business owners, and local athletes in Ghaziabad.
          </p>
        </div>

        {/* TWO COLUMN BENTO CONTAINER */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN 1: RATINGS METRICS & WRITE REVIEW (4 columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* OVERALL GOOGLE STATS CARD */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl"></div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold font-mono text-zinc-400 uppercase tracking-wider">Google Maps Rating</h3>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-5xl font-display font-black text-white">4.9</span>
                    <span className="text-sm font-mono text-zinc-500">/ 5.0</span>
                  </div>
                </div>
                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-850">
                  {/* Google maps style colored G */}
                  <span className="text-2xl font-bold font-sans tracking-tight">
                    <span className="text-blue-500">G</span>
                    <span className="text-red-500">o</span>
                    <span className="text-yellow-500">o</span>
                    <span className="text-blue-500">g</span>
                    <span className="text-green-500">l</span>
                    <span className="text-red-500">e</span>
                  </span>
                </div>
              </div>

              {/* STARS */}
              <div className="flex gap-1.5 mb-4 text-red-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-red-500 text-red-500 filter drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                ))}
              </div>

              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Superb community sentiment marking Fitness Molecules as the most hygienic and scientifically structured hypertrophy institute in Patel Nagar, Ghaziabad.
              </p>

              {/* ACTION: OPEN GOOGLE MAPS DIRECT REVIEW LINK */}
              <a
                href={mapsLocationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-between bg-red-500 hover:bg-red-400 text-white font-bold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-500/10 hover:shadow-red-500/20 active:scale-[0.98]"
              >
                <span>Write a Google Maps Review</span>
                <ArrowUpRight className="h-4.5 w-4.5" />
              </a>
            </div>

            {/* WEBSITE INPUT FORM CARD */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl">
              <h3 className="text-lg font-display font-semibold text-white mb-2 flex items-center gap-2">
                <Laptop className="h-5 w-5 text-red-500" />
                Post Direct Website Review
              </h3>
              <p className="text-zinc-500 text-xs mb-6 leading-relaxed">
                Add your feedback directly to the live website stream synced instantly with our secure cloud servers.
              </p>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                {errorMsg && (
                  <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs flex items-start gap-2 animate-shake">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-xs flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>Your direct review has been saved and is now broadcasting live on our community layout!</span>
                  </div>
                )}

                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1.5">Your Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-white font-sans outline-none focus:ring-1 focus:ring-red-500 duration-200"
                    maxLength={100}
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1.5 font-sans">Profession / Role (Optional)</label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="e.g. Software Architect, Powerlifter"
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-white font-sans outline-none focus:ring-1 focus:ring-red-500 duration-200"
                    maxLength={120}
                    disabled={submitting}
                  />
                </div>

                {/* STAR RATING PICKER */}
                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1.5">Anatomical Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const isHighlighted = hoverRating 
                        ? starValue <= hoverRating 
                        : starValue <= formRating;
                      return (
                        <button
                          key={starValue}
                          type="button"
                          onClick={() => setFormRating(starValue)}
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 focus:outline-none transition-transform active:scale-125"
                          disabled={submitting}
                        >
                          <Star
                            className={`h-7 w-7 transition-all duration-150 ${
                              isHighlighted 
                                ? 'text-red-500 fill-red-500 scale-105 filter drop-shadow-[0_0_3px_rgba(239,68,68,0.3)]' 
                                : 'text-zinc-700 hover:text-zinc-650'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1.5">Feedback Experience</label>
                  <textarea
                    value={formQuote}
                    onChange={(e) => setFormQuote(e.target.value)}
                    placeholder="Describe your training highlights, physical results, or overall machine density..."
                    rows={4}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-white font-sans outline-none focus:ring-1 focus:ring-red-500 duration-200 resize-none"
                    maxLength={1000}
                    disabled={submitting}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-zinc-800 hover:bg-red-500 hover:text-white text-zinc-300 font-bold py-3 px-5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Syncing parameters...
                    </span>
                  ) : (
                    <span>Publish Review</span>
                  )}
                </button>
              </form>
            </div>

          </div>

          {/* COLUMN 2: REVIEWS FEED WINDOW (7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* FILTER BUTTONS & HEADLINES */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Reviews Broadcast</span>
              </div>
              <div className="flex gap-1">
                {(['all', 'google', 'website'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFilter(opt)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider duration-150 cursor-pointer ${
                      filter === opt
                        ? 'bg-red-500 text-white font-semibold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    {opt === 'all' && 'All Feedback'}
                    {opt === 'google' && 'Google Only'}
                    {opt === 'website' && 'Direct Web'}
                  </button>
                ))}
              </div>
            </div>

            {/* THE FEED WINDOW */}
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                // SKELETON LOADING
                [...Array(3)].map((_, i) => (
                  <div key={i} className="bg-zinc-900/50 border border-zinc-900 p-6 rounded-3xl animate-pulse space-y-4">
                    <div className="flex justify-between">
                      <div className="h-4 w-28 bg-zinc-800 rounded"></div>
                      <div className="h-4 w-12 bg-zinc-800 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-zinc-800 rounded"></div>
                      <div className="h-3 w-5/6 bg-zinc-800 rounded"></div>
                    </div>
                  </div>
                ))
              ) : filteredReviews.length === 0 ? (
                <div className="text-center py-16 bg-zinc-900/10 border border-zinc-900 rounded-3xl p-6">
                  <MessageSquare className="h-10 w-10 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-500 text-sm font-sans">No reviews match the active terminal filter.</p>
                </div>
              ) : (
                filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-zinc-900 border border-zinc-900 hover:border-zinc-800/80 p-6 rounded-3xl flex flex-col justify-between duration-250 hover:shadow-xl group"
                  >
                    <div>
                      {/* Rating details & Badge Source */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <div className="flex space-x-1 text-red-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-red-500 text-red-500 filter drop-shadow-[0_0_2px_rgba(239,68,68,0.3)]" />
                          ))}
                        </div>
                        
                        {rev.isGoogle ? (
                          <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1.5">
                            <Globe className="h-2.5 w-2.5" />
                            Google Maps Verified
                          </span>
                        ) : (
                          <span className="bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1.5">
                            <Laptop className="h-2.5 w-2.5" />
                            Direct Web Protocol
                          </span>
                        )}
                      </div>

                      <p className="text-zinc-300 text-xs sm:text-sm italic leading-relaxed font-sans pr-2">
                        "{rev.quote}"
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-950 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={rev.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                          alt={rev.name}
                          className="w-9 h-9 rounded-full object-cover border border-zinc-800"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="text-white font-medium text-xs sm:text-sm leading-none flex items-center gap-1">
                            {rev.name}
                          </h4>
                          <span className="text-[10px] font-mono text-zinc-500 block mt-1">{rev.role || "Member"}</span>
                        </div>
                      </div>

                      {/* Display Date and delete capability */}
                      <div className="flex items-center gap-3">
                        {rev.createdAt && (
                          <span className="text-[9px] font-mono text-zinc-600 block">{rev.createdAt}</span>
                        )}

                        {/* Admin Purge Button */}
                        {user && isAdminEmail(user.email) && (
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="text-red-500/70 hover:text-red-500 p-1.5 hover:bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                            title="Admin Purge"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
