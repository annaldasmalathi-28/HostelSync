import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  UtensilsCrossed,
  Dumbbell,
  Clock,
  Users,
  Edit2,
  Check,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const CanteenGymManager: React.FC = () => {
  const { canteenSlots, gymSessions, updateCanteenMenu } = useHostel();

  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [menuText, setMenuText] = useState('');
  const [capacityInput, setCapacityInput] = useState<number>(60);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const startEdit = (slotId: string, currentMenu: string, currentCap: number) => {
    setEditingSlotId(slotId);
    setMenuText(currentMenu);
    setCapacityInput(currentCap);
  };

  const saveEdit = (slotId: string) => {
    updateCanteenMenu(slotId, menuText, Number(capacityInput));
    setEditingSlotId(null);
    setToastMessage('Dining menu and capacity updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Dining Hall & Gym Operations Control</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
              CAMPUS LOGISTICS
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Configure daily meal menus, slot seating limits, and gym trainer schedule allocations
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

      {/* Canteen Slot Configurations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
          <UtensilsCrossed className="w-5 h-5 text-indigo-600" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">Dining Slots & Live Menu Dispatch</h2>
            <p className="text-[11px] text-slate-600">Update kitchen menu descriptions visible to students</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {canteenSlots.map((slot) => {
            const isEditing = editingSlotId === slot.id;

            return (
              <div
                key={slot.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">{slot.title}</h3>
                    <div className="text-[11px] text-slate-600 font-mono">
                      {slot.startTime} – {slot.endTime} •{' '}
                      <span className="uppercase font-semibold">{slot.mealType}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Capacity: {slot.capacity}
                  </span>
                </div>

                {isEditing ? (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                        Capacity Limit:
                      </label>
                      <input
                        type="number"
                        value={capacityInput}
                        onChange={(e) => setCapacityInput(Number(e.target.value))}
                        className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                        Menu Description:
                      </label>
                      <textarea
                        rows={2}
                        value={menuText}
                        onChange={(e) => setMenuText(e.target.value)}
                        className="w-full p-2 text-xs rounded-lg border border-slate-300"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingSlotId(null)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(slot.id)}
                        className="px-3 py-1 text-xs font-semibold bg-emerald-600 text-white rounded hover:bg-emerald-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-700">
                    <p className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px]">
                      {slot.menuDescription}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-slate-600">
                        Current Bookings: <strong>{slot.bookedCount}</strong> / {slot.capacity}
                      </span>
                      <button
                        onClick={() => startEdit(slot.id, slot.menuDescription, slot.capacity)}
                        className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit Menu & Capacity</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Gym Sessions Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
          <Dumbbell className="w-5 h-5 text-amber-600" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">Gym Sessions & Batch Load</h2>
            <p className="text-[11px] text-slate-600">Active trainer batches and capacity status</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gymSessions.map((gym) => (
            <div
              key={gym.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{gym.slotTime}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                  {gym.bookedCount}/{gym.capacity} Booked
                </span>
              </div>
              <p className="text-blue-600 font-semibold text-[11px]">{gym.trainerName}</p>
              <p className="text-[11px] text-slate-600">{gym.focusArea}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
