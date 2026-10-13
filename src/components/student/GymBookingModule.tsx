import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHostel } from '../../context/HostelContext';
import {
  Dumbbell,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const GymBookingModule: React.FC = () => {
  const { currentUser } = useAuth();
  const { gymSessions, gymBookings, bookGymSession, cancelGymBooking } = useHostel();

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const myBookings = gymBookings.filter(
    (b) => b.studentId === currentUser?.id && b.status === 'confirmed'
  );

  const handleBook = async (slotTime: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentUser) return;

    try {
      setBookingLoading(slotTime);
      await bookGymSession(currentUser.id, currentUser.name, slotTime, selectedDate);
      setSuccessMessage(`Gym slot confirmed for ${slotTime} on ${selectedDate}!`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gym reservation failed.');
    } finally {
      setBookingLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Campus Gym & Fitness Centre</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              EQUIPMENT & COACHES
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Book trainer-guided strength batches and open mobility sessions with strict capacity caps
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
            Today
          </button>
          <button
            onClick={() => setSelectedDate(tomorrow)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedDate === tomorrow
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tomorrow
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="font-bold">
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Active Gym Bookings */}
      {myBookings.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Your Confirmed Gym Bookings</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {myBookings.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{b.slotTime}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Date: {b.date}</div>
                </div>
                <button
                  onClick={() => cancelGymBooking(b.id)}
                  className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {gymSessions.map((session) => {
          const isFull = session.bookedCount >= session.capacity;
          const hasBooked = myBookings.some(
            (b) => b.slotTime === session.slotTime && b.date === selectedDate
          );
          const availableCount = Math.max(0, session.capacity - session.bookedCount);

          return (
            <div
              key={session.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isFull
                        ? 'bg-rose-100 text-rose-800'
                        : availableCount < 5
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isFull ? 'BATCH FULL' : `${availableCount} slots open`}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{session.slotTime}</h3>
                <p className="text-xs text-blue-600 font-medium mt-0.5">{session.trainerName}</p>

                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5">Workout Focus:</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {session.focusArea}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600">
                  <span>Batch Capacity</span>
                  <span className="font-mono font-bold">
                    {session.bookedCount} / {session.capacity}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                {hasBooked ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Reserved
                  </span>
                ) : (
                  <button
                    onClick={() => handleBook(session.slotTime)}
                    disabled={isFull || bookingLoading === session.slotTime}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isFull
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                    }`}
                  >
                    {bookingLoading === session.slotTime ? 'Booking...' : isFull ? 'Full' : 'Book Session'}
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
