import React from "react";
import Link from "next/link";
import ThemeToggle from "@/components/common/ThemeToggle";
import {
  Shield,
  ArrowLeft,
  Activity,
  HeartPulse,
  PhoneCall,
  Lock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row text-slate-800 antialiased selection:bg-teal-500 selection:text-white">
      {/* ─── Left Branding & Clinical Telemetry Showcase (Desktop) ─── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[48%] bg-gradient-to-br from-[#061426] via-[#091f3a] to-[#040d1a] relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background Ambient Glows & Grid Mesh */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#14b8a6 1px, transparent 1px), radial-gradient(#38bdf8 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            backgroundPosition: "0 0, 12px 12px",
          }}
        />

        {/* Top Header / Brand Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#07172c] rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-teal-400 fill-teal-400/20" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white block">
                Dengue<span className="text-teal-400">Guard</span>
              </span>
              <span className="text-[10px] font-semibold text-teal-200/70 uppercase tracking-widest block -mt-1">
                Clinical Intelligence System
              </span>
            </div>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[11px] font-medium text-teal-300">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>DGHS Surveillance Active</span>
          </div>
        </div>

        {/* Center Clinical Showcase Card */}
        <div className="relative z-10 my-auto py-8 space-y-6 max-w-lg">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Smart Dengue Prevention & Management</span>
            </div>
            <h1 className="text-3xl xl:text-4xl font-black text-white leading-tight tracking-tight">
              Evidence-based Dengue Care & Real-time Epidemic Triage
            </h1>
            <p className="text-sm text-slate-300/90 leading-relaxed font-normal">
              Empowering patients with daily CBC platelet telemetry and connecting certified clinicians across Bangladesh for early detection and timely intervention.
            </p>
          </div>

          {/* Floating Live Telemetry Glass Card */}
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    National Triage Network
                  </span>
                  <span className="text-[11px] text-slate-400">
                    64 Districts • 24/7 Monitored
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Status: Optimal
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 block font-medium">Platelet Threshold</span>
                <span className="text-sm font-bold text-amber-300">&lt; 100,000</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 block font-medium">Warning Triage</span>
                <span className="text-sm font-bold text-teal-300">Phase 3 Ready</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 block font-medium">Verified Donors</span>
                <span className="text-sm font-bold text-blue-300">Privacy-First</span>
              </div>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 pt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Role-Based Access Control</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>WHO & DGHS Guidelines</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>End-to-End Encrypted Records</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Verified BMDC Doctors</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Hotline & Security Badge */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
            <span>National Health Call Center:</span>
            <span className="font-bold text-white tracking-wide">16263</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>256-Bit SSL Secured</span>
          </div>
        </div>
      </div>

      {/* ─── Right Form Canvas (Auth Container) ─── */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-y-auto">
        {/* Navigation Bar */}
        <div className="w-full max-w-lg mx-auto flex items-center justify-between pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0f2744] transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Portal</span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {/* Mobile Brand Preview */}
            <Link href="/" className="flex items-center gap-2 lg:hidden">
              <div className="w-7 h-7 rounded-lg bg-[#0f2744] text-teal-400 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 fill-teal-400/20" />
              </div>
              <span className="font-bold text-[#0f2744] text-sm tracking-tight">
                Dengue<span className="text-teal-600">Guard</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Dynamic Form Area */}
        <div className="w-full max-w-lg mx-auto my-auto py-4">
          {children}
        </div>

        {/* Footer Disclaimer */}
        <div className="w-full max-w-lg mx-auto pt-6 text-center text-[11px] text-slate-400 space-y-1">
          <p>© 2025 DengueGuard System. All healthcare data strictly protected.</p>
          <p className="text-slate-400/80">
            Medical triage and recommendations are guided by DGHS National Guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
