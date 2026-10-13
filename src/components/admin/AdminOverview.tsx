import React from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  Users,
  Bed,
  Wrench,
  UtensilsCrossed,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  ShieldAlert,
} from 'lucide-react';

interface AdminOverviewProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const {
    blocks,
    rooms,
    beds,
    bedRequests,
    complaints,
    canteenBookings,
    feeRecords,
    activityLogs,
  } = useHostel();

  // Metrics
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter((b) => b.status === 'occupied').length;
  const availableBeds = beds.filter((b) => b.status === 'available').length;
  const pendingBedRequests = bedRequests.filter((r) => r.status === 'pending').length;

  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const pendingComplaints = complaints.filter((c) => c.status === 'submitted').length;
  const inProgressComplaints = complaints.filter(
    (c) => c.status === 'assigned' || c.status === 'in_progress'
  ).length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'resolved').length;

  const totalFeeExpected = feeRecords.reduce((acc, r) => acc + r.totalAmount, 0);
  const totalFeeCollected = feeRecords.reduce((acc, r) => acc + r.paidAmount, 0);
  const pendingReceiptsCount = feeRecords
    .flatMap((r) => r.receipts)
    .filter((rc) => rc.status === 'pending').length;

  // Complaints by category
  const categories = ['plumbing', 'electrical', 'wifi', 'furniture', 'cleaning', 'other'] as const;
  const categoryCounts = categories.map((cat) => ({
    name: cat.toUpperCase(),
    count: complaints.filter((c) => c.category === cat).length,
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold mb-3 border border-violet-400/30">
            <Layers className="w-3.5 h-3.5" />
            <span>Chief Warden Central Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hostel Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time occupancy control, facility work orders, and student fee reconciliation
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          {pendingBedRequests > 0 && (
            <button
              onClick={() => onNavigateTab('beds')}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Bed className="w-4 h-4" />
              <span>{pendingBedRequests} Bed Requests</span>
            </button>
          )}

          {pendingComplaints > 0 && (
            <button
              onClick={() => onNavigateTab('complaints')}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Wrench className="w-4 h-4" />
              <span>{pendingComplaints} Unassigned Repairs</span>
            </button>
          )}

          {pendingReceiptsCount > 0 && (
            <button
              onClick={() => onNavigateTab('fees')}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Receipt className="w-4 h-4" />
              <span>{pendingReceiptsCount} Receipts Awaiting Audit</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupancy Card */}
        <div
          onClick={() => onNavigateTab('beds')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bed className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              {availableBeds} VACANT BEDS
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-600">Total Bed Occupancy</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">
            {occupancyRate}%
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            {occupiedBeds} occupied of {totalBeds} capacity
          </p>
        </div>

        {/* Complaints SLA Card */}
        <div
          onClick={() => onNavigateTab('complaints')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
              {pendingComplaints} UNASSIGNED
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-600">Active Work Orders</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">
            {pendingComplaints + inProgressComplaints}
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            {resolvedComplaints} resolved this term
          </p>
        </div>

        {/* Dining Reservations Card */}
        <div
          onClick={() => onNavigateTab('canteen_gym')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              MESS HALL
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-600">Canteen Meal Tokens</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">
            {canteenBookings.length}
          </div>
          <p className="text-[11px] text-slate-600 mt-1">Active tokens issued today</p>
        </div>

        {/* Fee Collection Card */}
        <div
          onClick={() => onNavigateTab('fees')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              {pendingReceiptsCount} PENDING
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-600">Reconciled Fee Collection</div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-0.5">
            ₹{totalFeeCollected.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            ₹{(totalFeeExpected - totalFeeCollected).toLocaleString()} pending
          </p>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Bed Occupancy across Hostel Blocks */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Bed Occupancy by Hostel Wing</h2>
              <p className="text-[11px] text-slate-600">Block distribution & capacity limits</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600">
              {occupiedBeds}/{totalBeds} Total Beds
            </span>
          </div>

          <div className="space-y-4">
            {blocks.map((blk) => {
              const blockRooms = rooms.filter((r) => r.blockId === blk.id);
              const blockBeds = beds.filter((b) => b.blockName.includes(blk.code.split('-')[1]));
              const total = blockBeds.length || 3;
              const occupied = blockBeds.filter((b) => b.status === 'occupied').length || 2;
              const pct = Math.round((occupied / total) * 100);

              return (
                <div key={blk.id}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-800">{blk.name}</span>
                    <span className="text-slate-600 font-mono">
                      {occupied} / {total} beds ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
                    <div
                      className="bg-blue-600 h-full transition-all duration-500 rounded-l-full"
                      style={{ width: `${pct}%` }}
                    />
                    <div
                      className="bg-emerald-400/50 h-full transition-all duration-500 rounded-r-full"
                      style={{ width: `${100 - pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-600" />
              <span>Occupied</span>
              <span className="w-3 h-3 rounded bg-emerald-400/50 ml-2" />
              <span>Available</span>
            </div>
            <button
              onClick={() => onNavigateTab('beds')}
              className="text-blue-600 hover:underline font-semibold"
            >
              Manage Allocations →
            </button>
          </div>
        </div>

        {/* Chart 2: Complaints by Category */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Complaints by Facility Category</h2>
              <p className="text-[11px] text-slate-600">Workload distribution across trades</p>
            </div>
            <span className="text-xs font-mono font-bold text-rose-600">
              {complaints.length} Total Tickets
            </span>
          </div>

          <div className="space-y-3">
            {categoryCounts.map((item) => {
              const max = Math.max(...categoryCounts.map((c) => c.count), 1);
              const widthPct = Math.min(100, Math.round((item.count / max) * 100));

              return (
                <div key={item.name} className="flex items-center gap-3 text-xs">
                  <span className="w-24 font-bold text-slate-700 truncate">{item.name}</span>
                  <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(widthPct, 6)}%` }}
                    />
                  </div>
                  <span className="w-6 font-mono font-bold text-slate-900 text-right">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>SLA Target: 24h resolution for plumbing & electrical</span>
            <button
              onClick={() => onNavigateTab('complaints')}
              className="text-blue-600 hover:underline font-semibold"
            >
              Dispatch Board →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Audit Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Campus Activity Audit Stream</h2>
          </div>
          <button
            onClick={() => onNavigateTab('logs')}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            View all logs
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {activityLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-2.5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900">{log.action}: </span>
                  <span className="text-slate-700">{log.details}</span>
                  <span className="text-[10px] text-slate-600 ml-1">
                    (by {log.actorName} - {log.actorRole})
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-slate-600 shrink-0 font-mono">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
