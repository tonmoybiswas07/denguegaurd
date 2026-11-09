"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Activity,
  Menu,
  X,
  HeartHandshake,
  Hospital,
  AlertCircle,
  BarChart3,
  BookOpen,
  LogIn,
  ChevronRight,
  PhoneCall,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navIcons: Record<string, React.ReactNode> = {
    "/": <Activity className="w-3.5 h-3.5" />,
    "/awareness": <BookOpen className="w-3.5 h-3.5" />,
    "/symptoms": <AlertCircle className="w-3.5 h-3.5 text-amber-500" />,
    "/prevention": <Shield className="w-3.5 h-3.5 text-teal-600" />,
    "/hospitals": <Hospital className="w-3.5 h-3.5 text-blue-600" />,
    "/blood-donors": <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />,
    "/statistics": <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />,
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(15,39,68,0.06)] border-b border-slate-200/80 py-2.5"
          : "bg-white/85 backdrop-blur-sm border-b border-slate-200/50 py-3.5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0f2744] via-[#16365c] to-teal-800 flex items-center justify-center text-teal-400 shadow-md shadow-[#0f2744]/15 group-hover:scale-105 transition-all">
              <Shield className="w-5 h-5 fill-teal-400/20" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-[#0f2744] block">
                Dengue<span className="text-teal-600">Guard</span>
              </span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block -mt-1">
                Clinical Health Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-full border border-slate-200/60">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                    isActive
                      ? "bg-white text-[#0f2744] shadow-xs border border-slate-200/80"
                      : "text-slate-600 hover:text-[#0f2744] hover:bg-white/60"
                  )}
                >
                  {navIcons[link.href]}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link href="/symptoms">
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs h-9 px-3.5 rounded-xl gap-1.5 shadow-sm shadow-amber-500/20 active:scale-95 transition-all"
              >
                <AlertCircle className="w-3.5 h-3.5 text-white" />
                <span>Triage Checker</span>
              </Button>
            </Link>

            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-[#0f2744] font-bold text-xs h-9 px-4 rounded-xl gap-1.5 shadow-2xs active:scale-95 transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-teal-600" />
                <span>Portal Sign In</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex xl:hidden items-center gap-2">
            <Link href="/symptoms" className="sm:hidden">
              <button className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 text-xs font-bold flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
              </button>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/80"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white/98 backdrop-blur-2xl border-b border-slate-200 shadow-xl px-4 py-5 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all",
                    isActive
                      ? "bg-teal-50 text-teal-900 border border-teal-200/80"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {navIcons[link.href]}
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
            <Link href="/login" className="w-full">
              <Button
                variant="outline"
                className="w-full h-10 rounded-xl text-xs font-bold border-slate-300 text-slate-800"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register" className="w-full">
              <Button className="w-full h-10 rounded-xl text-xs font-bold bg-[#0f2744] text-white">
                Register
              </Button>
            </Link>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
            <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
            <span>Emergency Health Helpline:</span>
            <strong className="text-slate-800">16263</strong>
          </div>
        </div>
      )}
    </header>
  );
}
