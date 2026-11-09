"use client";

import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Droplets,
  HeartPulse,
  Info,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  predictDengueSeverity,
  ClinicalPredictorInput,
  ClinicalPredictorOutput,
} from "@/lib/ml/severityPredictor";

export default function DengueSeverityPredictor() {
  const [dayOfIllness, setDayOfIllness] = useState<number>(4);
  const [plateletCount, setPlateletCount] = useState<string>("85000");
  const [hematocrit, setHematocrit] = useState<string>("44");
  const [age, setAge] = useState<string>("28");
  const [selectedWarnings, setSelectedWarnings] = useState<string[]>(["abd_pain"]);
  const [hasComorbidities, setHasComorbidities] = useState<boolean>(false);

  const [result, setResult] = useState<ClinicalPredictorOutput | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const warningOptions = [
    { id: "abd_pain", label: "Severe Abdominal Pain" },
    { id: "vomiting", label: "Persistent Vomiting (≥3 times/day)" },
    { id: "mucosal_bleeding", label: "Bleeding Gums / Nosebleeds" },
    { id: "lethargy", label: "Extreme Lethargy / Restlessness" },
    { id: "fluid_accumulation", label: "Ascites / Pleural Effusion" },
  ];

  const handleToggleWarning = (id: string) => {
    setSelectedWarnings((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const handleRunPrediction = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    setTimeout(() => {
      const output = predictDengueSeverity({
        dayOfIllness: Number(dayOfIllness),
        plateletCount: Number(plateletCount) || 100000,
        hematocrit: hematocrit ? Number(hematocrit) : undefined,
        age: Number(age) || 28,
        warningSigns: selectedWarnings,
        hasComorbidities,
      });

      setResult(output);
      setIsCalculating(false);
    }, 400);
  };

  const resetForm = () => {
    setDayOfIllness(4);
    setPlateletCount("85000");
    setHematocrit("44");
    setSelectedWarnings(["abd_pain"]);
    setResult(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-[#061426] via-[#091f3a] to-teal-900 text-white p-6 sm:p-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Clinical Decision Support Engine</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Dengue Clinical Severity & Plasma Leakage Predictor
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
          Algorithmic risk stratification model based on WHO 2009 Classification and DGHS Bangladesh National Guidelines. Evaluates platelet velocity, hemoconcentration, and critical phase timing.
        </p>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs */}
        <form onSubmit={handleRunPrediction} className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Day of Illness */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Day of Fever / Illness</span>
                <span className="text-teal-700 font-extrabold text-[11px]">Day {dayOfIllness}</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={dayOfIllness}
                onChange={(e) => setDayOfIllness(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>Day 1 (Onset)</span>
                <span className="text-amber-600 font-bold">Days 3-6 (Critical)</span>
                <span>Day 10 (Recovery)</span>
              </div>
            </div>

            {/* Current Platelet Count */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Latest Platelet Count (cells/μL)
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  placeholder="e.g. 75000"
                  value={plateletCount}
                  onChange={(e) => setPlateletCount(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all font-semibold"
                />
                <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold">
                  /μL
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Hematocrit % */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Hematocrit (HCT / PCV %)
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="e.g. 44 (Normal: 36-40%)"
                  value={hematocrit}
                  onChange={(e) => setHematocrit(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all font-semibold"
                />
                <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold">
                  %
                </span>
              </div>
            </div>

            {/* Patient Age */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Patient Age (Years)</label>
              <input
                type="number"
                placeholder="e.g. 28"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all font-semibold"
              />
            </div>
          </div>

          {/* Warning Signs Checklist */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-bold text-slate-700 block">
              Observed Clinical Warning Signs (Select all that apply):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {warningOptions.map((opt) => {
                const checked = selectedWarnings.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleToggleWarning(opt.id)}
                    className={`text-left p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all ${
                      checked
                        ? "bg-red-50 text-red-900 border-red-300 shadow-2xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                        checked ? "bg-red-500 border-red-600 text-white" : "border-slate-300 bg-white"
                      }`}
                    >
                      {checked && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comorbidities Checkbox */}
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={hasComorbidities}
              onChange={(e) => setHasComorbidities(e.target.checked)}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span>Patient has comorbidities (Diabetes, Hypertension, Pregnancy, Chronic Kidney Disease)</span>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={isCalculating}
              className="flex-1 bg-[#0f2744] hover:bg-[#16365c] text-white font-bold h-11 rounded-xl shadow-md gap-2"
            >
              {isCalculating ? (
                <span>Executing Prediction Algorithm...</span>
              ) : (
                <>
                  <Activity className="w-4 h-4 text-teal-400" />
                  <span>Calculate Severity & Plasma Leakage</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="border-slate-300 text-slate-700 h-11 px-4 rounded-xl"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </form>

        {/* Prediction Output & Visual Gauge */}
        <div className="lg:col-span-5">
          {result ? (
            <div className="rounded-2xl border p-5 sm:p-6 space-y-5 bg-gradient-to-b from-slate-50 to-white shadow-md animate-in fade-in duration-300">
              {/* Risk Score Gauge Header */}
              <div className="text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Calculated Risk Index
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={`text-4xl sm:text-5xl font-black ${
                      result.riskLevel === "HIGH_CRITICAL"
                        ? "text-red-600"
                        : result.riskLevel === "MODERATE"
                        ? "text-amber-500"
                        : "text-emerald-600"
                    }`}
                  >
                    {result.riskScore}
                  </span>
                  <span className="text-slate-400 text-lg font-bold">/ 100</span>
                </div>

                <Badge
                  variant={
                    result.riskLevel === "HIGH_CRITICAL"
                      ? "destructive"
                      : result.riskLevel === "MODERATE"
                      ? "warning"
                      : "teal"
                  }
                  className="mx-auto font-black px-3 py-1 text-xs"
                >
                  {result.riskLabel}
                </Badge>
              </div>

              {/* Progress bar visual */}
              <div className="space-y-1">
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-500 ${
                      result.riskLevel === "HIGH_CRITICAL"
                        ? "bg-red-500"
                        : result.riskLevel === "MODERATE"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${result.riskScore}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
                  <span>0 (Mild)</span>
                  <span>50 (Moderate)</span>
                  <span>100 (Severe DHF)</span>
                </div>
              </div>

              {/* Leakage Probability & Illness Phase */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-medium">Plasma Leakage Risk</span>
                  <strong className="text-sm font-bold text-slate-800">
                    {result.plasmaLeakageProbability}% Likelihood
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-medium">Predicted Phase</span>
                  <strong className="text-xs font-bold text-teal-700 truncate block">
                    {result.illnessPhase === "CRITICAL_LEAKAGE_PHASE"
                      ? "Critical Window"
                      : result.illnessPhase === "FEBRILE_PHASE"
                      ? "Febrile Phase"
                      : "Convalescent"}
                  </strong>
                </div>
              </div>

              {/* Key Insights */}
              {result.keyClinicalInsights.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-slate-700 block">Algorithmic Key Findings:</span>
                  <ul className="space-y-1 text-slate-600 text-[11px]">
                    {result.keyClinicalInsights.map((insight, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-teal-600 font-bold shrink-0">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Urgent Next Steps */}
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                  result.urgency === "IMMEDIATE_EMERGENCY_HOSPITALIZATION"
                    ? "bg-red-50 text-red-950 border-red-200"
                    : result.urgency === "CLINICAL_REVIEW_REQUIRED"
                    ? "bg-amber-50 text-amber-950 border-amber-200"
                    : "bg-teal-50 text-teal-950 border-teal-200"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Clinical Action Plan:</span>
                </div>
                <ul className="space-y-1 text-[11px] list-disc list-inside">
                  {result.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-400 space-y-3">
              <Activity className="w-10 h-10 text-slate-300" />
              <div>
                <span className="font-bold text-slate-600 block text-sm">
                  Ready for Assessment
                </span>
                <span className="text-xs max-w-xs block mt-1">
                  Adjust patient Day, Platelets, and Warning signs on the left, then click Calculate to view the ML risk score.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

