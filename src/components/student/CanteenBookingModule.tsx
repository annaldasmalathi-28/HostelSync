import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHostel } from '../../context/HostelContext';
import { MealType } from '../../types';
import {
  UtensilsCrossed,
  Clock,
  Users,
  QrCode,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Calendar,
  Sparkles,
  Coffee,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react';

export const CanteenBookingModule: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    canteenSlots,
    canteenBookings,
    bookCanteenSlot,
    cancelCanteenBooking,
  } = useHostel();

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToken, setSuccessToken] = useState<{ token: string; meal: string; slot: string } | null>(null);

  // Filter slots for current date & meal type
  const availableSlots = canteenSlots.filter((slot) => {
    if (selectedMealType !== 'all' && slot.mealType !== selectedMealType) return false;
    return true;
  });

  // User's active canteen bookings
  const myBookings = canteenBookings.filter(
    (b) => b.studentId === currentUser?.id && b.status === 'confirmed'
  );

  const handleBook = async (slotId: string) => {
    setErrorMessage(null);
    setSuccessToken(null);

    if (!currentUser) {
      setErrorMessage('Please sign in to book dining slots.');
      return;
    }

    try {
      setBookingLoading(slotId);
      const booking = await bookCanteenSlot(
        currentUser.id,
        currentUser.name,
        currentUser.studentId || 'STUDENT',
        slotId,
        selectedDate
      );
      setSuccessToken({
        token: booking.tokenNumber,
        meal: booking.mealType.toUpperCase(),
        slot: booking.timeWindow,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Dining reservation failed.');
    } finally {
      setBookingLoading(null);
    }
  };

  const getMealIcon = (meal: MealType) => {
    switch (meal) {
      case 'breakfast':
        return <Coffee className="w-4 h-4 text-amber-500" />;
      case 'lunch':
        return <Sun className="w-4 h-4 text-orange-500" />;
      case 'snacks':
        return <Sunset className="w-4 h-4 text-purple-500" />;
      case 'dinner':
        return <Moon className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Dining & Canteen Slot Booking</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
              SMART MESS
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Pre-book meal windows to reduce queue congestion and receive instant digital tokens
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setSelectedDate(todayStr)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedDate === todayStr
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today ({new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })})
          </button>
          <button
            onClick={() => setSelectedDate(tomorrow)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedDate === tomorrow
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tomorrow ({new Date(Date.now() + 86400000).toLocaleDateString([], { month: 'short', day: 'numeric' })})
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-600 font-bold">
            ✕
          </button>
        </div>
      )}

      {successToken && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white shadow-lg border border-emerald-700 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white text-emerald-900 flex items-center justify-center font-mono font-extrabold text-sm shadow-md shrink-0">
              <QrCode className="w-9 h-9 text-slate-900" />
            </div>
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                TOKEN CONFIRMED
              </span>
              <div className="text-xl font-mono font-extrabold tracking-wider mt-0.5">
                {successToken.token}
              </div>
              <p className="text-xs text-emerald-200">
                {successToken.meal} • {successToken.slot}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSuccessToken(null)}
            className="px-4 py-2 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-colors shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Active Tokens / Reservation section */}
      {myBookings.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Your Active Dining Tokens</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {myBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-extrabold text-blue-900">
                      {b.tokenNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-200 text-blue-900 uppercase">
                      {b.mealType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1">{b.timeWindow}</p>
                  <p className="text-[10px] text-slate-600">Date: {b.date}</p>
                </div>

                <button
                  onClick={() => cancelCanteenBooking(b.id)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors border border-rose-200 shrink-0"
                  title="Cancel token to free seat"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meal type filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['all', 'breakfast', 'lunch', 'snacks', 'dinner'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMealType(m)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
              selectedMealType === m
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Slot cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {availableSlots.map((slot) => {
          const isFull = slot.bookedCount >= slot.capacity;
          const pct = Math.min(100, Math.round((slot.bookedCount / slot.capacity) * 100));
          const hasBooked = myBookings.some(
            (b) => b.slotId === slot.id && b.date === selectedDate
          );

          return (
            <div
              key={slot.id}
              className={`bg-white rounded-2xl border p-5 transition-all shadow-xs flex flex-col justify-between ${
                isFull
                  ? 'border-slate-200 bg-slate-50/50'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div>
                {/* Slot Top Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      {getMealIcon(slot.mealType)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{slot.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-600" />
                        <span>
                          {slot.startTime} – {slot.endTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isFull
                        ? 'bg-rose-100 text-rose-800'
                        : pct > 80
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isFull ? 'FULL' : `${slot.capacity - slot.bookedCount} spots left`}
                  </span>
                </div>

                {/* Capacity Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                    <span>Dining Hall Capacity</span>
                    <span className="font-mono font-semibold">
                      {slot.bookedCount} / {slot.capacity}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFull
                          ? 'bg-rose-500'
                          : pct > 80
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Menu Highlights */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5">
                    Today’s Kitchen Menu:
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {slot.menuDescription}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-600">
                  {slot.priceEstimate || 'Included in Semester Mess'}
                </span>

                {hasBooked ? (
                  <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Booked
                  </span>
                ) : (
                  <button
                    onClick={() => handleBook(slot.id)}
                    disabled={isFull || bookingLoading === slot.id}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isFull
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                    }`}
                  >
                    {bookingLoading === slot.id ? 'Reserving...' : isFull ? 'Slot Full' : 'Reserve Slot'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
