import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Soup, Heart, RefreshCw, Check, Compass, HelpCircle, Utensils, Award } from 'lucide-react';

interface AyurvedicDiningProps {
  isDark: boolean;
  onApplyDoshaRequest?: (doshaMessage: string) => void;
}

export default function AyurvedicDining({ isDark, onApplyDoshaRequest }: AyurvedicDiningProps) {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [resultDosha, setResultDosha] = useState<'Vata' | 'Pitta' | 'Kapha' | null>(null);
  const [applied, setApplied] = useState(false);

  const questions = [
    {
      id: 1,
      text: "How would you describe your general energy and mindset throughout the day?",
      options: [
        { label: "Active, creative, but easily distracted or anxious", value: "Vata" },
        { label: "Focused, competitive, passionate, and structured", value: "Pitta" },
        { label: "Calm, affectionate, steady, though sometimes sluggish or sleepy", value: "Kapha" }
      ]
    },
    {
      id: 2,
      text: "What style of food and beverage usually resonates most deeply with you?",
      options: [
        { label: "Warm, rich, heavily-spiced curries and calming herbal brews", value: "Vata" },
        { label: "Cooling smoothies, sweet melons, and refreshing organic mint infusions", value: "Pitta" },
        { label: "Light, spicy, toasted grains, and detoxifying ginger infusions", value: "Kapha" }
      ]
    },
    {
      id: 3,
      text: "Which season or weather pattern do you find most physically demanding?",
      options: [
        { label: "Dry, cold autumn winds that make my skin and joints feel dehydrated", value: "Vata" },
        { label: "Hot humid summer afternoons that make my physical frame overheat quickly", value: "Pitta" },
        { label: "Foggy, cold, damp monsoon mornings that make me feel heavy and swollen", value: "Kapha" }
      ]
    }
  ];

  const handleStart = () => {
    setStep('quiz');
    setCurrentQuestion(0);
    setAnswers([]);
    setApplied(false);
  };

  const handleAnswerSelect = (value: string) => {
    const updatedAnswers = [...answers, value];
    setAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate archetype
      const counts = updatedAnswers.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      let selectedDosha: 'Vata' | 'Pitta' | 'Kapha' = 'Vata';
      let maxCount = 0;
      
      (['Vata', 'Pitta', 'Kapha'] as const).forEach(dosha => {
        if ((counts[dosha] || 0) > maxCount) {
          maxCount = counts[dosha];
          selectedDosha = dosha;
        }
      });

      setResultDosha(selectedDosha);
      setStep('result');
    }
  };

  // Archetype dynamic database details
  const doshaMeta = {
    Vata: {
      title: "Vata constitution &bull; Wind & Space",
      description: "Characterized by mobility, lightness, and creative warmth. In high mountain chill, Vata is balanced by dense grounding soups, organic almond milks, and soothing sweet warming spices.",
      breakfast: "Warm Cardamom Quinoa Parfait bathed in heated almond milk, wild honey, and toasted walnuts.",
      dinner: "Slow-roasted Yam & Butternut Squash curry, topped with warm pure grass-fed cow ghee and digestive fenugreek.",
      tea: "Organic Tulsi, Licorice ROOT, & Ginger Infusion.",
      benefits: "Deeply calms erratic nervous circuits, promotes grounding rest, and rehydrates cold joints.",
      badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20"
    },
    Pitta: {
      title: "Pitta constitution &bull; Fire & Water",
      description: "Characterized by passion, sharp focus, and metallic elemental vigor. Pitta is perfectly harmonized by cooling, fresh garden herbs, sweet refreshing fruits, and sweet astringent grains.",
      breakfast: "Chilled Coconut Sago Pudding with fresh hill-harvested mango purée and mint-infused garden sorrel.",
      dinner: "Cooling Jasmine Rice cooked with whole organic cumin seeds, paired with yellow split-mung dal and fresh coriander cream.",
      tea: "Refreshing Coriander seed, Fennel bloom, & Sweet Rose-petal tea.",
      benefits: "Pacifies internal inflammation, cools digestive fires, and calms structural high-altitude pressure.",
      badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-500 border-amber-500/20"
    },
    Kapha: {
      title: "Kapha constitution &bull; Earth & Water",
      description: "Characterized by absolute stability, physical endurance, and deep maternal ground. Kapha is energized by warming, light, dry, heavily spiced elements and astringent leafy greens.",
      breakfast: "Toasted Himalayan Buckwheat pancakes with wild pepper-mint paste and fresh spiced apple compote.",
      dinner: "Fireside Smoked Red Lentils seasoned with warming wild mustard seed, cumin sprigs, and organic bitter-leaf microgreens.",
      tea: "Warming Black-herb, fresh Ginger, and mountain Cloves tea.",
      benefits: "Activates sluggish early metabolism, sheds physical fluid retention, and counters foggy valley mornings.",
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    }
  };

  const handleApply = () => {
    if (!resultDosha) return;
    const meta = doshaMeta[resultDosha];
    const message = `Ayurvedic Ritual Plan: Please pre-reserve a nutritional ${resultDosha} Diet Ritual at Soma Restaurant. Recommended dishes: ${meta.breakfast} & ${meta.dinner}.`;
    
    // Copy to clipboard for easy pasting or call parent callback
    navigator.clipboard.writeText(message);
    if (onApplyDoshaRequest) {
      onApplyDoshaRequest(message);
    }
    setApplied(true);
  };

  return (
    <div className={`rounded-sm border p-6 md:p-8 shadow-xl relative overflow-hidden h-full flex flex-col justify-between ${
      isDark ? 'bg-luxury-green-950/80 border-white/5 text-white' : 'bg-white border-luxury-gold-200/50 text-luxury-green-900'
    }`}>
      {/* Decorative design graphic background */}
      <div className="absolute right-[-10px] top-[-10px] opacity-10 pointer-events-none">
        <Soup className="w-48 h-48" />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        {/* Step Intro */}
        {step === 'intro' && (
          <div className="text-left space-y-4">
            <div className="flex items-center gap-2">
              <Soup className="w-5 h-5 text-luxury-gold-500" />
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-luxury-gold-500">Soma Dining customizer</span>
            </div>
            
            <h3 className="font-serif-luxury text-xl md:text-2xl">Discover Your Vedic Dining Ritual</h3>
            <p className="text-xs text-stone-500 dark:text-stone-300 leading-relaxed">
              At **Soma**, food is recognized as sacred medicine. Our Ayurvedic experts personalize your entire menu based on your element archetype of mind and cell structure. 
            </p>
            <p className="text-xs text-stone-400 dark:text-stone-400">
              Take this brief 1-minute constitutional test to map out your perfect daily gourmet wellness plates.
            </p>

            <div className="pt-4">
              <button
                onClick={handleStart}
                className="luxury-gold-gradient text-white text-[10px] tracking-widest font-semibold uppercase px-5 py-3 rounded-xs hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Begin Constitutional Assessment</span>
              </button>
            </div>
          </div>
        )}

        {/* Step Quiz Question */}
        {step === 'quiz' && (
          <div className="text-left space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-luxury-gold-500 tracking-wide">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <HelpCircle className="w-4 h-4 text-luxury-gold-500 animate-pulse" />
            </div>

            {/* Question title */}
            <h4 className="font-serif-luxury text-base font-semibold leading-relaxed">
              {questions[currentQuestion].text}
            </h4>

            {/* Options list */}
            <div className="space-y-3 pt-2">
              {questions[currentQuestion].options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => handleAnswerSelect(opt.value)}
                  className={`w-full text-left text-xs p-3.5 border rounded-xs transition-all duration-300 hover:border-luxury-gold-500 active:scale-[0.99] cursor-pointer ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white/90 hover:bg-white/10' 
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full border border-stone-300 dark:border-white/20 text-[10px] font-mono font-bold flex items-center justify-center text-luxury-gold-600 shrink-0 select-none">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="font-medium">{opt.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Progress line */}
            <div className="w-full h-[3px] bg-stone-100 dark:bg-white/5 rounded-full overflow-hidden mt-6">
              <div 
                className="h-full bg-luxury-gold-500 transition-all duration-500" 
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Diagnostic Results */}
        {step === 'result' && resultDosha && (
          <div className="text-left space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-luxury-gold-500" />
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-luxury-gold-500">Your Diagnostic Profile</span>
              </div>
              <span className={`px-2.5 py-0.5 border rounded-full text-[9px] font-bold tracking-widest uppercase ${doshaMeta[resultDosha].badgeColor}`}>
                {resultDosha} Archetype
              </span>
            </div>

            <h3 className="font-serif-luxury text-lg font-bold" dangerouslySetInnerHTML={{ __html: doshaMeta[resultDosha].title }} />
            
            <p className="text-[11px] text-stone-500 dark:text-stone-300 leading-relaxed">
              {doshaMeta[resultDosha].description}
            </p>

            {/* Menu Items Recommended */}
            <div className="space-y-2 border-y border-stone-100 dark:border-white/5 py-4 my-2">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-mono">Personalized Breakfast</span>
                <p className="text-[11px] font-semibold text-stone-700 dark:text-stone-200">
                  {doshaMeta[resultDosha].breakfast}
                </p>
              </div>
              <div className="space-y-1 pt-1.5">
                <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-mono">Personalized Dinner</span>
                <p className="text-[11px] font-semibold text-stone-700 dark:text-stone-200">
                  {doshaMeta[resultDosha].dinner}
                </p>
              </div>
              <div className="space-y-1 pt-1.5">
                <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-mono">Daily Wellness Tea</span>
                <p className="text-[11px] font-semibold text-stone-700 dark:text-stone-200">
                  {doshaMeta[resultDosha].tea}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleStart}
                className="px-3.5 py-2 border border-stone-300 dark:border-white/10 text-[10px] uppercase font-semibold rounded-xs hover:bg-stone-50 dark:hover:bg-white/5 transition flex items-center gap-1.5 cursor-pointer text-stone-500"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retake Quiz</span>
              </button>

              <button
                onClick={handleApply}
                disabled={applied}
                className={`text-[10px] tracking-widest font-bold uppercase px-4 py-2 rounded-xs transition flex items-center gap-1.5 cursor-pointer ${
                  applied 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/10' 
                    : 'luxury-gold-gradient text-white'
                }`}
              >
                {applied ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{applied ? 'Dining Plan Copied!' : 'Copy Diet plan to memory'}</span>
              </button>
            </div>
            
            {applied && (
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium italic mt-1 text-center">
                Vedic menu copied. Paste this into your booking's **Special Requests** above to confirm!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
