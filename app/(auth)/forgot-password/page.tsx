"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed.");
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(15,39,68,0.08)] p-6 sm:p-10 space-y-7 relative">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-700 text-[11px] font-bold uppercase tracking-wider">
          <KeyRound className="w-3.5 h-3.5 text-teal-600" />
          <span>Credential Recovery</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0f2744] tracking-tight">
          Forgot Password?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Enter your registered email address to receive secure account recovery instructions.
        </p>
      </div>

      {isSubmitted ? (
        <div className="p-6 text-center space-y-4 rounded-xl bg-teal-50/50 border border-teal-200/60">
          <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto" />
          <h4 className="text-base font-bold text-[#0f2744]">
            Recovery Instructions Sent
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            If an account matching <strong>{email}</strong> is registered with DengueGuard, a secure password reset link has been dispatched.
          </p>
          <div className="pt-2">
            <Link href="/login">
              <Button variant="outline" size="sm" className="gap-2 border-slate-300 text-xs font-bold">
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-red-900 text-xs flex items-start gap-2.5 shadow-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block">Recovery Notice</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Registered Email Address
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0f2744] hover:bg-[#153459] active:scale-[0.99] text-white font-bold h-11 rounded-xl shadow-md shadow-[#0f2744]/15 transition-all text-xs sm:text-sm gap-2"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Dispatching Instructions...</span>
              </div>
            ) : (
              <>
                <Send className="w-4 h-4 text-teal-400" />
                <span>Send Reset Link</span>
              </>
            )}
          </Button>

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="text-xs text-slate-500 hover:text-slate-800 font-bold inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
