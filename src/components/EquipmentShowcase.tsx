/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Dumbbell, 
  Settings, 
  Activity, 
  Search, 
  Sparkles, 
  Info, 
  ShieldCheck, 
  Grid, 
  Layers, 
  Tv, 
  CheckCircle, 
  X,
  Gauge,
  ExternalLink
} from 'lucide-react';

const redSmithMachineImg = '/assets/images/red_smith_machine_gym_1780316281034.png';
const luxuryGymInteriorImg = '/assets/images/luxury_modern_gym_interior_1780316297950.png';

interface EquipmentItem {
  id: string;
  name: string;
  category: 'Strength' | 'Free Weights' | 'Cables' | 'Cardio';
  categoryLabel: string;
  image: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  techSpec: string;
  setupProtocol: string[];
  biomechanicalTip: string;
  loadCapacity: string;
  brand: string;
  zone: string;
}

// Fallback component when image fails to load or during pending state
const EquipmentImage: React.FC<{ src: string; alt: string; category: string }> = ({ src, alt, category }) => {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  const getCategoryIcon = () => {
    switch (category) {
      case 'Strength':
        return <Dumbbell className="h-10 w-10 text-red-500 stroke-[1.25]" />;
      case 'Cables':
        return <Layers className="h-10 w-10 text-red-500 stroke-[1.25]" />;
      case 'Cardio':
        return <Gauge className="h-10 w-10 text-red-500 stroke-[1.25]" />;
      default:
        return <Dumbbell className="h-10 w-10 text-red-500 stroke-[1.25]" />;
    }
  };

  return (
    <div className="w-full h-full relative bg-zinc-950 flex items-center justify-center overflow-hidden">
      {/* Biomechanical Blueprint System Grid Accent */}
      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      
      {loading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 z-20">
          <Activity className="h-6 w-6 text-red-500/50 animate-pulse" />
        </div>
      )}

      {!hasError ? (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-104 ${
            loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          onLoad={() => setLoading(false)}
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 z-10 w-full h-full bg-gradient-to-b from-zinc-900 to-zinc-955 border border-zinc-900 rounded-2xl">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-full animate-pulse">
            {getCategoryIcon()}
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] font-mono text-red-500 tracking-wider font-semibold uppercase">
              BIOMECHANICAL HARDWARE ACTIVE
            </span>
            <span className="block text-xs font-mono text-zinc-400 uppercase tracking-widest max-w-[200px] truncate">
              {alt}
            </span>
          </div>
          <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">
            System Calibrated • 100% Load OK
          </div>
        </div>
      )}
    </div>
  );
};

const EQUIPMENT_DATA: EquipmentItem[] = [
  {
    id: 'eq1',
    name: 'M12 Bio-Symmetric Iso-Lateral Leg Press',
    category: 'Strength',
    categoryLabel: 'Strength / Plate-Loaded',
    image: redSmithMachineImg,
    primaryMuscles: ['Quadriceps', 'Glutus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Adductors'],
    techSpec: 'Converging fluid motion curves aligning precisely with active knee/hip flexion vectors',
    setupProtocol: [
      'Set back support angle to matches torso length using safety lever.',
      'Place feet shoulder-width wide on anti-slip metal plate.',
      'Disengage lateral mechanical locks and lower platform under control.'
    ],
    biomechanicalTip: 'Do not lock your knee joints at maximum extension. Keep kinetic force loaded onto muscle bellies.',
    loadCapacity: 'Up to 800 Kg Max Loading',
    brand: 'Arsenal Strength',
    zone: 'Zone A - Biomechanical Turf'
  },
  {
    id: 'eq2',
    name: 'Rogue Monster Squat & Power Rack Suite',
    category: 'Free Weights',
    categoryLabel: 'Free Weights',
    image: luxuryGymInteriorImg,
    primaryMuscles: ['Quadriceps', 'Glutes', 'Erector Spinae'],
    secondaryMuscles: ['Transverse Abdominis', 'Calves'],
    techSpec: 'High-tensile steel frames with computer-guided laser-cut numbering and industrial sandwich J-cups',
    setupProtocol: [
      'Position safety spotter pins at a level just below your deepest squat depth.',
      'Align the Olympic steel bar to high chest level.',
      'Center the bar beneath your upper traps and lift cleanly.'
    ],
    biomechanicalTip: 'Brace your abdominal wall prior to liftoff. Maintain a neutral lumbar curve during the entire eccentric phase.',
    loadCapacity: 'Industrial Rated 1000+ Kg Limits',
    brand: 'Rogue Fitness',
    zone: 'Zone B - Heavy Lifting Center'
  },
  {
    id: 'eq3',
    name: 'Apex Dual-Cable Adjustable Functional Column',
    category: 'Cables',
    categoryLabel: 'Cables & Functional',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    primaryMuscles: ['Pectorals', 'Deltoids', 'Rotator Cuff'],
    secondaryMuscles: ['Core Slings', 'Biceps / Triceps'],
    techSpec: 'Aeronautical wire rope cables connected to isolated 100kg cold-rolled steel weight stacks',
    setupProtocol: [
      'Deploy magnetic selection pins in vertical stack.',
      'Pull orange rapid-selector knob to adjust pulley carriage height.',
      'Attach premium knurled handle or standard canvas straps.'
    ],
    biomechanicalTip: 'Do not use excessive torso sway. Lock shoulder blades in retraction to isolate active muscle fibers.',
    loadCapacity: '100 Kg dual stacks',
    brand: 'Watson Athletics',
    zone: 'Zone C - Cable & Kinetic Hub'
  },
  {
    id: 'eq4',
    name: 'Genesis Linear-Bearing 45° Hack Squat',
    category: 'Strength',
    categoryLabel: 'Strength / Plate-Loaded',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80',
    primaryMuscles: ['Vastus Lateralis', 'Rectus Femoris'],
    secondaryMuscles: ['Soleus', 'Gluteal fold'],
    techSpec: 'Rotational carriage moving smoothly on case-hardened high-precision steel shafts',
    setupProtocol: [
      'Rest shoulder region under custom ergonomic pads.',
      'Ensure head rests flatly onto spine-support cushion.',
      'Push up slightly to drop safety catch lever before lowering weight.'
    ],
    biomechanicalTip: 'Keep heels entirely glued to the deck. Raising your heels shifts shearing tension to the patella tendons.',
    loadCapacity: 'Up to 600 Kg capacity',
    brand: 'Hammer Strength',
    zone: 'Zone A - Biomechanical Turf'
  },
  {
    id: 'eq5',
    name: 'Watson Elite Solid Urethane Dumbbell Complex',
    category: 'Free Weights',
    categoryLabel: 'Free Weights',
    image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&w=800&q=80',
    primaryMuscles: ['Biceps Brachii', 'Triceps', 'Lateral Deltoid'],
    secondaryMuscles: ['Forearm Flexors', 'Trapezius'],
    techSpec: 'Solid mechanical steel cores with high-integrity chemically-bonded polyurethane shielding',
    setupProtocol: [
      'Locate desired tier weight matching scheduled session target.',
      'Grip centered knurled cylinder bar firmly.',
      'Ensure clear lifting radius from rack before beginning movement.'
    ],
    biomechanicalTip: 'Focus heavily on the eccentric (lowering) portion of the lift for increased mechanical hypertrophic stress.',
    loadCapacity: 'Range: 2.5 Kg to 75 Kg Pairs',
    brand: 'Watson Custom UK',
    zone: 'Zone B - Heavy Lifting Center'
  },
  {
    id: 'eq6',
    name: 'Assault AirBike Pro Elite Ergo-Grid',
    category: 'Cardio',
    categoryLabel: 'Cardio & Conditioning',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    primaryMuscles: ['Cardiovascular system', 'Quadriceps'],
    secondaryMuscles: ['Latissimus Dorsi', 'Pectorals'],
    techSpec: '27-inch steel air resistance fan creating progressive dynamic wind resistance matching body output',
    setupProtocol: [
      'Use vertical spring-pin to align top of seat saddle with hip bone.',
      'Slip secure dynamic foot straps around midfoot.',
      'Press Quickstart on the console with calibrated LCD display.'
    ],
    biomechanicalTip: 'Leverage equal drive through your hands pushing/pulling and your feet cycling to bypass early leg fatigue.',
    loadCapacity: 'Infinite wind-dynamics',
    brand: 'Assault Fitness',
    zone: 'Zone D - High-Oxygen Cardio Deck'
  }
];

export default function EquipmentShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Track which blueprint drawer is active
  const [expandedBlueprint, setExpandedBlueprint] = useState<string | null>(null);

  // Filter Categories
  const categories = ['All', 'Strength', 'Free Weights', 'Cables', 'Cardio'];

  // Filter logic
  const filteredEquipment = useMemo(() => {
    return EQUIPMENT_DATA.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.primaryMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.zone.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleBlueprint = (id: string) => {
    if (expandedBlueprint === id) {
      setExpandedBlueprint(null);
    } else {
      setExpandedBlueprint(id);
    }
  };

  return (
    <section className="py-20 bg-zinc-950/40 text-white border-y border-zinc-900/60" id="equipment-collection">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-red-500/10 px-3.5 py-1.5 rounded-full text-xs font-mono text-red-500 uppercase tracking-widest">
            <Settings className="h-3.5 w-3.5 animate-spin-slow" />
            <span>Biomechanical Machinery Blueprint</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-white mt-4 tracking-tight leading-none uppercase">
            ELITE <span className="text-red-500">EQUIPMENT</span> & POWER MACHINES
          </h2>
          <p className="text-zinc-400 mt-4 text-xs sm:text-base leading-relaxed font-sans">
            Witness our medical-grade training hardware setup. Featuring custom-molded converging levers, linear ball bearings, and premium high-tensile steel.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10 bg-zinc-900/40 border border-zinc-900 p-4 rounded-3xl backdrop-blur-md">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setExpandedBlueprint(null); // Close any expanded when filter changes
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono tracking-wide uppercase transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-red-500 text-white font-bold shadow-lg shadow-red-500/15'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-900'
                }`}
              >
                {cat === 'All' ? 'All Classes' : cat}
              </button>
            ))}
          </div>

          {/* Search Input Box */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Filter by machine, muscle, or zone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 text-sm py-2.5 pl-10 pr-4 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition-all font-sans"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results grid */}
        {filteredEquipment.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEquipment.map((item) => {
              const isOpen = expandedBlueprint === item.id;
              
              return (
                <div 
                  key={item.id}
                  className="bg-zinc-900 border border-zinc-900 hover:border-zinc-850 p-5 rounded-3xl transition-all duration-300 flex flex-col justify-between group shadow-lg"
                  id={`equipment-card-${item.id}`}
                >
                  <div>
                    {/* Image Area with badges */}
                    <div className="relative h-56 rounded-2xl overflow-hidden mb-5">
                      <EquipmentImage 
                        src={item.image} 
                        alt={item.name} 
                        category={item.category} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent pointer-events-none"></div>
                      
                      {/* Top left category badge */}
                      <div className="absolute top-3 left-3 bg-zinc-950/85 backdrop-blur-md border border-zinc-800 text-[10px] font-mono text-red-500 px-3 py-1.5 rounded-full uppercase font-medium tracking-wider">
                        {item.categoryLabel}
                      </div>

                      {/* Brand indicator top right */}
                      <div className="absolute top-3 right-3 bg-zinc-950/85 backdrop-blur-md border border-zinc-800 text-[10px] font-mono text-zinc-300 px-3 py-1.5 rounded-full font-medium">
                        {item.brand}
                      </div>

                      {/* Zone indicator bottom left */}
                      <div className="absolute bottom-3 left-3 bg-zinc-900/90 border border-zinc-850 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-mono text-zinc-400">
                        {item.zone}
                      </div>
                    </div>

                    {/* Machine Name */}
                    <h3 className="font-display font-medium text-xl text-white group-hover:text-red-500 transition-colors uppercase leading-tight">
                      {item.name}
                    </h3>

                    {/* Active Muscle Target tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.primaryMuscles.map((muscle) => (
                        <span 
                          key={muscle}
                          className="text-[9px] font-mono bg-red-500/10 text-red-500 px-2 py-0.5 rounded-md border border-red-500/20 uppercase font-semibold tracking-wider"
                        >
                          Primary: {muscle}
                        </span>
                      ))}
                      {item.secondaryMuscles.map((muscle) => (
                        <span 
                          key={muscle}
                          className="text-[9px] font-mono bg-zinc-950 text-zinc-400 px-2 py-0.5 rounded-md border border-zinc-850 uppercase tracking-wider"
                        >
                          Secondary: {muscle}
                        </span>
                      ))}
                    </div>

                    {/* Brief Tech description */}
                    <p className="text-zinc-400 text-xs sm:text-sm mt-4 font-sans leading-relaxed">
                      {item.techSpec}
                    </p>
                  </div>

                  {/* Dynamic Action Area: Blueprint foldout */}
                  <div className="mt-5 pt-4 border-t border-zinc-950 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                      <span>Rated Force limits:</span>
                      <span className="text-zinc-200 font-semibold">{item.loadCapacity}</span>
                    </div>

                    <button
                      onClick={() => toggleBlueprint(item.id)}
                      className={`w-full text-center py-2.5 rounded-xl text-xs font-mono font-medium tracking-wide uppercase transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer ${
                        isOpen 
                          ? 'bg-zinc-800 hover:bg-zinc-750 text-white' 
                          : 'bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-red-500 hover:bg-zinc-900'
                      }`}
                    >
                      <Activity className={`h-3.5 w-3.5 ${isOpen ? 'animate-pulse' : ''}`} />
                      <span>{isOpen ? 'Close Blueprint Details' : 'View Machinery Blueprint'}</span>
                    </button>

                    {/* Expandable Blueprint specs sheet */}
                    {isOpen && (
                      <div className="mt-2 bg-zinc-950 border border-zinc-850/80 p-4 rounded-2xl space-y-3.5 animate-in slide-in-from-top-2 duration-300">
                        {/* Setup steps */}
                        <div>
                          <span className="block text-[10px] font-mono text-red-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3 inline" /> Setup Safe Protocol:
                          </span>
                          <ol className="text-[11px] text-zinc-400 space-y-1.5 list-decimal list-inside font-sans leading-relaxed pl-1">
                            {item.setupProtocol.map((step, idx) => (
                              <li key={idx} className="indent-[-12px] pl-[12px]">{step}</li>
                            ))}
                          </ol>
                        </div>

                        {/* Professional tips */}
                        <div className="border-t border-zinc-900/60 pt-3">
                          <span className="block text-[10px] font-mono text-white uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Info className="h-3 w-3 text-red-500" /> Biomechanical Tip:
                          </span>
                          <p className="text-[11px] text-zinc-300 italic leading-relaxed pl-1">
                            "{item.biomechanicalTip}"
                          </p>
                        </div>

                        {/* Specs row */}
                        <div className="border-t border-zinc-900/60 pt-3 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-zinc-500">Kinesiology Level:</span>
                          <span className="bg-red-500/5 text-red-500 px-2.5 py-0.5 rounded border border-red-500/10 uppercase">
                            Advanced Elite Setup
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center bg-zinc-900/40 p-12 rounded-3xl border border-zinc-900 max-w-lg mx-auto">
            <Activity className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
            <h4 className="text-white font-medium text-lg">No biomechanical match found</h4>
            <p className="text-zinc-500 text-xs mt-1">Try searching for other terms like 'Quad', 'Leg', or 'Squat'.</p>
            <button 
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-zinc-950 hover:bg-zinc-900 text-red-500 font-mono text-xs rounded-xl border border-zinc-800 transition"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
