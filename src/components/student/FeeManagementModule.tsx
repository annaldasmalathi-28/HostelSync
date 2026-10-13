import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHostel } from '../../context/HostelContext';
import { FeeReceipt } from '../../types';
import {
  Receipt,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Calendar,
  Image as ImageIcon,
  Check,
  ShieldCheck,
} from 'lucide-react';

export const FeeManagementModule: React.FC = () => {
  const { currentUser } = useAuth();
  const { feeRecords, uploadFeeReceipt } = useHostel();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentMode, setPaymentMode] = useState<FeeReceipt['paymentMode']>('upi');
  const [amountPaid, setAmountPaid] = useState<number>(38000);
  const [receiptFileUrl, setReceiptFileUrl] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Student's fee record
  const record = feeRecords.find((r) => r.studentId === currentUser?.id);

  const sampleReceipts = [
    {
      label: 'UPI Transfer Receipt',
      url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Bank NEFT Ack Slip',
      url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptFileUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef || !receiptFileUrl || !amountPaid) return;

    setSubmitting(true);
    try {
      await uploadFeeReceipt(
        currentUser?.id || 'std-1',
        currentUser?.studentId || 'CS2026',
        {
          studentId: currentUser?.id || 'std-1',
          studentRoll: currentUser?.studentId || 'CS2026',
          transactionRef,
          paymentMode,
          amountPaid: Number(amountPaid),
          receiptFileUrl,
        }
      );

      setSuccessToast('Receipt submitted! Accounts office will verify and update your ledger.');
      setIsUploadModalOpen(false);
      setTransactionRef('');
      setReceiptFileUrl('');
    } catch (e: any) {
      alert(e.message || 'Failed to submit receipt.');
    } finally {
      setSubmitting(false);
    }
  };

  const outstanding = record ? Math.max(0, record.totalAmount - record.paidAmount) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Hostel Fee Management & Receipts</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              AUDIT VERIFIED
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Transparent breakdown of room rent, mess charges, and payment proof verification
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Payment Receipt</span>
        </button>
      </div>

      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Fee Status Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-600 uppercase">Term Total Fee</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
            ₹{record ? record.totalAmount.toLocaleString() : '52,000'}
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            {record?.academicTerm || 'Autumn 2026'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-600 uppercase">Verified Payments</span>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">
            ₹{record ? record.paidAmount.toLocaleString() : '0'}
          </div>
          <p className="text-[11px] text-slate-600 mt-1">Bank credit reconciled</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-600 uppercase">Outstanding Balance</span>
          <div
            className={`text-2xl font-extrabold font-mono mt-1 ${
              outstanding > 0 ? 'text-rose-600' : 'text-slate-900'
            }`}
          >
            ₹{outstanding.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            Due by {record?.dueDate || '2026-10-30'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-600 uppercase">Account Status</span>
          <div className="mt-1">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase inline-block ${
                record?.status === 'paid'
                  ? 'bg-emerald-100 text-emerald-800'
                  : record?.status === 'pending_verification'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {record?.status?.replace('_', ' ') || 'UNPAID'}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            {record?.status === 'pending_verification'
              ? 'Receipt uploaded, awaiting admin review'
              : record?.status === 'paid'
              ? 'All dues settled'
              : 'Payment pending'}
          </p>
        </div>
      </div>

      {/* Breakdown and Receipt History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Fee Head Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Official Fee Breakdown</h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600">Room Accommodation Rent</span>
              <span className="font-mono font-bold text-slate-900">
                ₹{record?.breakdown.roomRent.toLocaleString() || '38,000'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600">Mess Dining Advance</span>
              <span className="font-mono font-bold text-slate-900">
                ₹{record?.breakdown.messAdvance.toLocaleString() || '10,000'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600">Refundable Caution Deposit</span>
              <span className="font-mono font-bold text-slate-900">
                ₹{record?.breakdown.cautionDeposit.toLocaleString() || '2,000'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600">Campus Amenities & Wi-Fi</span>
              <span className="font-mono font-bold text-slate-900">
                ₹{record?.breakdown.maintenance.toLocaleString() || '2,000'}
              </span>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
            <span className="font-bold">Official Campus Banking Details:</span>
            <p className="mt-0.5 font-mono text-[11px] text-blue-800">
              A/C: 982100492819 • IFSC: HDFC0001824 <br />
              UPI: <span className="font-semibold">hostel.fees@campus.sbi</span>
            </p>
          </div>
        </div>

        {/* Right 2 Cols: Submitted Receipts Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Payment Receipts & Verification Log</h2>

          {!record?.receipts || record.receipts.length === 0 ? (
            <div className="py-12 text-center text-slate-600 text-xs bg-slate-50 rounded-xl border border-slate-100">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-800">No payment receipts submitted yet</p>
              <p className="text-[11px] mt-1">
                Once you transfer semester fees, upload your transaction slip here for admin reconciliation.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {record.receipts.map((rcp) => (
                <div
                  key={rcp.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={rcp.receiptFileUrl}
                        alt="Receipt"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {rcp.transactionRef}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 uppercase">
                          {rcp.paymentMode}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                        ₹{rcp.amountPaid.toLocaleString()}
                      </div>
                      <p className="text-[10px] text-slate-600">
                        Uploaded on {new Date(rcp.uploadedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                        rcp.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : rcp.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {rcp.status === 'verified' ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      <span>
                        {rcp.status === 'verified' ? 'Verified by Admin' : 'Pending Verification'}
                      </span>
                    </span>

                    {rcp.adminRemarks && (
                      <p className="text-[10px] text-slate-600 mt-1 max-w-xs text-right">
                        Note: {rcp.adminRemarks}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Receipt Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Upload Fee Payment Receipt</h2>
                <p className="text-[11px] text-slate-600">Submitted directly to hostel accounts desk</p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Amount Transferred (₹)
                </label>
                <input
                  type="number"
                  required
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  placeholder="38000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="upi">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="neft">NEFT / RTGS Bank Transfer</option>
                  <option value="netbanking">Net Banking Portal</option>
                  <option value="challan">Bank Challan Deposit</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Transaction / UTR Reference ID
                </label>
                <input
                  type="text"
                  required
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. UPI-HDFC-992384110 or UTR2026101284"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              {/* File upload */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Attach Transaction Receipt Image
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />

                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-600">Quick Samples:</span>
                  {sampleReceipts.map((sr, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setReceiptFileUrl(sr.url)}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-700 font-medium"
                    >
                      {sr.label}
                    </button>
                  ))}
                </div>

                {receiptFileUrl && (
                  <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-slate-300">
                    <img
                      src={receiptFileUrl}
                      alt="Receipt preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !receiptFileUrl || !transactionRef}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Receipt for Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
