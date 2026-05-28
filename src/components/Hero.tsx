import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Calendar, Users, Compass, Search } from 'lucide-react';

interface HeroProps {
  onCheckAvailability: () => void;
  onExploreRooms: () => void;
  arrivalDate: string;
  setArrivalDate: (date: string) => void;
  departureDate: string;
  setDepartureDate: (date: string) => void;
  guests: number;
  setGuests: (g: number) => void;
}

export default function Hero({
  onCheckAvailability,
  onExploreRooms,
  arrivalDate,
  setArrivalDate,
  departureDate,
  setDepartureDate,
  guests,
  setGuests
}: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden"
    >
      {/* Cinematic Media Background with Subtle Slow Zoom Parallax Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&q=80&w=2000')"
          }}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1.0 }}
          transition={{ duration: 15, ease: "easeOut" }}
        />
        {/* Deep, organic forest green custom gradient filter for perfect visual contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-green-950/85 via-luxury-green-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-green-950/90 via-transparent to-luxury-green-950/30" />
      </div>

      {/* Main Copy Area */}
      <div className="flex-1 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 items-center pt-32 pb-16 relative z-10 w-full">
        <div className="lg:col-span-8 text-white">
          <motion.div 
            className="mb-6 inline-flex items-center gap-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-10 h-[1.5px] bg-luxury-gold-500" />
            <span className="text-xs uppercase tracking-[0.4em] text-luxury-gold-500 font-semibold">
              Ethereal Valley Sanctuary
            </span>
          </motion.div>

          <h1 className="font-serif-luxury text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight mb-8">
            Where Silence <br />
            <motion.span 
              className="italic font-light text-luxury-gold-100 opacity-90 inline-block mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              Becomes Music.
            </motion.span>
          </h1>

          <motion.p
            className="max-w-xl text-sm md:text-base leading-relaxed text-luxury-gold-50/85 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Nestled deep within the emerald embrace of the sacred Himalayan cedar groves, Aaryam offers a sanctuary of refined eco-luxury where exquisite luxury design meets ancient forest stillness.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <button
              id="hero-explore-rooms-btn"
              onClick={onExploreRooms}
              className="px-8 py-3.5 bg-luxury-gold-500 hover:bg-luxury-gold-600 text-white hover:text-white rounded-sm text-xs font-semibold tracking-widest uppercase cursor-pointer transition-all duration-300 shadow-lg shadow-luxury-gold-500/10 hover:shadow-luxury-gold-500/30 flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-white" />
              <span>Explore Sanctuaries</span>
            </button>
            <button
              id="hero-scroll-rooms-btn"
              onClick={() => {
                const el = document.getElementById('rooms');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3.5 border border-white/20 hover:border-white/60 bg-white/5 hover:bg-white/10 text-white rounded-sm text-xs font-semibold tracking-widest uppercase cursor-pointer transition-all duration-300 flex items-center justify-center"
            >
              Our Experiences
            </button>
          </motion.div>

          {/* Quick Availability Widget (Frosted Glass Theme Signature) */}
          <motion.div
            id="hero-frosted-booking-widget"
            className="backdrop-blur-xl bg-white/15 border border-white/20 p-5 md:p-6 shadow-2xl rounded-sm flex flex-col md:flex-row items-center gap-6 max-w-3xl w-full"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, type: 'spring', stiffness: 50 }}
          >
            {/* Arrival Date */}
            <div className="flex items-center gap-3 w-full md:w-auto md:border-r border-white/15 pr-0 md:pr-6">
              <Calendar className="w-5 h-5 text-luxury-gold-200 shrink-0" />
              <div className="flex flex-col w-full">
                <label className="text-[9px] uppercase tracking-wider text-luxury-gold-200/80 mb-1">Arrival Date</label>
                <input
                  type="date"
                  className="bg-transparent border-0 p-0 text-white focus:outline-none text-xs w-full [color-scheme:dark]"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                />
              </div>
            </div>

            {/* Departure Date */}
            <div className="flex items-center gap-3 w-full md:w-auto md:border-r border-white/15 pr-0 md:pr-6">
              <Calendar className="w-5 h-5 text-luxury-gold-200 shrink-0" />
              <div className="flex flex-col w-full">
                <label className="text-[9px] uppercase tracking-wider text-luxury-gold-200/80 mb-1">Departure Date</label>
                <input
                  type="date"
                  className="bg-transparent border-0 p-0 text-white focus:outline-none text-xs w-full [color-scheme:dark]"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
              </div>
            </div>

            {/* Guests Count */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Users className="w-5 h-5 text-luxury-gold-200 shrink-0" />
              <div className="flex flex-col w-full">
                <label className="text-[9px] uppercase tracking-wider text-luxury-gold-200/80 mb-1">Honored Guests</label>
                <select
                  className="bg-transparent border-0 p-0 text-white focus:outline-none text-xs font-semibold cursor-pointer text-left w-full"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                >
                  <option value={1} className="bg-luxury-green-950 text-white">01 Single</option>
                  <option value={2} className="bg-luxury-green-950 text-white">02 Couple</option>
                  <option value={3} className="bg-luxury-green-950 text-white">03 Family</option>
                  <option value={4} className="bg-luxury-green-950 text-white">04 Royal Stay</option>
                </select>
              </div>
            </div>

            {/* Quick Action */}
            <button
              id="hero-quick-availability-search-btn"
              onClick={onCheckAvailability}
              className="p-4 bg-luxury-gold-500 hover:bg-luxury-gold-600 text-white rounded-sm shrink-0 transition-all duration-300 hover:scale-105 active:scale-95 w-full md:w-auto flex items-center justify-center gap-2 cursor-pointer cursor-royal"
            >
              <Search className="w-4 h-4 text-white" />
              <span className="md:hidden text-xs uppercase tracking-widest font-semibold">Check Availability</span>
            </button>
          </motion.div>
        </div>

        {/* Right Corner: Small floating badge */}
        <div className="hidden lg:block lg:col-span-4 relative h-full">
          <div className="absolute right-0 bottom-4 rotate-90 origin-right text-[10px] uppercase tracking-[0.6em] text-white/40 select-none">
            EST. 1994 &bull; SAHYADRI VALLEYS &bull; INDIA
          </div>
        </div>
      </div>

      {/* Bounce Footer Scroll Indicator */}
      <div className="w-full flex items-center justify-center pb-8 z-10 relative">
        <motion.button
          id="hero-scroll-indicator"
          onClick={() => {
            const el = document.getElementById('rooms');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-2 text-white/40 hover:text-white/80 transition-colors"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-[9px] tracking-[0.4em] uppercase">Scroll to explore</span>
          <ArrowDown className="w-4 h-4 text-luxury-gold-500" />
        </motion.button>
      </div>
    </section>
  );
}
