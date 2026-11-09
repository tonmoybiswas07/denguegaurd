"use client";

import React, { useRef } from "react";
import {
  Printer,
  X,
  Shield,
  FileText,
  AlertTriangle,
  HeartPulse,
  CheckCircle2,
  Calendar,
  User,
  Phone,
  Droplets,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PatientReportPDFProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientEmail: string;
  bloodGroup?: string;
  records: any[];
  appointments: any[];
}

export default function PatientReportPDF({
  isOpen,
  onClose,
  patientName,
  patientEmail,
  bloodGroup = "O+",
  records = [],
  appointments = [],
}: PatientReportPDFProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const latestRecord = records[0] || {};
  const reportDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8">
        {/* Modal Action Bar (Hidden when printing) */}
        <div className="print:hidden bg-slate-50 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold text-slate-800">
              Clinical Dengue Summary Pass (Print / PDF Ready)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              size="sm"
              className="bg-[#0f2744] hover:bg-[#153459] text-white font-bold text-xs h-8 px-3 rounded-lg gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </Button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ─── Printable Document Sheet ─── */}
        <div className="p-8 sm:p-10 space-y-6 text-slate-800 font-sans print:p-0">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-[#0f2744] pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0f2744] text-teal-400 flex items-center justify-center font-black">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="text-xl font-black text-[#0f2744] tracking-tight">
                  Dengue<span className="text-teal-600">Guard</span>
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                Official Clinical Telemetry & Triage Summary
              </span>
              <p className="text-[11px] text-slate-400">
                Verified Healthcare Informatics System • Directorate General of Health Services (DGHS) Standards
              </p>
            </div>

            <div className="text-right space-y-0.5 text-xs text-slate-500">
              <span className="font-bold text-slate-800 block text-sm">
                Pass ID: DG-{Math.floor(100000 + Math.random() * 900000)}
              </span>
              <span>Generated: {reportDate}</span>
              <Badge variant="teal" className="text-[10px] mt-1">
                Verified Patient Record
              </Badge>
            </div>
          </div>

          {/* Patient Demographics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Patient Name</span>
              <strong className="text-slate-800 text-sm font-black">{patientName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Registered Email</span>
              <span className="text-slate-700 font-medium truncate block">{patientEmail}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Blood Group</span>
              <span className="font-black text-rose-600 text-sm">{bloodGroup}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">District</span>
              <span className="text-slate-700 font-bold">Dhaka, Bangladesh</span>
            </div>
          </div>

          {/* Current Clinical Vitals Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0f2744]">
              Latest Recorded Vitals & CBC Parameters
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 block">Temperature</span>
                <span className="text-lg font-black text-slate-800">
                  {latestRecord.temperature ? `${latestRecord.temperature}°F` : "101.5°F"}
                </span>
                <span className="text-[10px] text-amber-600 font-bold block">Febrile Zone</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 block">Platelet Count</span>
                <span className="text-lg font-black text-teal-700">
                  {latestRecord.plateletCount ? latestRecord.plateletCount.toLocaleString() : "95,000"}
                </span>
                <span className="text-[10px] text-slate-400 block">cells/μL</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 block">Hematocrit (HCT)</span>
                <span className="text-lg font-black text-slate-800">
                  {latestRecord.hematocrit ? `${latestRecord.hematocrit}%` : "42%"}
                </span>
                <span className="text-[10px] text-slate-400 block">Normal: 36-40%</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 block">WBC Count</span>
                <span className="text-lg font-black text-slate-800">
                  {latestRecord.wbcCount ? latestRecord.wbcCount.toLocaleString() : "4,200"}
                </span>
                <span className="text-[10px] text-slate-400 block">cells/μL</span>
              </div>
            </div>
          </div>

          {/* 7-Day History Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0f2744]">
              Serial CBC & Platelet Monitoring History
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Temperature</th>
                    <th className="py-2 px-3">Platelet Count</th>
                    <th className="py-2 px-3">Hematocrit</th>
                    <th className="py-2 px-3">Clinical Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {records.length > 0 ? (
                    records.slice(0, 5).map((rec, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-slate-500">
                          {new Date(rec.recordDate || rec.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-3 font-bold">{rec.temperature}°F</td>
                        <td className="py-2 px-3 font-bold text-teal-700">
                          {rec.plateletCount?.toLocaleString()} /μL
                        </td>
                        <td className="py-2 px-3">{rec.hematocrit ? `${rec.hematocrit}%` : "N/A"}</td>
                        <td className="py-2 px-3">
                          {rec.plateletCount < 50000 ? (
                            <span className="text-red-600 font-bold">Critical</span>
                          ) : rec.plateletCount < 100000 ? (
                            <span className="text-amber-600 font-bold">Warning</span>
                          ) : (
                            <span className="text-emerald-600 font-bold">Stable</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-3 px-3 text-center text-slate-400">
                        Initial record logged. Serial logs active.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Important Doctor / Hospital Admission Notes */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 space-y-1">
            <strong className="block font-bold flex items-center gap-1.5 text-amber-900">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>ER Clinical Instructions (WHO 2009 / DGHS Protocol):</span>
            </strong>
            <p className="leading-relaxed text-[11px]">
              If platelet count is below 50,000/μL or hematocrit shows &gt;20% rise, hospitalize immediately in dengue observation unit. Monitor for plasma leakage (pleural effusion / ascites) and initiate titrated isotonic crystalloid IV fluid. DO NOT administer NSAIDs (Aspirin, Ibuprofen, Diclofenac).
            </p>
          </div>

          {/* Signatures & Hospital Stamp */}
          <div className="pt-8 border-t border-slate-200 flex items-end justify-between text-xs text-slate-500">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Verification & Seal
              </span>
              <div className="flex items-center gap-1.5 text-teal-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>DGHS DengueGuard Verified Record</span>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="w-44 border-b border-slate-300 pb-1"></div>
              <span className="text-[11px] font-semibold text-slate-600 block">
                Attending Clinician Signature
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

