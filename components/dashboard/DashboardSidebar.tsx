"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Calendar,
  FileText,
  User,
  Users,
  ShieldCheck,
  Hospital,
  HeartHandshake,
  BarChart3,
  Settings,
  Thermometer,
  Stethoscope,
  ClipboardList,
  AlertTriangle,
  FolderLock,
  ChevronRight,
} from "lucide-react";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  role: UserRole;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function DashboardSidebar({
  role,
  isOpen = true,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const patientNav = [
    { label: "Overview", href: "/patient", icon: Activity },
    { label: "Daily Vitals Tracker", href: "/patient/vitals", icon: Thermometer },
    { label: "Platelet & CBC History", href: "/patient/cbc-history", icon: FileText },
    { label: "Doctor Appointments", href: "/patient/appointments", icon: Calendar },
    { label: "Find Hospital Beds", href: "/hospitals", icon: Hospital },
    { label: "Request Blood / Platelets", href: "/blood-donors", icon: HeartHandshake },
  ];

  const doctorNav = [
    { label: "Doctor Console", href: "/doctor", icon: Stethoscope },
    { label: "Appointment Inbox", href: "/doctor/appointments", icon: Calendar },
    { label: "Authorized Patients", href: "/doctor/patients", icon: Users },
    { label: "Clinical Guidelines", href: "/awareness", icon: ClipboardList },
    { label: "Hospital Directory", href: "/hospitals", icon: Hospital },
  ];

  const adminNav = [
    { label: "Command Center", href: "/admin", icon: BarChart3 },
    { label: "Doctor Verifications", href: "/admin/doctors", icon: Stethoscope },
    { label: "Dengue Case Reports", href: "/admin/reports", icon: AlertTriangle },
    { label: "Donor verification", href: "/admin/management", icon: Hospital },
    { label: "Audit & Security Logs", href: "/admin/audit-logs", icon: FolderLock },
  ];

  const navItems =
    role === "admin" ? adminNav : role === "doctor" ? doctorNav : patientNav;

  return (
    <aside
      className={cn(
        "w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 transition-all",
        "fixed inset-y-0 left-0 z-40 lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Sidebar Top Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
          Navigation Menu
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors",
                isActive
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-teal-400")} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Emergency Help */}
      <div className="p-4 m-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1.5">
        <span className="font-bold text-white block">Medical Emergency?</span>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          DGHS National Dengue Helpline is active 24/7.
        </p>
        <a
          href="tel:16263"
          className="inline-block text-teal-400 font-bold text-xs hover:underline"
        >
          Call 16263 Immediately
        </a>
      </div>
    </aside>
  );
}

