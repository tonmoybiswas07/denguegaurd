"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  Stethoscope,
  Building2,
  Award,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");

  // Doctor-specific fields
  const [bmdcNumber, setBmdcNumber] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [hospitalAffiliation, setHospitalAffiliation] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const payload: any = {
        name,
        email,
        password,
        role,
        phone,
      };

      if (role === "doctor") {
        payload.bmdcRegistrationNumber = bmdcNumber;
        payload.specialization = specialization;
        payload.hospitalAffiliation = hospitalAffiliation;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration failed. Please check inputs.");
      }

      // Automatically redirect to appropriate dashboard
      if (role === "doctor") {
        router.push("/doctor");
      } else {
        router.push("/patient");
      }
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(15,39,68,0.08)] p-6 sm:p-10 space-y-7 relative">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-700 text-[11px] font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Patient & Clinician Portal</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0f2744] tracking-tight">
          Create an Account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Select your registration profile below to get started with verified clinical services.
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100/80 rounded-xl border border-slate-200/60">
        <button
          type="button"
          onClick={() => setRole("patient")}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
            role === "patient"
              ? "bg-white text-[#0f2744] shadow-sm border border-slate-200/80"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <User className={`w-4 h-4 ${role === "patient" ? "text-teal-600" : "text-slate-400"}`} />
          <span>Patient Account</span>
        </button>

        <button
          type="button"
          onClick={() => setRole("doctor")}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
            role === "doctor"
              ? "bg-white text-[#0f2744] shadow-sm border border-slate-200/80"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Stethoscope className={`w-4 h-4 ${role === "doctor" ? "text-blue-600" : "text-slate-400"}`} />
          <span>Doctor / Clinician</span>
        </button>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-red-900 text-xs flex items-start gap-2.5 shadow-xs animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">Registration Notice</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleRegister} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Full Name</label>
          <div className="relative group">
            <User className="w-4 h-4 text-slate-400 group-focus-within:text-teal-600 absolute left-3.5 top-3.5 transition-colors pointer-events-none" />
            <input
              type="text"
              required
              placeholder={role === "doctor" ? "Dr. Mohammad Ali" : "Amina Rahman"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all font-medium"
            />
          </div>
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <div className="relative group">
              <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-teal-600 absolute left-3.5 top-3.5 transition-colors pointer-events-none" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all font-medium"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Phone Number</label>
            <div className="relative group">
              <Phone className="w-4 h-4 text-slate-400 group-focus-within:text-teal-600 absolute left-3.5 top-3.5 transition-colors pointer-events-none" />
              <input
                type="tel"
                required
                placeholder="+88017XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* Doctor Verification Section (if doctor selected) */}
        {role === "doctor" && (
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-3.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 border-b border-blue-200/60 pb-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span>BMDC Verification Details</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-blue-950">BMDC Registration Number</label>
              <input
                type="text"
                required
                placeholder="e.g. A-12345"
                value={bmdcNumber}
                onChange={(e) => setBmdcNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-blue-200 bg-white text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-blue-950">Specialization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Internal Medicine"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-blue-200 bg-white text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-blue-950">Hospital Affiliation</label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. DMCH / BSMMU"
                    value={hospitalAffiliation}
                    onChange={(e) => setHospitalAffiliation(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-blue-200 bg-white text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Account Password</label>
          <div className="relative group">
            <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-teal-600 absolute left-3.5 top-3.5 transition-colors pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-11 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-md focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#0f2744] hover:bg-[#153459] active:scale-[0.99] text-white font-bold h-11 rounded-xl shadow-md shadow-[#0f2744]/15 transition-all text-xs sm:text-sm gap-2"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating Verified Profile...</span>
            </div>
          ) : (
            <>
              <UserPlus className="w-4 h-4 text-teal-400" />
              <span>Register as {role === "doctor" ? "Doctor" : "Patient"}</span>
              <ArrowRight className="w-4 h-4 text-slate-400 ml-auto" />
            </>
          )}
        </Button>
      </form>

      {/* Social Auth */}
      {process.env.NODE_ENV !== "production" && role === "patient" && <SocialAuthButtons />}

      {/* Bottom Switcher */}
      <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
        Already registered?{" "}
        <Link
          href="/login"
          className="font-bold text-teal-600 hover:text-teal-700 underline underline-offset-2 ml-1"
        >
          Sign In Here
        </Link>
      </div>
    </div>
  );
}
