"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  BarChart3,
  Calendar,
  Filter,
  Info,
  TrendingUp,
  AlertTriangle,
  Building,
  CheckCircle2,
  Thermometer,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_STATISTICS } from "@/lib/data/mockData";

export default function StatisticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"all" | "q3_q4" | "peak">("all");
  const [districtFilter, setDistrictFilter] = useState<string>("All");

  const monthlyData =
    selectedTimeframe === "peak"
      ? MOCK_STATISTICS.monthlyTrends.filter((item) => ["Jul", "Aug", "Sep", "Oct", "Nov"].includes(item.month))
      : MOCK_STATISTICS.monthlyTrends;

  const filteredDistricts =
    districtFilter === "All"
      ? MOCK_STATISTICS.districtComparison
      : MOCK_STATISTICS.districtComparison.filter((d) => d.district.toLowerCase().includes(districtFilter.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
          <span>Demo dataset</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0f2744] tracking-tight">
          Dengue statistics and trends
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Explore sample charts for admissions, district comparisons, and clinical trends.
        </p>
      </div>

      {/* Sourced Data Attribution Notice (Ethical Compliance) */}
      <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="leading-relaxed">
            <strong>Data Disclosure & Attribution:</strong> Statistical values displayed below are structured based on official historical bulletins published by the <em>Directorate General of Health Services (DGHS) Bangladesh Control Room</em>. This dataset is clearly labeled as academic simulated surveillance data for research demonstration and thesis evaluation.
          </p>
          <div className="text-[11px] text-blue-800">
            <span>Last Updated: {MOCK_STATISTICS.lastUpdated}</span> •{" "}
            <span>Source: {MOCK_STATISTICS.dataSource}</span>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5">
          <span className="text-xs text-slate-500 block">Total Surveillance Cases</span>
          <span className="text-2xl sm:text-3xl font-black text-[#0f2744] mt-1 block">
            {MOCK_STATISTICS.nationalOverview.totalCasesThisYear.toLocaleString()}
          </span>
          <span className="text-[11px] text-teal-700 font-semibold block mt-1">
            Nationwide Cumulative
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-slate-500 block">Total Recovered</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 block">
            {MOCK_STATISTICS.nationalOverview.totalRecovered.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            98.3% Recovery Ratio
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-slate-500 block">Active Hospitalized</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 block">
            {MOCK_STATISTICS.nationalOverview.activeHospitalized.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            Dedicated Dengue Wards
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-slate-500 block">Case Fatality Rate (CFR)</span>
          <span className="text-2xl sm:text-3xl font-black text-red-600 mt-1 block">
            {MOCK_STATISTICS.nationalOverview.caseFatalityRate}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            Below WHO Warning Threshold (&lt;1%)
          </span>
        </Card>
      </div>

      {/* 1. Monthly Trends Chart */}
      <Card className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="navy">SEASONAL PATTERN</Badge>
            <h3 className="text-lg font-bold text-[#0f2744] mt-1">
              Monthly Dengue Admissions & Hospitalizations
            </h3>
            <p className="text-xs text-slate-500">
              Demonstrates monsoon and post-monsoon transmission surges (July to November peak).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={selectedTimeframe === "all" ? "default" : "outline"}
              onClick={() => setSelectedTimeframe("all")}
              className="text-xs"
            >
              Full Year
            </Button>
            <Button
              size="sm"
              variant={selectedTimeframe === "peak" ? "default" : "outline"}
              onClick={() => setSelectedTimeframe("peak")}
              className="text-xs"
            >
              Peak Monsoon (Jul - Nov)
            </Button>
          </div>
        </div>

        <div className="w-full h-80 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Bar dataKey="cases" name="Total Reported Cases" fill="#0d9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="hospitalized" name="Severe Hospitalizations" fill="#0f2744" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 2. Clinical Phase Curve: Platelet vs Temperature (Crucial for Healthcare Project) */}
      <Card className="p-6 space-y-6">
        <div>
          <Badge variant="teal">CLINICAL INFORMATICS</Badge>
          <h3 className="text-lg font-bold text-[#0f2744] mt-1">
            Clinical Hemodynamic Correlation: Platelet Count vs. Fever Duration
          </h3>
          <p className="text-xs text-slate-500">
            Visualizing the paradox of the &quot;Critical Phase&quot;: Temperature drops sharply around Day 4, but Platelets deplete to dangerous nadir (40k-65k) due to plasma leakage.
          </p>
        </div>

        <div className="w-full h-80 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_STATISTICS.clinicalPhaseCurve} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis yAxisId="left" stroke="#dc2626" fontSize={12} domain={[96, 106]} label={{ value: "Temp (°F)", angle: -90, position: "insideLeft", fill: "#dc2626", fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#0d9488" fontSize={12} domain={[0, 300]} label={{ value: "Platelets (x1000/μL)", angle: 90, position: "insideRight", fill: "#0d9488", fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Line yAxisId="left" type="monotone" dataKey="temp" name="Body Temperature (°F)" stroke="#dc2626" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="platelets" name="Platelet Count (k/μL)" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-800 block">Febrile Phase (Days 1 - 3)</span>
            <span className="text-slate-500">High fever; stable or mildly declining platelets.</span>
          </div>
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <span className="font-bold text-red-900 block">Critical Phase (Days 4 - 6)</span>
            <span className="text-red-700">Fever normalizes; platelet count plummets into critical zone.</span>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="font-bold text-emerald-900 block">Recovery Phase (Days 7+)</span>
            <span className="text-emerald-700">Rapid platelet rebound; clinical stabilization.</span>
          </div>
        </div>
      </Card>

      {/* 3. District-wise Comparison Table */}
      <Card className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="navy">REGIONAL SURVEILLANCE</Badge>
            <h3 className="text-lg font-bold text-[#0f2744] mt-1">
              District-Level Case Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Comparative transmission density and localized risk categorization.
            </p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Filter by district..."
              value={districtFilter === "All" ? "" : districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value || "All")}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">District / Division</th>
                <th className="py-3 px-4">Reported Cases</th>
                <th className="py-3 px-4">Currently Hospitalized</th>
                <th className="py-3 px-4">Vector Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDistricts.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#0f2744]">
                    {item.district}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">
                    {item.cases.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-amber-700">
                    {item.hospitalized.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        item.risk === "High"
                          ? "destructive"
                          : item.risk === "Moderate"
                          ? "warning"
                          : "success"
                      }
                    >
                      {item.risk} Risk
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

