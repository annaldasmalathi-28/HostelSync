import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHostel } from '../../context/HostelContext';
import { Complaint, ComplaintPriority } from '../../types';
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Camera,
  Play,
  Check,
  Phone,
  User,
  Star,
  FileText,
} from 'lucide-react';

export const TechnicianDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { complaints, updateComplaintProgress, resolveComplaint } = useHostel();

  // Filter complaints assigned to this technician
  const myAssignedComplaints = complaints.filter(
    (c) => c.assignedTechnicianId === currentUser?.id
  );

  const [activeTab, setActiveTab] = useState<'assigned' | 'in_progress' | 'resolved'>('assigned');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Progress Note modal
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [progressNote, setProgressNote] = useState('Inspected site. Sourced required replacement materials.');

  // Resolution modal
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolutionDetails, setResolutionDetails] = useState('Replaced damaged fixture with new OEM part. Tested operation and leak-free.');
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredOrders = myAssignedComplaints.filter((c) => {
    if (activeTab === 'assigned') return c.status === 'assigned';
    if (activeTab === 'in_progress') return c.status === 'in_progress';
    if (activeTab === 'resolved') return c.status === 'resolved';
    return true;
  });

  const handleStartWork = async (c: Complaint) => {
    setSelectedComplaint(c);
    setProgressModalOpen(true);
  };

  const handleSaveProgress = async () => {
    if (!selectedComplaint) return;
    setActionLoading(true);
    try {
      await updateComplaintProgress(selectedComplaint.id, progressNote);
      setToastMessage(`Work in progress logged for ${selectedComplaint.complaintNumber}!`);
      setProgressModalOpen(false);
    } catch (e: any) {
      alert(e.message || 'Update failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkResolved = async () => {
    if (!selectedComplaint) return;
    setActionLoading(true);
    try {
      await resolveComplaint(selectedComplaint.id, resolutionDetails);
      setToastMessage(`Ticket ${selectedComplaint.complaintNumber} marked resolved! Student notified.`);
      setResolveModalOpen(false);
      setSelectedComplaint(null);
    } catch (e: any) {
      alert(e.message || 'Resolution failed');
    } finally {
      setActionLoading(false);
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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Technician Work Orders Console</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
              {currentUser?.trade || 'GENERAL'} MAINTENANCE
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Logged in as <strong className="text-slate-800">{currentUser?.name}</strong> • View assigned complaints, record inspection progress, and log parts replaced
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('assigned')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'assigned'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Assigned (
            {myAssignedComplaints.filter((c) => c.status === 'assigned').length}
            )
          </button>
          <button
            onClick={() => setActiveTab('in_progress')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'in_progress'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Progress (
            {myAssignedComplaints.filter((c) => c.status === 'in_progress').length}
            )
          </button>
          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'resolved'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resolved (
            {myAssignedComplaints.filter((c) => c.status === 'resolved').length}
            )
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Main List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">
              No work orders in this section
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Check the other tabs or wait for the warden to dispatch new maintenance tickets.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {order.complaintNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] border ${getPriorityBadge(
                            order.priority
                          )}`}
                        >
                          {order.priority.toUpperCase()}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                          {order.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{order.title}</h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-extrabold text-sm text-blue-600 block">
                        Room {order.roomNumber}
                      </span>
                      <span className="text-[10px] text-slate-600">{order.blockName}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    {order.description}
                  </p>

                  {/* Photo Preview if attached */}
                  {order.photoUrl && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <img
                          src={order.photoUrl}
                          alt="Evidence"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[11px] text-slate-600">
                        Photo evidence uploaded by student
                      </span>
                    </div>
                  )}

                  {/* Student info */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      {order.studentName} ({order.studentRoll})
                    </span>
                    <span>
                      Reported:{' '}
                      {new Date(order.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {order.technicianNotes && (
                    <div className="mt-3 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                      <span className="font-bold">Your Progress Note: </span>
                      {order.technicianNotes}
                    </div>
                  )}

                  {order.resolutionDetails && (
                    <div className="mt-3 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900">
                      <span className="font-bold">Resolution Recorded: </span>
                      {order.resolutionDetails}
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedComplaint(order)}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View Timeline
                  </button>

                  <div className="flex items-center gap-2">
                    {order.status === 'assigned' && (
                      <button
                        onClick={() => handleStartWork(order)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-xs flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" />
                        <span>Start Work</span>
                      </button>
                    )}

                    {order.status === 'in_progress' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedComplaint(order);
                            setProgressModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                        >
                          Add Note
                        </button>
                        <button
                          onClick={() => {
                            setSelectedComplaint(order);
                            setResolveModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Resolved</span>
                        </button>
                      </>
                    )}

                    {order.status === 'resolved' && (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Signed Off
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progress Note Modal */}
      {progressModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Start Work Order: {selectedComplaint.complaintNumber}
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              Room {selectedComplaint.roomNumber} ({selectedComplaint.blockName})
            </p>

            <div className="space-y-3 text-xs">
              <label className="block font-semibold text-slate-700">
                Inspection & In-Progress Work Notes (visible to student & warden)
              </label>
              <textarea
                rows={3}
                value={progressNote}
                onChange={(e) => setProgressNote(e.target.value)}
                placeholder="e.g. Inspected tap assembly. Replacing valve seat cartridge..."
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setProgressModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  disabled={actionLoading}
                  onClick={handleSaveProgress}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-xs"
                >
                  {actionLoading ? 'Updating...' : 'Set In-Progress'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resolution Details Modal */}
      {resolveModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Complete Resolution: {selectedComplaint.complaintNumber}
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              Mark {selectedComplaint.title} as fixed in Room {selectedComplaint.roomNumber}
            </p>

            <div className="space-y-3 text-xs">
              <label className="block font-semibold text-slate-700">
                Resolution Summary & Parts Replaced
              </label>
              <textarea
                rows={3}
                value={resolutionDetails}
                onChange={(e) => setResolutionDetails(e.target.value)}
                placeholder="e.g. Replaced faulty 16A modular socket. Tested grounding and load capacity. Verified by resident."
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setResolveModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  disabled={actionLoading}
                  onClick={handleMarkResolved}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-xs"
                >
                  {actionLoading ? 'Saving...' : 'Confirm Resolution'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Inspector Modal */}
      {selectedComplaint && !progressModalOpen && !resolveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                Ticket #{selectedComplaint.complaintNumber} Timeline
              </h3>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              {selectedComplaint.timeline.map((step, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 capitalize">
                      {step.step.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-600">
                      {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Actor: {step.actor}</div>
                  {step.note && (
                    <p className="text-[11px] text-slate-800 mt-1 bg-white p-1.5 rounded border border-slate-200">
                      {step.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
