import React from "react";
import Link from "next/link";
import {
  Shield,
  PhoneCall,
  Heart,
  ExternalLink,
  ShieldAlert,
  MapPin,
  HeartHandshake,
  BarChart2,
  Lock,
} from "lucide-react";
import { APP_NAME, APP_TAGLINE, EMERGENCY_HOTLINES, NAV_LINKS } from "@/lib/constants";
import MedicalDisclaimer from "./MedicalDisclaimer";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#091524] text-slate-300 border-t border-slate-800 text-sm">
      {/* Top Banner / Disclaimer */}
      <div className="border-b border-slate-800/80 bg-[#0c1a2d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <MedicalDisclaimer compact className="bg-amber-950/40 border-amber-900/50 text-amber-200" />
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand & Project Summary */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Shield className="w-5 h-5 fill-teal-400/20" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">
                  Dengue<span className="text-teal-400">Guard</span>
                </span>
                <span className="block text-[11px] text-teal-300 font-medium">
                  Smart Dengue Prevention & Management System
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-sm">
              An intelligent healthcare platform engineered to provide real-time epidemiological surveillance, clinical symptom triage, verified hospital bed tracking, and privacy-preserving blood donor coordination.
            </p>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="text-teal-400 font-semibold block">
                Academic Project:
              </span>
              <p>
                BSc in Computer Science & Engineering 4th-Year Capstone Project. Designed adhering to healthcare informatics and public safety principles.
              </p>
            </div>
          </div>

          {/* Public Services */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold tracking-wide uppercase">
              Public Health
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/awareness"
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                >
                  Dengue Transmission & Risks
                </Link>
              </li>
              <li>
                <Link
                  href="/symptoms"
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                >
                  Symptom Evaluator & Warning Signs
                </Link>
              </li>
              <li>
                <Link
                  href="/prevention"
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                >
                  Vector Control & Home Safety
                </Link>
              </li>
              <li>
                <Link
                  href="/hospitals"
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                >
                  Verified Dengue Hospitals
                </Link>
              </li>
              <li>
                <Link
                  href="/blood-donors"
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                >
                  Blood & Platelet Donor Hub
                </Link>
              </li>
              <li>
                <Link
                  href="/statistics"
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                >
                  Surveillance & District Stats
                </Link>
              </li>
            </ul>
          </div>

          {/* Secure Portals */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold tracking-wide uppercase">
              Clinical Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/login"
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-teal-400" />
                  Patient Portal Login
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-teal-400" />
                  Doctor Consultation Desk
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-teal-400" />
                  Hospital Administration
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                >
                  Register as Blood Donor
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                >
                  Doctor Credential Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Hotlines */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold tracking-wide uppercase">
              Emergency Hotlines
            </h4>
            <div className="space-y-2 text-xs">
              {EMERGENCY_HOTLINES.map((hotline) => (
                <div
                  key={hotline.number}
                  className="p-2 rounded bg-slate-900/60 border border-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-medium truncate">
                      {hotline.name}
                    </span>
                    <span className="text-[10px] text-teal-400 bg-teal-950/60 px-1 rounded">
                      {hotline.available}
                    </span>
                  </div>
                  <a
                    href={`tel:${hotline.number.replace(/\s+/g, "")}`}
                    className="font-mono text-teal-300 hover:text-white font-bold flex items-center gap-1 mt-0.5"
                  >
                    <PhoneCall className="w-3 h-3" />
                    {hotline.number}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {currentYear} {APP_NAME}. All rights reserved. Developed for public good & research demonstration.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span>Data Sources: DGHS Bangladesh • IEDCR • WHO SEARO</span>
            <span className="text-teal-400 font-medium">Privacy Preserving Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

