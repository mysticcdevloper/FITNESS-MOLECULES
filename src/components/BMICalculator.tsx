/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calculator, RefreshCw, Sparkles, CheckCircle } from 'lucide-react';

export default function BMICalculator() {
  const [weight, setWeight] = useState<string>('72');
  const [height, setHeight] = useState<string>('174');
  const [age, setAge] = useState<string>('28');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [bmi, setBmi] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('');
  const [suggestion, setSuggestion] = useState<string>('');

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // to meters

    if (!w || !h || w <= 0 || h <= 0) return;

    const calculatedBmi = w / (h * h);
    const roundedBmi = Math.round(calculatedBmi * 10) / 10;
    setBmi(roundedBmi);

    let bmiStatus = '';
    let bSuggestion = '';

    if (roundedBmi < 18.5) {
      bmiStatus = 'Underweight';
      bSuggestion = 'Focus on complex carbohydrates & clean calorie surplus. We recommend our "Hypertrophy & Strength" class paired with a structured diet plan from our nutrition coaches to pack lean tissue density.';
    } else if (roundedBmi >= 18.5 && roundedBmi < 24.9) {
      bmiStatus = 'Healthy Weight';
      bSuggestion = 'Exceptional baseline body structure! Maintain this metabolism with progressive overload of compound movements. Our "Tactical CrossFit & Conditioning" program will help polish your power and VO2 max levels.';
    } else if (roundedBmi >= 24.9 && roundedBmi < 29.9) {
      bmiStatus = 'Overweight';
      bSuggestion = 'Moderately high body fat threshold. Plan for a moderate daily negative energy balance (250-400 calories). Target athletic intervals with "Cardiac Oxygen Boxing" to trigger sustained lipid oxidation.';
    } else {
      bmiStatus = 'Obese';
      bSuggestion = 'High metabolic resistance detected. We highly recommend Master Trainer Ayush\'s custom biological diet plan and mild fasted walk routines. Build physical foundation, then scale into full-body strength splits.';
    }

    setStatus(bmiStatus);
    setSuggestion(bSuggestion);
  };

  const getStatusColor = (bmiStatus: string) => {
    switch (bmiStatus) {
      case 'Underweight': return 'text-amber-400 border-amber-400/20 bg-amber-400/5';
      case 'Healthy Weight': return 'text-red-400 border-red-400/20 bg-red-400/5';
      case 'Overweight': return 'text-orange-400 border-orange-400/20 bg-orange-400/5';
      case 'Obese': return 'text-red-400 border-red-400/20 bg-red-400/5';
      default: return 'text-zinc-400 border-zinc-800 bg-zinc-900';
    }
  };

  const resetCalculator = () => {
    setWeight('');
    setHeight('');
    setAge('');
    setBmi(null);
    setStatus('');
    setSuggestion('');
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden" id="bmi-calculator">
      <div className="absolute top-0 right-0 p-8 text-zinc-800 stroke-1 pointer-events-none">
        <Calculator className="h-[200px] w-[200px] opacity-10" />
      </div>

      <div className="relative">
        <div className="flex items-center space-x-2.5 mb-6">
          <div className="p-2 bg-red-500/10 text-red-500 rounded-xl">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Self-Assessment Tool</span>
            <h3 className="text-2xl sm:text-3xl font-display font-semibold text-white">Biological BMI Calculator</h3>
          </div>
        </div>

        <p className="text-zinc-400 text-sm mb-8 leading-relaxed font-sans max-w-xl">
          Quickly compute your Body Mass Index (BMI). Our system evaluates your body density profile and correlates it with customized fitness advice.
        </p>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Inputs Form */}
          <form onSubmit={calculateBMI} className="lg:col-span-7 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {/* Gender */}
              <div className="col-span-2">
                <label className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Biological Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-3 px-4 rounded-xl font-medium text-sm transition-all border text-center ${
                      gender === 'male'
                        ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/10'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-3 px-4 rounded-xl font-medium text-sm transition-all border text-center ${
                      gender === 'female'
                        ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/10'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              {/* Height */}
              <div>
                <label htmlFor="bmi-height" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Height (cm)</label>
                <input
                  id="bmi-height"
                  type="number"
                  required
                  placeholder="e.g. 174"
                  min="100"
                  max="250"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {/* Weight */}
              <div>
                <label htmlFor="bmi-weight" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Weight (kg)</label>
                <input
                  id="bmi-weight"
                  type="number"
                  required
                  placeholder="e.g. 72"
                  min="30"
                  max="250"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {/* Age */}
              <div className="col-span-2">
                <label htmlFor="bmi-age" className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Age</label>
                <input
                  id="bmi-age"
                  type="number"
                  required
                  placeholder="e.g. 28"
                  min="10"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-colors cursor-pointer text-center font-sans shadow-lg shadow-red-500/5 hover:shadow-red-500/10"
              >
                Calculate Metrics
              </button>
              <button
                type="button"
                onClick={resetCalculator}
                className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white p-3.5 rounded-xl transition-colors cursor-pointer"
                aria-label="Reset fields"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Outputs Panel */}
          <div className="lg:col-span-5 h-full">
            {bmi !== null ? (
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 h-full flex flex-col justify-between animate-in fade-in zoom-in-95 duration-300">
                <div>
                  <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest block mb-4">Assessment Analysis</span>
                  
                  <div className="flex items-baseline space-x-2">
                    <span className="text-5xl font-display font-black text-white">{bmi}</span>
                    <span className="text-sm font-mono text-zinc-400">BMI score</span>
                  </div>

                  <div className={`mt-4 px-3 py-1.5 rounded-lg border text-xs font-mono inline-block ${getStatusColor(status)}`}>
                    CATEGORY: <span className="font-bold uppercase">{status}</span>
                  </div>

                  {/* Recommendation Text */}
                  <div className="mt-6 border-t border-zinc-900 pt-5">
                    <div className="flex items-center space-x-2 text-red-500 mb-2">
                      <Sparkles className="h-4 w-4 shrink-0" />
                      <span className="text-xs font-mono uppercase tracking-wider font-semibold">Custom Molecular Suggestion</span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                      {suggestion}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-900 text-[11px] text-zinc-500 flex items-center space-x-1.5 font-mono">
                  <CheckCircle className="h-3 w-3 text-zinc-500 shrink-0" />
                  <span>Calculated in compliance with WHO weight category standard metrics.</span>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-950/40 border border-zinc-800 border-dashed rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center py-16">
                <div className="bg-zinc-900 p-4 rounded-full text-zinc-600 mb-4 border border-zinc-800">
                  <Calculator className="h-8 w-8 stroke-[1.5]" />
                </div>
                <h4 className="text-zinc-400 font-medium text-sm">Awaiting Entry Parameters</h4>
                <p className="text-zinc-500 text-xs max-w-xs mt-1 leading-relaxed font-sans">
                  Input your biometric markers on the left and trigger evaluation to receive state recommendations.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
