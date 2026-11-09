"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Thermometer,
  FileText,
  Calendar,
  Plus,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Clock,
  Heart,
  Droplet,
  ShieldAlert,
  Send,
  User,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PatientDashboardPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [tempInput, setTempInput] = useState("101.5");
  const [plateletInput, setPlateletInput] = useState("120000");
  const [hematocritInput, setHematocritInput] = useState("42");
  const [wbcInput, setWbcInput] = useState("4500");
  const [notesInput, setNotesInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [recRes, appRes] = await Promise.all([
        fetch("/api/patient/records"),
        fetch("/api/patient/appointments"),
      ]);

      const recData = await recRes.json();
      const appData = await appRes.json();

      if (recData.success) setRecords(recData.data || []);
      if (appData.success) setAppointments(appData.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/patient/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temperature: parseFloat(tempInput),
          plateletCount: parseInt(plateletInput),
          hematocrit: hematocritInput ? parseFloat(hematocritInput) : undefined,
          wbcCount: wbcInput ? parseInt(wbcInput) : undefined,
          symptoms: ["Fever", "Body aches"],
          notes: notesInput,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNotesInput("");
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const latestRecord = records[0] || {
    temperature: 101.2,
    plateletCount: 115000,
    hematocrit: 43,
    wbcCount: 4100,
    recordDate: new Date().toISOString(),
  };

  // Platelet Safety Tier
  const platelets = latestRecord.plateletCount || 150000;
  let plateletStatus: {
    text: string;
    color: string;
    bg: string;
    badge: "success" | "destructive" | "warning" | "teal";
  } = {
    text: "Normal",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    badge: "success",
  };
  if (platelets < 50000) {
    plateletStatus = { text: "Critical Thrombocytopenia", color: "text-red-600", bg: "bg-red-50", badge: "destructive" };
  } else if (platelets < 100000) {
    plateletStatus = { text: "Moderate Drop (Caution)", color: "text-amber-600", bg: "bg-amber-50", badge: "warning" };
  } else if (platelets < 150000) {
    plateletStatus = { text: "Mild Thrombocytopenia", color: "text-teal-700", bg: "bg-teal-50", badge: "teal" };
  }

  // Chart data formatted chronologically
  const chartData = [...records].reverse().map((r, i) => ({
    time: new Date(r.recordDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    temperature: r.temperature,
    platelets: Math.round(r.plateletCount / 1000), // in thousands
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="teal">PATIENT CARE CONSOLE</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f2744] mt-1">
            Personal Health & Platelet Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Log your daily fever and CBC laboratory markers. Only you and authorized physicians can review these records.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold gap-2 self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Log Daily Vitals / CBC</span>
        </Button>
      </div>

      {/* Critical Platelet Warning if < 50,000 */}
      {platelets < 50000 && (
        <div className="p-4 rounded-xl bg-red-600 text-white flex items-center justify-between gap-4 shadow-lg animate-pulse">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <div>
              <strong className="block text-sm font-black">CRITICAL ALERT: Platelet Count Under 50,000/μL</strong>
              <p className="text-xs text-red-100">
                You are at risk of spontaneous mucosal bleeding. Hospital evaluation is urgently required.
              </p>
            </div>
          </div>
          <a
            href="tel:16263"
            className="shrink-0 px-4 py-2 bg-white text-red-700 rounded-lg font-bold text-xs hover:bg-slate-100"
          >
            Call 16263
          </a>
        </div>
      )}

      {/* KPI Vitals Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Body Temperature</span>
            <Thermometer className="w-4 h-4 text-red-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-[#0f2744] block">
            {latestRecord.temperature}°F
          </span>
          <span className="text-[11px] text-slate-500 block">
            {latestRecord.temperature > 100.4 ? "Febrile state detected" : "Normal temperature"}
          </span>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Platelet Count</span>
            <Droplet className="w-4 h-4 text-teal-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-[#0f2744] block">
            {platelets.toLocaleString()}{" "}
            <span className="text-xs font-normal text-slate-400">/μL</span>
          </span>
          <Badge variant={plateletStatus.badge} className="text-[10px]">
            {plateletStatus.text}
          </Badge>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Hematocrit (PCV)</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-[#0f2744] block">
            {latestRecord.hematocrit || 42}%
          </span>
          <span className="text-[11px] text-slate-500 block">
            Plasma leakage indicator
          </span>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Active Consultations</span>
            <Calendar className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-[#0f2744] block">
            {appointments.length}
          </span>
          <span className="text-[11px] text-teal-700 font-semibold block">
            {appointments[0]?.status === "confirmed" ? "Confirmed upcoming" : "In review"}
          </span>
        </Card>
      </div>

      {/* Interactive Chart */}
      <Card className="p-6 space-y-4">
        <div>
          <Badge variant="navy">LONGITUDINAL MONITORING</Badge>
          <h3 className="text-lg font-bold text-[#0f2744] mt-1">
            Platelet Count & Temperature Curve
          </h3>
          <p className="text-xs text-slate-500">
            Track daily CBC fluctuations to detect recovery phase turnaround.
          </p>
        </div>

        <div className="w-full h-72 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
              <YAxis yAxisId="left" stroke="#dc2626" fontSize={11} domain={[96, 105]} />
              <YAxis yAxisId="right" orientation="right" stroke="#0d9488" fontSize={11} domain={[0, 300]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Line yAxisId="left" type="monotone" dataKey="temperature" name="Temp (°F)" stroke="#dc2626" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="platelets" name="Platelets (x1000/μL)" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Health Record History Table */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#0f2744]">
              CBC & Vitals Entry History
            </h3>
            <p className="text-xs text-slate-500">
              Audit log of all verified laboratory values and clinical logs.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Temperature</th>
                <th className="py-3 px-4">Platelets</th>
                <th className="py-3 px-4">Hematocrit</th>
                <th className="py-3 px-4">Clinical Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-700">
                    {new Date(r.recordDate).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-4 font-bold text-red-600">
                    {r.temperature}°F
                  </td>
                  <td className="py-3 px-4 font-bold text-teal-700">
                    {r.plateletCount.toLocaleString()}/μL
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-mono">
                    {r.hematocrit ? `${r.hematocrit}%` : "—"}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                    {r.notes || "Standard daily check"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Doctor Appointments & Follow-up Notes */}
      <Card className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-[#0f2744]">
            Attending Doctor Consultation & Notes
          </h3>
          <p className="text-xs text-slate-500">
            Review instructions and advice provided by your authorized physician.
          </p>
        </div>

        <div className="space-y-3">
          {appointments.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No active appointments yet.</p>
          ) : (
            appointments.map((app, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0f2744] text-sm">
                    {app.doctorId?.name || "Consultant Physician"}
                  </span>
                  <Badge variant={app.status === "confirmed" ? "success" : "secondary"}>
                    {app.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                  <span>Slot: {app.timeSlot}</span>
                  <span>Date: {new Date(app.date).toLocaleDateString()}</span>
                </div>

                {app.doctorNotes && (
                  <div className="p-3 rounded-lg bg-teal-50 border border-teal-100 text-teal-900 mt-2">
                    <strong className="block text-teal-950 font-bold mb-1">
                      Doctor Follow-Up Instructions:
                    </strong>
                    <p>{app.doctorNotes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* LOG VITALS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0f2744]">
                Log Daily Temperature & CBC Platelets
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Temperature (°F):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={tempInput}
                    onChange={(e) => setTempInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Platelet Count (/μL):
                  </label>
                  <input
                    type="number"
                    required
                    value={plateletInput}
                    onChange={(e) => setPlateletInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Hematocrit (PCV %):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 43"
                    value={hematocritInput}
                    onChange={(e) => setHematocritInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    WBC Count (/μL):
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 3800"
                    value={wbcInput}
                    onChange={(e) => setWbcInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Symptoms & Notes:
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Mild joint pain, appetite improving, drinking 3L water."
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  {isSubmitting ? "Saving..." : "Save Record"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
