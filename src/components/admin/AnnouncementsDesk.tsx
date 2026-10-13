import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import { Announcement } from '../../types';
import {
  Megaphone,
  Plus,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AnnouncementsDesk: React.FC = () => {
  const { announcements, createAnnouncement } = useHostel();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<Announcement['priority']>('important');
  const [category, setCategory] = useState<Announcement['category']>('hostel');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    createAnnouncement({
      title,
      content,
      priority,
      category,
      authorName: 'Chief Warden Office',
      authorRole: 'Admin',
    });

    setToastMessage('Circular broadcasted to all students and staff!');
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Campus Circulars & Broadcast Desk</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
              OFFICIAL NOTICES
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Post campus maintenance alerts, dining notifications, and emergency circulars
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

      {/* Grid: Broadcast Creator on left, Active Broadcasts on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Creator Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs h-fit">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
            <Megaphone className="w-4 h-4 text-rose-600" />
            <h2 className="text-sm font-bold text-slate-900">Compose New Broadcast</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Notice Headline</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Overhead Water Tank Cleaning"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="urgent">Urgent Alert</option>
                  <option value="important">Important Notice</option>
                  <option value="general">General Circular</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Domain</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="hostel">Hostel & Living</option>
                  <option value="mess">Mess & Dining</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="sports">Gym & Sports</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Detailed Message</label>
              <textarea
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the full notice text, including specific dates, timings, and resident instructions..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Notice</span>
            </button>
          </form>
        </div>

        {/* Existing Announcements List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              Published Circulars ({announcements.length})
            </span>
            <span className="text-[11px] text-slate-600">Visible to all residents</span>
          </div>

          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2 hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      ann.priority === 'urgent'
                        ? 'bg-rose-100 text-rose-800'
                        : ann.priority === 'important'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {ann.priority}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {ann.category}
                  </span>
                </div>
                <span className="text-[10px] text-slate-600">
                  {new Date(ann.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{ann.title}</h3>
              <p className="text-xs text-slate-700 leading-relaxed">{ann.content}</p>

              <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-600 flex items-center justify-between">
                <span>
                  Author: <strong className="text-slate-700">{ann.authorName}</strong> ({ann.authorRole})
                </span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Broadcast Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
