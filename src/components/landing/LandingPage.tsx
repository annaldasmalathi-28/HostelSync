import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Bed,
  UtensilsCrossed,
  Wrench,
  HeartPulse,
  Receipt,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Sparkles,
  Zap,
  Lock,
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenAuth: (defaultTab: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenAuth }) => {
  const { switchUser } = useAuth();

  const handleQuickLaunch = (userId: string) => {
    switchUser(userId);
    onEnterApp();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Banner Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-white">
                  Hostel<span className="text-blue-400">Sync</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  SMART CAMPUS
                </span>
              </div>
              <p className="text-xs text-slate-400">One Hostel. One Connected Platform.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-xl transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/30 transition-all hover:scale-102"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
          {/* Subtle glow background */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[120px] pointer-events-none rounded-full" />
          <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-violet-600/15 blur-[140px] pointer-events-none rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Hostel Automation & Role-Based Campus Portal</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
              One Hostel. <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400">
                One Connected Platform.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Eliminate paper logs and manual confusion. Seamlessly connect university residents,
              hostel wardens, and maintenance technicians with real-time bed bookings, dining token
              slots, 4-stage complaint tracking, and AI health triage.
            </p>

            {/* Quick Demo Launchers */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
              <button
                onClick={() => handleQuickLaunch('usr-student-1')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                <span>Launch Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleQuickLaunch('usr-admin-1')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-violet-700 hover:bg-violet-600 text-white shadow-lg shadow-violet-700/30 flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                <span>Enter Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleQuickLaunch('usr-tech-1')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-all"
              >
                <span>Technician Work Orders</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Live Campus Highlights Banner */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 backdrop-blur-xs">
                <div className="text-2xl font-bold text-white">4 Blocks</div>
                <div className="text-xs text-slate-400 mt-0.5">130 Total Rooms</div>
                <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Live Inventory Sync
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 backdrop-blur-xs">
                <div className="text-2xl font-bold text-white">Zero Double-Booking</div>
                <div className="text-xs text-slate-400 mt-0.5">Conflict-Guarded Beds</div>
                <div className="mt-2 text-[11px] text-blue-400 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Concurrency Protection
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 backdrop-blur-xs">
                <div className="text-2xl font-bold text-white">4-Stage SLA</div>
                <div className="text-xs text-slate-400 mt-0.5">Complaint Dispatch</div>
                <div className="mt-2 text-[11px] text-indigo-400 flex items-center gap-1">
                  <Wrench className="w-3 h-3" /> Real-time Work Updates
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 backdrop-blur-xs">
                <div className="text-2xl font-bold text-white">Gemini AI</div>
                <div className="text-xs text-slate-400 mt-0.5">Triage & Safety Engine</div>
                <div className="mt-2 text-[11px] text-violet-400 flex items-center gap-1">
                  <HeartPulse className="w-3 h-3" /> 24/7 First-Aid Guidance
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Modules Showcase */}
        <section className="py-20 bg-slate-950 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
                Engineered for Modern Universities
              </h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-white">
                Everything required to run an efficient residential campus
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Bed className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Bed & Room Allocation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Browse blocks, rooms, amenities, and floor plans. Request available beds with strict
                  concurrency guards preventing double bookings. Wardens review and approve requests with 1-click.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Canteen Dining Tokens</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Avoid overcrowded mess halls. Students reserve breakfast, lunch, snacks, or dinner slots
                  with live capacity counters and instant digital QR token generation.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">4-Step Complaint Lifecycle</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Students log maintenance issues with photos. Wardens assign technicians. Technicians
                  log work progress and resolution notes. Transparent timeline tracking for all parties.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-2xl p-6 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Gemini AI Health Guidance</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Safe, non-diagnostic student symptom guidance. Offers immediate first-aid tips,
                  red-flag symptom detection, and campus dispensary emergency telephone contacts.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Receipt className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Fee Receipts & Verification</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Students upload bank transfer or UPI payment receipts. Accounts administrators review
                  documents with audit remarks, preventing unverified claims from passing as paid.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-slate-900 border border-slate-800 hover:border-violet-500/50 rounded-2xl p-6 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Strict Role-Based Access</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Separate portals for Students, Wardens, and Technicians. Protected routes enforce that
                  students can never access administrative desks or technician work queues.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7-Step Demonstration Walkthrough Card */}
        <section className="py-20 bg-slate-900 border-t border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                End-to-End Evaluation Flow
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Test the complete connected workflow in 2 minutes
              </h2>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="flex h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-bold items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">Student logs in & requests bed</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Switch to Vikram Singh and request vacant bed A-205-1.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="flex h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-bold items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">Student books canteen slot</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Select lunch meal window and generate instant digital dining token.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="flex h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-bold items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">Student submits complaint with photo</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Use AI auto-categorization button and submit washroom leakage ticket.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="flex h-6 w-6 rounded-full bg-violet-600 text-white text-xs font-bold items-center justify-center shrink-0">
                    4
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">Admin assigns complaint & approves bed</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Switch to Warden Dr. Henderson to approve bed and dispatch Ramesh Kumar.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="flex h-6 w-6 rounded-full bg-amber-600 text-white text-xs font-bold items-center justify-center shrink-0">
                    5
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">Technician marks complaint resolved</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Switch to Ramesh Kumar, accept work order, and submit resolution note.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="flex h-6 w-6 rounded-full bg-emerald-600 text-white text-xs font-bold items-center justify-center shrink-0">
                    6
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">Student sees live resolution & uploads receipt</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Student views closed ticket and submits NEFT/UPI fee receipt.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-center">
                <button
                  onClick={onEnterApp}
                  className="px-8 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all hover:scale-102"
                >
                  <span>Launch Live System Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 bg-slate-950 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-slate-300">HostelSync — Smart Hostel Management System</span>
          </div>
          <p>© 2026 Campus Residential Services. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
