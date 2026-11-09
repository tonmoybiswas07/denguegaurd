"use client";

import React, { useState } from "react";
import { PhoneCall, AlertTriangle, X, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function EmergencyBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#0f2744] text-white text-xs border-b border-teal-800/40 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Advisory Notice */}
          <div className="flex items-center gap-2 flex-1 min-w-[280px]">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="bg-red-500/20 text-red-300 font-semibold px-2 py-0.5 rounded border border-red-500/30 text-[11px] uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              Health Advisory
            </span>
            <p className="text-slate-200 truncate hidden sm:inline">
              Severe dengue warning signs require immediate clinical assessment. Platelet count &lt; 50,000/μL is critical.
            </p>
          </div>

          {/* Quick-dial Hotlines */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-slate-400 hidden md:inline">Emergency Hotlines:</span>
            <a
              href="tel:16263"
              className="inline-flex items-center gap-1 bg-teal-800/50 hover:bg-teal-700/60 text-teal-200 hover:text-white px-2.5 py-1 rounded transition-colors border border-teal-700/40 font-medium"
              title="Directorate General of Health Services"
            >
              <PhoneCall className="w-3 h-3 text-teal-400" />
              <span>DGHS: 16263</span>
            </a>
            <a
              href="tel:10655"
              className="inline-flex items-center gap-1 bg-teal-800/50 hover:bg-teal-700/60 text-teal-200 hover:text-white px-2.5 py-1 rounded transition-colors border border-teal-700/40 font-medium"
              title="IEDCR Dengue Helpline"
            >
              <ShieldAlert className="w-3 h-3 text-teal-400" />
              <span>IEDCR: 10655</span>
            </a>
            <button
              onClick={() => setIsVisible(false)}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

