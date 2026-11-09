"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Shield,
  AlertTriangle,
  Bug,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Droplets,
  Sun,
  Activity,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MedicalDisclaimer from "@/components/common/MedicalDisclaimer";

const MYTHS_AND_FACTS = [
  {
    question: "Myth: Dengue mosquitoes only breed in dirty, sewage water.",
    myth: "Dengue mosquitoes breed in contaminated drain or sewage water.",
    fact: "Aedes mosquitoes breed almost exclusively in clean, stagnant water—such as roof water, flowerpots, plastic containers, discarded tires, and AC drainage trays.",
  },
  {
    question: "Myth: Platelet transfusion is mandatory whenever platelet count falls below 50,000.",
    myth: "Every dengue patient with platelets under 50,000 needs an emergency platelet transfusion.",
    fact: "According to WHO & DGHS guidelines, prophylactic platelet transfusion is generally unnecessary unless active bleeding is present or count drops below 10,000-20,000/μL. Excessive transfusions can trigger fluid overload.",
  },
  {
    question: "Myth: Dengue cannot happen to someone who already had it before.",
    myth: "Having dengue once grants lifelong immunity to all dengue fevers.",
    fact: "There are four distinct virus serotypes (DENV-1, DENV-2, DENV-3, DENV-4). Infection with one gives lifelong immunity to that serotype only. Subsequent infection with a different serotype significantly increases the risk of Severe Dengue due to Antibody-Dependent Enhancement (ADE).",
  },
  {
    question: "Myth: A patient is out of danger as soon as high fever drops.",
    myth: "The disease has resolved once the fever temperature normalizes.",
    fact: "The Critical Phase (Days 3 to 7) begins exactly when fever subsides. This is the 24-48 hour window of plasma leakage, shock, and acute platelet drop requiring strictest clinical observation.",
  },
  {
    question: "Myth: Papaya leaf extract cures dengue fever.",
    myth: "Papaya leaf juice is a scientifically proven cure that eliminates dengue virus.",
    fact: "There is no verified antiviral cure for dengue. While some small studies observed modest platelet stabilization with papaya extracts, supportive oral rehydration (ORS, coconut water, fluids) and strict medical supervision are the only clinically validated treatments.",
  },
];

export default function AwarenessPage() {
  const [openMythIndex, setOpenMythIndex] = useState<number | null>(0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-teal-600" />
          <span>Clinical & Community Education</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0f2744] tracking-tight">
          Understanding Dengue: Transmission, Risks & Facts
        </h1>
        <p className="text-slate-600 text-base md:text-lg leading-relaxed">
          Comprehensive, evidence-based health guidance compiled in alignment with the World Health Organization (WHO) and Directorate General of Health Services (DGHS) Bangladesh clinical protocols.
        </p>
      </div>

      <MedicalDisclaimer />

      {/* 1. What is Dengue & Serotypes */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <Badge variant="navy">VIROLOGY & EPIDEMIOLOGY</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2744]">
              What is Dengue Fever?
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Dengue is a mosquito-borne viral infection caused by the dengue virus (DENV), a member of the <em>Flaviviridae</em> family. It is transmitted to humans through the bites of infected female mosquitoes, primarily <strong>Aedes aegypti</strong> and, to a lesser extent, <strong>Aedes albopictus</strong>.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-teal-50/70 border border-teal-200/80 space-y-3">
            <h3 className="font-bold text-[#0f2744] text-base flex items-center gap-2">
              <Bug className="w-4 h-4 text-teal-700" />
              The Four Serotypes (DENV-1, DENV-2, DENV-3, DENV-4)
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Recovery from infection provides lifelong immunity against that specific serotype. However, cross-immunity to other serotypes is only partial and temporary. Subsequent infections with other serotypes increase the risk of severe dengue (Dengue Hemorrhagic Fever / Dengue Shock Syndrome).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1.5">
              <Sun className="w-5 h-5 text-amber-500" />
              <h4 className="font-bold text-[#0f2744] text-sm">Daytime Biting Behavior</h4>
              <p className="text-xs text-slate-600">
                Aedes mosquitoes bite predominantly during the day, with peak activity in the early morning (dawn) and late afternoon before dusk.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1.5">
              <Droplets className="w-5 h-5 text-teal-600" />
              <h4 className="font-bold text-[#0f2744] text-sm">Clean Stagnant Water</h4>
              <p className="text-xs text-slate-600">
                They lay eggs on the walls of water-filled containers. Eggs can withstand desiccation for months and hatch within days of contact with fresh water.
              </p>
            </div>
          </div>
        </div>

        {/* Right Info Card: The 3 Clinical Phases */}
        <div className="lg:col-span-5">
          <Card className="border-teal-200 shadow-md bg-gradient-to-br from-white to-teal-50/30">
            <CardHeader className="space-y-2">
              <Badge variant="teal">CLINICAL STAGING</Badge>
              <CardTitle className="text-lg text-[#0f2744]">
                The Three Phases of Dengue
              </CardTitle>
              <CardDescription className="text-xs">
                Understanding these phases saves lives by preventing premature discharge during plasma leakage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-[#0f2744] font-bold text-sm">1. Febrile Phase</strong>
                  <span className="text-teal-700 font-semibold">Days 1 - 3</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Sudden onset of high-grade fever (103°F - 105°F), retro-orbital eye pain, severe myalgia, facial flushing, and mild hemorrhagic signs (petechiae).
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-red-900 font-bold text-sm">2. Critical Phase</strong>
                  <span className="text-red-700 font-bold">Days 3 - 7 (24-48 hrs)</span>
                </div>
                <p className="text-red-950 leading-relaxed">
                  Fever abruptly drops. Increased capillary permeability triggers plasma leakage, hemoconcentration (rising hematocrit), and rapid platelet drop. Risk of shock.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-emerald-900 font-bold text-sm">3. Recovery Phase</strong>
                  <span className="text-emerald-700 font-semibold">Days 7 - 10</span>
                </div>
                <p className="text-emerald-950 leading-relaxed">
                  Gradual fluid reabsorption, stabilization of vitals, steady rebound of platelet count, improved appetite, and characteristic &quot;islands of white in a sea of red&quot; rash.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2. High-Risk Mosquito Breeding Hotspots */}
      <section className="space-y-6">
        <div className="space-y-2">
          <Badge variant="navy">SOURCE REDUCTION</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2744]">
            Common Mosquito Breeding Grounds
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl">
            Aedes mosquitoes can breed in as little as 1 teaspoon of stagnant water. Inspect these high-risk areas every 3 days:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="p-5 space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-800 font-bold">
              01
            </div>
            <h4 className="font-bold text-[#0f2744] text-base">AC Drainage Trays</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Air conditioner condensation trays and outdoor compressor piping retain unevaporated clean water ideal for mosquito egg deposition.
            </p>
          </Card>

          <Card className="p-5 space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-800 font-bold">
              02
            </div>
            <h4 className="font-bold text-[#0f2744] text-base">Flower Pots & Trays</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Plates beneath indoor plants, rooftop gardening pots, and decorative money plant water bottles collect water that is rarely changed.
            </p>
          </Card>

          <Card className="p-5 space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-800 font-bold">
              03
            </div>
            <h4 className="font-bold text-[#0f2744] text-base">Discarded Tires & Cans</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automobile scrap tires, discarded coconut shells, polystyrene boxes, and beverage cans accumulate rainwater in urban yards.
            </p>
          </Card>

          <Card className="p-5 space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-800 font-bold">
              04
            </div>
            <h4 className="font-bold text-[#0f2744] text-base">Overhead Tanks & Wells</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Uncovered rooftop water storage tanks, basement construction reservoirs, and open sumps provide vast breeding surfaces.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. Interactive Myths vs. Facts Accordion */}
      <section className="space-y-6">
        <div className="space-y-2">
          <Badge variant="teal">FACT-CHECKING DESK</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2744]">
            Dengue Myths vs. Medical Facts
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl">
            Debunking hazardous health misconceptions with evidence-based clinical facts.
          </p>
        </div>

        <div className="space-y-3">
          {MYTHS_AND_FACTS.map((item, index) => {
            const isOpen = openMythIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenMythIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50/70 transition-colors"
                >
                  <span className="font-bold text-[#0f2744] text-sm sm:text-base pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-teal-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3 text-xs sm:text-sm">
                    <div className="flex items-start gap-2.5 text-red-800 bg-red-50 p-3 rounded-lg border border-red-100">
                      <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Common Myth: </strong>
                        <span>{item.myth}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-emerald-900 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Clinical Fact: </strong>
                        <span>{item.fact}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Bottom Action Card */}
      <section className="p-8 rounded-2xl bg-gradient-to-r from-[#0f2744] to-[#16365c] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl font-bold">Experiencing persistent high fever?</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Use our interactive clinical triage tool to check warning signs and determine if immediate medical care is advised.
          </p>
        </div>
        <Link href="/symptoms" className="shrink-0">
          <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-[#0f2744] font-bold gap-2">
            <span>Symptom Triage Tool</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}

