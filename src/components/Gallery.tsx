import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, X, ChevronLeft, ChevronRight, Share2, Heart, Award } from 'lucide-react';

export default function Gallery() {
  const images = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200",
      title: "Ancient Cedar Yoga Pavilion",
      category: "Wellness",
      aspect: "landscape"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1200",
      title: "Prithvi Suite Heated Pool",
      category: "Sanctuary",
      aspect: "portrait"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200",
      title: "Bespoke Fine Linen Bedding",
      category: "Detail",
      aspect: "portrait"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200",
      title: "Soma Restaurant Ayurvedic Alchemist Pavilions",
      category: "Dining",
      aspect: "landscape"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200",
      title: "River Sanctuary Floating Lounge Deck",
      category: "Water",
      aspect: "landscape"
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1432303491146-c21e612ec4e3?auto=format&fit=crop&q=80&w=1200",
      title: "Valley Mist Sunrise Observation Edge",
      category: "Estate",
      aspect: "portrait"
    }
  ];

  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
    }
  };

  const handleFavoriteToggle = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-luxury-gold-50 text-luxury-green-900 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.4em] text-luxury-gold-700 font-bold block mb-3">
              Aesthetics Board
            </span>
            <h2 className="font-serif-luxury text-4xl md:text-5xl text-luxury-green-900 leading-tight">
              Capturing the raw spirit <br />
              <span className="italic font-light">of Aaryam valley.</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-luxury-gold-500" />
            <span className="text-[10px] uppercase tracking-widest font-bold tracking-tighter">Verified Organic Visual Estate</span>
          </div>
        </div>

        {/* Masonry / Justified Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((img, idx) => {
            const isFav = favorites.includes(img.id);
            return (
              <motion.div
                key={img.id}
                id={`gallery-masonry-item-${img.id}`}
                className="break-inside-avoid relative overflow-hidden rounded-sm group cursor-pointer border border-[#1b3022]/5 shadow-md bg-white hover:shadow-2xl transition-all duration-500"
                onClick={() => setActivePhotoIndex(idx)}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                {/* Image */}
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full object-cover rounded-sm group-hover:scale-[1.03] transition-transform duration-700 select-none"
                />

                {/* Cover Overlay holding features */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a170f]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                  {/* Heart / Favorite Button top row */}
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => handleFavoriteToggle(img.id, e)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all active:scale-90"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                    </button>
                  </div>

                  {/* Information slide details bottom row */}
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-luxury-gold-500 font-bold">
                      {img.category} Profile
                    </span>
                    <h4 className="font-serif-luxury text-sm text-white font-bold leading-tight mt-0.5 mb-2">
                      {img.title}
                    </h4>
                    
                    <div className="flex items-center gap-1.5 text-[10px] text-white/70 uppercase tracking-widest">
                      <ZoomIn className="w-3.5 h-3.5 text-luxury-gold-500" />
                      <span>Maximize Image</span>
                    </div>

                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Lightbox Modal System */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            id="gallery-lightbox"
            className="fixed inset-0 z-55 bg-[#0a170f]/95 backdrop-blur-md flex flex-col justify-between p-6 select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Top Bar controls */}
            <div className="flex items-center justify-between text-white border-b border-white/5 pb-4">
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase tracking-widest text-luxury-gold-500">
                  {images[activePhotoIndex].category} Photography
                </span>
                <span className="font-serif-luxury text-lg tracking-wide">
                  {images[activePhotoIndex].title}
                </span>
              </div>
              
              <button
                id="gallery-lightbox-close"
                onClick={() => setActivePhotoIndex(null)}
                className="bg-white/5 hover:bg-white/10 text-white p-2.5 rounded-full border border-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Central Photo */}
            <div className="flex-1 flex items-center justify-center relative my-4">
              <motion.img
                key={activePhotoIndex}
                src={images[activePhotoIndex].url}
                alt={images[activePhotoIndex].title}
                className="max-w-full max-h-[75vh] object-contain rounded-sm border border-white/10 shadow-2xl"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Slider Arrows */}
              <button
                id="gallery-arrow-prev"
                onClick={handlePrev}
                className="absolute left-4 bg-white/5 hover:bg-white/10 hover:scale-105 active:scale-95 text-white p-3 md:p-4 rounded-full border border-white/10 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                id="gallery-arrow-next"
                onClick={handleNext}
                className="absolute right-4 bg-white/5 hover:bg-white/10 hover:scale-105 active:scale-95 text-white p-3 md:p-4 rounded-full border border-white/10 transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Bar Details */}
            <div className="text-center text-white/50 text-[10px] uppercase tracking-widest pb-2">
              Viewing photo {activePhotoIndex + 1} of {images.length} &bull; Photo Favorites: {favorites.length}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
