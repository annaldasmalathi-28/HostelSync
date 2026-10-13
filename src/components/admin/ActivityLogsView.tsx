import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import { Activity, Search, ShieldCheck } from 'lucide-react';

export const ActivityLogsView: React.FC = () => {
  const { activityLogs } = useHostel();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = activityLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.actorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">System Activity & Security Audit Logs</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
              IMMUTABLE AUDIT
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Full audit trail of all room allocations, maintenance dispatches, fee verifications, and tokens
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative max-w-sm mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search logs by actor, action, or details..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {filtered.map((log) => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-4 hover:bg-slate-50/50">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <p className="text-slate-700 mt-0.5 leading-relaxed">{log.details}</p>
                  <span className="text-[10px] text-slate-600">
                    Actor: <strong className="text-slate-800">{log.actorName}</strong> ({log.actorRole})
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0 font-mono text-[11px] text-slate-600">
                {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} •{' '}
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
