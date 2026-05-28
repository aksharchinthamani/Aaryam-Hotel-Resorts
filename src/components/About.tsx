import React from 'react';
import { motion } from 'motion/react';
import { Droplets, Flame, Trees, Wind, Sparkles } from 'lucide-react';

export default function About() {
  const elements = [
    {
      icon: <Trees className="w-5 h-5 text-emerald-600" />,
      title: "Prithvi (Earth)",
      desc: "Architectures carved from regional stone, rich local teakwoods, and private botanic terraced gardens."
    },
    {
      icon: <Wind className="w-5 h-5 text-cyan-600" />,
      title: "Vayu (Air)",
      desc: "Retractable high-loft glass ceilings designed specifically for stargazing the pristine Sahyadri constellations."
    },
    {
      icon: <Flame className="w-5 h-5 text-amber-500" />,
      title: "Tejas (Fire)",
      desc: "Wood-burning stone hearths, outdoor embers under the canopy, and sun-bathed warm meditation decks."
    },
    {
      icon: <Droplets className="w-5 h-5 text-blue-500" />,
      title: "Jal (Water)",
      desc: "Floating culinary breakfasts, therapeutic cedar hot tubs, and private bridges over crystal natural rivers."
    }
  ];

  return (
    <section id="story" className="py-24 linen-gradient relative overflow-hidden">
      {/* Subtle circular blur glow background from design spec */}
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-luxury-gold-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-[450px] h-[450px] bg-luxury-green-900/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Visual asymmetric layout with frosted overlays */}
          <div className="lg:col-span-6 relative">
            <div className="relative">
              {/* Primary Premium Image */}
              <motion.div 
                className="overflow-hidden rounded-sm shadow-2xl border border-white/40"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.0 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=1200" 
                  alt="Aaryam Forest Sanctuary Lobby"
                  className="w-full h-[550px] object-cover hover:scale-105 transition-transform duration-1000"
                />
              </motion.div>

              {/* Suspended Frosted Badge Over Image */}
              <motion.div 
                className="absolute -bottom-8 -right-4 md:right-10 frosted-glass-card max-w-[260px] p-6 rounded-sm shadow-2xl text-[#1B3022]"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Sparkles className="w-6 h-6 text-luxury-gold-500 mb-2" />
                <h4 className="font-serif-luxury text-lg font-bold mb-1">Elite Eco Platinum</h4>
                <p className="text-[11px] leading-relaxed opacity-80">
                  Recognized globally for deep Ayurvedic architectural wellness and 100% sustainable energy.
                </p>
              </motion.div>
            </div>
            
            {/* Hanging decorative coordinates */}
            <div className="absolute left-4 top-1/2 -rotate-95 -translate-x-1/2 hidden md:block text-[9px] tracking-[0.4em] text-luxury-green-900/40 font-mono">
              10.2238° N, 77.4941° E
            </div>
          </div>

          {/* Right Column: Historical Narrative and Elements Grid */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold-700 font-bold block mb-3">Our Core Philosophy</span>
              <h2 className="font-serif-luxury text-4xl md:text-5xl text-luxury-green-900 leading-tight mb-6">
                Curated precisely <br />
                <span className="italic font-light">to harmonize your spirit.</span>
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-luxury-green-900/80 mb-8">
                At Aaryam, we believe that true luxury does not distance oneself from the soil; rather, it weaves one elegantly back into it. Crafted from local clay, mountain basalt, and recycled fine cedar, our four distinct architectural suites mirror the ancient elements of the universe.
              </p>
            </motion.div>

            {/* Elements Interactive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              {elements.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="p-5 frosted-glass-card hover:bg-white/60 transition-all duration-300 rounded-sm border border-white/50"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="mb-3 w-10 h-10 rounded-full bg-white/80 border border-luxury-gold-500/20 flex items-center justify-center shadow-sm">
                    {item.icon}
                  </div>
                  <h3 className="font-serif-luxury text-sm font-semibold text-luxury-green-900 mb-1">{item.title}</h3>
                  <p className="text-[11px] leading-relaxed text-luxury-green-900/70">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
