import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHostel } from '../../context/HostelContext';
import {
  Bed,
  UtensilsCrossed,
  Wrench,
  Receipt,
  HeartPulse,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Megaphone,
  Sparkles,
  Calendar,
} from 'lucide-react';

interface StudentOverviewProps {
  onNavigateTab: (tab: string) => void;
}

export const StudentOverview: React.FC<StudentOverviewProps> = ({ onNavigateTab }) => {
  const { currentUser } = useAuth();
  const {
    beds,
    bedRequests,
    complaints,
    canteenBookings,
    feeRecords,
    announcements,
  } = useHostel();

  // Find student's bed or pending bed request
  const studentBed = beds.find((b) => b.currentStudentId === currentUser?.id);
  const pendingBedRequest = bedRequests.find(
    (r) => r.studentId === currentUser?.id && r.status === 'pending'
  );

  // Student's complaints
  const myComplaints = complaints.filter((c) => c.studentId === currentUser?.id);
  const activeComplaint = myComplaints.find(
    (c) => c.status === 'submitted' || c.status === 'assigned' || c.status === 'in_progress'
  );

  // Today's upcoming canteen booking
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingMeal = canteenBookings.find(
    (b) => b.studentId === currentUser?.id && b.date >= todayStr && b.status === 'confirmed'
  );

  // Student fee record
  const myFeeRecord = feeRecords.find((r) => r.studentId === currentUser?.id);

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-56 h-56 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Resident Student Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {currentUser?.studentId ? `Roll: ${currentUser.studentId} • ` : ''}
              {studentBed
                ? `Allocated: Bed ${studentBed.bedNumber} (${studentBed.blockName})`
                : pendingBedRequest
                ? `Bed Request Pending: Bed ${pendingBedRequest.bedNumber}`
                : 'No bed assigned yet. Browse available beds in the booking module.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('complaints')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Wrench className="w-4 h-4" />
              <span>File Complaint</span>
            </button>
            <button
              onClick={() => onNavigateTab('canteen')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Book Meal</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bed Status Card */}
        <div
          onClick={() => onNavigateTab('bed_booking')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Bed className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                studentBed
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : pendingBedRequest
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {studentBed ? 'CONFIRMED' : pendingBedRequest ? 'PENDING' : 'NOT BOOKED'}
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-600">Room & Bed</div>
          <div className="text-lg font-bold text-slate-900 mt-0.5">
            {studentBed
              ? studentBed.bedNumber
              : pendingBedRequest
              ? `Req #${pendingBedRequest.bedNumber}`
              : 'Request Bed'}
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            {studentBed
              ? studentBed.blockName
              : pendingBedRequest
              ? 'Awaiting warden verification'
              : 'Browse vacant rooms'}
          </p>
        </div>

        {/* Complaints Card */}
        <div
          onClick={() => onNavigateTab('complaints')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeComplaint
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {activeComplaint ? activeComplaint.status.toUpperCase() : 'ALL CLEAR'}
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-600">Maintenance Tickets</div>
          <div className="text-lg font-bold text-slate-900 mt-0.5">
            {myComplaints.length} Total
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            {activeComplaint ? activeComplaint.title.slice(0, 26) + '...' : 'No open repairs'}
          </p>
        </div>

        {/* Upcoming Canteen Slot */}
        <div
          onClick={() => onNavigateTab('canteen')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {upcomingMeal ? upcomingMeal.tokenNumber : 'NO TOKEN'}
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-600">Dining Reservation</div>
          <div className="text-lg font-bold text-slate-900 mt-0.5">
            {upcomingMeal ? upcomingMeal.mealType.toUpperCase() : 'Reserve Slot'}
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            {upcomingMeal ? upcomingMeal.timeWindow : 'Avoid queue congestion'}
          </p>
        </div>

        {/* Fee Status Card */}
        <div
          onClick={() => onNavigateTab('fees')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                myFeeRecord?.status === 'paid'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : myFeeRecord?.status === 'pending_verification'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {myFeeRecord?.status?.replace('_', ' ').toUpperCase() || 'UNPAID'}
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-600">Semester Hostel Fee</div>
          <div className="text-lg font-bold text-slate-900 mt-0.5">
            {myFeeRecord ? `₹${(myFeeRecord.totalAmount - myFeeRecord.paidAmount).toLocaleString()}` : '₹0'} Due
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            {myFeeRecord?.status === 'paid'
              ? 'Settled & Verified'
              : myFeeRecord?.status === 'pending_verification'
              ? 'Receipt under review'
              : 'Upload transfer receipt'}
          </p>
        </div>
      </div>

      {/* Main Grid: Active Maintenance Tracker & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Complaint Live Timeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Active Maintenance Status
              </h2>
              <p className="text-xs text-slate-600">
                Real-time tracking of reported room & floor repairs
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('complaints')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View all tickets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeComplaint ? (
            <div className="rounded-xl border border-slate-200 p-5 bg-slate-50/50">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {activeComplaint.complaintNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                      {activeComplaint.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 capitalize">
                      {activeComplaint.priority} Priority
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    {activeComplaint.title}
                  </h3>
                </div>
                <div className="text-[11px] text-slate-600">
                  Room: <span className="font-semibold text-slate-800">{activeComplaint.roomNumber}</span>
                </div>
              </div>

              {/* 4-Step Visual Progress Stepper */}
              <div className="py-6">
                <div className="grid grid-cols-4 relative">
                  {/* Connecting line */}
                  <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

                  {/* Step 1: Submitted */}
                  <div className="flex flex-col items-center text-center relative z-10">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 mt-1.5">Submitted</span>
                    <span className="text-[10px] text-slate-600">Ticket Logged</span>
                  </div>

                  {/* Step 2: Assigned */}
                  <div className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                        activeComplaint.status !== 'submitted'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {activeComplaint.status !== 'submitted' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        '2'
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 mt-1.5">Assigned</span>
                    <span className="text-[10px] text-slate-600">
                      {activeComplaint.assignedTechnicianName || 'Pending tech'}
                    </span>
                  </div>

                  {/* Step 3: In Progress */}
                  <div className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                        activeComplaint.status === 'in_progress' || activeComplaint.status === 'resolved'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {activeComplaint.status === 'resolved' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        '3'
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 mt-1.5">In Progress</span>
                    <span className="text-[10px] text-slate-600">Work Underway</span>
                  </div>

                  {/* Step 4: Resolved */}
                  <div className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                        activeComplaint.status === 'resolved'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {activeComplaint.status === 'resolved' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        '4'
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 mt-1.5">Resolved</span>
                    <span className="text-[10px] text-slate-600">Sign-off</span>
                  </div>
                </div>
              </div>

              {activeComplaint.technicianNotes && (
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-700">
                  <span className="font-semibold text-slate-900">Latest Technician Note: </span>
                  {activeComplaint.technicianNotes}
                </div>
              )}
            </div>
          ) : (
            <div className="py-10 text-center bg-slate-50/50 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">No Pending Maintenance Issues</p>
              <p className="text-[11px] text-slate-600 max-w-sm mx-auto mt-1">
                Your room has no active complaints. Notice any plumbing, electrical, or Wi-Fi glitch?
              </p>
              <button
                onClick={() => onNavigateTab('complaints')}
                className="mt-3 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Report an Issue
              </button>
            </div>
          )}
        </div>

        {/* Right 1 Col: Campus Announcements */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Megaphone className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Campus Circulars</h2>
            </div>
            <button
              onClick={() => onNavigateTab('announcements')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              All
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {announcements.slice(0, 3).map((ann) => (
              <div
                key={ann.id}
                className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase ${
                      ann.priority === 'urgent'
                        ? 'bg-rose-100 text-rose-700'
                        : ann.priority === 'important'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {ann.priority}
                  </span>
                  <span className="text-[10px] text-slate-600">
                    {new Date(ann.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{ann.title}</h3>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {ann.content}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Health Assistant Banner */}
          <div
            onClick={() => onNavigateTab('health')}
            className="mt-4 p-3.5 rounded-xl bg-gradient-to-tr from-rose-500/10 to-purple-500/10 border border-rose-200/80 cursor-pointer hover:bg-rose-50/70 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <HeartPulse className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">Feeling Unwell?</p>
                <p className="text-[10px] text-slate-600">
                  Instant symptom triage with Gemini AI
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-rose-600" />
          </div>
        </div>
      </div>
    </div>
  );
};
