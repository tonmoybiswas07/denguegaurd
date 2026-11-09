"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Home,
  User,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  Sparkles,
  Clock,
  Droplets,
  Bug,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CHECKLIST_ITEMS = [
  { id: "c1", category: "Home", text: "Empty and scrub all flower pot saucers, vases, and pet bowls every 3 days." },
  { id: "c2", category: "Home", text: "Check and drain air conditioner condensation collection trays and piping." },
  { id: "c3", category: "Home", text: "Tightly cover overhead water tanks, cisterns, and emergency water buckets with tight mesh lids." },
  { id: "c4", category: "Home", text: "Inspect refrigerator defrost drip trays behind the appliance." },
  { id: "c5", category: "Personal", text: "Sleep under a mosquito bed net (especially for infants, elders, and daytime naps)." },
  { id: "c6", category: "Personal", text: "Apply DEET (20-30%) or Picaridin-based insect repellent on exposed skin." },
  { id: "c7", category: "Personal", text: "Wear loose-fitting, light-colored long-sleeved shirts and long trousers." },
  { id: "c8", category: "Community", text: "Discard or invert broken tires, coconut shells, and construction plastic scrap." },
  { id: "c9", category: "Community", text: "Ensure rainwater drainage sumps and roadside stormwater gullies remain free-flowing." },
];

export default function PreventionPage() {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Integrated Vector Management (IVM)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0f2744] tracking-tight">
          Comprehensive Dengue Prevention & Vector Control
        </h1>
        <p className="text-slate-600 text-base md:text-lg leading-relaxed">
          The most effective medical strategy against dengue is proactive source reduction. Since Aedes mosquitoes thrive inside human residences, consistent indoor and community hygiene breaks the transmission chain.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Home Prevention */}
        <Card className="border-teal-100 p-6 space-y-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <Home className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#0f2744]">1. Home Vector Control</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Target stagnant clean water inside and around your apartment or house:
            </p>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span><strong>The 3-Day Rule:</strong> Aedes larvae require 7-8 days to develop into flying mosquitoes. Emptying containers every 3 days disrupts the reproductive cycle completely.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span><strong>Scrub Container Walls:</strong> Mosquito eggs stick tenaciously to dry container walls. Scrub surfaces thoroughly with a brush and detergent.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span><strong>Window & Door Mesh:</strong> Install fine-wire mosquito screens on windows and balcony doors to prevent vector entry.</span>
            </li>
          </ul>
        </Card>

        {/* Personal Protection */}
        <Card className="border-teal-100 p-6 space-y-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#0f2744]">2. Personal Protection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Shield yourself from daytime bites during peak mosquito feeding hours:
            </p>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Approved Repellents:</strong> Use insect repellents containing DEET (20-30%), Picaridin, or Oil of Lemon Eucalyptus (OLE) approved by health authorities.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Protective Clothing:</strong> Wear light-colored clothing covering arms and legs. Dark colors attract Aedes mosquitoes.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Daytime Bed Nets:</strong> Always place infants, young children, and bedridden elders under insecticide-treated bed nets during afternoon sleep.</span>
            </li>
          </ul>
        </Card>

        {/* Community & Vector Elimination */}
        <Card className="border-teal-100 p-6 space-y-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#0f2744]">3. Community Action</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dengue mosquitoes fly up to 400 meters. Vector control requires neighbourhood cooperation:
            </p>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Roof & Basement Audits:</strong> Form building committees to inspect communal rooftops, elevator sumps, and car parking drainage weekly.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Construction Site Management:</strong> Ensure construction site reservoirs are treated with larvicide (e.g., Temephos or Bti) or drained.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Report Open Breeding Sites:</strong> Notify municipal city corporations (e.g., DNCC/DSCC) regarding abandoned plots or garbage dumping grounds.</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* Interactive Printable Checklist */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="teal">PRINTABLE PROTOCOL</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2744] mt-1">
              Weekly Dengue Inspection Checklist
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Perform this 10-minute inspection every Friday or Sunday to keep your residence mosquito-free.
            </p>
          </div>

          <Button
            onClick={handlePrint}
            variant="outline"
            className="border-slate-300 text-slate-800 hover:bg-slate-100 gap-2 shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>Print Checklist</span>
          </Button>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
            <span>Completed: {checkedIds.length} of {CHECKLIST_ITEMS.length} items</span>
            <span className="font-semibold text-teal-700">
              {Math.round((checkedIds.length / CHECKLIST_ITEMS.length) * 100)}% Protected
            </span>
          </div>

          <div className="space-y-3">
            {CHECKLIST_ITEMS.map((item) => {
              const isChecked = checkedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    isChecked
                      ? "border-teal-500 bg-teal-50/50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <div className="flex-1">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 mr-2">
                      {item.category}
                    </span>
                    <span className={`text-xs sm:text-sm ${isChecked ? "text-slate-500 line-through" : "text-slate-800 font-medium"}`}>
                      {item.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

