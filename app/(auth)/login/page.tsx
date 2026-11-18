"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Login failed. Check your credentials.");
      }

      // Redirect based on role
      const role = data.data.role;
      if (role === "admin") {
        router.push("/admin");
      } else if (role === "doctor") {
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
      {/* Card Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-700 text-[11px] font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Secure Clinical Portal</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0f2744] tracking-tight">
          Welcome Back
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Enter your registered email and password to access your secure health dashboard.
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-red-900 text-xs flex items-start gap-2.5 shadow-xs animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">Authentication Notice</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-5">
        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Email Address</span>
          </label>
          <div className="relative group">
            <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-teal-600 absolute left-3.5 top-3.5 transition-colors pointer-events-none" />
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all font-medium"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-700">Password</label>
            <Link
              href="/forgot-password"
              className="text-teal-600 hover:text-teal-700 font-semibold hover:underline text-[11px]"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative group">
            <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-teal-600 absolute left-3.5 top-3.5 transition-colors pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••••••"
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
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#0f2744] hover:bg-[#153459] active:scale-[0.99] text-white font-bold h-11 rounded-xl shadow-md shadow-[#0f2744]/15 transition-all text-xs sm:text-sm gap-2"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Verifying Credentials...</span>
            </div>
          ) : (
            <>
              <LogIn className="w-4 h-4 text-teal-400" />
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4 text-slate-400 ml-auto" />
            </>
          )}
        </Button>
      </form>

      {/* Social Auth (Google / GitHub) */}
      {process.env.NODE_ENV !== "production" && <SocialAuthButtons />}

      {/* Bottom Switcher */}
      <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
        New to DengueGuard?{" "}
        <Link
          href="/register"
          className="font-bold text-teal-600 hover:text-teal-700 underline underline-offset-2 ml-1"
        >
          Create an Account
        </Link>
      </div>
    </div>
  );
}
