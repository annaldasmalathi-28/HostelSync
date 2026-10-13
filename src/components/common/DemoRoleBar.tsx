import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHostel } from '../../context/HostelContext';
import { Shield, GraduationCap, Wrench, RefreshCw } from 'lucide-react';

export const DemoRoleBar: React.FC = () => {
  const { currentUser, switchUser } = useAuth();
  const { resetAllData } = useHostel();

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-xs text-slate-300 py-1.5 px-3 md:px-6 flex flex-wrap items-center justify-between gap-2 z-50">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-slate-200">Demonstration Mode:</span>
        <span className="hidden sm:inline text-slate-400">
          Switch roles instantly to evaluate end-to-end workflows
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => switchUser('usr-student-1')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
            currentUser?.id === 'usr-student-1'
              ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title="Switch to Student Rahul Sharma (Room A-204, existing bed & complaints)"
        >
          <GraduationCap className="w-3.5 h-3.5 text-blue-300" />
          <span>Rahul (Student)</span>
        </button>

        <button
          onClick={() => switchUser('usr-student-3')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
            currentUser?.id === 'usr-student-3'
              ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title="Switch to Student Vikram Singh (Unallocated - Test bed booking!)"
        >
          <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
          <span>Vikram (New Student)</span>
        </button>

        <button
          onClick={() => switchUser('usr-admin-1')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
            currentUser?.id === 'usr-admin-1'
              ? 'bg-violet-600 text-white shadow-sm ring-1 ring-violet-400'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title="Switch to Chief Warden Dr. Henderson (Approve beds, assign complaints, verify fees)"
        >
          <Shield className="w-3.5 h-3.5 text-violet-300" />
          <span>Warden (Admin)</span>
        </button>

        <button
          onClick={() => switchUser('usr-tech-1')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
            currentUser?.id === 'usr-tech-1'
              ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title="Switch to Ramesh Kumar (Resolve assigned maintenance tickets)"
        >
          <Wrench className="w-3.5 h-3.5 text-amber-300" />
          <span>Ramesh (Technician)</span>
        </button>

        <button
          onClick={() => {
            if (window.confirm('Reset all demonstration data back to initial campus state?')) {
              resetAllData();
            }
          }}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 transition-colors ml-1"
          title="Reset sample data"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="hidden md:inline">Reset Data</span>
        </button>
      </div>
    </div>
  );
};
