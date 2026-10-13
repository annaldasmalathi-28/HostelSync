import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHostel } from '../../context/HostelContext';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  Bed,
  Receipt,
  Wrench,
  CheckCircle2,
} from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const { availableUsers } = useAuth();
  const { feeRecords, complaints, beds } = useHostel();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('all');

  const students = availableUsers.filter((u) => u.role === 'student');

  const filteredStudents = students.filter((std) => {
    const matchesSearch =
      std.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (std.studentId && std.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      std.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedBlock !== 'all' && std.blockName && !std.blockName.includes(selectedBlock)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Resident Student Directory</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
              {students.length} REGISTERED
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Search student records, allocated rooms, parent emergency contacts, and fee statuses
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, roll number, email..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={selectedBlock}
          onChange={(e) => setSelectedBlock(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
        >
          <option value="all">All Hostel Wings</option>
          <option value="Block A">Block A (Einstein Boys)</option>
          <option value="Block B">Block B (Curie Girls)</option>
          <option value="Block C">Block C (Raman Tech)</option>
          <option value="Block D">Block D (Kalam PG)</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
              <tr>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Roll ID</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Hostel Wing & Room</th>
                <th className="px-4 py-3">Fee Status</th>
                <th className="px-4 py-3">Repairs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((std) => {
                const fee = feeRecords.find((r) => r.studentId === std.id);
                const studentComplaints = complaints.filter((c) => c.studentId === std.id);
                const bed = beds.find((b) => b.currentStudentId === std.id);

                return (
                  <tr key={std.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                          {std.avatarUrl ? (
                            <img
                              src={std.avatarUrl}
                              alt={std.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold">
                              {std.name[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{std.name}</span>
                          <span className="text-[11px] text-slate-600">{std.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono font-bold text-blue-600">
                      {std.studentId || 'UNREGISTERED'}
                    </td>

                    <td className="px-4 py-3 text-slate-700">{std.phone}</td>

                    <td className="px-4 py-3">
                      {bed ? (
                        <div>
                          <span className="font-mono font-bold text-slate-900 block">
                            Bed {bed.bedNumber}
                          </span>
                          <span className="text-[10px] text-slate-600">{bed.blockName}</span>
                        </div>
                      ) : (
                        <span className="text-amber-700 font-semibold text-[11px]">
                          Unallocated
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          fee?.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : fee?.status === 'pending_verification'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {fee?.status?.replace('_', ' ') || 'UNPAID'}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-slate-800">
                        {studentComplaints.length} tickets
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
