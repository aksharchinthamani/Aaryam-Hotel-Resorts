import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Eye, Music, Award, Flame, Sun } from 'lucide-react';

export default function Experiences() {
  const list = [
    {
      id: "exp-yoga",
      title: "Prana Sound & Cliffside Yoga",
      category: "Wellness & Akasha",
      description: "As dawn scales the peaks, align your breath with therapeutic Himalayan crystal gongs on our outdoor cedar platforms suspending over mist valleys.",
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1200",
      accent: <Sun className="w-5 h-5 text-amber-500" />,
      tag: "Highly Restorative"
    },
    {
      id: "exp-culinary",
      title: "Soma Ayurvedic Culinary Alchemy",
      category: "Feast & Soma",
      description: "Gather with our executive head chef to hand-harvest high-altitude organic herbs from the stone terraces and blend them into ancient nourishing curations.",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200",
      accent: <Award className="w-5 h-5 text-emerald-500" />,
      tag: "Organic & Pure"
    },
    {
      id: "exp-constellation",
      title: "Celestial Constellation Dinners",
      category: "Night & Tejas",
      description: "Dine on fine linen beneath Kodaikanal's unpolluted high-altitude skies. Includes private telescope stargazingguided reviews with our local astronomer.",
      image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=1200",
      accent: <Flame className="w-5 h-5 text-luxury-gold-500" />,
      tag: "Signature Candlelit"
    },
    {
      id: "exp-forest",
      title: "Guided Cedar Forest-Bathing",
      category: "Adventure & Prithvi",
      description: "Immerse in deep sensory walks through centuries-old pine and cedar groves to cleanse the spirit and activate organic calm, led by local naturalist guides.",
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1200",
      accent: <Music className="w-5 h-5 text-blue-500" />,
      tag: "Immersive Nature"
    }
  ];

  return (
    <section id="experiences" className="py-24 luxury-gradient text-white relative overflow-hidden">
      {/* Decorative Golden Ambient Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-luxury-gold-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-luxury-gold-500 font-bold block mb-3">
            Bespoke Rituals
          </span>
          <h2 className="font-serif-luxury text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
            Curated valley experiences <br />
            <span className="italic font-light text-luxury-gold-200">found nowhere else.</span>
          </h2>
          <p className="text-xs md:text-sm text-luxury-gold-100/70 mt-4 leading-relaxed max-w-xl">
            From sunrise pranayama on pristine mountain ridges to secret culinary fire-pavilions, Aaryam breathes elemental memory into every solitary afternoon.
          </p>
        </div>

        {/* Horizontal & Card Grid Layout with Hover Zoom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {list.map((item, idx) => (
            <motion.div
              key={item.id}
              id={`experience-card-${item.id}`}
              className="frosted-glass-card-dark rounded-sm overflow-hidden flex flex-col md:grid md:grid-cols-12 min-h-[280px] border border-white/5 shadow-2xl group transition-all"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.7 }}
              whileHover={{ y: -4, borderColor: "rgba(212, 175, 55, 0.3)" }}
            >
              {/* Picture Spot */}
              <div className="md:col-span-5 relative h-48 md:h-full overflow-hidden bg-luxury-green-950">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80"
                />
                
                {/* Custom glowing micro tag */}
                <div className="absolute top-3 left-3 bg-luxury-gold-500 text-luxury-green-950 text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-xs">
                  {item.tag}
                </div>
              </div>

              {/* Text Info Spot */}
              <div className="md:col-span-7 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-luxury-gold-500 font-medium block mb-1">
                    {item.category}
                  </span>
                  
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-serif-luxury text-lg font-bold tracking-wide group-hover:text-luxury-gold-200 transition-colors">
                      {item.title}
                    </h3>
                    <div className="shrink-0 p-1 bg-white/5 rounded-full border border-white/10 shadow-sm">
                      {item.accent}
                    </div>
                  </div>

                  <p className="text-[11px] leading-relaxed text-luxury-gold-100/70 mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-[9px] uppercase tracking-widest text-luxury-gold-200/60 font-mono">
                    Aaryam Estate Guest Service
                  </span>
                  <div className="flex items-center gap-1 text-xs text-luxury-gold-500 font-semibold group-hover:gap-2 transition-all">
                    <span>Inquire</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
