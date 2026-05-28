import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Rooms from './components/Rooms';
import Experiences from './components/Experiences';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import ButlerChat from './components/ButlerChat';
import AdminPanel from './components/AdminPanel';
import MyBookingsLookup from './components/MyBookingsLookup';
import AyurvedicDining from './components/AyurvedicDining';
import WellnessPlanner from './components/WellnessPlanner';
import { Room, Booking, AdminUser } from './types';
import { 
  Compass, Play, Award, Sparkles, MapPin, 
  Phone, Mail, Instagram, ShieldAlert, CheckCircle, Clock 
} from 'lucide-react';

export default function App() {
  // Global Styling Theme: Default to light Off-White/Linen theme per design philosophy
  const [isDark, setIsDark] = useState<boolean>(false);

  // States
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synced Booking parameters
  const [arrivalDate, setArrivalDate] = useState<string>('');
  const [departureDate, setDepartureDate] = useState<string>('');
  const [guests, setGuests] = useState<number>(2);

  // Video / Virtual Tour Playing State
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

  // Fetch initial Database elements
  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      const data = await response.json();
      setRooms(data);
    } catch (e) {
      console.error("Failed fetching sanctuaries:", e);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      setBookings(data);
    } catch (e) {
      console.error("Failed fetching ledgers:", e);
    }
  };

  useEffect(() => {
    const initFetch = async () => {
      setIsLoading(true);
      await fetchRooms();
      await fetchBookings();
      setIsLoading(false);
    };

    // Synchronize local administrative credentials if present
    const savedAdmin = localStorage.getItem('aaryam_admin_signature');
    if (savedAdmin) {
      try {
        setAdminUser(JSON.parse(savedAdmin));
      } catch {
        localStorage.removeItem('aaryam_admin_signature');
      }
    }

    initFetch();
  }, []);

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'rooms', 'experiences', 'gallery', 'story'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Administrative credential callbacks
  const handleAdminLogin = (user: AdminUser) => {
    setAdminUser(user);
    localStorage.setItem('aaryam_admin_signature', JSON.stringify(user));
    // Immediately fetch current reservations safely
    fetchBookings();
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('aaryam_admin_signature');
    setIsAdminOpen(false);
  };

  // Master Submission Reservatory pipeline
  const handleBookRequest = async (bookingData: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const data = await response.json();
      if (data && data.success) {
        // Sync local ledger database
        await fetchBookings();
        return true;
      }
    } catch (e) {
      console.error("Reservation pipeline failure:", e);
    }
    return false;
  };

  // Admin CRUD Actions
  const handleAddRoom = async (roomData: Omit<Room, 'id' | 'rating' | 'gallery'>): Promise<boolean> => {
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminUser?.token}`
        },
        body: JSON.stringify(roomData)
      });
      if (response.ok) {
        await fetchRooms();
        return true;
      }
    } catch (e) {
      console.error("Action add room failed:", e);
    }
    return false;
  };

  const handleUpdateRoom = async (id: string, roomData: Partial<Room>): Promise<boolean> => {
    try {
      const response = await fetch(`/api/rooms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminUser?.token}`
        },
        body: JSON.stringify(roomData)
      });
      if (response.ok) {
        await fetchRooms();
        return true;
      }
    } catch (e) {
      console.error("Action update room failed:", e);
    }
    return false;
  };

  const handleDeleteRoom = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/rooms/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminUser?.token}`
        }
      });
      if (response.ok) {
        await fetchRooms();
        return true;
      }
    } catch (e) {
      console.error("Action delete room failed:", e);
    }
    return false;
  };

  const handleUpdateBookingStatus = async (id: string, status: 'confirmed' | 'rejected'): Promise<boolean> => {
    try {
      const response = await fetch(`/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminUser?.token}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        await fetchBookings();
        return true;
      }
    } catch (e) {
      console.error("Action update booking state failed:", e);
    }
    return false;
  };

  const handleToggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-x-hidden ${
      isDark ? 'bg-luxury-green-950 text-white' : 'bg-luxury-gold-50 text-luxury-green-905'
    }`}>
      
      {/* Dynamic Header navbar */}
      <Navbar
        onNavClick={handleNavClick}
        adminUser={adminUser}
        onLogout={handleAdminLogout}
        activeSection={activeSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      {/* Primary Landing Screen content */}
      <Hero
        onCheckAvailability={() => handleNavClick('rooms')}
        onExploreRooms={() => handleNavClick('rooms')}
        arrivalDate={arrivalDate}
        setArrivalDate={setArrivalDate}
        departureDate={departureDate}
        setDepartureDate={setDepartureDate}
        guests={guests}
        setGuests={setGuests}
      />

      {/* Unified Skeletons / Loader states */}
      {isLoading ? (
        <div id="loader-skeleton" className="py-24 text-center select-none linen-gradient">
          <div className="w-10 h-10 border-4 border-luxury-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif-luxury uppercase tracking-[0.3em] text-xs">Syncing Aaryam Sacred Valley...</p>
        </div>
      ) : (
        <>
          {/* Main sections */}
          <Rooms
            rooms={rooms}
            onBookRequest={handleBookRequest}
            arrivalDate={arrivalDate}
            setArrivalDate={setArrivalDate}
            departureDate={departureDate}
            setDepartureDate={setDepartureDate}
            guests={guests}
            setGuests={setGuests}
          />

          <MyBookingsLookup
            bookings={bookings}
            onRefreshBookings={fetchBookings}
            isDark={isDark}
          />

          <Experiences />

          {/* SOMA AYURVEDIC ALCHEMY & AKASHA PLANNER SPLIT SECTION */}
          <section id="wellness-planner" className={`py-24 border-t border-b ${
            isDark ? 'bg-luxury-green-950/20 border-white/5' : 'bg-luxury-gold-100/10 border-luxury-gold-200/50'
          }`}>
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs uppercase tracking-[0.4em] text-luxury-gold-600 font-bold block mb-3">
                  Sacred Self-Care Systems
                </span>
                <h2 className="font-serif-luxury text-3xl md:text-5xl">
                  Interactive Personal Planners
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-4 leading-relaxed">
                  Tailor your escape with precision: discover your element-focused menu for Soma Restaurant, or customize your physical and sound yoga rhythms at the Akasha Canopy.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                <AyurvedicDining isDark={isDark} />
                <WellnessPlanner isDark={isDark} />
              </div>
            </div>
          </section>

          {/* VIRTUAL CINEMATIC 360 TOUR EMBED SECTION */}
          <section id="virtual-tour" className="py-24 bg-[#0a170f] text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200')" }} />
            <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
              <span className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold-500 font-bold block mb-3">Immersive Aesthetics</span>
              <h2 className="font-serif-luxury text-3xl md:text-5xl leading-tight mb-8">
                Explore the Himalayan Sanctuary <br />
                <span className="italic font-light text-luxury-gold-200">through our 360° virtual window.</span>
              </h2>

              {/* Video Box Container */}
              <div className="max-w-3xl mx-auto rounded-sm overflow-hidden shadow-2xl border border-white/10 relative h-96 bg-black flex items-center justify-center group">
                {isVideoPlaying ? (
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                    title="Aaryam Luxury Walkthrough video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(10,23,15,0.7), rgba(10,23,15,0.85)), url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200')" }}>
                    <button
                      id="play-virtual-tour"
                      onClick={() => setIsVideoPlaying(true)}
                      className="w-16 h-16 rounded-full bg-luxury-gold-500 hover:bg-luxury-gold-600 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
                      title="Play Tour Walkthrough"
                    >
                      <Play className="w-6 h-6 fill-white ml-1 text-white" />
                    </button>
                    <span className="text-xs uppercase tracking-widest font-bold text-white mt-4 block">Play Cinematic Visual Guide</span>
                    <p className="text-[11px] opacity-60 max-w-sm mt-1 leading-relaxed">
                      Wander deep through the Soma food courtyards, Akasha tree canopies, and the peaceful, silent Vayu cloud lofts.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <Gallery />
          
          <About />

          <Testimonials />
        </>
      )}

      {/* Floating Personal Royal AI Concierge Butler */}
      <ButlerChat />

      {/* Admin Panel component */}
      <AdminPanel
        rooms={rooms}
        bookings={bookings}
        isAdminOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        adminUser={adminUser}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        onAddRoom={handleAddRoom}
        onUpdateRoom={handleUpdateRoom}
        onDeleteRoom={handleDeleteRoom}
        onUpdateBookingStatus={handleUpdateBookingStatus}
      />

      {/* Professional Luxury Layout Footer */}
      <footer className="bg-luxury-green-950 text-white border-t border-white/10 pt-20 pb-8 select-none">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10 pb-16">
          
          {/* Col 1 */}
          <div className="md:col-span-5 text-left space-y-4">
            <span className="font-serif-luxury text-3xl tracking-[0.1em] font-semibold block text-white">AARYAM</span>
            <p className="text-xs leading-relaxed text-white/70 max-w-sm">
              Nestled beautifully in pristine high-elevation forests, Aaryam blends ancient architecture with first-class hospitality design. Our eco-focused suites feature natural stone-carvings and retractable stargazing ceilings.
            </p>
            <div className="flex items-center gap-3 text-white/50 pt-2">
              <span className="text-[10px] uppercase tracking-widest">Global Green Key Award 2026</span>
              <Award className="w-4 h-4 text-luxury-gold-500" />
            </div>
          </div>

          {/* Col 2 */}
          <div className="md:col-span-3 text-left space-y-4">
            <span className="text-xs uppercase tracking-widest font-bold tracking-tighter text-luxury-gold-500 block">Sanctuary Stays</span>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li><button onClick={() => handleNavClick('rooms')} className="hover:text-luxury-gold-500 transition-colors">Prithvi Suite (Garden Villa)</button></li>
              <li><button onClick={() => handleNavClick('rooms')} className="hover:text-luxury-gold-500 transition-colors">Vayu Cottage (Cloud Loft)</button></li>
              <li><button onClick={() => handleNavClick('rooms')} className="hover:text-luxury-gold-500 transition-colors">Tejas Suite (Golden Pavilion)</button></li>
              <li><button onClick={() => handleNavClick('rooms')} className="hover:text-luxury-gold-500 transition-colors">Jal Sanctuary (River Chalet)</button></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="md:col-span-4 text-left space-y-4">
            <span className="text-xs uppercase tracking-widest font-bold tracking-tighter text-luxury-gold-500 block">The Valleys Estate</span>
            <div className="space-y-3.5 text-xs text-white/70">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-luxury-gold-500 shrink-0" />
                <span>Sahyadri Mountain Valleys &bull; Kodaikanal Region, TN, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-luxury-gold-500 shrink-0" />
                <span>+91 (0) 4542 998811</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-luxury-gold-500 shrink-0" />
                <span>royal.concierge@aaryam.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Deep Credits */}
        <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/50 text-[10px] uppercase tracking-widest leading-loose">
          <span>&copy; {new Date().getFullYear()} Aaryam Hotel & Resorts Private Limited.</span>
          <span>Wellness & Nature Sanctum &bull; Kodaikanal Hills &bull; India</span>
        </div>
      </footer>

    </div>
  );
}
