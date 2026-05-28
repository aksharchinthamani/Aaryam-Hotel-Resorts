import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Calendar, User, Sparkles, AlertCircle, Edit3, CheckCircle, XCircle, Ban, ArrowRight, CornerDownRight, Clock } from 'lucide-react';
import { Booking } from '../types';

interface MyBookingsLookupProps {
  bookings: Booking[];
  onRefreshBookings: () => Promise<void>;
  isDark: boolean;
}

export default function MyBookingsLookup({ bookings, onRefreshBookings, isDark }: MyBookingsLookupProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [lookupResults, setLookupResults] = useState<Booking[] | null>(null);
  const [searched, setSearched] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setLookupResults([]);
      return;
    }

    const matches = bookings.filter(b => 
      b.guestEmail.toLowerCase().includes(query) || 
      b.id.toLowerCase() === query ||
      b.guestName.toLowerCase().includes(query)
    );
    
    // Sort matching by creation date newest first
    matches.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());

    setLookupResults(matches);
    setSearched(true);
    setMessage('');
  };

  const handleStartEdit = (b: Booking) => {
    setEditingId(b.id);
    setEditText(b.specialRequests || '');
  };

  const handleSaveRequests = async (id: string) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/bookings/${id}/requests`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specialRequests: editText })
      });
      if (response.ok) {
        await onRefreshBookings();
        // Update direct results view
        if (lookupResults) {
          setLookupResults(prev => 
            prev ? prev.map(item => item.id === id ? { ...item, specialRequests: editText } : item) : null
          );
        }
        setEditingId(null);
        setMessage('Your special requests have been elegantly updated with the royal concierge.');
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage('Failed to update special requests. Please try again.');
      }
    } catch (e) {
      console.error(e);
      setMessage('An error occurred during communication.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm('Are you absolutely certain you wish to request cancellation of this Himalayan sanctuary escape?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });
      if (response.ok) {
        await onRefreshBookings();
        // Update results
        if (lookupResults) {
          setLookupResults(prev => 
            prev ? prev.map(item => item.id === id ? { ...item, status: 'cancelled' as any } : item) : null
          );
        }
        setMessage('Your reservation has been cancelled gracefully. The space has been released.');
        setTimeout(() => setMessage(''), 6000);
      } else {
        setMessage('Failed to cancel your reservation.');
      }
    } catch (e) {
      console.error(e);
      setMessage('Error occurred while cancelling stay.');
    }
  };

  return (
    <section id="booking-lookup" className={`py-20 border-t ${
      isDark ? 'border-white/5 bg-luxury-green-950/40' : 'border-luxury-gold-200/50 bg-luxury-gold-50/70'
    }`}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-[0.4em] text-luxury-gold-500 font-bold block mb-2">Track & Personalize</span>
          <h2 className="font-serif-luxury text-3xl md:text-4xl">Guest Reservation Portal</h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 max-w-md mx-auto">
            Review status, customize arrival options, or refine special requests for your upcoming sanctuary escape.
          </p>
        </div>

        {/* Query Input Box */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
          <div className="flex items-center gap-2 p-1.5 rounded-sm border border-stone-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-md">
            <Search className="w-4 h-4 text-stone-400 ml-2" />
            <input
              type="text"
              placeholder="Enter email (e.g. aksharchinthamani@gmail.com) or Booking ID"
              className="flex-1 bg-transparent border-0 text-xs focus:ring-0 focus:outline-none dark:text-white p-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="luxury-gold-gradient text-white text-[11px] tracking-widest font-semibold uppercase px-5 py-2.5 rounded-xs hover:opacity-90 transition cursor-pointer"
            >
              Retrieve
            </button>
          </div>
          <div className="text-center mt-2.5">
            <span className="text-[10px] text-stone-400 font-mono tracking-wide">
              Tip: Explore with <code className="text-luxury-gold-600 font-bold">aksharchinthamani@gmail.com</code> or <code className="text-luxury-gold-600 font-bold">bk-09122</code>
            </span>
          </div>
        </form>

        {/* Global Notifications panel */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto mb-6 p-4 rounded-xs border border-luxury-gold-500/20 bg-luxury-gold-500/10 text-xs text-center font-medium text-luxury-gold-700 dark:text-luxury-gold-300"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Output list panel */}
        <AnimatePresence mode="wait">
          {searched && lookupResults !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {lookupResults.length === 0 ? (
                <div className="text-center py-10 select-none border border-stone-200/50 dark:border-white/5 rounded-sm p-8 bg-white/30 dark:bg-white/5">
                  <AlertCircle className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                  <p className="font-serif-luxury text-sm">No sanctuary accounts found</p>
                  <p className="text-[11px] text-stone-400 mt-1 max-w-sm mx-auto">
                    We could not retrieve any active reserves matching "{searchQuery}". Ensure your spelling is accurate or speak to the 24/7 AI Butler below.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-serif-luxury text-sm text-stone-500 dark:text-stone-400 uppercase tracking-widest">
                    Matching Escape Logs ({lookupResults.length})
                  </h3>

                  {lookupResults.map((booking) => {
                    const checkInDate = new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const checkOutDate = new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    
                    // Style badges base on status
                    let statusLabel = 'Pending Concierge Review';
                    let statusColorClasses = 'border-amber-500/30 text-amber-600 bg-amber-500/5';
                    let statusIcon = <Clock className="w-3.5 h-3.5" />;

                    if (booking.status === 'confirmed') {
                      statusLabel = 'Sanctuary Reserved & Confirmed';
                      statusColorClasses = 'border-emerald-500/30 text-emerald-600 bg-emerald-500/5';
                      statusIcon = <CheckCircle className="w-3.5 h-3.5" />;
                    } else if (booking.status === 'rejected') {
                      statusLabel = 'Sanctuary Discontinued / Dates Booked';
                      statusColorClasses = 'border-rose-500/30 text-rose-600 bg-rose-504/5';
                      statusIcon = <XCircle className="w-3.5 h-3.5" />;
                    } else if (booking.status === 'cancelled') {
                      statusLabel = 'Stay Cancelled Gracefully';
                      statusColorClasses = 'border-neutral-500/30 text-neutral-500 bg-neutral-100 dark:bg-white/5';
                      statusIcon = <Ban className="w-3.5 h-3.5" />;
                    }

                    return (
                      <motion.div
                        key={booking.id}
                        layout
                        className="rounded-sm p-6 border border-stone-200 dark:border-white/10 bg-white dark:bg-white/10 shadow-lg relative flex flex-col justify-between gap-6 overflow-hidden md:flex-row md:items-center"
                        whileHover={{ y: -1 }}
                      >
                        {/* Decorative background ID label */}
                        <div className="absolute right-4 bottom-1 text-[55px] font-bold font-mono text-stone-100/5 dark:text-white/2 pointer-events-none select-none">
                          {booking.id}
                        </div>

                        {/* Booking Credentials */}
                        <div className="space-y-3.5 min-w-[280px]">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-mono text-[10px] tracking-wider uppercase bg-stone-100 dark:bg-white/10 px-2.5 py-1 text-stone-500 dark:text-stone-300 rounded font-semibold">
                              ID: {booking.id}
                            </span>
                            <div className={`px-2.5 py-0.5 border rounded-full text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 ${statusColorClasses}`}>
                              {statusIcon}
                              <span>{statusLabel}</span>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-serif-luxury text-base font-bold text-luxury-green-900 dark:text-luxury-gold-200">
                              {booking.roomName}
                            </h4>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                              Registered to <span className="font-semibold text-stone-700 dark:text-stone-200">{booking.guestName}</span> &bull; {booking.guestEmail}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 border-t border-stone-100 dark:border-white/5 pt-3">
                            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                              <Calendar className="w-4 h-4 text-luxury-gold-600 shrink-0" />
                              <div className="text-left">
                                <span className="text-[9px] uppercase tracking-wider text-stone-400 block">Check In</span>
                                <span className="text-xs font-semibold">{checkInDate}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                              <Calendar className="w-4 h-4 text-luxury-gold-600 shrink-0 animate-pulse-slow" />
                              <div className="text-left">
                                <span className="text-[9px] uppercase tracking-wider text-stone-400 block">Check Out</span>
                                <span className="text-xs font-semibold">{checkOutDate}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Guest special requests / Butler additions */}
                        <div className="flex-1 max-w-sm rounded-sm bg-stone-50 dark:bg-black/10 border border-stone-100 dark:border-white/5 p-4 self-stretch flex flex-col justify-between">
                          <div className="text-left">
                            <span className="text-[9px] uppercase tracking-widest text-luxury-gold-600 font-bold flex items-center gap-1 mb-1">
                              <Sparkles className="w-3 h-3" />
                              <span>Personal Sanctuary Requests</span>
                            </span>
                            
                            {editingId === booking.id ? (
                              <div className="space-y-2 mt-2">
                                <textarea
                                  className="w-full h-16 p-2 bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xs text-[11px] font-medium resize-none focus:outline-none dark:text-white"
                                  value={editText}
                                  placeholder="E.g., Require quiet cottage, prefer Vata dinner menu customizers, requests lavender sound therapies..."
                                  onChange={(e) => setEditText(e.target.value)}
                                />
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="px-2.5 py-1 border border-stone-300 dark:border-white/10 text-[10px] uppercase font-semibold rounded-xs text-stone-500 hover:bg-stone-100 dark:hover:bg-white/5"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleSaveRequests(booking.id)}
                                    disabled={isSaving}
                                    className="px-2.5 py-1 bg-luxury-green-900 border border-luxury-green-900 text-white text-[10px] uppercase font-bold rounded-xs hover:opacity-95"
                                  >
                                    {isSaving ? 'Saving...' : 'Save'}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <p className="text-[11px] text-stone-600 dark:text-stone-300 italic min-h-[34px] leading-relaxed">
                                  {booking.specialRequests ? `"${booking.specialRequests}"` : '"No special culinary/room requests added yet. Tailor your stay below."'}
                                </p>
                                {booking.status !== 'cancelled' && (
                                  <button
                                    onClick={() => handleStartEdit(booking)}
                                    className="text-[10px] text-luxury-gold-700 dark:text-luxury-gold-500 font-semibold uppercase hover:underline flex items-center gap-0.5 mt-2.5 cursor-pointer"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>Refine Requests</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Cancel sanctuary option */}
                        {booking.status !== 'cancelled' && booking.status !== 'rejected' && (
                          <div className="flex flex-col items-stretch self-stretch justify-center gap-2 xs:flex-row md:flex-col md:w-36">
                            <div className="text-right pb-1 border-b border-stone-100 dark:border-white/5 md:block hidden">
                              <span className="text-[9px] uppercase tracking-wider text-stone-400 block">Total Escape cost</span>
                              <span className="text-sm font-bold text-luxury-gold-700 dark:text-luxury-gold-500 font-mono">${booking.totalAmount}</span>
                            </div>
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="px-4 py-2 border border-red-500/20 hover:border-red-500/40 text-red-500 bg-red-500/5 hover:bg-red-500/10 text-[10px] font-bold uppercase tracking-widest rounded-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Ban className="w-3 h-3" />
                              <span>Release Booking</span>
                            </button>
                          </div>
                        )}
                        
                        {/* Cancelled placeholder */}
                        {(booking.status === 'cancelled' || booking.status === 'rejected') && (
                          <div className="text-right w-32 md:block hidden select-none opacity-40">
                            <span className="text-[9px] uppercase tracking-wider block">Released Value</span>
                            <span className="text-xs font-mono line-through font-bold">${booking.totalAmount}</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
