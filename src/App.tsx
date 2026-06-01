/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AboutSection from './components/AboutSection';
import BMICalculator from './components/BMICalculator';
import MembershipPlans from './components/MembershipPlans';
import ClassesSection from './components/ClassesSection';
import TrainersSection from './components/TrainersSection';
import GallerySection from './components/GallerySection';
import ContactSection from './components/ContactSection';
import TransformationStories from './components/TransformationStories';
import EquipmentShowcase from './components/EquipmentShowcase';
import OwnersSection from './components/OwnersSection';
import SafeGymImage from './components/SafeGymImage';
import FMLogo from './components/FMLogo';
import RegistrationModal from './components/RegistrationModal';
import BookingModal from './components/BookingModal';
import UserDashboard from './components/UserDashboard';
import WhatsAppWidget from './components/WhatsAppWidget';

import { GYM_LOCATION, WORKOUT_PROGRAMS, TESTIMONIALS } from './data/gymData';
import { MembershipPlan, GymClass, Trainer, MembershipRegistration, PersonalTrainerBooking, ClassBooking, EnquirySubmission } from './types';
import { Dumbbell, Trophy, ArrowRight, Shield, Heart, Zap, Sparkles, MessageSquare, Star, LayoutDashboard, Plus, Facebook, Instagram, Youtube } from 'lucide-react';

const HERO_BACKGROUNDS = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1920&q=80", // plates & heavy lifting barbell
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80", // rogue heavy racks
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1920&q=80", // cables machine barbell row close up
  "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&w=1920&q=80", // elite Watson dumbbells Row
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1920&q=80"  // assault fitness and conditioning row
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentBgIndex, setCurrentBgIndex] = useState<number>(0);

  // Cycle through background images every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Load persistent localStorage items on initial boot
  const [registrations, setRegistrations] = useState<MembershipRegistration[]>(() => {
    const saved = localStorage.getItem('fm_registrations');
    return saved ? JSON.parse(saved) : [];
  });

  const [trainerBookings, setTrainerBookings] = useState<PersonalTrainerBooking[]>(() => {
    const saved = localStorage.getItem('fm_trainer_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [classBookings, setClassBookings] = useState<ClassBooking[]>(() => {
    const saved = localStorage.getItem('fm_class_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [enquiries, setEnquiries] = useState<EnquirySubmission[]>(() => {
    const saved = localStorage.getItem('fm_enquiries');
    return saved ? JSON.parse(saved) : [];
  });

  // Track state syncing to localstorage
  useEffect(() => {
    localStorage.setItem('fm_registrations', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('fm_trainer_bookings', JSON.stringify(trainerBookings));
  }, [trainerBookings]);

  useEffect(() => {
    localStorage.setItem('fm_class_bookings', JSON.stringify(classBookings));
  }, [classBookings]);

  useEffect(() => {
    localStorage.setItem('fm_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  // Modal Control States
  const [isRegOpen, setIsRegOpen] = useState(false);
  const [selectedPlanForReg, setSelectedPlanForReg] = useState<MembershipPlan | null>(null);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [initialBookingTrainer, setInitialBookingTrainer] = useState<Trainer | null>(null);
  const [initialBookingClass, setInitialBookingClass] = useState<GymClass | null>(null);

  // Helper trigger procedures
  const triggerJoinPlan = (plan: MembershipPlan) => {
    setSelectedPlanForReg(plan);
    setIsRegOpen(true);
  };

  const triggerOpenBlankJoin = () => {
    setSelectedPlanForReg(null);
    setIsRegOpen(true);
  };

  const triggerBookTrainer = (trainer: Trainer) => {
    setInitialBookingTrainer(trainer);
    setInitialBookingClass(null);
    setIsBookingOpen(true);
  };

  const triggerBookClass = (gymClass: GymClass, trainer: Trainer) => {
    setInitialBookingClass(gymClass);
    setInitialBookingTrainer(null);
    setIsBookingOpen(true);
  };

  const triggerOpenBlankBooking = () => {
    setInitialBookingTrainer(null);
    setInitialBookingClass(null);
    setIsBookingOpen(true);
  };

  // Submit Operations called from components
  const handleRegisterSubmit = (newReg: Omit<MembershipRegistration, 'id' | 'createdAt'>) => {
    const registration: MembershipRegistration = {
      ...newReg,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };
    setRegistrations((prev) => [registration, ...prev]);
    setActiveTab('dashboard'); // take straight to custom hub dashboard to view results
  };

  const handleTrainerBookingSubmit = (newB: Omit<PersonalTrainerBooking, 'id' | 'createdAt'>) => {
    const booking: PersonalTrainerBooking = {
      ...newB,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toLocaleDateString('en-IN')
    };
    setTrainerBookings((prev) => [booking, ...prev]);
    setActiveTab('dashboard');
  };

  const handleClassBookingSubmit = (newB: Omit<ClassBooking, 'id' | 'createdAt'>) => {
    const booking: ClassBooking = {
      ...newB,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toLocaleDateString('en-IN')
    };
    setClassBookings((prev) => [booking, ...prev]);
    setActiveTab('dashboard');
  };

  const handleEnquirySubmit = (newE: Omit<EnquirySubmission, 'id' | 'createdAt'>) => {
    const enquiry: EnquirySubmission = {
      ...newE,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit'
      })
    };
    setEnquiries((prev) => [enquiry, ...prev]);
  };

  // Cancellations
  const cancelReg = (id: string) => setRegistrations(prev => prev.filter(p => p.id !== id));
  const cancelTrainerB = (id: string) => setTrainerBookings(prev => prev.filter(p => p.id !== id));
  const cancelClassB = (id: string) => setClassBookings(prev => prev.filter(p => p.id !== id));
  const cancelEnquiry = (id: string) => setEnquiries(prev => prev.filter(p => p.id !== id));

  const hasDashboardData = (registrations.length + trainerBookings.length + classBookings.length + enquiries.length) > 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-red-500 selection:text-white pt-20">
      
      {/* Dynamic Header Navbar widget */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        openJoinModal={triggerOpenBlankJoin} 
        hasDashboardData={hasDashboardData}
      />

      {/* RENDER ACTIVE TAB */}
      {activeTab === 'home' && (
        <div className="animate-in fade-in duration-300">
          
          {/* HERO BANNER SECTION */}
          <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center bg-zinc-950 overflow-hidden">
            <div className="absolute inset-0 select-none pointer-events-none">
              {HERO_BACKGROUNDS.map((bgUrl, idx) => (
                <img 
                  key={bgUrl}
                  src={bgUrl} 
                  alt={`Biomechanical hardware machine visual ${idx + 1}`} 
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out filter grayscale"
                  style={{ 
                    opacity: idx === currentBgIndex ? 0.25 : 0,
                    zIndex: idx === currentBgIndex ? 1 : 0
                  }}
                  referrerPolicy="no-referrer"
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/0 via-zinc-950/70 to-zinc-950 z-10"></div>
            </div>

            {/* Glowing cosmic accent */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none z-[11]"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-8 z-[12]">
              {/* Majestic Circular Neon Brand emblem for Owner */}
              <div className="flex justify-center pb-1 animate-in zoom-in-95 duration-1000">
                <div className="relative w-44 h-44 sm:w-56 sm:h-56 group">
                  {/* Neon atmospheric backlight bleed */}
                  <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500/20 via-red-500/10 to-transparent rounded-full blur-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <FMLogo size="100%" className="relative transform group-hover:scale-104 transition-transform duration-500" />
                </div>
              </div>

              <div className="inline-flex items-center space-x-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full text-xs font-mono tracking-wider text-zinc-300 uppercase">
                <Sparkles className="h-4 w-4 text-red-500 animate-pulse" />
                <span>Ghaziabad's Premier Biomechanical Athlete Hub</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white leading-none max-w-5xl mx-auto uppercase">
                WHERE HEAVY <span className="text-red-500">PHYSICS</span> MEETS GENERAL <span className="text-red-500">BIOLOGY</span>
              </h1>

              <p className="text-zinc-400 text-sm sm:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
                Expert kinesiological guidance, pristine modern equipment, and customized diet programming. Unlock physical hypertrophy and postural decompression designed specifically for your cells.
              </p>

              {/* Action Blocks */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-4">
                <button
                  onClick={() => triggerOpenBlankBooking()}
                  className="w-full sm:w-auto bg-red-500 hover:bg-red-400 text-white font-bold px-8 py-4 rounded-xl text-sm transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer shadow-xl shadow-red-500/10"
                >
                  Reserve Workout Slot
                </button>
                <button
                  onClick={() => setActiveTab('plans')}
                  className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-white font-bold px-8 py-4 rounded-xl text-sm transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Browse Plans</span>
                  <ArrowRight className="h-4 w-4 text-zinc-500" />
                </button>
              </div>


            </div>
          </section>

          {/* ACTIVE DISCIPLINE CARD SECTION */}
          <section className="py-20 bg-zinc-950 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs font-mono tracking-widest text-red-500 bg-red-500/10 px-3.5 py-1.5 rounded-full uppercase">
                  Workout Programs
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-white mt-4 tracking-tight leading-none">
                  BIOMECHANICAL <span className="text-red-500">SYNERGIES</span>
                </h2>
                <p className="text-zinc-400 mt-4 text-xs sm:text-base leading-relaxed">
                  Carefully structured physical pathways that deliver high adaptational responses without overloading spinal structures.
                </p>
              </div>

              {/* Programs Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                {WORKOUT_PROGRAMS.map((prog) => (
                  <div key={prog.id} className="bg-zinc-900 border border-zinc-900 hover:border-zinc-800 p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between group">
                    <div>
                      <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                        <SafeGymImage 
                          src={prog.image} 
                          alt={prog.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                          categoryHint={prog.level}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent pointer-events-none"></div>
                        <div className="absolute top-3 left-3 bg-zinc-950/80 border border-zinc-800 backdrop-blur-md text-xs font-mono text-red-500 px-3 py-1 rounded-full uppercase font-semibold">
                          {prog.level}
                        </div>
                      </div>

                      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1">
                        FOCUS: {prog.focusedMuscle}
                      </span>
                      <h3 className="font-display font-bold text-xl text-white group-hover:text-red-500 transition-colors">
                        {prog.title}
                      </h3>
                      <p className="text-zinc-400 text-xs sm:text-sm mt-3 leading-relaxed font-sans">
                        {prog.description}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-zinc-950 mt-6 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500">Duration Split: {prog.days} Days / Week</span>
                      <button 
                        onClick={() => setActiveTab('classes')}
                        className="text-red-500 hover:text-white font-bold transition-all flex items-center space-x-1"
                      >
                        <span>Class Times</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ELITE EQUIPMENT & MACHINES SECTION */}
          <EquipmentShowcase />

          {/* DYNAMIC OWNERS & FOUNDERS SECTION */}
          <OwnersSection />

          {/* DYNAMIC TRANSFORMATION STORIES */}
          <TransformationStories />

          {/* TESTIMONIALS */}
          <section className="py-20 bg-zinc-950 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-mono tracking-widest text-red-500 bg-red-500/10 px-3.5 py-1.5 rounded-full uppercase">
                  Google Maps & Local Reviews
                </span>
                <h2 className="text-3xl sm:text-4xl font-display font-medium text-white mt-4">
                  CLIENTS <span className="text-red-500">TESTIMONIALS</span>
                </h2>
                <p className="text-zinc-400 mt-4 text-xs sm:text-sm">
                  Prisinte results verified by software architects, medical students, and Ghaziabad local business owners.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {TESTIMONIALS.map((test) => (
                  <div key={test.id} className="bg-zinc-900 border border-zinc-900 p-6 rounded-3xl flex flex-col justify-between hover:border-zinc-850 duration-200">
                    <div>
                      {/* Starts count */}
                      <div className="flex space-x-1 mb-4 text-red-500">
                        {[...Array(test.rating)].map((_, i) => (
                          <Star key={i} className="h-4.5 w-4.5 fill-red-500 text-red-500" />
                        ))}
                      </div>

                      <p className="text-zinc-300 text-xs sm:text-sm italic leading-relaxed font-sans">
                        "{test.quote}"
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-950 flex items-center space-x-3.5">
                      <img 
                        src={test.avatar} 
                        alt={test.name} 
                        className="w-10 h-10 rounded-full object-cover border border-zinc-800"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-white font-medium text-sm leading-none">{test.name}</h4>
                        <span className="text-[11px] font-mono text-zinc-500 block mt-1">{test.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* DYNAMIC HUB BANNER CTA */}
          <section className="py-16 bg-gradient-to-r from-zinc-900 to-zinc-950 border-t border-zinc-900 mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white uppercase">
                  Become a Member of <span className="text-red-500">Fitness Molecule</span> Today
                </h2>
                <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-xl font-sans">
                  Secure admission processes online instantly. Pay or orientation your diagnostic templates physical on our club floor.
                </p>
              </div>
              <div className="flex shrink-0 space-x-3 w-full sm:w-auto">
                <button
                  onClick={() => triggerOpenBlankJoin()}
                  className="w-full sm:w-auto bg-red-500 hover:bg-red-400 text-white font-bold px-6 py-3.5 rounded-xl text-center text-sm transition-colors cursor-pointer"
                >
                  Join Club Now
                </button>
              </div>
            </div>
          </section>

          {/* ACTIVE BIOLOGICAL BMI SECTION */}
          <section className="py-20 bg-zinc-900/40 border-y border-zinc-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <BMICalculator />
            </div>
          </section>

        </div>
      )}

      {activeTab === 'about' && (
        <div className="animate-in fade-in duration-300">
          <AboutSection />
          <OwnersSection />
        </div>
      )}
      
      {activeTab === 'classes' && <ClassesSection onBookClassClick={triggerBookClass} />}
      
      {activeTab === 'trainers' && <TrainersSection onBookTrainerClick={triggerBookTrainer} />}
      
      {activeTab === 'plans' && <MembershipPlans onJoinClick={triggerJoinPlan} />}
      
      {activeTab === 'gallery' && <GallerySection />}
      
      {activeTab === 'contact' && <ContactSection onEnquirySubmit={handleEnquirySubmit} />}
      
      {activeTab === 'dashboard' && (
        <UserDashboard
          registrations={registrations}
          trainerBookings={trainerBookings}
          classBookings={classBookings}
          enquiries={enquiries}
          onCancelRegistration={cancelReg}
          onCancelTrainerBooking={cancelTrainerB}
          onCancelClassBooking={cancelClassB}
          onCancelEnquiry={cancelEnquiry}
        />
      )}

      {/* FOOTER BLOCK WITH LOCATION INFO */}
      <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900/60 font-sans py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid md:grid-cols-4 gap-8">
            {/* Branding Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-1.5">
                <div className="bg-red-500 p-1.5 rounded-lg text-white">
                  <Dumbbell className="h-5 w-5 stroke-[2.5]" />
                </div>
                <span className="font-display font-black text-xl tracking-wider text-white">
                  FITNESS <span className="text-red-500">MOLECULE</span>
                </span>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Elite postural orientation, hypertrophy coaching, and medical nutrition programs designed precisely for high kinetic longevity.
              </p>
              
              {/* Social Channels with customized logo buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <a 
                  href="https://www.facebook.com/Fitnessmolecule" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2 bg-zinc-900 hover:bg-blue-600 text-zinc-400 hover:text-white rounded-lg border border-zinc-850 hover:border-blue-500 transition-colors cursor-pointer"
                  title="Fitness Molecule Facebook Page"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a 
                  href="https://www.instagram.com/fitnessmoleculeofficial/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2 bg-zinc-900 hover:bg-gradient-to-tr hover:from-yellow-600 hover:via-purple-600 hover:to-pink-600 text-zinc-400 hover:text-white rounded-lg border border-zinc-850 hover:border-pink-500 transition-colors cursor-pointer"
                  title="Fitness Molecule Instagram Profile"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a 
                  href="http://www.youtube.com/@fitnessmoleculeAyush" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2 bg-zinc-900 hover:bg-red-650 text-zinc-400 hover:text-white rounded-lg border border-zinc-850 hover:border-red-500 transition-colors cursor-pointer"
                  title="Ayush Fitness Molecule YouTube"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              </div>

              <div className="text-[10px] text-zinc-600 font-mono">
                Plus Code: {GYM_LOCATION.plusCode}
              </div>
            </div>

            {/* Timings */}
            <div>
              <h4 className="text-white font-mono text-xs uppercase tracking-widest font-bold mb-4">Operational Timings</h4>
              <ul className="space-y-2 text-xs font-mono text-zinc-500">
                {GYM_LOCATION.workingHours.map((wh, idx) => (
                  <li key={idx}>
                    <p><span className="text-zinc-400">{wh.days}:</span> {wh.hours}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Club Location */}
            <div>
              <h4 className="text-white font-mono text-xs uppercase tracking-widest font-bold mb-4">Club Address</h4>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mb-3">
                {GYM_LOCATION.address}
              </p>
              <span className="text-[10px] text-red-500 font-mono font-medium block">Near Patel Nagar 3, Ghaziabad, UP</span>
            </div>

            {/* Quick Actions Links */}
            <div>
              <h4 className="text-white font-mono text-xs uppercase tracking-widest font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs font-mono">
                <li>
                  <button onClick={() => setActiveTab('home')} className="text-zinc-500 hover:text-white transition-colors">Home Landing</button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('classes')} className="text-zinc-500 hover:text-white transition-colors">Active Classes</button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('plans')} className="text-zinc-500 hover:text-white transition-colors">Pricing Packages</button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('contact')} className="text-zinc-500 hover:text-white transition-colors">Contacts Desk</button>
                </li>
                {hasDashboardData && (
                  <li>
                    <button onClick={() => setActiveTab('dashboard')} className="text-red-500/80 hover:text-red-500 transition-colors flex items-center">
                      <LayoutDashboard className="h-3 w-3 mr-1" />
                      <span>My Performance Hub</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-900 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-650 font-mono">
            <div>
              &copy; {new Date().getFullYear()} FITNESS MOLECULE Gym and Wellness Club. Ghaziabad. All Rights Reserved.
            </div>
            <div>
              Crafted in collaboration with certified bio-scientists. Science-Backed Human adaptation.
            </div>
          </div>

        </div>
      </footer>

      {/* MODALS RENDER OVERLAYS */}
      <RegistrationModal
        isOpen={isRegOpen}
        onClose={() => setIsRegOpen(false)}
        selectedPlan={selectedPlanForReg}
        onRegisterSubmit={handleRegisterSubmit}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialTrainer={initialBookingTrainer}
        initialClass={initialBookingClass}
        onPersonalTrainerBooking={handleTrainerBookingSubmit}
        onClassBooking={handleClassBookingSubmit}
      />

      {/* WHATSAPP WIDGET FLOATER PIECE */}
      <WhatsAppWidget />

    </div>
  );
}
