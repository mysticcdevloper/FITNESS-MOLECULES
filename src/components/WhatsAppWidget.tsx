/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GYM_LOCATION } from '../data/gymData';

export default function WhatsAppWidget() {
  const handleWhatsAppRedirect = () => {
    const text = encodeURIComponent(
      `Hi, I would like to enquire about FITNESS MOLECULE gym membership packages and training consultations in Ghaziabad.`
    );
    const url = `https://wa.me/${GYM_LOCATION.whatsappNumber}?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleWhatsAppRedirect}
        className="flex items-center space-x-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer font-sans"
        aria-label="Contact us on WhatsApp"
        id="whatsapp-chat-widget"
      >
        {/* Animated green ping pulse indicator */}
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        
        {/* WhatsApp Icon */}
        <svg 
          className="h-5.5 w-5.5 fill-current" 
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.51 5.277 3.51 8.474a11.95 11.95 0 0 1-11.948 11.977c-2.008-.001-3.987-.512-5.741-1.486L0 24zm6.59-11.236c-.144-.24-.047-.373.072-.49.108-.107.24-.277.36-.416.12-.138.16-.233.24-.389.08-.155.04-.293-.02-.413-.06-.12-.54-1.302-.74-1.785-.195-.47-.393-.406-.54-.413-.137-.007-.294-.009-.451-.009-.157 0-.413.06-.63.294-.216.234-.824.806-.824 1.967 0 1.162.845 2.285.963 2.443.118.158 1.663 2.54 4.029 3.559.563.243 1.002.389 1.343.498.564.18 1.077.155 1.483.094.453-.068 1.393-.569 1.59-1.117.195-.547.195-1.017.137-1.117-.058-.1-.215-.158-.471-.286-.256-.128-1.517-.749-1.753-.834-.236-.086-.407-.128-.578.128-.172.256-.665.834-.815 1.005-.15.17-.301.191-.557.062-.256-.13-1.079-.398-2.057-1.272-.76-.677-1.273-1.514-1.422-1.771z"/>
        </svg>

        <span className="text-xs sm:text-sm font-semibold tracking-wide">WhatsApp Support</span>
      </button>
    </div>
  );
}
