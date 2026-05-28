import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Building2, Check, X, Shield, Plus,
  Trash2, Edit, CheckCircle2, XCircle, DollarSign,
  Briefcase, Image as ImageIcon, Ruler, HelpCircle,
  TrendingUp, Award, Calendar, Layers, ChevronUp
} from 'lucide-react';
import { Room, Booking, AdminUser } from '../types';

interface AdminPanelProps {
  rooms: Room[];
  bookings: Booking[];
  isAdminOpen: boolean;
  onClose: () => void;
  adminUser: AdminUser | null;
  onLogin: (user: AdminUser) => void;
  onLogout: () => void;
  onAddRoom: (room: Omit<Room, 'id' | 'rating' | 'gallery'>) => Promise<boolean>;
  onUpdateRoom: (id: string, room: Partial<Room>) => Promise<boolean>;
  onDeleteRoom: (id: string) => Promise<boolean>;
  onUpdateBookingStatus: (id: string, status: 'confirmed' | 'rejected') => Promise<boolean>;
}

export default function AdminPanel({
  rooms,
  bookings,
  isAdminOpen,
  onClose,
  adminUser,
  onLogin,
  onLogout,
  onAddRoom,
  onUpdateRoom,
  onDeleteRoom,
  onUpdateBookingStatus
}: AdminPanelProps) {
  // Login flow
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tabs inside panel
  const [activeTab, setActiveTab] = useState<'overview' | 'rooms' | 'bookings'>('overview');

  // New room crud form
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState('Suite');
  const [newRoomPrice, setNewRoomPrice] = useState(400);
  const [newRoomSize, setNewRoomSize] = useState(550);
  const [newRoomMaxGuests, setNewRoomMaxGuests] = useState(2);
  const [newRoomView, setNewRoomView] = useState('Lush Canopy Valley View');
  const [newRoomImage, setNewRoomImage] = useState('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [newRoomAmenities, setNewRoomAmenities] = useState<string>('Bespoke fine linen, Artisanal herbal bar');
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [crudSuccess, setCrudSuccess] = useState('');

  // Handle standard Administrative Login
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      setIsLoggingIn(false);

      if (data && data.success) {
        onLogin({
          token: data.token,
          email: data.email,
          name: data.name
        });
        // Clear variables
        setEmail('');
        setPassword('');
      } else {
        setLoginError(data.error || 'Authentic administration details required.');
      }
    } catch {
      setIsLoggingIn(false);
      setLoginError('Himalayan servers check failed. Re-verify service.');
    }
  };

  const handleRoomCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCrudSuccess('');
    setIsAddingRoom(true);

    const parsedAmenities = newRoomAmenities.split(',').map(item => item.trim()).filter(Boolean);

    const payload = {
      name: newRoomName,
      type: newRoomType,
      price: Number(newRoomPrice),
      size: Number(newRoomSize),
      maxGuests: Number(newRoomMaxGuests),
      view: newRoomView,
      image: newRoomImage,
      description: newRoomDesc,
      amenities: parsedAmenities
    };

    const success = await onAddRoom(payload);
    setIsAddingRoom(false);

    if (success) {
      setCrudSuccess('Elemental stay category initialized in active inventory.');
      // Clear
      setNewRoomName('');
      setNewRoomPrice(450);
      setNewRoomSize(600);
      setNewRoomDesc('');
    } else {
      setLoginError('Room creation failure.');
    }
  };

  // Analytics aggregate properties
  const totalStaysRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, current) => sum + current.totalAmount, 0);

  const pendingReservations = bookings.filter(b => b.status === 'pending').length;
  const confirmedReservations = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <AnimatePresence>
      {isAdminOpen && (
        <motion.div
          id="admin-overlay"
          className="fixed inset-0 z-50 bg-luxury-green-950/80 backdrop-blur-md flex items-center justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            id="admin-side-panel"
            className="w-full max-w-4xl h-full bg-luxury-gold-50 border-l border-white/20 shadow-2xl flex flex-col justify-between overflow-hidden relative"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.5 }}
          >
            {/* Header Area */}
            <div className="p-6 bg-luxury-green-950 text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-luxury-gold-500" />
                <div className="text-left">
                  <h3 className="font-serif-luxury text-lg tracking-wide uppercase">Ambassador Ledger Office</h3>
                  <p className="text-[10px] uppercase tracking-widest text-luxury-gold-300">Aaryam Administrative Desk</p>
                </div>
              </div>
              <button
                id="close-admin-desk"
                onClick={onClose}
                className="text-white/70 hover:text-white p-2.5 bg-white/5 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Authentications flow required if no active admin user */}
            {!adminUser ? (
              <div className="flex-1 p-8 flex flex-col justify-center max-w-md mx-auto w-full">
                <div className="text-center mb-8">
                  <div className="w-12 h-12 rounded-full bg-luxury-green-950 text-white flex items-center justify-center mx-auto mb-3 border border-luxury-gold-500/20">
                    <Shield className="w-6 h-6 text-luxury-gold-500" />
                  </div>
                  <h4 className="font-serif-luxury text-2xl text-luxury-green-905">Administrative Clearance</h4>
                  <p className="text-xs text-luxury-green-900/60 mt-1 leading-relaxed">
                    Access is strictly reserved for the Royal Concierge and authorized Aaryam hospitality managers.
                  </p>
                </div>

                <div className="bg-white border border-luxury-gold-500/30 p-6 rounded-sm shadow-xl">
                  <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-luxury-gold-700 block mb-1">Authentic Staff ID / Email</label>
                      <input
                        id="admin-email-field"
                        type="email"
                        placeholder="admin@aaryam.com"
                        className="w-full bg-luxury-gold-50 border border-black/10 text-xs p-2.5 rounded focus:outline-none focus:border-luxury-gold-500 text-luxury-green-950"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-luxury-gold-700 block mb-1">Signature Royal Encryption Pass</label>
                      <input
                        id="admin-password-field"
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-luxury-gold-50 border border-black/10 text-xs p-2.5 rounded focus:outline-none focus:border-luxury-gold-500 text-luxury-green-950"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    {loginError && (
                      <div className="text-red-600 text-xs bg-red-50 p-2.5 border border-red-200 rounded">
                        {loginError}
                      </div>
                    )}

                    <button
                      id="admin-login-submit"
                      type="submit"
                      disabled={isLoggingIn}
                      className="w-full bg-luxury-green-900 hover:bg-luxury-gold-600 disabled:bg-luxury-green-950/20 text-white py-3 text-xs tracking-widest uppercase font-semibold transition-all rounded-xs cursor-pointer"
                    >
                      {isLoggingIn ? 'Verifying Clearances...' : 'Unlock Ledgers'}
                    </button>
                  </form>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-luxury-green-900/40">
                    Default: admin@aaryam.com / luxury2026
                  </p>
                </div>
              </div>
            ) : (
              // Logged in Ambassador console Workspace
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                
                {/* Secondary Horizontal Tab Select bar */}
                <div className="p-4 bg-white border-b border-black/5 flex items-center justify-between shrink-0">
                  <div className="flex space-x-2">
                    {/* Tab 1 */}
                    <button
                      id="tab-overview"
                      onClick={() => setActiveTab('overview')}
                      className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded ${
                        activeTab === 'overview'
                          ? 'bg-luxury-green-900 text-white'
                          : 'bg-transparent text-luxury-green-900 hover:bg-black/5'
                      }`}
                    >
                      At A Glance
                    </button>

                    {/* Tab 2 */}
                    <button
                      id="tab-bookings"
                      onClick={() => setActiveTab('bookings')}
                      className={`px-4 py-2 relative text-xs uppercase tracking-widest font-semibold rounded ${
                        activeTab === 'bookings'
                          ? 'bg-luxury-green-900 text-white'
                          : 'bg-transparent text-luxury-green-900 hover:bg-black/5'
                      }`}
                    >
                      <span>Reservations</span>
                      {pendingReservations > 0 && (
                        <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                          {pendingReservations}
                        </span>
                      )}
                    </button>

                    {/* Tab 3 */}
                    <button
                      id="tab-rooms"
                      onClick={() => setActiveTab('rooms')}
                      className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded ${
                        activeTab === 'rooms'
                          ? 'bg-luxury-green-900 text-white'
                          : 'bg-transparent text-luxury-green-900 hover:bg-black/5'
                      }`}
                    >
                      Sanctuaries CRUD
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-luxury-gold-700 font-mono bg-luxury-gold-100 px-2 py-1 rounded">
                      Hello, {adminUser.name}!
                    </span>
                    <button
                      id="desk-logout"
                      onClick={onLogout}
                      className="text-[10px] uppercase font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded transition-all"
                    >
                      Exit Desk
                    </button>
                  </div>
                </div>

                {/* Main Tab Area context display screen */}
                <div className="flex-1 p-6 overflow-y-auto bg-luxury-gold-50/50">
                  
                  {/* TAB 1: OVERVIEW/ANALYTICS PANEL WITH COUNTUPS APPLIED */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      
                      {/* Count aggregates widgets bar */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
                        {/* Box 1 */}
                        <div className="bg-white border border-[#1b3022]/10 p-5 rounded-sm shadow-sm flex items-center justify-between">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-luxury-gold-700 font-bold block">Total Investment value</span>
                            <span className="font-serif-luxury text-2xl font-bold text-luxury-green-950 block mt-1">
                              ${totalStaysRevenue}
                            </span>
                            <span className="text-[8px] uppercase tracking-wider text-emerald-600 font-semibold mt-1 block">Projected ledger</span>
                          </div>
                          <div className="p-3 bg-emerald-50 rounded-full">
                            <DollarSign className="w-5 h-5 text-emerald-600" />
                          </div>
                        </div>

                        {/* Box 2 */}
                        <div className="bg-white border border-[#1b3022]/10 p-5 rounded-sm shadow-sm flex items-center justify-between">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-luxury-gold-700 font-bold block">Sanctuary Stays</span>
                            <span className="font-serif-luxury text-2xl font-bold text-luxury-green-950 block mt-1">
                              {rooms.length} Suite(s)
                            </span>
                            <span className="text-[8px] uppercase tracking-wider text-[#1b3022]/60 mt-1 block">Active on-site</span>
                          </div>
                          <div className="p-3 bg-orange-50 rounded-full">
                            <Building2 className="w-5 h-5 text-orange-600" />
                          </div>
                        </div>

                        {/* Box 3 */}
                        <div className="bg-white border border-[#1b3022]/10 p-5 rounded-sm shadow-sm flex items-center justify-between">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-luxury-gold-700 font-bold block">Pending Inquiries</span>
                            <span className="font-serif-luxury text-2xl font-bold text-luxury-green-950 block mt-1">
                              {pendingReservations} Stays
                            </span>
                            <span className="text-[8px] uppercase tracking-wider text-amber-600 font-semibold mt-1 block">Awaiting response</span>
                          </div>
                          <div className="p-3 bg-amber-50 rounded-full">
                            <Calendar className="w-5 h-5 text-amber-600" />
                          </div>
                        </div>

                        {/* Box 4 */}
                        <div className="bg-white border border-[#1b3022]/10 p-5 rounded-sm shadow-sm flex items-center justify-between">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-luxury-gold-700 font-bold block">Confirmed Stays</span>
                            <span className="font-serif-luxury text-2xl font-bold text-luxury-green-950 block mt-1">
                              {confirmedReservations}
                            </span>
                            <span className="text-[8px] uppercase tracking-wider text-emerald-600 font-semibold mt-1 block">Secured guests</span>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-full">
                            <ChevronUp className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                      </div>

                      {/* Calendar view & availability charts simulation */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-5 border border-black/5 shadow-sm rounded-sm text-left">
                          <h4 className="font-serif-luxury text-sm font-bold text-[#1B3022] mb-3 uppercase tracking-wider">
                            Valley Availability Matrix
                          </h4>
                          <p className="text-[11px] leading-relaxed text-luxury-green-905/70 mb-4">
                            Detailed snapshot of our current room inventory allocations for guest arrivals.
                          </p>
                          <div className="space-y-3">
                            {rooms.map(room => {
                              const activeBookingsCount = bookings.filter(b => b.roomId === room.id && b.status === "confirmed").length;
                              return (
                                <div key={room.id} className="flex items-center justify-between p-2.5 bg-luxury-gold-50 border border-[#1b3022]/5">
                                  <div className="text-left">
                                    <span className="text-xs font-semibold block">{room.name}</span>
                                    <span className="text-[9px] uppercase tracking-wider opacity-60">{room.type}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[9px] uppercase tracking-widest font-mono font-bold px-2 py-0.5 rounded ${
                                      activeBookingsCount > 0 ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-800'
                                    }`}>
                                      {activeBookingsCount > 0 ? `Occupied (${activeBookingsCount} stay)` : 'Fully Available'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Recent ledger timeline activity logs */}
                        <div className="bg-white p-5 border border-black/5 shadow-sm rounded-sm text-left">
                          <h4 className="font-serif-luxury text-sm font-bold text-[#1B3022] mb-3 uppercase tracking-wider">
                            Live Ambassador Activity Feed
                          </h4>
                          <div className="space-y-4">
                            {bookings.map(b => (
                              <div key={b.id} className="flex items-start gap-3 border-b border-black/5 pb-2.5">
                                <div className="p-1.5 rounded bg-luxury-gold-50 border border-black/5">
                                  <Users className="w-3.5 h-3.5 text-luxury-gold-700" />
                                </div>
                                <div className="text-left flex-1">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-semibold">{b.guestName}</span>
                                    <span className="text-[8px] font-mono opacity-50">{new Date(b.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-[10px] leading-tight text-luxury-green-900/70 mt-0.5">
                                    Requested Category: {b.roomName} &bull; {b.checkIn} to {b.checkOut}
                                  </p>
                                  <div className="mt-1 flex items-center justify-between">
                                    <span className="text-xs font-serif-luxury text-luxury-gold-700 font-bold">${b.totalAmount}</span>
                                    <span className={`text-[8px] uppercase tracking-widest font-semibold ${
                                      b.status === 'confirmed' ? 'text-emerald-600' : b.status === 'rejected' ? 'text-red-500' : 'text-blue-500'
                                    }`}>
                                      {b.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 2: ACTIVE BOOKINGS / RESERVATIONS WORKLIST */}
                  {activeTab === 'bookings' && (
                    <div className="space-y-4 text-left">
                      <h4 className="font-serif-luxury text-lg font-bold text-luxury-green-900 border-b border-black/5 pb-2">
                        Active Room Booking Requests ({bookings.length})
                      </h4>

                      {bookings.length === 0 ? (
                        <div className="p-12 text-center bg-white border border-[#1b3022]/10 rounded">
                          <p className="font-serif-luxury text-base text-[#1B3022]/60">No pending or confirmed stays registered in ledger.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {bookings.map((booking) => (
                            <div
                              key={booking.id}
                              id={`admin-booking-${booking.id}`}
                              className="bg-white border border-[#1b3022]/10 p-5 rounded shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                            >
                              <div className="text-left space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-serif-luxury text-base font-bold text-luxury-green-950">
                                    {booking.guestName}
                                  </span>
                                  <span className="text-[9px] uppercase font-mono tracking-widest font-bold bg-luxury-gold-100 text-[#1B3022] px-2 py-0.5 rounded">
                                    {booking.id}
                                  </span>
                                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded ${
                                    booking.status === 'confirmed'
                                      ? 'bg-emerald-100 text-emerald-805 text-emerald-800'
                                      : booking.status === 'rejected'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-blue-100 text-blue-800 animate-pulse'
                                  }`}>
                                    {booking.status}
                                  </span>
                                </div>

                                <div className="text-xs font-semibold text-luxury-green-905">
                                  Email: <span className="opacity-80 font-medium">{booking.guestEmail}</span>
                                </div>

                                <div className="text-xs font-medium text-luxury-green-900/70 leading-relaxed">
                                  Requested Category: <strong className="text-luxury-green-950">{booking.roomName}</strong> &bull; Total Stay Check-In: <strong>{booking.checkIn}</strong> to <strong>{booking.checkOut}</strong> &bull; Guests: <strong>{booking.guestsCount}</strong>
                                </div>

                                {booking.specialRequests && (
                                  <div className="text-[11px] p-2 bg-luxury-gold-50/50 border border-black/5 rounded text-luxury-green-905 italic">
                                    "{booking.specialRequests}"
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-col items-end justify-between gap-4 shrink-0 border-t md:border-t-0 border-black/5 pt-3 md:pt-0">
                                <div className="text-right">
                                  <span className="text-[10px] uppercase tracking-wider block opacity-50">Total Stay Fee</span>
                                  <span className="font-serif-luxury text-xl font-bold text-luxury-gold-700">${booking.totalAmount}</span>
                                </div>

                                {/* Controls: Confirm and Reject */}
                                {booking.status === 'pending' && (
                                  <div className="flex items-center gap-2">
                                    <button
                                      id={`confirm-stay-${booking.id}`}
                                      onClick={async () => {
                                        await onUpdateBookingStatus(booking.id, 'confirmed');
                                      }}
                                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm cursor-pointer"
                                    >
                                      Accept Stay
                                    </button>
                                    <button
                                      id={`reject-stay-${booking.id}`}
                                      onClick={async () => {
                                        await onUpdateBookingStatus(booking.id, 'rejected');
                                      }}
                                      className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm cursor-pointer"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                )}
                              </div>

                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  )}

                  {/* TAB 3: SANCTUARIES CRUD MANAGEMENT */}
                  {activeTab === 'rooms' && (
                    <div className="space-y-6 text-left">
                      
                      {/* Crud submission form block */}
                      <div className="bg-white p-5 rounded-sm border border-black/5 shadow-sm">
                        <h4 className="font-serif-luxury text-sm font-bold text-[#1B3022] mb-3 uppercase tracking-wider">
                          Seed A Brand New Eco Chamber Stay
                        </h4>

                        <form onSubmit={handleRoomCreateSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          
                          <div className="md:col-span-4">
                            <label className="text-[9px] uppercase tracking-wider opacity-60 block mb-1">Sanctuary Name</label>
                            <input
                              type="text"
                              placeholder="Akasha Forest Tree Loft"
                              className="w-full bg-luxury-gold-50 border border-black/10 text-xs p-2 rounded focus:outline-none focus:border-luxury-gold-500"
                              value={newRoomName}
                              onChange={(e) => setNewRoomName(e.target.value)}
                              required
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="text-[9px] uppercase tracking-wider opacity-60 block mb-1">Category Type</label>
                            <select
                              className="w-full bg-luxury-gold-50 border border-black/10 text-xs p-2 rounded focus:outline-none"
                              value={newRoomType}
                              onChange={(e) => setNewRoomType(e.target.value)}
                            >
                              <option value="Villa">Villa</option>
                              <option value="Cottage">Cottage</option>
                              <option value="Suite">Suite</option>
                              <option value="Sanctuary">Sanctuary</option>
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label className="text-[9px] uppercase tracking-wider opacity-60 block mb-1">Investment / Night</label>
                            <input
                              type="number"
                              className="w-full bg-luxury-gold-50 border border-black/10 text-xs p-2 rounded focus:outline-none"
                              value={newRoomPrice}
                              onChange={(e) => setNewRoomPrice(Number(e.target.value))}
                              required
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="text-[9px] uppercase tracking-wider opacity-60 block mb-1">Area (SQ FT)</label>
                            <input
                              type="number"
                              className="w-full bg-luxury-gold-50 border border-black/10 text-xs p-2 rounded focus:outline-none"
                              value={newRoomSize}
                              onChange={(e) => setNewRoomSize(Number(e.target.value))}
                              required
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="text-[9px] uppercase tracking-wider opacity-60 block mb-1">Max capacity</label>
                            <input
                              type="number"
                              className="w-full bg-luxury-gold-50 border border-black/10 text-xs p-2 rounded focus:outline-none"
                              value={newRoomMaxGuests}
                              onChange={(e) => setNewRoomMaxGuests(Number(e.target.value))}
                              required
                            />
                          </div>

                          <div className="md:col-span-6">
                            <label className="text-[9px] uppercase tracking-wider opacity-60 block mb-1">Bespoke Aspect View Descriptor</label>
                            <input
                              type="text"
                              value={newRoomView}
                              onChange={(e) => setNewRoomView(e.target.value)}
                              className="w-full bg-luxury-gold-50 border border-black/10 text-xs p-2 rounded focus:outline-none"
                              required
                            />
                          </div>

                          <div className="md:col-span-6">
                            <label className="text-[9px] uppercase tracking-wider opacity-60 block mb-1">Splash Showcase Image URL</label>
                            <input
                              type="text"
                              className="w-full bg-luxury-gold-50 border border-black/10 text-xs p-2 rounded focus:outline-none"
                              value={newRoomImage}
                              onChange={(e) => setNewRoomImage(e.target.value)}
                              required
                            />
                          </div>

                          <div className="md:col-span-12">
                            <label className="text-[9px] uppercase tracking-wider opacity-60 block mb-1">Ritualistic chamber descriptors</label>
                            <textarea
                              rows={2}
                              className="w-full bg-luxury-gold-50 border border-black/10 text-xs p-2 rounded focus:outline-none resize-none"
                              value={newRoomDesc}
                              onChange={(e) => setNewRoomDesc(e.target.value)}
                              placeholder="Write about elemental alignments..."
                              required
                            />
                          </div>

                          <div className="md:col-span-8">
                            <label className="text-[9px] uppercase tracking-wider opacity-60 block mb-1">Exclusive Artifacts (Separated by commas)</label>
                            <input
                              type="text"
                              className="w-full bg-luxury-gold-50 border border-black/10 text-xs p-2 rounded focus:outline-none"
                              value={newRoomAmenities}
                              onChange={(e) => setNewRoomAmenities(e.target.value)}
                              required
                            />
                          </div>

                          <div className="md:col-span-4 flex items-end">
                            <button
                              id="submit-crud-room"
                              type="submit"
                              disabled={isAddingRoom}
                              className="w-full h-11 bg-luxury-green-900 hover:bg-luxury-gold-500 text-white font-bold text-xs uppercase tracking-widest"
                            >
                              {isAddingRoom ? 'Propagating inventory...' : 'Seed Suite'}
                            </button>
                          </div>

                        </form>

                        {crudSuccess && (
                          <div className="text-emerald-700 text-xs bg-emerald-50 p-2 border border-emerald-200 rounded mt-3">
                            {crudSuccess}
                          </div>
                        )}
                      </div>

                      {/* Display current list and allow delete */}
                      <div className="space-y-3">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#1B3022] block">
                          Active Sanctuaries Inventory List ({rooms.length})
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {rooms.map(room => (
                            <div key={room.id} className="p-4 bg-white border border-black/5 rounded-sm shadow-xs flex items-center justify-between">
                              <div className="text-left">
                                <span className="text-xs font-bold block">{room.name}</span>
                                <span className="text-[9px] uppercase tracking-widest text-luxury-gold-700 font-bold block">
                                  {room.type} &bull; ${room.price} Per Night
                                </span>
                                <span className="text-[10px] opacity-70 block mt-1">Area: {room.size} SQ FT</span>
                              </div>

                              <button
                                id={`delete-room-${room.id}`}
                                onClick={async () => {
                                  if (confirm("Confirm discontinuing this eco chamber category from the ledger?")) {
                                    await onDeleteRoom(room.id);
                                  }
                                }}
                                className="p-2 border border-red-200 text-red-500 hover:bg-red-50 rounded"
                                title="Delete Sanctuary Category"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                </div>

              </div>
            )}

            {/* Footer desk stamp */}
            <div className="p-4 bg-luxury-green-950 border-t border-white/5 text-center text-[10px] uppercase tracking-[0.3em] text-white/50 shrink-0 select-none">
              AARYAM ESTATE &bull; CONCIERGE MANAGEMENT CONSOLE
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
