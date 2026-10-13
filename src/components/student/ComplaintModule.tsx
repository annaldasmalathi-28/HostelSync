import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHostel } from '../../context/HostelContext';
import { ComplaintCategory, ComplaintPriority, Complaint } from '../../types';
import { categorizeComplaintWithAI } from '../../services/api';
import {
  Wrench,
  Plus,
  Sparkles,
  Camera,
  CheckCircle2,
  Clock,
  AlertCircle,
  Star,
  User,
  Phone,
  FileText,
  Upload,
  Image as ImageIcon,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const ComplaintModule: React.FC = () => {
  const { currentUser } = useAuth();
  const { complaints, submitComplaint, rateComplaint } = useHostel();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('plumbing');
  const [priority, setPriority] = useState<ComplaintPriority>('medium');
  const [roomNumber, setRoomNumber] = useState(currentUser?.roomNumber || 'A-204');
  const [blockName, setBlockName] = useState(currentUser?.blockName || 'Block A (Einstein Boys)');
  const [photoUrl, setPhotoUrl] = useState<string>('');

  const [aiLoading, setAiLoading] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter student's complaints
  const myComplaints = complaints.filter((c) => c.studentId === currentUser?.id);
  const filteredList = myComplaints.filter((c) => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    return true;
  });

  // Pre-configured sample photos for quick testing
  const samplePhotos = [
    {
      label: 'Washroom Leaking Tap',
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Sparking Wall Socket',
      url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Damaged Wooden Desk',
      url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleAiAnalyze = async () => {
    if (!description.trim()) {
      alert('Please write a brief description of the issue first so the AI can analyze it.');
      return;
    }

    setAiLoading(true);
    try {
      const result = await categorizeComplaintWithAI(title, description);
      if (result.category) {
        setCategory(result.category as ComplaintCategory);
      }
      if (result.priority) {
        setPriority(result.priority as ComplaintPriority);
      }
      if (result.suggestedTitle && !title) {
        setTitle(result.suggestedTitle);
      }
      if (result.safetyTip) {
        setAiTip(result.safetyTip);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setSubmitting(true);
    try {
      const created = await submitComplaint({
        studentId: currentUser?.id || 'std-unknown',
        studentName: currentUser?.name || 'Student',
        studentRoll: currentUser?.studentId || 'CS2026',
        blockName,
        roomNumber,
        category,
        priority,
        title,
        description,
        photoUrl: photoUrl || undefined,
      });

      setSuccessToast(`Ticket #${created.complaintNumber} registered successfully!`);
      setIsFormOpen(false);
      setTitle('');
      setDescription('');
      setPhotoUrl('');
      setAiTip(null);
      setSelectedComplaint(created);
    } catch (e: any) {
      alert(e.message || 'Failed to submit complaint.');
    } finally {
      setSubmitting(false);
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
      case 'low':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-indigo-100 text-indigo-800';
      case 'in_progress':
        return 'bg-amber-100 text-amber-800';
      case 'resolved':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Maintenance & Complaints Tracker</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              FACILITIES SLA
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Report residential issues with photos, track technician dispatch, and verify resolutions
          </p>
        </div>

        <button
          onClick={() => {
            setIsFormOpen(true);
            setSelectedComplaint(null);
          }}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Issue</span>
        </button>
      </div>

      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="font-bold text-emerald-700">
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Complaint List on left, Detail Drawer on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Complaints List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(['all', 'submitted', 'assigned', 'in_progress', 'resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  filterStatus === st
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          {filteredList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">No complaints registered</p>
              <p className="text-xs text-slate-600 mt-1">
                Have a plumbing, electrical, or Wi-Fi problem? Click "Report New Issue" above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredList.map((cmp) => {
                const isSelected = selectedComplaint?.id === cmp.id;

                return (
                  <div
                    key={cmp.id}
                    onClick={() => setSelectedComplaint(cmp)}
                    className={`bg-white rounded-2xl border p-4 transition-all cursor-pointer shadow-xs hover:shadow-md ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-mono text-xs font-bold text-slate-900">
                            {cmp.complaintNumber}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getPriorityBadge(
                              cmp.priority
                            )}`}
                          >
                            {cmp.priority.toUpperCase()}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(
                              cmp.status
                            )}`}
                          >
                            {cmp.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-[10px] text-slate-600">
                            Room {cmp.roomNumber} ({cmp.blockName})
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900">{cmp.title}</h3>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                          {cmp.description}
                        </p>
                      </div>

                      {cmp.photoUrl && (
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          <img
                            src={cmp.photoUrl}
                            alt="Damage evidence"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                      <div>
                        {cmp.assignedTechnicianName ? (
                          <span className="text-blue-600 font-semibold">
                            Assigned to: {cmp.assignedTechnicianName}
                          </span>
                        ) : (
                          <span>Awaiting technician dispatch</span>
                        )}
                      </div>
                      <span className="flex items-center gap-1 font-medium text-slate-600">
                        Details <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Detailed Timeline Inspector */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs h-fit">
          {selectedComplaint ? (
            <div className="space-y-5">
              <div className="pb-3 border-b border-slate-200">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600">
                    {selectedComplaint.complaintNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(
                      selectedComplaint.status
                    )}`}
                  >
                    {selectedComplaint.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedComplaint.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Photo Preview */}
              {selectedComplaint.photoUrl && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Damage Photo Attachment
                  </label>
                  <div className="rounded-xl overflow-hidden border border-slate-200 max-h-48">
                    <img
                      src={selectedComplaint.photoUrl}
                      alt="Complaint attachment"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Technician Contact card */}
              {selectedComplaint.assignedTechnicianName && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Assigned Technician</span>
                  </div>
                  <p className="font-semibold text-slate-900">
                    {selectedComplaint.assignedTechnicianName}
                  </p>
                  {selectedComplaint.technicianPhone && (
                    <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-600" />
                      <span>{selectedComplaint.technicianPhone}</span>
                    </p>
                  )}
                  {selectedComplaint.technicianNotes && (
                    <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-700">
                      <span className="font-bold">Work Note: </span>
                      {selectedComplaint.technicianNotes}
                    </div>
                  )}
                </div>
              )}

              {/* Resolution details if resolved */}
              {selectedComplaint.status === 'resolved' && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Resolution Summary</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {selectedComplaint.resolutionDetails || 'Maintenance work completed and verified.'}
                  </p>

                  {/* Rating widget */}
                  <div className="mt-3 pt-2.5 border-t border-emerald-200/60">
                    <span className="text-[11px] font-bold text-emerald-950 block mb-1">
                      Rate Resolution Quality:
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => rateComplaint(selectedComplaint.id, star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              (selectedComplaint.rating || 0) >= star
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Visual 4-Step Timeline Stepper */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Complaint History Timeline
                </label>
                <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 text-xs">
                  {selectedComplaint.timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                      <div className="font-bold text-slate-800 capitalize">
                        {step.step.replace('_', ' ')}
                      </div>
                      <div className="text-[10px] text-slate-600">
                        {step.actor} • {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {step.note && (
                        <p className="text-[11px] text-slate-600 mt-0.5 bg-slate-50 p-1.5 rounded-md border border-slate-100">
                          {step.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-600 text-xs">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No ticket selected</p>
              <p className="text-[11px] mt-1">Select a complaint from the list to view live timeline</p>
            </div>
          )}
        </div>
      </div>

      {/* New Complaint Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Report Maintenance Issue</h2>
                <p className="text-[11px] text-slate-600">Dispatched directly to Facilities & Wardens</p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Washroom tap valve leaking water continuously"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Issue Description</label>
                  <button
                    type="button"
                    onClick={handleAiAnalyze}
                    disabled={aiLoading || !description}
                    className="flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    <span>{aiLoading ? 'Analyzing...' : 'Auto-Categorize with AI'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what is broken, when it started, and exact location inside the room..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {aiTip && (
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-[11px] flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Gemini Safety Tip: </span>
                    {aiTip}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="wifi">Wi-Fi & Internet</option>
                    <option value="furniture">Furniture / Carpentry</option>
                    <option value="cleaning">Cleaning / Sanitation</option>
                    <option value="appliance">Appliance</option>
                    <option value="other">Other Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="low">Low (Cosmetic)</option>
                    <option value="medium">Medium (Standard)</option>
                    <option value="high">High (Urgent Repair)</option>
                    <option value="emergency">Emergency (Flooding/Sparking)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room Number</label>
                  <input
                    type="text"
                    required
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hostel Block</label>
                  <input
                    type="text"
                    required
                    value={blockName}
                    onChange={(e) => setBlockName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Photo Upload & Quick Picks */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Attach Photo Evidence
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-600">Quick Samples:</span>
                  {samplePhotos.map((sp, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoUrl(sp.url)}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-700 font-medium"
                    >
                      {sp.label}
                    </button>
                  ))}
                </div>

                {photoUrl && (
                  <div className="mt-2 relative w-20 h-20 rounded-xl overflow-hidden border border-slate-300">
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Registering Ticket...' : 'Submit Complaint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
