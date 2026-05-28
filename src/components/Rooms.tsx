import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Check, X, Shield, Star, 
  MapPin, Coffee, Volume2, CloudRain, 
  CheckCircle2, ArrowLeft, ArrowRight,
  ZoomIn, Sparkles, Calendar, ArrowUpRight, DollarSign, Eye
} from 'lucide-react';
import { Room } from '../types';

interface RoomsProps {
  rooms: Room[];
  onBookRequest: (bookingData: any) => Promise<boolean>;
  arrivalDate: string;
  setArrivalDate: (date: string) => void;
  departureDate: string;
  setDepartureDate: (date: string) => void;
  guests: number;
  setGuests: (g: number) => void;
}

export default function Rooms({
  rooms,
  onBookRequest,
  arrivalDate,
  setArrivalDate,
  departureDate,
  setDepartureDate,
  guests,
  setGuests
}: RoomsProps) {
  // Filters State
  const [selectedType, setSelectedType] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(850);
  const [selectedAmenity, setSelectedAmenity] = useState<string>('All');

  // Active / Selected Room State
  const [viewingRoom, setViewingRoom] = useState<Room | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Booking Local State inside Modal
  const [localGuestName, setLocalGuestName] = useState('');
  const [localGuestEmail, setLocalGuestEmail] = useState('');
  const [localSpecialRequests, setLocalSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Auto-fill dates if empty
  useEffect(() => {
    if (!arrivalDate) {
      const today = new Date();
      setArrivalDate(today.toISOString().split('T')[0]);
    }
    if (!departureDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 3);
      setDepartureDate(tomorrow.toISOString().split('T')[0]);
    }
  }, []);

  // Filter criteria lists
  const roomTypes = ['All', 'Villa', 'Cottage', 'Suite', 'Sanctuary'];
  const allAmenities = ['All', 'Private heated plunge pool', 'Stone fireplace', 'Retractable glass stargazing ceiling', 'Infinity edge outdoor hot tub', 'Outdoor cedar soaking tub', 'Floating breakfast experience'];

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const typeMatch = selectedType === 'All' || room.type === selectedType;
    const priceMatch = room.price <= maxPrice;
    const amenityMatch = selectedAmenity === 'All' || room.amenities.includes(selectedAmenity);
    return typeMatch && priceMatch && amenityMatch;
  });

  // Calculate reservation nights and total cost
  const calculateDays = () => {
    if (!arrivalDate || !departureDate) return 1;
    const checkIn = new Date(arrivalDate);
    const checkOut = new Date(departureDate);
    const diff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  const calculateTotal = (pricePerNight: number) => {
    return pricePerNight * calculateDays();
  };

  const handleBookingSubmit = async (e: React.FormEvent, room: Room) => {
    e.preventDefault();
    setValidationError('');

    if (!localGuestName.trim() || !localGuestEmail.trim()) {
      setValidationError('Please provide both your full name and authentic email address.');
      return;
    }

    const checkIn = new Date(arrivalDate);
    const checkOut = new Date(departureDate);
    if (checkOut <= checkIn) {
      setValidationError('Departure date must be later than your arrival entry date.');
      return;
    }

    setIsSubmitting(true);

    const reservationPayload = {
      roomId: room.id,
      roomName: room.name,
      guestName: localGuestName,
      guestEmail: localGuestEmail,
      checkIn: arrivalDate,
      checkOut: departureDate,
      guestsCount: guests,
      totalAmount: calculateTotal(room.price),
      specialRequests: localSpecialRequests
    };

    const success = await onBookRequest(reservationPayload);
    setIsSubmitting(false);

    if (success) {
      setBookingSuccess(true);
      // Clean up fields
      setLocalGuestName('');
      setLocalGuestEmail('');
      setLocalSpecialRequests('');
    } else {
      setValidationError('Reservation request could not be persisted. Check server logs.');
    }
  };

  return (
    <section id="rooms" className="py-24 bg-luxury-gold-50 text-luxury-green-900 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span 
            className="text-xs uppercase tracking-[0.4em] text-luxury-gold-700 font-bold block mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Elemental Living
          </motion.span>
          <motion.h2 
            className="font-serif-luxury text-4xl md:text-5xl lg:text-6xl text-luxury-green-900 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Our Sacred Sanctuaries
          </motion.h2>
          <motion.div 
            className="w-16 h-[1.5px] bg-luxury-gold-500 mx-auto mt-6"
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
          />
        </div>

        {/* Filters Panel (Beautifully integrated frosted design block) */}
        <div id="filter-bar" className="frosted-glass-card p-6 md:p-8 rounded-sm mb-12 shadow-md gap-6 grid grid-cols-1 lg:grid-cols-12 items-center">
          
          {/* Room Type select */}
          <div className="lg:col-span-4 flex flex-col">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-luxury-gold-700 mb-2">Sanctuary Type</span>
            <div className="flex flex-wrap gap-2">
              {roomTypes.map(t => (
                <button
                  key={t}
                  id={`filter-type-${t.toLowerCase()}`}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1.5 rounded-xs text-xs font-medium tracking-wide uppercase transition-all duration-300 ${
                    selectedType === t 
                      ? 'bg-luxury-green-900 text-white' 
                      : 'bg-white/40 hover:bg-white/80 border border-black/5'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Luxury Amenity Selection */}
          <div className="lg:col-span-4 flex flex-col">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-luxury-gold-700 mb-2">Bespoke Amenity</span>
            <select
              id="filter-amenity-select"
              value={selectedAmenity}
              onChange={(e) => setSelectedAmenity(e.target.value)}
              className="px-3 py-2 bg-white/50 border border-black/10 rounded-xs text-xs focus:outline-none uppercase tracking-wide font-medium"
            >
              {allAmenities.map(amenity => (
                <option key={amenity} value={amenity}>{amenity}</option>
              ))}
            </select>
          </div>

          {/* Pricing slider bar */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-luxury-gold-700">Max Investment</span>
              <span className="text-xs font-semibold text-luxury-green-900">${maxPrice} / Night</span>
            </div>
            <input 
              id="price-range-slider"
              type="range" 
              min={300} 
              max={1000} 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-luxury-gold-500 cursor-pointer h-1.5 bg-black/10 rounded-lg"
            />
          </div>

        </div>

        {/* Rooms Grid */}
        {filteredRooms.length === 0 ? (
          <div className="text-center py-24 frosted-glass-card rounded-sm">
            <p className="font-serif-luxury text-xl opacity-60">No sanctuaries match your active elemental filters.</p>
            <button 
              onClick={() => { setSelectedType('All'); setSelectedAmenity('All'); setMaxPrice(850); }}
              className="mt-4 px-6 py-2 bg-luxury-green-900 text-white text-xs tracking-widest uppercase"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {filteredRooms.map((room) => (
              <motion.div
                key={room.id}
                id={`room-card-${room.id}`}
                className="group flex flex-col bg-white overflow-hidden rounded-sm shadow-xl border border-white/60 hover:shadow-2xl transition-all duration-500"
                whileHover={{ y: -6 }}
                layout
              >
                {/* Image Wrap */}
                <div className="relative h-72 lg:h-[340px] overflow-hidden">
                  <img 
                    src={room.image} 
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  {/* Rating Label top-left */}
                  <div className="absolute top-4 left-4 bg-luxury-green-950/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded text-white flex items-center gap-1.5">
                    <Star className="w-3 h-3 fill-luxury-gold-500 text-luxury-gold-500" />
                    <span className="text-xs font-semibold tracking-wide">{room.rating.toFixed(1)}</span>
                  </div>

                  {/* Room Category Label bottom-left */}
                  <div className="absolute bottom-4 left-4 bg-white/90 border border-black/5 px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-[#1B3022]">
                    {room.type}
                  </div>
                </div>

                {/* Inner Info Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif-luxury text-xl lg:text-2xl font-semibold hover:text-luxury-gold-700 transition-colors">
                        {room.name}
                      </h3>
                      <div className="text-right">
                        <span className="block text-xl font-serif-luxury text-luxury-gold-700 font-bold">${room.price}</span>
                        <span className="text-[9px] uppercase tracking-wider opacity-60">Per Night</span>
                      </div>
                    </div>

                    <p className="text-xs text-luxury-green-900/60 font-medium mb-3">
                      {room.view} &bull; {room.size} SQ FT &bull; Up to {room.maxGuests} guests
                    </p>

                    <p className="text-xs leading-relaxed text-luxury-green-900/75 line-clamp-3 mb-6">
                      {room.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-black/5 pt-4">
                    {/* View Details Button */}
                    <button
                      id={`view-details-${room.id}`}
                      onClick={() => {
                        setViewingRoom(room);
                        setActiveGalleryIndex(0);
                        setBookingSuccess(false);
                      }}
                      className="text-xs font-semibold uppercase tracking-widest text-[#1B3022] hover:text-luxury-gold-700 flex items-center gap-2 group/btn cursor-pointer"
                    >
                      <span>Explore In-Depth</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                    </button>

                    {/* Book Now Quick trigger */}
                    <button
                      id={`book-now-${room.id}`}
                      onClick={() => {
                        setViewingRoom(room);
                        setActiveGalleryIndex(0);
                        setBookingSuccess(false);
                        setTimeout(() => {
                          const formEl = document.getElementById('booking-focus-anchor');
                          if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                        }, 200);
                      }}
                      className="px-4 py-2 hover:bg-luxury-gold-500 bg-transparent text-luxury-green-900 hover:text-white border border-[#1B3022] hover:border-luxury-gold-500 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 rounded-sm cursor-pointer"
                    >
                      Request Stay
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Expanded Room Detail Drawer/Lightbox/Interactive System on click */}
      <AnimatePresence>
        {viewingRoom && (
          <motion.div
            id="room-details-overlay"
            className="fixed inset-0 z-50 bg-[#0a170f]/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              id="room-details-modal"
              className="bg-luxury-gold-50 w-full max-w-6xl rounded-sm overflow-hidden border border-white/50 shadow-2xl relative my-8"
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              {/* Close Button top-right */}
              <button
                id="close-room-details"
                onClick={() => setViewingRoom(null)}
                className="absolute top-4 right-4 z-10 bg-luxury-green-950/80 border border-white/10 hover:bg-luxury-gold-500 hover:text-white text-white p-2.5 rounded-full backdrop-blur-md transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                
                {/* LHS: Image Horizontal snapped gallery */}
                <div className="lg:col-span-7 flex flex-col bg-luxury-green-950 relative">
                  <div className="relative h-[300px] md:h-[450px] overflow-hidden">
                    <img
                      src={viewingRoom.gallery[activeGalleryIndex] || viewingRoom.image}
                      alt={viewingRoom.name}
                      className="w-full h-full object-cover transition-all"
                    />

                    {/* Magnify Open Lightbox Button */}
                    <button
                      id="lightbox-trigger"
                      onClick={() => setIsLightboxOpen(true)}
                      className="absolute bottom-4 left-4 bg-luxury-green-950/80 hover:bg-luxury-gold-500 border border-white/10 p-2.5 rounded-full text-white backdrop-blur-sm transition-all"
                      title="Enlarge Image Room Perspective"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>

                    {/* Quick navigation indicators on picture */}
                    <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
                      <button
                        id="gallery-prev"
                        onClick={() => setActiveGalleryIndex(idx => idx > 0 ? idx - 1 : viewingRoom.gallery.length - 1)}
                        className="bg-luxury-green-950/70 hover:bg-luxury-gold-500 p-2 rounded-full text-white pointer-events-auto backdrop-blur-sm transition-all"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <button
                        id="gallery-next"
                        onClick={() => setActiveGalleryIndex(idx => idx < viewingRoom.gallery.length - 1 ? idx + 1 : 0)}
                        className="bg-luxury-green-950/70 hover:bg-luxury-gold-500 p-2 rounded-full text-white pointer-events-auto backdrop-blur-sm transition-all"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Row */}
                  <div className="p-4 bg-luxury-green-950 flex items-center gap-3 overflow-x-auto border-t border-white/5">
                    {viewingRoom.gallery.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        id={`gallery-thumb-${idx}`}
                        className={`w-20 h-14 rounded-xs overflow-hidden shrink-0 transition-all border-2 ${
                          activeGalleryIndex === idx ? 'border-luxury-gold-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                        onClick={() => setActiveGalleryIndex(idx)}
                      >
                        <img src={imgUrl} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* RHS: In-depth details & Sticky booking form */}
                <div className="lg:col-span-5 p-8 flex flex-col justify-between overflow-y-auto max-h-[700px]">
                  
                  <div>
                    {/* Header Details */}
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-luxury-gold-700 block mb-1">
                      {viewingRoom.type} Sanctuary
                    </span>
                    <h2 className="font-serif-luxury text-3xl font-bold mb-2 text-luxury-green-900 border-b border-black/5 pb-3">
                      {viewingRoom.name}
                    </h2>

                    <div className="flex items-center gap-4 text-xs font-semibold text-luxury-green-800 mb-4 bg-luxury-gold-100/50 p-2.5 rounded-sm">
                      <span>View: <strong className="text-luxury-green-950">{viewingRoom.view}</strong></span>
                      <span>&bull;</span>
                      <span>Area: <strong className="text-luxury-green-950">{viewingRoom.size} SQ FT</strong></span>
                    </div>

                    <p className="text-xs leading-relaxed text-luxury-green-900/80 mb-6">
                      {viewingRoom.description}
                    </p>

                    {/* Amenities Checklist with individual hover lifts */}
                    <div className="mb-6">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-luxury-gold-700 mb-3 block">
                        Exclusive Suite Artifacts:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {viewingRoom.amenities.map((amenity, index) => (
                          <div 
                            key={index} 
                            className="flex items-center gap-2 text-xs text-luxury-green-900"
                          >
                            <Check className="w-3.5 h-3.5 text-luxury-gold-600 font-bold shrink-0" />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* REAL-TIME RESERVATION ENGINE FOR HIGHLIGHTED STAY */}
                  <div id="booking-focus-anchor" className="bg-white border border-luxury-gold-500/20 p-5 rounded-xs shadow-md">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-luxury-green-950 mb-3 block text-center border-b border-black/5 pb-2">
                      Secure Private Sanctuary Stay
                    </span>

                    {bookingSuccess ? (
                      <motion.div
                        className="text-center py-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                        <h4 className="font-serif-luxury text-lg font-bold text-luxury-green-950">Stay Requested Successfully!</h4>
                        <p className="text-[11px] text-luxury-green-900/70 max-w-xs mx-auto mt-2">
                          Our Royal Concierge Team will review availability for {arrivalDate} to {departureDate} and contact you at the signature email provided.
                        </p>
                        <button
                          id="reset-booking-view"
                          onClick={() => setBookingSuccess(false)}
                          className="mt-4 px-4 py-2 bg-luxury-green-900 text-white text-[10px] tracking-widest uppercase rounded-sm"
                        >
                          Submit New Custom Stay
                        </button>
                      </motion.div>
                    ) : (
                      <form onSubmit={(e) => handleBookingSubmit(e, viewingRoom)} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] uppercase tracking-wider opacity-60 block mb-1">Check In</label>
                            <input
                              type="date"
                              className="w-full bg-luxury-gold-50 border border-black/10 text-xs p-2 rounded focus:outline-none focus:border-luxury-gold-500"
                              value={arrivalDate}
                              onChange={(e) => setArrivalDate(e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <label className="text-[9px] uppercase tracking-wider opacity-60 block mb-1">Check Out</label>
                            <input
                              type="date"
                              className="w-full bg-luxury-gold-50 border border-black/10 text-xs p-2 rounded focus:outline-none focus:border-luxury-gold-500"
                              value={departureDate}
                              onChange={(e) => setDepartureDate(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] uppercase tracking-wider opacity-60 block mb-1">Guests</label>
                            <select
                              value={guests}
                              onChange={(e) => setGuests(Number(e.target.value))}
                              className="w-full bg-luxury-gold-50 border border-black/10 text-xs p-2 rounded focus:outline-none font-medium"
                            >
                              <option value={1}>01 Single</option>
                              <option value={2}>02 Couple</option>
                              <option value={3}>03 Family</option>
                              <option value={4}>04 Royal Stay</option>
                            </select>
                          </div>
                          <div className="flex flex-col justify-end text-right">
                            <span className="text-[9px] uppercase tracking-wider opacity-60">Calculated Investment:</span>
                            <span className="font-serif-luxury text-xl font-bold text-luxury-gold-700">
                              ${calculateTotal(viewingRoom.price)}
                            </span>
                            <span className="text-[9px] tracking-widest opacity-40 uppercase">
                              / for {calculateDays()} Night(s)
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] uppercase tracking-wider opacity-60 block mb-1">Your Full Name</label>
                          <input
                            id="booking-fullname"
                            type="text"
                            placeholder="Sarah Laurent"
                            className="w-full bg-luxury-gold-50 border border-black/10 text-xs p-2.5 rounded focus:outline-none focus:border-luxury-gold-500"
                            value={localGuestName}
                            onChange={(e) => setLocalGuestName(e.target.value)}
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[9px] uppercase tracking-wider opacity-60 block mb-1">Authentic Email Address</label>
                          <input
                            id="booking-email"
                            type="email"
                            placeholder="sarah@traveler.com"
                            className="w-full bg-luxury-gold-50 border border-black/10 text-xs p-2.5 rounded focus:outline-none focus:border-luxury-gold-500"
                            value={localGuestEmail}
                            onChange={(e) => setLocalGuestEmail(e.target.value)}
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[9px] uppercase tracking-wider opacity-60 block mb-1">Ritualistic Requests (Optional)</label>
                          <textarea
                            placeholder="Anniversary flowers, organic food allergies, cliffside stargazing requests..."
                            rows={2}
                            className="w-full bg-luxury-gold-50 border border-black/10 text-xs p-2.5 rounded focus:outline-none focus:border-luxury-gold-500 resize-none"
                            value={localSpecialRequests}
                            onChange={(e) => setLocalSpecialRequests(e.target.value)}
                          />
                        </div>

                        {validationError && (
                          <div className="text-red-600 text-xs bg-red-50 p-2 border border-red-200 rounded">
                            {validationError}
                          </div>
                        )}

                        <button
                          id="submit-reservation-btn"
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-luxury-green-900 hover:bg-luxury-gold-600 disabled:bg-luxury-green-950/50 text-white font-bold p-3 text-xs tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer"
                        >
                          {isSubmitting ? 'Requesting Royal Ledger...' : 'Request Formal Reservation'}
                        </button>
                      </form>
                    )}
                  </div>

                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal triggered from Zoom Button */}
      <AnimatePresence>
        {isLightboxOpen && viewingRoom && (
          <motion.div
            id="lightbox-container"
            className="fixed inset-0 z-55 bg-black/95 flex flex-col justify-between p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Top Bar inside Lightbox */}
            <div className="flex items-center justify-between text-white shrink-0">
              <span className="font-serif-luxury text-lg tracking-wide">{viewingRoom.name} — Perspective View</span>
              <button
                id="lightbox-close"
                onClick={() => setIsLightboxOpen(false)}
                className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Picture Context Spot */}
            <div className="flex-1 flex items-center justify-center relative">
              <img
                src={viewingRoom.gallery[activeGalleryIndex] || viewingRoom.image}
                alt={viewingRoom.name}
                className="max-w-full max-h-[80vh] object-contain rounded border border-white/10 select-none shadow-2xl"
              />

              {/* Side controls */}
              <button
                id="lightbox-prev"
                onClick={() => setActiveGalleryIndex(idx => idx > 0 ? idx - 1 : viewingRoom.gallery.length - 1)}
                className="absolute left-4 bg-white/10 hover:bg-white/20 hover:scale-105 rounded-full p-4 text-white transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button
                id="lightbox-next"
                onClick={() => setActiveGalleryIndex(idx => idx < viewingRoom.gallery.length - 1 ? idx + 1 : 0)}
                className="absolute right-4 bg-white/10 hover:bg-white/20 hover:scale-105 rounded-full p-4 text-white transition-all"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>

            {/* Lightbox index stats row */}
            <div className="text-center text-white/50 text-xs shrink-0 tracking-widest uppercase">
              Sanctuary Aspect {activeGalleryIndex + 1} of {viewingRoom.gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
