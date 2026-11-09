"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Activity,
  AlertTriangle,
  Hospital,
  HeartHandshake,
  BarChart3,
  Search,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  HeartPulse,
  Droplets,
  Thermometer,
  ShieldAlert,
  Flame,
  Info,
  Building2,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MedicalDisclaimer from "@/components/common/MedicalDisclaimer";
import { MOCK_HOSPITALS, MOCK_NOTICES, MOCK_STATISTICS } from "@/lib/data/mockData";

export default function HomePage() {
  const [searchDistrict, setSearchDistrict] = useState("");
  const [selectedQuickSymptoms, setSelectedQuickSymptoms] = useState<string[]>([]);

  const quickSymptomOptions = [
    { id: "fever", label: "High Fever (>102°F)", severity: "amber" },
    { id: "eye_pain", label: "Retro-orbital Eye Pain", severity: "amber" },
    { id: "vomiting", label: "Persistent Vomiting", severity: "red" },
    { id: "bleeding", label: "Gum/Nose Bleeding", severity: "red" },
    { id: "severe_pain", label: "Severe Abdominal Pain", severity: "red" },
  ];

  const toggleSymptom = (id: string) => {
    setSelectedQuickSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const hasRedFlag = selectedQuickSymptoms.some((s) =>
    ["vomiting", "bleeding", "severe_pain"].includes(s)
  );

  const filteredHospitals = MOCK_HOSPITALS.filter((h) =>
    searchDistrict
      ? h.district.toLowerCase().includes(searchDistrict.toLowerCase()) ||
        h.name.toLowerCase().includes(searchDistrict.toLowerCase())
      : true
  ).slice(0, 4);

  return (
    <div className="space-y-16 md:space-y-24 pb-20">
      {/* ─── 1. HERO SECTION (High-Tech Clinical Command Center) ─── */}
      <section className="relative overflow-hidden pt-8 md:pt-14 pb-16 bg-gradient-to-b from-[#0f2744]/[0.03] via-white to-slate-50 border-b border-slate-200/60">
        <div className="absolute inset-0 medical-grid-bg opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Telemetry Status Pill */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                <span>DGHS Protocol 2025 • National Dengue Surveillance Network</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0f2744] tracking-tight leading-[1.12]">
                Protect Every Life from{" "}
                <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                  Dengue
                </span>{" "}
                with Smart Clinical Triage
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                An intelligent healthcare infrastructure connecting patients, certified clinicians, and emergency hospital bed registries across Bangladesh for rapid diagnosis and timely intervention.
              </p>

              {/* Interactive Quick Symptom Mini-Checker */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-md shadow-slate-200/50 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-teal-600" />
                    <span>Quick Symptom Screening: Click to assess risk</span>
                  </span>
                  {selectedQuickSymptoms.length > 0 && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        hasRedFlag
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {hasRedFlag ? "🚨 RED WARNING SIGN DETECTED" : "⚠️ Potential Febrile Phase"}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {quickSymptomOptions.map((sym) => {
                    const isSelected = selectedQuickSymptoms.includes(sym.id);
                    return (
                      <button
                        key={sym.id}
                        type="button"
                        onClick={() => toggleSymptom(sym.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                          isSelected
                            ? sym.severity === "red"
                              ? "bg-red-500 text-white border-red-600 shadow-xs"
                              : "bg-amber-500 text-white border-amber-600 shadow-xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        {sym.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
                <Link href="/symptoms" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full bg-[#0f2744] hover:bg-[#153459] text-white font-bold h-12 px-7 rounded-xl shadow-lg shadow-[#0f2744]/15 gap-2.5 active:scale-95 transition-all"
                  >
                    <Activity className="w-4 h-4 text-teal-400" />
                    <span>Comprehensive Triage Tool</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 ml-1" />
                  </Button>
                </Link>

                <Link href="/hospitals" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-slate-300 text-slate-800 hover:bg-slate-50 font-bold h-12 px-6 rounded-xl gap-2 active:scale-95 transition-all"
                  >
                    <Hospital className="w-4 h-4 text-blue-600" />
                    <span>Find Emergency Beds</span>
                  </Button>
                </Link>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>WHO & DGHS Protocols</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Verified BMDC Clinicians</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Privacy-First Donors</span>
                </div>
              </div>
            </div>

            {/* Right Card: Live Clinical Telemetry Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_12px_35px_-8px_rgba(15,39,68,0.12)] space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                      National Surveillance Radar
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    Live 2025 Dataset
                  </span>
                </div>

                {/* Key Numbers Grid */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/30 border border-slate-200/60 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 block">Reported Cases</span>
                    <span className="text-2xl sm:text-3xl font-black text-[#0f2744] tracking-tight">
                      {MOCK_STATISTICS.nationalOverview.totalCasesThisYear.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-teal-700 font-bold block">
                      64 Districts Tracked
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-amber-50/30 border border-slate-200/60 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 block">Active Hospitalized</span>
                    <span className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">
                      {MOCK_STATISTICS.nationalOverview.activeHospitalized.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-amber-700 font-bold block">
                      Dedicated Dengue Units
                    </span>
                  </div>
                </div>

                {/* Hospital Telemetry Radar */}
                <div className="p-4 rounded-2xl bg-[#0f2744] text-white space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1.5 text-teal-300">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Dhaka Medical College (DMCH)</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ICU Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-white/10">
                      <span className="text-[10px] text-slate-300 block">Dengue Beds</span>
                      <strong className="text-teal-300 text-sm">24 Available</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-white/10">
                      <span className="text-[10px] text-slate-300 block">Platelet Unit</span>
                      <strong className="text-white text-sm">24/7 Apheresis</strong>
                    </div>
                  </div>
                </div>

                {/* Direct Action Link */}
                <Link href="/symptoms">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold h-11 rounded-xl justify-between shadow-md shadow-teal-600/15">
                    <span>Evaluate Clinical Symptoms</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. CLINICAL MEDICAL DISCLAIMER ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MedicalDisclaimer />
      </section>

      {/* ─── 3. THREE CLINICAL PHASES & CRITICAL WARNING SIGNS ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-[#061426] via-[#091f3a] to-[#040d1a] text-white p-8 sm:p-12 shadow-2xl border border-slate-800 relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Critical Clinical Knowledge</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Understanding the 3 Phases of Dengue Infection
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              When fever suddenly subsides (defervescence), patients often assume recovery. In reality, this marks the start of the <strong>Critical 24–48 Hour Window</strong> where internal plasma leakage and sudden platelet drop occur.
            </p>
          </div>

          {/* Phase Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8 relative z-10">
            {/* Phase 1 */}
            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Phase 1</span>
                <span className="text-[11px] text-slate-400">Days 1 to 3</span>
              </div>
              <h4 className="font-bold text-white text-base">Febrile Phase</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sudden high fever (104°F), intense headache, retro-orbital pain, severe joint and muscle aches, nausea.
              </p>
              <div className="pt-2 text-[11px] text-teal-300 font-semibold border-t border-white/10">
                Action: ORS Hydration & Paracetamol Only
              </div>
            </div>

            {/* Phase 2: CRITICAL */}
            <div className="p-6 rounded-2xl bg-red-950/40 border border-red-500/30 space-y-3 backdrop-blur-md relative">
              <span className="absolute -top-2.5 right-4 bg-red-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                Highest Danger
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Phase 2</span>
                <span className="text-[11px] text-slate-400">Days 4 to 6</span>
              </div>
              <h4 className="font-bold text-white text-base">Critical Phase (Leakage)</h4>
              <p className="text-xs text-red-100 leading-relaxed">
                Severe abdominal pain, persistent vomiting, bleeding gums or nose, extreme lethargy, plasma leakage.
              </p>
              <div className="pt-2 text-[11px] text-red-300 font-bold border-t border-red-500/20">
                Action: Immediate Hospital Admission
              </div>
            </div>

            {/* Phase 3 */}
            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Phase 3</span>
                <span className="text-[11px] text-slate-400">Days 7+</span>
              </div>
              <h4 className="font-bold text-white text-base">Convalescent Phase</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Reabsorption of leaked fluid, stabilization of hematocrit, steady rebound of platelet count, appetite return.
              </p>
              <div className="pt-2 text-[11px] text-blue-300 font-semibold border-t border-white/10">
                Action: Continued Rest & Clinical Follow-up
              </div>
            </div>
          </div>

          {/* Warning Banner at Bottom of Card */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-200">
                <strong>ABSOLUTE CONTRAINDICATION:</strong> Never take Aspirin, Ibuprofen, Naproxen, or Diclofenac. They accelerate internal hemorrhage.
              </p>
            </div>

            <Link href="/symptoms">
              <Button className="bg-teal-500 hover:bg-teal-400 text-[#0f2744] font-black h-10 px-5 rounded-xl">
                Open Full Triage Tool
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 4. FOUR PILLARS OF DENGUEGUARD ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="teal">HEALTHCARE INFORMATICS</Badge>
          <h2 className="text-3xl font-black text-[#0f2744] tracking-tight">
            Integrated Clinical Architecture
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Everything needed to monitor patients, locate beds, coordinate blood, and analyze epidemiological datasets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pillar 1 */}
          <Card className="hover:border-teal-400 hover:shadow-lg transition-all rounded-2xl border-slate-200/80 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <CardTitle className="text-base text-[#0f2744]">Symptom Evaluator</CardTitle>
              <CardDescription className="text-xs leading-relaxed text-slate-600">
                Step-by-step risk stratification based on illness day, clinical red flags, and CBC platelet levels.
              </CardDescription>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100">
              <Link href="/symptoms" className="text-teal-600 hover:text-teal-700 font-bold text-xs inline-flex items-center gap-1">
                <span>Start Assessment</span> <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>

          {/* Pillar 2 */}
          <Card className="hover:border-blue-400 hover:shadow-lg transition-all rounded-2xl border-slate-200/80 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Hospital className="w-6 h-6" />
              </div>
              <CardTitle className="text-base text-[#0f2744]">Hospital Bed Finder</CardTitle>
              <CardDescription className="text-xs leading-relaxed text-slate-600">
                Interactive Leaflet map showing government & private hospitals with live dengue bed and ICU counts.
              </CardDescription>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100">
              <Link href="/hospitals" className="text-blue-600 hover:text-blue-700 font-bold text-xs inline-flex items-center gap-1">
                <span>Explore Directory</span> <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>

          {/* Pillar 3 */}
          <Card className="hover:border-rose-400 hover:shadow-lg transition-all rounded-2xl border-slate-200/80 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <CardTitle className="text-base text-[#0f2744]">Blood & Platelets</CardTitle>
              <CardDescription className="text-xs leading-relaxed text-slate-600">
                Privacy-first donor discovery. Request verified blood and apheresis platelet donors with no public number exposure.
              </CardDescription>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100">
              <Link href="/blood-donors" className="text-rose-600 hover:text-rose-700 font-bold text-xs inline-flex items-center gap-1">
                <span>Find Donors</span> <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>

          {/* Pillar 4 */}
          <Card className="hover:border-indigo-400 hover:shadow-lg transition-all rounded-2xl border-slate-200/80 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <CardTitle className="text-base text-[#0f2744]">Epidemic Statistics</CardTitle>
              <CardDescription className="text-xs leading-relaxed text-slate-600">
                64-district surveillance datasets, interactive Recharts curves, and official DGHS circulars.
              </CardDescription>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100">
              <Link href="/statistics" className="text-indigo-600 hover:text-indigo-700 font-bold text-xs inline-flex items-center gap-1">
                <span>View Analytics</span> <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* ─── 5. HOSPITAL FINDER PREVIEW ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Badge variant="navy">LIVE CAPACITY RADAR</Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f2744] mt-1">
              Verified Dengue Hospital Bed Directory
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Live capacity monitoring across government and private medical centers.
            </p>
          </div>

          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Filter by hospital or district..."
              value={searchDistrict}
              onChange={(e) => setSearchDistrict(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredHospitals.map((hospital) => (
            <Card key={hospital.id} className="p-5 flex flex-col justify-between rounded-2xl border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={hospital.type === "Government" ? "navy" : "secondary"}>
                    {hospital.type}
                  </Badge>
                  {hospital.hasDedicatedDengueUnit && (
                    <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                      Dedicated Dengue Unit
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-[#0f2744] text-sm leading-snug">
                  {hospital.name}
                </h4>

                <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{hospital.area}, {hospital.district}</span>
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2 rounded-lg bg-teal-50/50">
                    <span className="text-slate-500 block text-[10px]">Dengue Beds</span>
                    <strong className="text-teal-700 font-black text-sm">
                      {hospital.availableDengueBeds}
                    </strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-500 block text-[10px]">ICU Available</span>
                    <strong className="text-slate-800 font-black text-sm">
                      {hospital.icuAvailable} / {hospital.icuTotal}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-2">
                <a
                  href={`tel:${hospital.emergencyPhone}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-[#0f2744] hover:text-white transition-all text-slate-800"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{hospital.emergencyPhone}</span>
                </a>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link href="/hospitals">
            <Button variant="outline" className="border-slate-300 text-slate-800 font-bold rounded-xl text-xs h-10 px-5 gap-2">
              <span>View All 10+ Hospitals on Interactive Map</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── 6. PUBLIC HEALTH NOTICES STREAM ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="teal">OFFICIAL SURVEILLANCE BULLETINS</Badge>
            <h2 className="text-2xl font-black text-[#0f2744] mt-1">
              Latest Verified Public Health Bulletins
            </h2>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline font-semibold">
            DGHS & IEDCR Authenticated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MOCK_NOTICES.map((notice) => (
            <Card key={notice.id} className="p-5 flex flex-col justify-between rounded-2xl border-slate-200/80 shadow-xs">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <Badge variant={notice.category === "Alert" ? "destructive" : "teal"}>
                    {notice.category}
                  </Badge>
                  <span className="text-slate-400 text-[11px] font-medium">{notice.date}</span>
                </div>
                <h4 className="font-bold text-[#0f2744] text-sm leading-snug">
                  {notice.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {notice.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between font-medium">
                <span>{notice.source}</span>
                <span className="text-teal-700 font-bold">Verified Circular</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── 7. EMERGENCY CALL TO ACTION ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#0f2744] via-[#16365c] to-teal-800 text-white p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Are you monitoring fever or a declining platelet count?
            </h3>
            <p className="text-teal-100 text-xs sm:text-sm leading-relaxed">
              Register as a patient to log daily temperature curves, track CBC laboratory values, and consult verified doctors online.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link href="/register">
              <Button size="lg" className="bg-teal-400 hover:bg-teal-300 text-[#0f2744] font-black rounded-xl h-11 px-6 shadow-md">
                Register Patient Account
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold rounded-xl h-11 px-6">
                Portal Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
