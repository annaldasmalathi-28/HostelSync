import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHostel } from '../../context/HostelContext';
import { Room, Bed } from '../../types';
import {
  Bed as BedIcon,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Eye,
  Check,
  ShieldCheck,
  Users,
  Sparkles,
  Info,
} from 'lucide-react';

export const BedBookingModule: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    blocks,
    rooms,
    beds,
    bedRequests,
    requestBedBooking,
  } = useHostel();

  const [selectedBlockId, setSelectedBlockId] = useState<string>('all');
  const [selectedRoomType, setSelectedRoomType] = useState<string>('all');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [selectedRoomModal, setSelectedRoomModal] = useState<Room | null>(null);

  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check if current user already has an allocated bed
  const currentBed = beds.find((b) => b.currentStudentId === currentUser?.id);
  const myPendingRequest = bedRequests.find(
    (r) => r.studentId === currentUser?.id && r.status === 'pending'
  );

  // Filtered rooms
  const filteredRooms = rooms.filter((r) => {
    if (selectedBlockId !== 'all' && r.blockId !== selectedBlockId) return false;
    if (selectedRoomType !== 'all' && r.roomType !== selectedRoomType) return false;
    if (onlyAvailable && r.availableBeds === 0) return false;
    return true;
  });

  const handleRequestBed = async (bedId: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentUser) {
      setErrorMessage('Please sign in to request a bed.');
      return;
    }

    if (currentBed) {
      setErrorMessage(
        `Allocation Conflict: You already hold confirmed Bed ${currentBed.bedNumber} in ${currentBed.blockName}. You cannot request multiple beds concurrently.`
      );
      return;
    }

    if (myPendingRequest) {
      setErrorMessage(
        `Pending Request: You already have a pending allocation request for Bed ${myPendingRequest.bedNumber}. Please wait for warden review.`
      );
      return;
    }

    try {
      setBookingLoading(bedId);
      await requestBedBooking(
        currentUser.id,
        currentUser.name,
        currentUser.studentId || 'STUDENT',
        bedId
      );
      setSuccessMessage('Bed allocation requested successfully! Awaiting Warden approval.');
      setSelectedRoomModal(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to request bed.');
    } finally {
      setBookingLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Bed Allocation Desk</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
              Autumn 2026
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Browse campus residential blocks, review floor amenities, and request available beds
          </p>
        </div>

        {/* Status highlight */}
        {currentBed ? (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Allocated Bed: {currentBed.bedNumber}</span>
              <p className="text-[10px] text-emerald-600">{currentBed.blockName}</p>
            </div>
          </div>
        ) : myPendingRequest ? (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Request Pending: Bed {myPendingRequest.bedNumber}</span>
              <p className="text-[10px] text-amber-600">Awaiting Warden Approval</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Select a bed below to initiate room allocation</span>
          </div>
        )}
      </div>

      {/* Alert Banners */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-600 hover:text-rose-800 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-800 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Block Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedBlockId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedBlockId === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Blocks ({rooms.length} Rooms)
          </button>
          {blocks.map((blk) => (
            <button
              key={blk.id}
              onClick={() => setSelectedBlockId(blk.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedBlockId === blk.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {blk.name.split(' ')[0]} {blk.name.split(' ')[1]} ({blk.gender})
            </button>
          ))}
        </div>

        {/* Room Type & Availability toggle */}
        <div className="flex items-center gap-3">
          <select
            value={selectedRoomType}
            onChange={(e) => setSelectedRoomType(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Room Types</option>
            <option value="single_ac">Single AC</option>
            <option value="double_ac">Double AC</option>
            <option value="double_non_ac">Double Non-AC</option>
            <option value="triple_non_ac">Triple Non-AC</option>
          </select>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <span>Available Beds Only</span>
          </label>
        </div>
      </div>

      {/* Rooms & Beds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredRooms.map((room) => {
          const roomBeds = beds.filter((b) => b.roomId === room.id);
          const hasAvailableBed = roomBeds.some((b) => b.status === 'available');

          return (
            <div
              key={room.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Top Room Banner */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-extrabold text-slate-900">
                        {room.roomNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                        Floor {room.floor}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          hasAvailableBed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {room.availableBeds}/{room.totalBeds} Available
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{room.blockName}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-blue-600 font-mono">
                      ₹{room.rentPerTerm.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-600 block">/ semester</span>
                  </div>
                </div>

                {/* Amenities Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {room.amenities.map((am, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200/60"
                    >
                      {am}
                    </span>
                  ))}
                </div>

                {/* Beds in Room */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                    <span>Bed Inventory</span>
                    <span className="text-[10px] text-slate-600">
                      {room.roomType.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {roomBeds.map((bed) => {
                      const isOccupied = bed.status === 'occupied';
                      const isReserved = bed.status === 'reserved';
                      const isAvailable = bed.status === 'available';
                      const isMine = bed.currentStudentId === currentUser?.id;
                      const isMyPending = bed.requestedStudentId === currentUser?.id;

                      return (
                        <div
                          key={bed.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                            isMine
                              ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-400'
                              : isMyPending
                              ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-400'
                              : isAvailable
                              ? 'bg-slate-50/60 border-slate-200 hover:border-blue-400'
                              : 'bg-slate-100/50 border-slate-200 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                                isMine
                                  ? 'bg-emerald-600 text-white'
                                  : isMyPending
                                  ? 'bg-amber-500 text-white'
                                  : isAvailable
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-slate-200 text-slate-500'
                              }`}
                            >
                              <BedIcon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-xs font-bold font-mono text-slate-800">
                                {bed.bedNumber}
                              </div>
                              <div className="text-[10px] text-slate-600">
                                {isMine
                                  ? 'Your Allocated Bed'
                                  : isMyPending
                                  ? 'Your Request Pending'
                                  : isOccupied
                                  ? `Occupied by ${bed.currentStudentName?.split(' ')[0] || 'Resident'}`
                                  : isReserved
                                  ? 'Requested by student'
                                  : 'Vacant & Ready'}
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          {isAvailable ? (
                            <button
                              onClick={() => handleRequestBed(bed.id)}
                              disabled={bookingLoading === bed.id || !!currentBed || !!myPendingRequest}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                currentBed || myPendingRequest
                                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                              }`}
                            >
                              {bookingLoading === bed.id ? 'Requesting...' : 'Request Bed'}
                            </button>
                          ) : (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isMine
                                  ? 'bg-emerald-200 text-emerald-800'
                                  : isMyPending
                                  ? 'bg-amber-200 text-amber-900'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {isMine ? 'ALLOCATED' : isMyPending ? 'PENDING' : 'UNAVAILABLE'}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
          <BedIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">No matching rooms found</p>
          <p className="text-xs text-slate-600 mt-1">
            Try adjusting your block or room type filters above
          </p>
        </div>
      )}
    </div>
  );
};
