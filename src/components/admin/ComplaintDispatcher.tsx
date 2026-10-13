import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import { Complaint, ComplaintPriority, ComplaintCategory } from '../../types';
import {
  Wrench,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Filter,
  Check,
  ChevronRight,
  ShieldCheck,
  Star,
} from 'lucide-react';

export const ComplaintDispatcher: React.FC = () => {
  const { complaints, technicians, assignComplaint } = useHostel();

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [assignModalComplaint, setAssignModalComplaint] = useState<Complaint | null>(null);
  const [selectedTechId, setSelectedTechId] = useState<string>(technicians[0]?.id || '');
  const [assignLoading, setAssignLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredComplaints = complaints.filter((c) => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (filterCategory !== 'all' && c.category !== filterCategory) return false;
    return true;
  });

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalComplaint || !selectedTechId) return;

    setAssignLoading(true);
    try {
      await assignComplaint(assignModalComplaint.id, selectedTechId);
      setAssignModalComplaint(null);
    } catch (e: any) {
      alert(e.message || 'Assignment failed');
    } finally {
      setAssignLoading(false);
    }
  };

  const getPriorityBadge = (p: ComplaintPriority) => {
    switch (p) {
      case 'emergency':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'submitted':
        return 'bg-rose-100 text-rose-800 font-bold';
      case 'assigned':
        return 'bg-indigo-100 text-indigo-800 font-bold';
      case 'in_progress':
        return 'bg-amber-100 text-amber-800 font-bold';
      case 'resolved':
        return 'bg-emerald-100 text-emerald-800 font-bold';
      default:
        return 'bg-slate-100 text-slate-800 font-bold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Maintenance & Complaint Dispatch Desk</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
              FACILITIES SLA
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Triage residential issues, dispatch certified technicians, and monitor work order SLA resolution
          </p>
        </div>
      </div>

      {/* Technician Staff Workload Summary */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
          <User className="w-4 h-4 text-blue-600" />
          <span>Active Maintenance Technician Roster & Live Workloads</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {technicians.map((t) => (
            <div
              key={t.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-900 block">{t.name}</span>
                <span className="text-[11px] text-slate-600 uppercase font-semibold">
                  {t.trade} Specialist
                </span>
                <p className="text-[10px] text-slate-600 mt-0.5">{t.phone}</p>
              </div>

              <div className="text-right">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    t.activeComplaintsCount === 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {t.activeComplaintsCount} Active Orders
                </span>
                <p className="text-[10px] text-slate-600 mt-1 font-mono">
                  {t.resolvedComplaintsCount} completed
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'submitted', 'assigned', 'in_progress', 'resolved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'submitted' ? 'Unassigned' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
        >
          <option value="all">All Facility Trades</option>
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="wifi">Wi-Fi & Network</option>
          <option value="furniture">Furniture</option>
          <option value="cleaning">Housekeeping</option>
        </select>
      </div>

      {/* Work Order Cards Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
          <span>Active Campus Work Orders</span>
          <span className="font-mono text-slate-600">
            {filteredComplaints.length} Records Shown
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredComplaints.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-600">
              No matching complaints for this filter
            </div>
          ) : (
            filteredComplaints.map((c) => (
              <div
                key={c.id}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {c.photoUrl ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={c.photoUrl}
                        alt="Damage"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                      <Wrench className="w-5 h-5" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {c.complaintNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${getPriorityBadge(c.priority)}`}>
                        {c.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${getStatusBadge(c.status)}`}>
                        {c.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-600 font-semibold">
                        Room {c.roomNumber} ({c.blockName})
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                    <p className="text-xs text-slate-600 mt-0.5 max-w-xl leading-relaxed">
                      {c.description}
                    </p>
                    <div className="mt-1 text-[11px] text-slate-600">
                      Reported by <span className="font-semibold text-slate-800">{c.studentName}</span> ({c.studentRoll})
                    </div>
                  </div>
                </div>

                {/* Right Dispatch Controller */}
                <div className="flex items-center gap-3 shrink-0">
                  {c.assignedTechnicianName ? (
                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-900 block">
                        Assigned: {c.assignedTechnicianName}
                      </span>
                      <span className="text-[10px] text-slate-600">{c.technicianPhone}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setAssignModalComplaint(c);
                        const matchTech = technicians.find((t) => t.trade === c.category);
                        setSelectedTechId(matchTech ? matchTech.id : technicians[0]?.id || '');
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Assign Technician</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedComplaint(c)}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    title="View details & timeline"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Assign Modal */}
      {assignModalComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Dispatch Technician for {assignModalComplaint.complaintNumber}
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Category: <span className="font-bold uppercase">{assignModalComplaint.category}</span> • Room: {assignModalComplaint.roomNumber}
            </p>

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-2">
                  Select Maintenance Staff
                </label>
                <div className="space-y-2">
                  {technicians.map((t) => {
                    const isTradeMatch = t.trade === assignModalComplaint.category;

                    return (
                      <label
                        key={t.id}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          selectedTechId === t.id
                            ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-500'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="tech"
                            checked={selectedTechId === t.id}
                            onChange={() => setSelectedTechId(t.id)}
                            className="text-blue-600"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{t.name}</span>
                            <span className="text-[10px] text-slate-600 uppercase font-semibold">
                              {t.trade} Specialist
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {t.activeComplaintsCount} active
                          </span>
                          {isTradeMatch && (
                            <span className="block text-[9px] font-bold text-emerald-600 mt-0.5">
                              Recommended Trade
                            </span>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssignModalComplaint(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assignLoading}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-xs disabled:opacity-50"
                >
                  {assignLoading ? 'Dispatching...' : 'Confirm Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspector Drawer Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">
                  {selectedComplaint.complaintNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedComplaint.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {selectedComplaint.description}
              </p>

              {selectedComplaint.photoUrl && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Attached Evidence Photo
                  </label>
                  <img
                    src={selectedComplaint.photoUrl}
                    alt="Damage"
                    className="w-full rounded-xl border border-slate-200 max-h-60 object-cover"
                  />
                </div>
              )}

              {selectedComplaint.resolutionDetails && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                  <span className="font-bold block mb-1">Technician Resolution Report:</span>
                  <p>{selectedComplaint.resolutionDetails}</p>
                </div>
              )}

              {/* Timeline */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Full Audit History
                </label>
                <div className="space-y-2.5 relative pl-4 border-l-2 border-slate-200 text-xs">
                  {selectedComplaint.timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                      <div className="font-bold text-slate-800 capitalize">
                        {step.step.replace('_', ' ')}
                      </div>
                      <div className="text-[10px] text-slate-600">
                        {step.actor} • {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {step.note && <p className="text-[11px] text-slate-600 mt-0.5">{step.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
