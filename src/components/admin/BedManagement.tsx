import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  Bed,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  User,
  AlertCircle,
  Check,
  X,
  Filter,
} from 'lucide-react';

export const BedManagement: React.FC = () => {
  const {
    blocks,
    rooms,
    beds,
    bedRequests,
    approveBedRequest,
    rejectBedRequest,
  } = useHostel();

  const [activeTab, setActiveTab] = useState<'requests' | 'inventory'>('requests');
  const [rejectModalReqId, setRejectModalReqId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Room capacity allocated to senior batch students.');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const pendingRequests = bedRequests.filter((r) => r.status === 'pending');
  const pastRequests = bedRequests.filter((r) => r.status !== 'pending');

  const handleApprove = async (reqId: string) => {
    setActionLoading(reqId);
    try {
      await approveBedRequest(reqId, 'Approved by Chief Warden Office');
      setToastMessage('Bed allocation approved! Student notified.');
    } catch (e: any) {
      alert(e.message || 'Approval failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModalReqId) return;
    setActionLoading(rejectModalReqId);
    try {
      await rejectBedRequest(rejectModalReqId, rejectReason);
      setToastMessage('Bed request declined.');
      setRejectModalReqId(null);
    } catch (e: any) {
      alert(e.message || 'Rejection failed');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Bed Allocation & Room Desk</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
              {pendingRequests.length} PENDING VERIFICATION
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Review incoming student bed reservation requests, enforce eligibility, and inspect room occupancy
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'requests'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Requests ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'inventory'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Beds ({beds.length})
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

      {/* Tab 1: Pending Bed Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">No pending bed requests</p>
              <p className="text-xs text-slate-600 mt-1">
                All student room allocation submissions have been processed.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Incoming Bed Requests Requiring Warden Approval</span>
                <span className="font-mono text-indigo-600">
                  {pendingRequests.length} Action Items
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                        <Bed className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-900">{req.studentName}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                            {req.studentRoll}
                          </span>
                          <span className="text-[10px] text-slate-600">
                            Requested on {new Date(req.requestedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-700">
                          Target Bed:{' '}
                          <span className="font-mono font-bold text-blue-600">{req.bedNumber}</span>{' '}
                          in Room <span className="font-semibold">{req.roomNumber}</span> (
                          {req.blockName})
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApprove(req.id)}
                        disabled={actionLoading === req.id}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-all"
                      >
                        <Check className="w-4 h-4" />
                        <span>{actionLoading === req.id ? 'Approving...' : 'Approve Bed'}</span>
                      </button>

                      <button
                        onClick={() => setRejectModalReqId(req.id)}
                        disabled={actionLoading === req.id}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-semibold text-xs border border-slate-200 transition-all flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Requests History */}
          {pastRequests.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 mb-3">Recent Allocation History</h3>
              <div className="space-y-2 text-xs">
                {pastRequests.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-slate-700"
                  >
                    <div>
                      <span className="font-bold">{r.studentName}</span> ({r.studentRoll}) — Bed{' '}
                      <span className="font-mono font-bold">{r.bedNumber}</span> ({r.blockName})
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        r.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Complete Bed Inventory */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800">
            Hostel Residential Bed Master Inventory
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold">Bed Number</th>
                  <th className="px-4 py-3 font-bold">Hostel Block</th>
                  <th className="px-4 py-3 font-bold">Room</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Current Occupant / Student</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {beds.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{b.bedNumber}</td>
                    <td className="px-4 py-3 text-slate-700">{b.blockName}</td>
                    <td className="px-4 py-3 font-mono text-slate-800">{b.roomNumber}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.status === 'occupied'
                            ? 'bg-blue-100 text-blue-800'
                            : b.status === 'reserved'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {b.currentStudentName ? (
                        <span className="font-semibold text-slate-900">
                          {b.currentStudentName} ({b.currentStudentRoll})
                        </span>
                      ) : b.requestedStudentName ? (
                        <span className="text-amber-700 font-semibold">
                          Requested: {b.requestedStudentName} ({b.requestedStudentRoll})
                        </span>
                      ) : (
                        <span className="text-slate-600 font-medium">Available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalReqId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Decline Bed Allocation</h3>
            <p className="text-xs text-slate-600 mb-3">
              Please enter the reason that will be communicated to the student:
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectModalReqId(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
