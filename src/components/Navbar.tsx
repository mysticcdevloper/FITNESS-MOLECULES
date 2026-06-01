/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, Dumbbell, Calendar, LayoutDashboard } from 'lucide-react';
import FMLogo from './FMLogo';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openJoinModal: (planId?: string) => void;
  hasDashboardData: boolean;
}

export default function Navbar({ activeTab, setActiveTab, openJoinModal, hasDashboardData }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'classes', label: 'Classes' },
    { id: 'trainers', label: 'Trainers' },
    { id: 'plans', label: 'Membership Plans' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => handleTabClick('home')}
          >
            <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-zinc-950/80 border border-zinc-900 overflow-hidden group-hover:border-zinc-800 transition-all duration-300 shadow-md shadow-red-500/5">
              <FMLogo size={46} className="transform group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-2xl tracking-wider text-white leading-none">
                FITNESS <span className="text-red-500">MOLECULE</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                Science-Backed Human Peak Performance
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'text-red-500 bg-zinc-900' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                }`}
                id={`nav-tab-${item.id}`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-red-500 rounded-full" />
                )}
              </button>
            ))}

            {/* Dashboard Badge Tab */}
            {hasDashboardData && (
              <button
                onClick={() => handleTabClick('dashboard')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'text-red-500 bg-zinc-900'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                }`}
                id="nav-tab-dashboard"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>My Hub</span>
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              </button>
            )}
          </div>

          {/* Action CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => openJoinModal()}
              className="bg-red-500 hover:bg-red-400 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-red-500/10 hover:shadow-red-500/20"
              id="navbar-cta-join"
            >
              Join Now
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            {hasDashboardData && (
              <button
                onClick={() => handleTabClick('dashboard')}
                className={`p-2 rounded-xl ${activeTab === 'dashboard' ? 'text-red-500 bg-zinc-900' : 'text-zinc-400'}`}
              >
                <LayoutDashboard className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 focus:outline-none transition-colors border border-zinc-900"
              aria-label="Toggle menu"
              id="navbar-toggle-mobile"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-zinc-950 border-t border-zinc-900 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-2 pt-2 pb-6 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  activeTab === item.id
                    ? 'text-red-500 bg-zinc-900 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-4 px-4">
              <button
                onClick={() => {
                  setIsOpen(false);
                  openJoinModal();
                }}
                className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-4 rounded-xl text-center text-sm transition-colors block"
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
