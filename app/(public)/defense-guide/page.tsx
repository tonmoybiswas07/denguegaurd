"use client";

import React from "react";
import Link from "next/link";
import {
  Printer,
  Shield,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Layers,
  Lock,
  Database,
  Code2,
  Server,
  Sparkles,
  HelpCircle,
  Award,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DefenseGuidePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans print:p-0 print:bg-white text-slate-800">
      {/* Floating Action Bar (Hidden during Print) */}
      <div className="max-w-4xl mx-auto mb-6 print:hidden flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0f2744]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">
            পিডিএফ সেভ করতে ডানপাশের বাটনে চাপুন 👉
          </span>
          <Button
            onClick={handlePrint}
            className="bg-[#0f2744] hover:bg-[#16365c] text-white font-bold text-xs h-10 px-5 rounded-xl gap-2 shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Download / Save as PDF</span>
          </Button>
        </div>
      </div>

      {/* Main Document Container */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-14 space-y-10 print:shadow-none print:border-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-[#0f2744] pb-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0f2744] text-teal-400 flex items-center justify-center font-black">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0f2744] tracking-tight">
                  DengueGuard – স্মার্ট ডেঙ্গু প্রিভেনশন অ্যান্ড ম্যানেজমেন্ট সিস্টেম
                </h1>
                <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block">
                  BSc in CSE 4th-Year Capstone Project • Final Defense & Interview Master Guide
                </span>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500 hidden sm:block">
              <span className="font-bold text-slate-800 block">Student: Tonmoy Biswas</span>
              <span>CSE 4th-Year Defense</span>
            </div>
          </div>
        </div>

        {/* 1. Project Pitch */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-[#0f2744] flex items-center gap-2 border-b pb-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <span>১. প্রজেক্টের ১ মিনিটের এলিভেটর পিচ (Elevator Pitch)</span>
          </h2>
          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 text-sm leading-relaxed text-slate-800 font-medium">
            <p>
              &ldquo;<strong>DengueGuard</strong> হলো একটি সমন্বিত হেলথকেয়ার ইনফরমেটিক্স প্ল্যাটফর্ম, যা বাংলাদেশে ডেঙ্গু মহামারীর সময় রোগীদের ক্লিনিক্যাল ট্রায়াজ, দৈনিক প্লাটিলেট টেলিমেট্রি ট্র্যাকিং, হাসপাতালের আইসিইউ ও সাধারণ বেডের প্রাপ্যতা যাচাই এবং গোপনীয়তা বজায় রেখে রক্তের প্লাটিলেট দাতা খুঁজে পাওয়ার সম্পূর্ণ ডিজিটাল সমাধান প্রদান করে। এটি বিশ্ব স্বাস্থ্য সংস্থা (WHO) ও ডিজিএইচএস (DGHS) এর ক্লিনিক্যাল প্রোটোকল মেনে তৈরি করা হয়েছে।&rdquo;
            </p>
          </div>
        </section>

        {/* 2. Problem Statement */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-[#0f2744] flex items-center gap-2 border-b pb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>২. বাস্তব সমস্যা ও প্রজেক্টের উদ্দেশ্য (Motivation & Problem Statement)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block font-bold">১. সময়মতো প্লাজমা লিকেজ শনাক্তের অভাব:</strong>
              <p className="text-slate-600">
                ডেঙ্গুর জ্বর কমার সময় (Days 3-6) রোগীরা সুস্থ মনে করে ভুল করে, অথচ এই ক্রcritical phase-এই প্লাটিলেট মারাত্মকভাবে ড্রপ করে ও রক্তক্ষরণ ঘটে।
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block font-bold">২. হাসপাতালের বেড ও আইসিইউ তথ্যের সংকট:</strong>
              <p className="text-slate-600">
                মুমূর্ষু রোগী নিয়ে স্বজনেরা এক হাসপাতাল থেকে অন্য হাসপাতালে ছোটাছুটি করে সময় নষ্ট করে।
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block font-bold">৩. রক্তদাতার নিরাপত্তা ও গোপনীয়তার ঝুঁকি:</strong>
              <p className="text-slate-600">
                সোশ্যাল মিডিয়ায় ফোন নম্বর পাবলিকলি দেওয়ার ফলে নারীরা হ্যারাসমেন্টের শিকার হয় এবং ভুয়া রক্তদাতার কারণে বিভ্রান্তি তৈরি হয়।
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block font-bold">৪. ভুল ওষুধের ব্যবহার (Aspirin/NSAIDs):</strong>
              <p className="text-slate-600">
                জনগণের সচেতনতার অভাবে ব্যথানাশক খাওয়ার ফলে অভ্যন্তরীণ রক্তক্ষরণ ও মৃত্যুহার বৃদ্ধি পায়।
              </p>
            </div>
          </div>
        </section>

        {/* 3. Tech Stack */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-[#0f2744] flex items-center gap-2 border-b pb-2">
            <Code2 className="w-5 h-5 text-blue-600" />
            <span>৩. টেকনোলজি স্ট্যাক ও স্থাপত্য (Technology Stack)</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Frontend</span>
              <strong className="text-slate-800 text-sm block">Next.js 16 (App Router)</strong>
              <span className="text-slate-500 text-[11px]">React 19 + TypeScript</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Styling & UI</span>
              <strong className="text-slate-800 text-sm block">Tailwind CSS v4</strong>
              <span className="text-slate-500 text-[11px]">Lucide Icons + Framer Motion</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Database</span>
              <strong className="text-slate-800 text-sm block">MongoDB Atlas</strong>
              <span className="text-slate-500 text-[11px]">Mongoose ODM + Multi-node Cluster</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Security & Auth</span>
              <strong className="text-slate-800 text-sm block">JWT + RBAC + Bcrypt</strong>
              <span className="text-slate-500 text-[11px]">Google & GitHub OAuth 2.0</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Data Visualization</span>
              <strong className="text-slate-800 text-sm block">Recharts</strong>
              <span className="text-slate-500 text-[11px]">Serial CBC Platelet Charts</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">GIS & Mapping</span>
              <strong className="text-slate-800 text-sm block">Leaflet + OpenStreetMap</strong>
              <span className="text-slate-500 text-[11px]">Hospital Location GPS</span>
            </div>
          </div>
        </section>

        {/* 4. Core Modules */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-[#0f2744] flex items-center gap-2 border-b pb-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>৪. প্রজেক্টের প্রধান ফিচার ও মডিউলসমূহ (Core Modules)</span>
          </h2>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-800 text-sm block">১. স্মার্ট সিম্পটম ট্রায়াজ ইঞ্জিন (Triage Engine):</strong>
              <p className="text-slate-600 mt-0.5">
                রোগীর বয়স, জ্বরের দিন এবং রেড ফ্ল্যাগ সিম্পটম (পেটে তীব্র ব্যথা, নাক/দাঁত দিয়ে রক্ত পড়া, ঘনঘন বমি) বিশ্লেষণ করে ৩টি ক্যাটাগরিতে (Green: হোম কেয়ার, Amber: ডাক্তার পরামর্শ, Red: জরুরি হাসপাতালে ভর্তি) সিদ্ধান্ত প্রদান করে।
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-800 text-sm block">২. এআই/এমএল সিভিয়ারিটি ও প্লাজমা লিকেজ প্রেডিক্টর:</strong>
              <p className="text-slate-600 mt-0.5">
                রোগীর হেমাটোক্রিট (HCT %) বৃদ্ধি ও প্লাটিলেটের ড্রপ ভেলোসিটি বিশ্লেষণ করে ০-১০০ স্কেলে রিস্ক স্কোর এবং প্লাজমা লিকেজের সম্ভাবনা নির্ধারণ করে।
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-800 text-sm block">৩. ভেরিফাইড হাসপাতাল ও আইসিইউ বেড ডিরেক্টরি:</strong>
              <p className="text-slate-600 mt-0.5">
                বাংলাদেশের সরকারি ও বেসরকারি হাসপাতালের মোট ডেঙ্গু বেড, আইসিইউ সংখ্যা, জরুরি ফোন নম্বর এবং ইন্টারেক্টিভ ম্যাপ ভিউ।
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-800 text-sm block">৪. প্রাইভেসি-ফার্স্ট রক্ত ও প্লাটিলেট দাতা নেটওয়ার্ক:</strong>
              <p className="text-slate-600 mt-0.5">
                রক্তদাতার ব্যক্তিগত ফোন নম্বর সুরক্ষিত রেখে ইন-অ্যাপ রিকোয়েস্টের মাধ্যমে দাতা ও রোগীর মধ্যে সংযোগ তৈরি করে।
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-800 text-sm block">৫. পেশেন্ট ড্যাশবোর্ড ও ১-ক্লিক প্রিন্ট মেডিকেল পাস:</strong>
              <p className="text-slate-600 mt-0.5">
                রোগী প্রতিদিনের শরীরের তাপমাত্রা ও সিবিসি রিপোর্ট ট্র্যাকিং করতে পারে এবং এক ক্লিকে হাসপাতালে ভর্তির জন্য অফিসিয়াল মেডিকেল সামারি পিডিএফ প্রিন্ট করতে পারে।
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-800 text-sm block">৬. ডাক্তার ও অ্যাডমিন কনট্রোল প্যানেল:</strong>
              <p className="text-slate-600 mt-0.5">
                ডাক্তারদের BMDC রেজিস্ট্রেশন ভেরিফিকেশন, রোগীদের অ্যাপয়েন্টমেন্ট ম্যানেজমেন্ট এবং সম্পূর্ণ সিস্টেমের সিকিউরিটি অডিট লগস।
              </p>
            </div>
          </div>
        </section>

        {/* 5. Security & Privacy */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-[#0f2744] flex items-center gap-2 border-b pb-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            <span>৫. সিকিউরিটি ও প্রাইভেসি প্রোটোকল (Security Protocols)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <strong className="text-emerald-900 block font-bold">Role-Based Access Control (RBAC):</strong>
              <p className="text-emerald-800 mt-0.5">
                রোগী, ডাক্তার ও অ্যাডমিনের জন্য ব্যাকএন্ডে সার্ভার-সাইড ভ্যালিডেশন (`getSession` ও JWT ভেরিফিকেশন)।
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <strong className="text-emerald-900 block font-bold">Password & Data Protection:</strong>
              <p className="text-emerald-800 mt-0.5">
                Bcrypt অ্যালগরিদম দিয়ে ১০ রাউন্ড সল্টিং পাসওয়ার্ড হ্যাশিং। কখনোই র পাসওয়ার্ড ডাটাবেজে রাখা হয় না।
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <strong className="text-emerald-900 block font-bold">Donor Privacy Guard:</strong>
              <p className="text-emerald-800 mt-0.5">
                Mongoose স্কিমায় ফোন নম্বরে `select: false` রাখা হয়েছে যেন পাবলিক এপিআই দিয়ে কোনোভাবেই ডাটা লিক না হয়।
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <strong className="text-emerald-900 block font-bold">Medical Disclaimer Compliance:</strong>
              <p className="text-emerald-800 mt-0.5">
                সিস্টেমটি রোগীকে কোনো ওষুধ প্রেসক্রাইব করে না, শুধুমাত্র জরুরি ট্রায়াজ সতর্কতা দিয়ে দ্রুত ডাক্তার দেখানোর পরামর্শ দেয়।
              </p>
            </div>
          </div>
        </section>

        {/* 6. Top 15 Viva Questions & Answers */}
        <section className="space-y-4">
          <h2 className="text-lg font-black text-[#0f2744] flex items-center gap-2 border-b pb-2">
            <HelpCircle className="w-5 h-5 text-rose-600" />
            <span>৬. ভাইভায় শিক্ষকরা যে প্রশ্নগুলো ধরবেন এবং তাদের আদর্শ উত্তর (Top Viva Q&A)</span>
          </h2>

          <div className="space-y-3 text-xs leading-relaxed">
            {/* Q1 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
              <span className="font-bold text-[#0f2744] block">
                প্রশ্ন ১: প্রজেক্টে কেন Next.js App Router ব্যবহার করেছেন? সাধারণ React নয় কেন?
              </span>
              <p className="text-slate-600">
                <strong>উত্তর:</strong> Next.js App Router আমাদের Server Components ও Server-Side Rendering (SSR) সুবিধা দেয়। এতে পেজ লোডিং অনেক দ্রুত হয় এবং এসইও (SEO) ভালো হয়। এছাড়া API Routes একই কোডবেসে হ্যান্ডেল করা যায় এবং সার্ভার-সাইড সিকিউরিটি সহজে নিয়ন্ত্রণ করা যায়।
              </p>
            </div>

            {/* Q2 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
              <span className="font-bold text-[#0f2744] block">
                প্রশ্ন ২: MongoDB কেন বেছে নিলেন? রিলেশনাল ডাটাবেজ (MySQL) কেন নয়?
              </span>
              <p className="text-slate-600">
                <strong>উত্তর:</strong> রোগীর স্বাস্থ্য রেকর্ড (যেমন রক্তচাপ, প্লাটিলেট, ভিন্ন ভিন্ন লক্ষণ) সেমি-স্ট্রাকচার্ড এবং সময়ে সময়ে নতুন প্যারামিটার যুক্ত হতে পারে। MongoDB-র ফ্লেক্সিবল NoSQL স্কিমা এবং দ্রুত JSON হ্যান্ডলিং ক্ষমতা হেলথকেয়ার ডাটার জন্য অত্যন্ত উপযোগী।
              </p>
            </div>

            {/* Q3 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
              <span className="font-bold text-[#0f2744] block">
                প্রশ্ন ৩: সিস্টেম কি কোনো ক্লিনিক্যাল ডায়াগনসিস করে ওষুধ দিতে পারে?
              </span>
              <p className="text-slate-600">
                <strong>উত্তর:</strong> না। সফটওয়্যার কখনোই ডাক্তারের বিকল্প হতে পারে না। আমাদের সিস্টেম শুধুমাত্র বিশ্ব স্বাস্থ্য সংস্থার স্ট্যান্ডার্ড অনুযায়ী রোগীর ঝুঁকি (Risk Level) মূল্যায়ন করে এবং হাসপাতালে রেফার করে। আমরা ইচ্ছাকৃতভাবেই কোনো প্রেসক্রিপশন জেনারেশন রাখিনি যাতে ভুল চিকিৎসার ঝুঁকি তৈরি না হয়।
              </p>
            </div>

            {/* Q4 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
              <span className="font-bold text-[#0f2744] block">
                প্রশ্ন ৪: প্লাজমা লিকেজ প্রেডিকশন মডেলটি কীভাবে কাজ করে?
              </span>
              <p className="text-slate-600">
                <strong>উত্তর:</strong> এটি মূলত জ্বরের ৩-৬তম দিনের ক্রcritical defervescence উইন্ডো, হেমাটোক্রিটের ২০% এর বেশি বৃদ্ধি (যা রক্তনালী থেকে প্লাজমা বেরিয়ে যাওয়ার প্রমাণ) এবং প্লাটিলেট কাউন্ট ১০০,০০০ এর নিচে নামার গতিবেগ বিশ্লেষণ করে একটি গাণিতিক রিস্ক ইনডেক্স (০-১০০) গণনা করে।
              </p>
            </div>

            {/* Q5 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
              <span className="font-bold text-[#0f2744] block">
                প্রশ্ন ৫: রক্তদাতার ফোন নম্বর কীভাবে সুরক্ষিত রাখা হয়েছে?
              </span>
              <p className="text-slate-600">
                <strong>উত্তর:</strong> Mongoose মডেলে ফোন নম্বরের ফিল্ডে `select: false` দেওয়া আছে। পাবলিক এপিআই কল করলে ডাটাবেজ থেকে ফোন নম্বর ফেরত আসে না। রোগী শুধু ব্লাড গ্রুপ ও এরিয়া দিয়ে সার্চ করে অ্যাপের মাধ্যমে ফর্ম সাবমিট করতে পারে, ফলে অনাকাঙ্ক্ষিত কল বা হ্যারাসমেন্ট প্রতিরোধ করা সম্ভব হয়।
              </p>
            </div>

            {/* Q6 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
              <span className="font-bold text-[#0f2744] block">
                প্রশ্ন ৬: অথেনটিকেশনে কোন মেকানিজম ব্যবহার করেছেন?
              </span>
              <p className="text-slate-600">
                <strong>উত্তর:</strong> আমরা JSON Web Token (JWT) ব্যবহার করেছি যা HttpOnly সিকিউর কুকিতে সংরক্ষিত থাকে। এছাড়া পাসওয়ার্ড সুরক্ষার জন্য Bcrypt দিয়ে সল্টিং করা হয়। একইসাথে Google ও GitHub OAuth 2.0 সোশ্যাল সাইন-ইন সমর্থন করে।
              </p>
            </div>

            {/* Q7 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
              <span className="font-bold text-[#0f2744] block">
                প্রশ্ন ৭: ডাক্তারদের কীভাবে ভেরিফাই করা হয়?
              </span>
              <p className="text-slate-600">
                <strong>উত্তর:</strong> ডাক্তার রেজিস্ট্রেশনের সময় BMDC (বাংলাদেশ মেডিকেল অ্যান্ড ডেন্টাল কাউন্সিল) রেজিস্ট্রেশন নম্বর এবং হাসপাতাল সংযুক্তি জমা নেওয়া হয়। অ্যাডমিন তার ড্যাশবোর্ড থেকে তথ্য যাচাই করে 'Approved' বা 'Rejected' করতে পারে।
              </p>
            </div>
          </div>
        </section>

        {/* Footer Signature Block */}
        <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            <span className="font-bold text-[#0f2744] block">DengueGuard Healthcare Informatics</span>
            <span>Prepared for BSc in Computer Science & Engineering Final Year Defense</span>
          </div>
          <div className="text-right">
            <span>Project Grade Target: <strong>A+ (Outstanding)</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

