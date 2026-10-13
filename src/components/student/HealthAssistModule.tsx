import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HealthAdviceResponse } from '../../types';
import { fetchHealthGuidance } from '../../services/api';
import {
  HeartPulse,
  Sparkles,
  AlertTriangle,
  Phone,
  Building,
  CheckCircle2,
  ShieldAlert,
  Send,
  Loader2,
  Info,
} from 'lucide-react';

export const HealthAssistModule: React.FC = () => {
  const { currentUser } = useAuth();
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HealthAdviceResponse | null>(null);

  const starterPrompts = [
    'Sudden fever (101°F) with headache and body pain since last night',
    'Stomach cramps and mild nausea after dinner',
    'Severe ankle sprain with swelling while playing basketball',
    'Persistent dry cough, sore throat, and nasal congestion',
  ];

  const handleQuery = async (queryText?: string) => {
    const textToSubmit = queryText || symptoms;
    if (!textToSubmit.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await fetchHealthGuidance(textToSubmit, currentUser?.name);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyBadge = (level: string) => {
    switch (level) {
      case 'emergency':
        return 'bg-red-600 text-white animate-pulse';
      case 'high':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'moderate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Prominent Medical Disclaimer Banner */}
      <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-5 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-extrabold text-amber-900">
              IMPORTANT MEDICAL DISCLAIMER — INFORMATIONAL ONLY
            </h2>
            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
              This AI tool provides preliminary self-care and educational wellness guidelines. It is
              <strong> NOT a substitute for professional clinical medical advice</strong>, diagnosis, or prescription.
              For serious emergencies, immediately contact hostel medical dispensary or emergency ambulance below.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Query Interface on left, Emergency Desk on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Symptom input and results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h1 className="text-base font-bold text-slate-900">
                AI Campus Health Guidance Assistant
              </h1>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Describe your symptoms, duration, and discomfort to receive preliminary self-care suggestions and urgency evaluation.
            </p>

            {/* Quick Starters */}
            <div className="mb-4">
              <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                Quick Symptom Starters:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {starterPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSymptoms(prompt);
                      handleQuery(prompt);
                    }}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="relative">
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Mild throat pain and fever since morning, no cough..."
                className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-slate-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  Powered by Gemini 3.8 Flash model
                </span>

                <button
                  onClick={() => handleQuery()}
                  disabled={loading || !symptoms.trim()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 disabled:opacity-50 transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing Guidance...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Get Health Advice</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* AI Response Card */}
          {result && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase">
                    Initial Triage Result
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                    Wellness Assessment Summary
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getUrgencyBadge(
                    result.urgencyLevel
                  )}`}
                >
                  {result.urgencyLevel} Urgency
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                {result.summary}
              </p>

              {/* Possible Causes & Self Care */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span>Common Considerations to Discuss</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                    {result.possibleCauses?.map((cause, i) => (
                      <li key={i}>{cause}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
                  <h4 className="text-xs font-bold text-emerald-950 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Safe First-Aid & Self-Care</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-emerald-900 list-disc list-inside">
                    {result.selfCareSteps?.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Red Flag Warning Signs */}
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50">
                <h4 className="text-xs font-bold text-rose-950 mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Red Flag Symptoms — Seek Immediate Attention If You Experience:</span>
                </h4>
                <ul className="space-y-1 text-xs text-rose-900 list-disc list-inside">
                  {result.redFlagWarning?.map((warn, i) => (
                    <li key={i}>{warn}</li>
                  ))}
                </ul>
              </div>

              {/* Clinic Recommendation */}
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                <span className="font-bold">Campus Clinic Action: </span>
                {result.dispensaryRecommendation}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Campus Emergency Health Hotlines */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-5 h-5 text-rose-600" />
              <h2 className="text-sm font-bold text-slate-900">Campus Emergency Hotlines</h2>
            </div>
            <p className="text-[11px] text-slate-600 mb-4">
              24/7 on-site medical staff, on-duty warden, and rapid emergency transport
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs">
                <span className="font-bold text-rose-900 block">Hostel Medical Dispensary</span>
                <p className="text-[11px] text-rose-800 mt-0.5">Location: Block A, Ground Floor, Room 004</p>
                <div className="mt-2 flex items-center justify-between font-mono font-bold text-rose-950">
                  <span>+91 98765 43210</span>
                  <span className="text-[10px] font-sans font-semibold px-2 py-0.5 bg-rose-200 rounded">
                    Open 24/7
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                <span className="font-bold text-blue-900 block">Campus Emergency Ambulance</span>
                <p className="text-[11px] text-blue-800 mt-0.5">Location: Central Security Gate</p>
                <div className="mt-2 font-mono font-bold text-blue-950 text-sm">
                  Ext: 108 / Dial 108
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-900 block">Chief Resident Warden</span>
                <p className="text-[11px] text-slate-600 mt-0.5">Dr. Arthur Henderson (Warden Office)</p>
                <div className="mt-2 font-mono font-semibold text-slate-800">
                  +91 94123 45678
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
