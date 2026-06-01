/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GALLERY_IMGS } from '../data/gymData';
import { Eye, X, ZoomIn } from 'lucide-react';

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCaption, setSelectedCaption] = useState<string>('');

  const openLightbox = (url: string, caption: string) => {
    setSelectedImage(url);
    setSelectedCaption(caption);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setSelectedCaption('');
  };

  return (
    <section className="py-20 bg-zinc-950 text-white" id="gallery-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-red-500 bg-red-500/10 px-3.5 py-1.5 rounded-full uppercase">
            Facility Overview
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-white mt-4 tracking-tight leading-none">
            THE FITNESS <span className="text-red-500">ARENA</span>
          </h2>
          <p className="text-zinc-400 mt-4 text-sm sm:text-base leading-relaxed font-sans">
            A visual inspection of our 10,000+ Sq. Ft. state-of-the-art facility. Built with premium spacing, rich acoustic zoning, and high oxygen ventilation systems.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_IMGS.map((img, i) => (
            <div
              key={i}
              onClick={() => openLightbox(img.url, img.caption)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-900/60 aspect-4/3 shadow-md"
              id={`gallery-item-${i}`}
            >
              <img
                src={img.url}
                alt={img.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-zinc-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-4">
                <div className="bg-red-500 text-white p-2.5 rounded-full scale-75 group-hover:scale-100 transition-transform duration-300">
                  <ZoomIn className="h-5 w-5" />
                </div>
                <h4 className="text-white font-medium text-sm mt-3 font-display">
                  {img.caption}
                </h4>
                <p className="text-[11px] font-mono tracking-widest text-red-500 mt-1 uppercase">
                  Click to Expand
                </p>
              </div>

              {/* Caption Bottom bar (mobile visible) */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950/90 to-transparent p-4 sm:hidden">
                <span className="text-xs text-white text-sans font-medium">{img.caption}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-300"
            onClick={closeLightbox}
          >
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
              <button
                onClick={closeLightbox}
                className="p-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full transition-colors border border-zinc-800"
                aria-label="Close Lightbox"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div 
              className="max-w-4xl w-full flex flex-col relative max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()} // Stop modal closure when clicking image area
            >
              <img
                src={selectedImage}
                alt={selectedCaption}
                className="w-full h-auto max-h-[75vh] object-contain rounded-2xl mx-auto shadow-2xl border border-zinc-900"
                referrerPolicy="no-referrer"
              />
              {selectedCaption && (
                <div className="text-center mt-4">
                  <h4 className="text-red-500 font-display font-medium text-lg leading-tight">
                    {selectedCaption}
                  </h4>
                  <span className="text-zinc-500 font-mono text-[11px] uppercase tracking-wider block mt-1">
                    Fitness Molecule • Premium Interior Layout
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
