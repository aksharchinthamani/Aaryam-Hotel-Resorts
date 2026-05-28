import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, BookOpen, Clock, Heart, Trash2, CheckCircle2 } from 'lucide-react';

interface WellnessPlannerProps {
  isDark: boolean;
}

interface Ritual {
  id: string;
  name: string;
  time: string;
  duration: string;
  days: string[];
  instructor: string;
  spots: number;
  description: string;
  type: string;
}

export default function WellnessPlanner({ isDark }: WellnessPlannerProps) {
  const rituals: Ritual[] = [
    {
      id: "rit-gong",
      name: "Akasha Crystal Sound Healing & Tibetan Gong Baths",
      time: "08:00 AM - 09:15 AM",
      duration: "75 Mins",
      days: ["Mon", "Wed", "Fri", "Sun"],
      instructor: "Master Tenzing",
      spots: 12,
      description: "Harness the healing vibration of hand-hammered singing bowls and large therapeutic gongs to restore natural electrical rhythms.",
      type: "Vibration Sound therapy"
    },
    {
      id: "rit-pranayama",
      name: "Prana-Cliff Sunrise Vinyasa Flow",
      time: "06:30 AM - 07:45 AM",
      duration: "75 Mins",
      days: ["Tue", "Thu", "Sat", "Sun"],
      instructor: "Yogini Meera",
      spots: 15,
      description: "Pranayama and alignment postures on high wooden decks overlooking early valley mist and mountain cloud rises.",
      type: "Yoga & Breath alignment"
    },
    {
      id: "rit-forest",
      name: "Guided Pine Bathing (Shinrin-Yoku)",
      time: "11:00 AM - 12:30 PM",
      duration: "90 Mins",
      days: ["Mon", "Tue", "Thu", "Fri"],
      instructor: "Rohan (Naturalist)",
      spots: 8,
      description: "Silent sensory walk under towering ancient cedar groves focused on aroma inhalation and mindful pacing.",
      type: "Forest Bathing Walk"
    },
    {
      id: "rit-sauna",
      name: "Himalayan Pink Salt Steam & Halotherapy",
      time: "04:30 PM - 05:30 PM",
      duration: "60 Mins",
      days: ["Wed", "Sat"],
      instructor: "Therapist Priya",
      spots: 6,
      description: "Detoxification therapy surrounded by blocks of natural pink salts and eucalyptus thermal moisture.",
      type: "Vapor Respiratory Therapy"
    }
  ];

  const [selectedRituals, setSelectedRituals] = useState<Ritual[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("Sun");
  
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Filter rituals for selected day
  const dailyRituals = rituals.filter(r => r.days.includes(selectedDay));

  const handleToggleRitual = (ritual: Ritual) => {
    const exists = selectedRituals.some(r => r.id === ritual.id);
    if (exists) {
      setSelectedRituals(selectedRituals.filter(r => r.id !== ritual.id));
    } else {
      setSelectedRituals([...selectedRituals, ritual]);
    }
  };

  const handleClearItinerary = () => {
    setSelectedRituals([]);
  };

  return (
    <div className={`rounded-sm border p-6 md:p-8 shadow-xl h-full flex flex-col justify-between relative overflow-hidden ${
      isDark ? 'bg-luxury-green-950/80 border-white/5 text-white' : 'bg-white border-luxury-gold-200/50 text-luxury-green-900'
    }`}>
      {/* Dynamic decoration ribbon */}
      <div className="absolute left-[-15px] top-[15px] -rotate-45 bg-luxury-gold-500 text-luxury-green-950 text-[8px] font-bold uppercase tracking-widest px-6 py-1 select-none pointer-events-none">
        Weekly Ceremony
      </div>

      <div className="space-y-6">
        <div className="text-left space-y-2 border-b border-stone-100 dark:border-white/5 pb-4 pl-8 md:pl-10">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-luxury-gold-500 block">Akasha wellness planner</span>
          <h3 className="font-serif-luxury text-xl md:text-2xl">Shape Your Ceremony Itinerary</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Select a day below to view scheduled morning and sunset gatherings, and compile some moments into your personalized wellness stays.
          </p>
        </div>

        {/* Day Selector Ribbon */}
        <div className="flex justify-between gap-1 overflow-x-auto pb-1">
          {weekDays.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[40px] py-2 text-center text-xs font-semibold uppercase tracking-wider rounded-xs border transition cursor-pointer ${
                selectedDay === day
                  ? 'bg-luxury-green-900 text-white border-luxury-green-900 shadow-md shadow-luxury-green-900/10'
                  : 'bg-stone-50 hover:bg-white dark:bg-white/5 text-stone-500 hover:text-stone-800 border-stone-200 dark:border-white/10 dark:hover:bg-white/10'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Daily Scheduled ceremonies */}
        <div className="space-y-3.5">
          <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-mono">
            {selectedDay} rituals scheduled ({dailyRituals.length})
          </span>

          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {dailyRituals.map(ritual => {
              const isAdded = selectedRituals.some(r => r.id === ritual.id);
              return (
                <div
                  key={ritual.id}
                  className={`p-3.5 border rounded-xs transition flex flex-col justify-between gap-3 ${
                    isAdded 
                      ? 'border-luxury-gold-500 bg-luxury-gold-500/5' 
                      : 'border-stone-100 dark:border-white/5 bg-stone-50/50 dark:bg-white/3'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 text-left">
                    <div>
                      <span className="text-[8px] uppercase tracking-wider bg-stone-100 dark:bg-white/10 px-1.5 py-0.5 rounded font-bold font-mono text-stone-500">
                        {ritual.type}
                      </span>
                      <h4 className="font-serif-luxury text-[13px] font-bold mt-1 text-luxury-green-900 dark:text-luxury-gold-200 leading-tight">
                        {ritual.name}
                      </h4>
                      
                      <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-1 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-luxury-gold-500 shrink-0" />
                          <span>{ritual.time}</span>
                        </span>
                        <span>&bull;</span>
                        <span>{ritual.duration}</span>
                        <span>&bull;</span>
                        <span>Slots: {ritual.spots} left</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleRitual(ritual)}
                      className={`px-3 py-1.5 rounded-xs text-[9px] uppercase tracking-widest font-bold border transition cursor-pointer select-none active:scale-95 ${
                        isAdded
                          ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-500 text-white shadow-sm'
                          : 'bg-white hover:bg-stone-50 dark:bg-white/5 border-stone-300 dark:border-white/10 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      {isAdded ? 'Added' : 'Add'}
                    </button>
                  </div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-normal italic text-left">
                    "{ritual.description}" <span className="font-semibold not-italic text-[9px] text-luxury-gold-700">&bull; Led by {ritual.instructor}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Personalized Active Itinerary list preview */}
        <div className="border-t border-stone-100 dark:border-white/5 pt-5 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-luxury-gold-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Bespoke Activity Itinerary ({selectedRituals.length})</span>
            </span>
            {selectedRituals.length > 0 && (
              <button
                onClick={handleClearItinerary}
                className="text-[9px] uppercase tracking-wider text-red-500 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <AnimatePresence mode="popLayout">
            {selectedRituals.length === 0 ? (
              <p className="text-[10px] text-stone-400 italic">
                No organic wellness sessions selected yet. Browse gatherings and build a rejuvenating stays protocol.
              </p>
            ) : (
              <motion.div 
                className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto py-1"
                layout
              >
                {selectedRituals.map(rit => (
                  <motion.div
                    key={rit.id}
                    layoutId={`badge-${rit.id}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="bg-luxury-gold-500/10 border border-luxury-gold-500/20 text-luxury-gold-700 dark:text-luxury-gold-300 text-[9px] px-2.5 py-1 rounded-sm font-semibold flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>{rit.name.split(' & ')[0].split(' (')[0].substring(0, 15)}...</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
