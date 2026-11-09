"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Activity,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  RotateCcw,
  Hospital,
  ShieldAlert,
  ArrowRight,
  Info,
  Calendar,
  Thermometer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MedicalDisclaimer from "@/components/common/MedicalDisclaimer";

interface AssessmentState {
  ageGroup: "child" | "adult" | "senior";
  feverDay: "day1_2" | "day3_5" | "day6_plus";
  primarySymptoms: string[];
  warningSigns: string[];
  plateletRange: "normal" | "mild" | "moderate" | "critical" | "unknown";
}

const PRIMARY_SYMPTOMS_LIST = [
  { id: "high_fever", label: "Sudden high fever (102°F - 104°F)" },
  { id: "eye_pain", label: "Severe pain behind the eyes (retro-orbital pain)" },
  { id: "headache", label: "Intense frontal headache" },
  { id: "body_pain", label: "Severe joint and muscle aches ('breakbone fever')" },
  { id: "nausea", label: "Nausea, vomiting, or loss of appetite" },
  { id: "rash", label: "Skin redness or rash appearing after fever onset" },
];

const WARNING_SIGNS_LIST = [
  { id: "abd_pain", label: "Severe, continuous abdominal pain or tenderness" },
  { id: "persist_vomit", label: "Persistent vomiting (cannot retain water, ≥ 3 times/day)" },
  { id: "bleeding", label: "Mucosal bleeding: bleeding gums, nosebleeds, or red spots on skin" },
  { id: "lethargy", label: "Extreme lethargy, restlessness, drowsiness, or mental confusion" },
  { id: "cold_skin", label: "Cold, clammy hands and feet, or sudden hypothermia" },
  { id: "breathing", label: "Shortness of breath, rapid breathing, or chest heaviness" },
];

export default function SymptomsPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [assessment, setAssessment] = useState<AssessmentState>({
    ageGroup: "adult",
    feverDay: "day1_2",
    primarySymptoms: [],
    warningSigns: [],
    plateletRange: "unknown",
  });

  const togglePrimarySymptom = (id: string) => {
    setAssessment((prev) => ({
      ...prev,
      primarySymptoms: prev.primarySymptoms.includes(id)
        ? prev.primarySymptoms.filter((item) => item !== id)
        : [...prev.primarySymptoms, id],
    }));
  };

  const toggleWarningSign = (id: string) => {
    setAssessment((prev) => ({
      ...prev,
      warningSigns: prev.warningSigns.includes(id)
        ? prev.warningSigns.filter((item) => item !== id)
        : [...prev.warningSigns, id],
    }));
  };

  const resetAssessment = () => {
    setAssessment({
      ageGroup: "adult",
      feverDay: "day1_2",
      primarySymptoms: [],
      warningSigns: [],
      plateletRange: "unknown",
    });
    setStep(1);
  };

  // Determine Triage Level
  const hasWarningSigns = assessment.warningSigns.length > 0;
  const isCriticalPlatelet = assessment.plateletRange === "critical";
  const isModeratePlatelet = assessment.plateletRange === "moderate";
  const isCriticalPhaseDays = assessment.feverDay === "day3_5";

  let triageLevel: "red" | "amber" | "green" = "green";
  if (hasWarningSigns || isCriticalPlatelet) {
    triageLevel = "red";
  } else if (
    isModeratePlatelet ||
    (isCriticalPhaseDays && assessment.primarySymptoms.length >= 2) ||
    assessment.primarySymptoms.length >= 4 ||
    assessment.ageGroup === "child" ||
    assessment.ageGroup === "senior"
  ) {
    triageLevel = "amber";
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5 text-teal-600" />
          <span>Interactive Clinical Guidance & Triage Protocol</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f2744] tracking-tight">
          Symptom Evaluator & Warning Sign Assessment
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Step-by-step triage guide aligned with WHO & DGHS clinical staging protocols. This tool helps identify whether symptoms warrant routine observation, clinical review, or immediate emergency hospital care.
        </p>
      </div>

      <MedicalDisclaimer />

      {/* STEP PROGRESS INDICATOR */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 text-xs font-semibold">
        {[
          { num: 1, label: "Context" },
          { num: 2, label: "Symptoms" },
          { num: 3, label: "Warning Signs" },
          { num: 4, label: "Platelets" },
          { num: 5, label: "Guidance" },
        ].map((s) => (
          <div
            key={s.num}
            className={`flex items-center gap-2 ${
              step >= s.num ? "text-teal-700" : "text-slate-400"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s.num
                  ? "bg-teal-600 text-white ring-2 ring-teal-200"
                  : step > s.num
                  ? "bg-teal-100 text-teal-800"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {s.num}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: PATIENT CONTEXT */}
      {step === 1 && (
        <Card className="p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#0f2744]">
              Step 1: Patient Context & Fever Duration
            </h3>
            <p className="text-xs text-slate-500">
              The duration of fever is clinically critical, as the &quot;Critical Phase&quot; of dengue typically occurs around Days 3 to 5.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Patient Age Category:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "child", title: "Child (< 12 yrs)", desc: "Higher risk of rapid dehydration" },
                  { id: "adult", title: "Adult (12 - 60 yrs)", desc: "Standard clinical staging" },
                  { id: "senior", title: "Senior (60+ yrs)", desc: "Higher risk with comorbidities" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setAssessment((prev) => ({
                        ...prev,
                        ageGroup: item.id as AssessmentState["ageGroup"],
                      }))
                    }
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      assessment.ageGroup === item.id
                        ? "border-teal-600 bg-teal-50/70 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="font-bold text-sm text-[#0f2744]">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                How many days ago did the fever start?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "day1_2",
                    title: "Days 1 to 2",
                    desc: "Early Febrile Phase (High fever, headache, body aches)",
                  },
                  {
                    id: "day3_5",
                    title: "Days 3 to 5",
                    desc: "CRITICAL PHASE (Fever may subside; plasma leakage risk)",
                  },
                  {
                    id: "day6_plus",
                    title: "Day 6 or later",
                    desc: "Late Critical or Early Convalescent/Recovery Phase",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setAssessment((prev) => ({
                        ...prev,
                        feverDay: item.id as AssessmentState["feverDay"],
                      }))
                    }
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      assessment.feverDay === item.id
                        ? "border-teal-600 bg-teal-50/70 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="font-bold text-sm text-[#0f2744]">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button onClick={() => setStep(2)} className="gap-2">
              <span>Next: Select Symptoms</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: PRIMARY FEBRILE SYMPTOMS */}
      {step === 2 && (
        <Card className="p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#0f2744]">
              Step 2: Primary Febrile Symptoms
            </h3>
            <p className="text-xs text-slate-500">
              Select any symptoms currently present in the patient:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRIMARY_SYMPTOMS_LIST.map((sym) => {
              const isChecked = assessment.primarySymptoms.includes(sym.id);
              return (
                <div
                  key={sym.id}
                  onClick={() => togglePrimarySymptom(sym.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    isChecked
                      ? "border-teal-600 bg-teal-50/70 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-xs font-semibold text-slate-800 leading-snug">
                    {sym.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between items-center">
            <Button variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={() => setStep(3)} className="gap-2">
              <span>Next: Check Warning Signs</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: CRITICAL WARNING SIGNS */}
      {step === 3 && (
        <Card className="p-6 space-y-6 border-red-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="destructive">HIGH PRIORITY</Badge>
              <h3 className="text-lg font-bold text-red-950">
                Step 3: Check for Critical Warning Signs
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              According to WHO & DGHS guidelines, presence of <strong>even one</strong> of these signs signals plasma leakage and warrants urgent hospital admission.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {WARNING_SIGNS_LIST.map((ws) => {
              const isChecked = assessment.warningSigns.includes(ws.id);
              return (
                <div
                  key={ws.id}
                  onClick={() => toggleWarningSign(ws.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    isChecked
                      ? "border-red-500 bg-red-50 text-red-900 shadow-xs"
                      : "border-slate-200 hover:border-red-200 bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-900 block leading-tight">
                      {ws.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between items-center">
            <Button variant="ghost" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button onClick={() => setStep(4)} className="gap-2">
              <span>Next: Platelet Count (CBC)</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4: PLATELET COUNT CBC */}
      {step === 4 && (
        <Card className="p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#0f2744]">
              Step 4: Complete Blood Count (CBC) Platelet Level
            </h3>
            <p className="text-xs text-slate-500">
              If a CBC laboratory test has been performed within the last 24 hours, select the platelet count:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: "normal",
                title: "> 150,000 / μL (Normal)",
                desc: "Platelets within standard physiological baseline.",
              },
              {
                id: "mild",
                title: "100,000 - 150,000 / μL (Mild Drop)",
                desc: "Requires daily CBC monitoring; maintain hydration.",
              },
              {
                id: "moderate",
                title: "50,000 - 100,000 / μL (Moderate)",
                desc: "Strict clinical observation; monitor for spontaneous bleeding.",
              },
              {
                id: "critical",
                title: "< 50,000 / μL (Severe / Critical)",
                desc: "Hospitalization strongly indicated. Risk of internal bleeding.",
              },
              {
                id: "unknown",
                title: "Not tested / Unknown",
                desc: "CBC test not yet conducted by a diagnostic lab.",
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setAssessment((prev) => ({
                    ...prev,
                    plateletRange: item.id as AssessmentState["plateletRange"],
                  }))
                }
                className={`p-4 rounded-xl border text-left transition-all ${
                  assessment.plateletRange === item.id
                    ? "border-teal-600 bg-teal-50/70 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="font-bold text-sm text-[#0f2744]">{item.title}</div>
                <div className="text-[11px] text-slate-500 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>

          <div className="pt-4 flex justify-between items-center">
            <Button variant="ghost" onClick={() => setStep(3)}>
              Back
            </Button>
            <Button
              onClick={() => setStep(5)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold gap-2"
            >
              <span>Generate Triage Guidance</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 5: CLINICAL TRIAGE OUTPUT & NEXT STEPS */}
      {step === 5 && (
        <div className="space-y-6">
          {/* RED TRIAGE: EMERGENCY */}
          {triageLevel === "red" && (
            <Card className="border-red-300 bg-gradient-to-br from-red-50/90 to-white shadow-lg p-6 sm:p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <Badge variant="destructive" className="bg-red-600 text-white font-bold">
                    TRIAGE LEVEL: RED — IMMEDIATE HOSPITALIZATION
                  </Badge>
                  <h3 className="text-xl sm:text-2xl font-black text-red-950">
                    Urgent Emergency Clinical Assessment Required
                  </h3>
                  <p className="text-xs sm:text-sm text-red-900 leading-relaxed">
                    The presence of severe warning signs or critical platelet reduction (&lt;50,000/μL) indicates plasma leakage and potential progression to Dengue Hemorrhagic Fever / Shock. Do not delay.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-red-200 space-y-2 text-xs">
                <strong className="text-red-900 block font-bold text-sm">
                  Recommended Immediate Action Plan:
                </strong>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                  <li>Proceed to the nearest emergency department or dedicated dengue unit immediately.</li>
                  <li>Do NOT administer pain relievers like Aspirin, Ibuprofen, or Diclofenac.</li>
                  <li>Continue administering small, frequent sips of oral rehydration solution (ORS) during transit.</li>
                  <li>Call DGHS Dengue Hotline: <strong>16263</strong> or National Emergency: <strong>999</strong> for transport guidance.</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="/hospitals" className="flex-1">
                  <Button size="lg" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold gap-2">
                    <Hospital className="w-5 h-5" />
                    <span>Find Nearest Dengue Hospital Beds</span>
                  </Button>
                </Link>
                <a href="tel:16263" className="shrink-0">
                  <Button size="lg" variant="outline" className="border-red-300 text-red-800 hover:bg-red-50 gap-2">
                    <PhoneCall className="w-4 h-4" />
                    <span>Call 16263</span>
                  </Button>
                </a>
              </div>
            </Card>
          )}

          {/* AMBER TRIAGE: CLINICAL REVIEW */}
          {triageLevel === "amber" && (
            <Card className="border-amber-300 bg-gradient-to-br from-amber-50/90 to-white shadow-lg p-6 sm:p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <Badge variant="warning" className="bg-amber-500 text-slate-950 font-bold">
                    TRIAGE LEVEL: AMBER — CLINICAL REVIEW RECOMMENDED
                  </Badge>
                  <h3 className="text-xl sm:text-2xl font-bold text-amber-950">
                    Physician Consultation & CBC Testing Recommended
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                    Symptoms or clinical timing (Days 3 to 5 critical transition window) suggest moderate dengue illness. An in-person clinical review by a physician within 12-24 hours is advised.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-amber-200 space-y-2 text-xs">
                <strong className="text-amber-900 block font-bold text-sm">
                  Clinical Next Steps:
                </strong>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                  <li>Obtain a Complete Blood Count (CBC) with Hematocrit from an accredited diagnostic facility.</li>
                  <li>Ensure generous oral fluid intake (ORS, green coconut water, clear broth, plain water).</li>
                  <li>Paracetamol may be used for fever reduction (maximum 500mg - 1000mg per adult dose; maximum 4 times in 24h).</li>
                  <li>Monitor vigilantly for sudden vomiting, bleeding, or extreme lethargy.</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="/hospitals" className="flex-1">
                  <Button size="lg" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold gap-2">
                    <Hospital className="w-5 h-5" />
                    <span>Locate Diagnostic Centers & Hospitals</span>
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="border-slate-300 text-slate-800">
                    Log Vitals on Patient Portal
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* GREEN TRIAGE: HOME MONITORING */}
          {triageLevel === "green" && (
            <Card className="border-teal-200 bg-gradient-to-br from-teal-50/60 to-white shadow-lg p-6 sm:p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <Badge variant="teal" className="bg-teal-100 text-teal-800 font-bold">
                    TRIAGE LEVEL: GREEN — HOME MONITORING WITH CAUTION
                  </Badge>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0f2744]">
                    Mild / Early Febrile Phase — Supportive Home Care
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    No acute clinical warning signs or severe thrombocytopenia detected. Maintain supportive home hydration and monitor daily vitals closely.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-teal-100 space-y-2 text-xs">
                <strong className="text-teal-900 block font-bold text-sm">
                  Recommended Supportive Care:
                </strong>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                  <li>Adequate oral hydration: Minimum 2.5 to 3 liters of fluids daily for adults.</li>
                  <li>Complete bed rest under a mosquito bed net to prevent secondary mosquito bites and transmission.</li>
                  <li>Check temperature every 4 to 6 hours and log values.</li>
                  <li>Schedule a baseline CBC on Day 3 or Day 4 of fever.</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="/register" className="flex-1">
                  <Button size="lg" className="w-full bg-[#0f2744] hover:bg-[#16365c] text-white font-bold gap-2">
                    <Activity className="w-5 h-5 text-teal-400" />
                    <span>Track Daily Temperature on Dashboard</span>
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Reset Button */}
          <div className="text-center pt-2">
            <Button variant="ghost" onClick={resetAssessment} className="text-slate-600 gap-2">
              <RotateCcw className="w-4 h-4" />
              <span>Start Over / New Patient Assessment</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

