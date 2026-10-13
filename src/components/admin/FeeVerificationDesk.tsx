import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import { FeeReceipt, FeeRecord } from '../../types';
import {
  Receipt,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Check,
  X,
  FileText,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

export const FeeVerificationDesk: React.FC = () => {
  const { feeRecords, verifyFeeReceipt } = useHostel();

  const [inspectReceipt, setInspectReceipt] = useState<{
    record: FeeRecord;
    receipt: FeeReceipt;
  } | null>(null);
  const [remarks, setRemarks] = useState('Reconciled with bank credit ledger.');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('Transaction reference not reflecting in bank statement.');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Extract all receipts across all student records
  const allReceiptItems = feeRecords.flatMap((record) =>
    record.receipts.map((rcp) => ({
      record,
      receipt: rcp,
    }))
  );

  const pendingItems = allReceiptItems.filter((i) => i.receipt.status === 'pending');
  const processedItems = allReceiptItems.filter((i) => i.receipt.status !== 'pending');

  const handleApprove = async () => {
    if (!inspectReceipt) return;
    setLoading(true);
    try {
      await verifyFeeReceipt(
        inspectReceipt.record.id,
        inspectReceipt.receipt.id,
        true,
        remarks,
        'Accounts Officer (Chief Warden Desk)'
      );
      setToastMessage(
        `Receipt ${inspectReceipt.receipt.transactionRef} for ₹${inspectReceipt.receipt.amountPaid.toLocaleString()} verified successfully!`
      );
      setInspectReceipt(null);
    } catch (e: any) {
      alert(e.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!inspectReceipt) return;
    setLoading(true);
    try {
      await verifyFeeReceipt(
        inspectReceipt.record.id,
        inspectReceipt.receipt.id,
        false,
        rejectReason,
        'Accounts Officer (Chief Warden Desk)'
      );
      setToastMessage(`Receipt marked rejected. Audit note logged.`);
      setInspectReceipt(null);
      setRejectModalOpen(false);
    } catch (e: any) {
      alert(e.message || 'Rejection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Student Fee Audit & Verification Desk</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              {pendingItems.length} PENDING AUDIT
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Audit student bank transfer proofs, reconcile UTR transaction numbers, and approve ledger credits
          </p>
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

      {/* Pending Receipts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
          <span>Fee Receipts Awaiting Financial Verification</span>
          <span className="font-mono text-amber-700">
            {pendingItems.length} Submissions
          </span>
        </div>

        {pendingItems.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-600">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-slate-800">All student receipts have been verified</p>
            <p className="text-[11px] mt-1">No unverified receipts pending in queue.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingItems.map(({ record, receipt }) => (
              <div
                key={receipt.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    onClick={() => setInspectReceipt({ record, receipt })}
                    className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer shrink-0 hover:opacity-90"
                    title="Click to zoom receipt"
                  >
                    <img
                      src={receipt.receiptFileUrl}
                      alt="Receipt"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-sm text-slate-900">
                        {record.studentName}
                      </span>
                      <span className="font-mono font-bold text-xs text-blue-600 px-2 py-0.5 rounded bg-blue-50">
                        {record.studentRoll}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 uppercase">
                        {receipt.paymentMode}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 mt-1">
                      UTR / Reference:{' '}
                      <span className="font-mono font-bold text-slate-900">
                        {receipt.transactionRef}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-600">
                      <span>
                        Amount: <strong className="font-mono text-emerald-700 font-bold text-xs">₹{receipt.amountPaid.toLocaleString()}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Uploaded: {new Date(receipt.uploadedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setInspectReceipt({ record, receipt });
                      setRemarks(`Verified against bank credit ledger #${receipt.transactionRef}`);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Review & Reconcile</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Processed Receipts */}
      {processedItems.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-xs font-bold text-slate-800 mb-3">Reconciliation Audit Archive</h3>
          <div className="space-y-2 text-xs">
            {processedItems.map(({ record, receipt }) => (
              <div
                key={receipt.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900">{record.studentName}</span> (
                  {record.studentRoll}) — ₹{receipt.amountPaid.toLocaleString()} via{' '}
                  <span className="font-mono">{receipt.transactionRef}</span>
                  {receipt.adminRemarks && (
                    <span className="text-[10px] text-slate-600 block mt-0.5">
                      Audit Note: {receipt.adminRemarks}
                    </span>
                  )}
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    receipt.status === 'verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {receipt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inspection Modal */}
      {inspectReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Verify Payment Receipt: {inspectReceipt.record.studentName}
                </h3>
                <p className="text-[11px] text-slate-600 font-mono">
                  Roll: {inspectReceipt.record.studentRoll} • Term: {inspectReceipt.record.academicTerm}
                </p>
              </div>
              <button
                onClick={() => setInspectReceipt(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              {/* Receipt Image Zoom */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Submitted Proof Document:
                </label>
                <div className="rounded-xl overflow-hidden border border-slate-300 max-h-72 bg-slate-100">
                  <img
                    src={inspectReceipt.receipt.receiptFileUrl}
                    alt="Receipt inspection"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Transaction details card */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-600">Claimed Amount:</span>
                  <span className="font-mono font-bold text-sm text-slate-900">
                    ₹{inspectReceipt.receipt.amountPaid.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Payment Channel:</span>
                  <span className="font-semibold uppercase text-slate-800">
                    {inspectReceipt.receipt.paymentMode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">UTR / Ref:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {inspectReceipt.receipt.transactionRef}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Accountant Ledger Audit Remarks
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(true)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200"
                >
                  Reject Proof
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInspectReceipt(null)}
                    className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleApprove}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-xs flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{loading ? 'Crediting...' : 'Approve & Credit Fee'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Confirmation */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Decline Fee Receipt</h3>
            <p className="text-xs text-slate-600 mb-3">
              State the reason so the student can re-upload valid bank transfer documentation:
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 mb-4"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
              >
                Back
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold"
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
