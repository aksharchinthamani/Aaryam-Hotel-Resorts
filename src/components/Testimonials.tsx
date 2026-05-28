import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      id: 1,
      quote: "To call Aaryam a resort would be an extreme understatement of its magic. It is a majestic, sacred portal. Sleeping in the Vayu Cottage beneath the retractable glass ceiling as mist floated across the canopy felt like stargazing inside a beautiful dream.",
      author: "Sarah Laurent",
      title: "Luxury Travel Editor, Elite Escape Magazine",
      rating: 5,
      date: "Oct 2025"
    },
    {
      id: 2,
      quote: "The Ayurvedic sound bath combined with physical morning therapy by the river stream is a masterpiece of curation. I came to Dharamshala completely exhausted, and returned with absolute clarity. The personal butler service is elite, silent, and prompt.",
      author: "Lord Adrian Thorne",
      title: "Thorne International Holdings",
      rating: 5,
      date: "Feb 2026"
    },
    {
      id: 3,
      quote: "We spent five nights in the Tejas Suite. Dining beneath the Himalayan constellations with the private telescope and having our own wooden fireplace blazing in the hills is a memory our family will treasure for lifetimes. Authentic and incredibly crafted first-class design.",
      author: "Renowned Artist Mei Ling",
      title: "Singapore Fine Arts Guild",
      rating: 5,
      date: "May 2026"
    }
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 8500);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const handlePrev = () => {
    setIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const active = reviews[index];

  return (
    <section className="py-24 linen-gradient text-luxury-green-900 border-t border-b border-black/5 relative overflow-hidden">
      
      {/* Absolute decorative back quotes sign */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 text-luxury-gold-500/10 pointer-events-none select-none">
        <Quote className="w-96 h-96" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        
        {/* Quotes Icon badge */}
        <div className="inline-flex p-3 bg-luxury-green-900 text-white rounded-full mb-8 shadow-md">
          <Quote className="w-5 h-5 text-luxury-gold-500" />
        </div>

        {/* Carousel Content */}
        <div className="min-h-[260px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.55 }}
              className="space-y-6"
            >
              {/* Rating stars */}
              <div className="flex items-center justify-center gap-1">
                {[...Array(active.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-luxury-gold-500 text-luxury-gold-500" />
                ))}
              </div>

              {/* Large Quote body */}
              <blockquote className="font-serif-luxury text-xl md:text-2xl lg:text-3xl italic leading-relaxed text-luxury-green-950 font-medium">
                "{active.quote}"
              </blockquote>

              {/* Author Descriptor details */}
              <div>
                <cite className="font-serif-luxury text-sm font-bold tracking-widest text-[#1B3022] not-italic block">
                  {active.author}
                </cite>
                <span className="text-[10px] uppercase tracking-widest text-luxury-gold-700 font-semibold block mt-1">
                  {active.title} &bull; {active.date}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dots & Arrow Controls */}
        <div className="flex items-center justify-center gap-6 mt-12">
          {/* Back btn */}
          <button
            id="testimonial-prev-btn"
            onClick={handlePrev}
            className="p-2 border border-black/10 hover:border-luxury-gold-500 rounded-full hover:bg-white text-luxury-green-900 transition-all cursor-pointer"
            title="Previous Patron Memory"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dots group */}
          <div className="flex items-center gap-2">
            {reviews.map((rev, i) => (
              <button
                key={rev.id}
                id={`testimonial-dot-${i}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === i ? 'w-6 bg-luxury-gold-500' : 'w-2 bg-black/15'
                }`}
              />
            ))}
          </div>

          {/* Next btn */}
          <button
            id="testimonial-next-btn"
            onClick={handleNext}
            className="p-2 border border-black/10 hover:border-luxury-gold-500 rounded-full hover:bg-white text-luxury-green-900 transition-all cursor-pointer"
            title="Next Patron Memory"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
