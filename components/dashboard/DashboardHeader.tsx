"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  LogOut,
  User,
  Bell,
  Menu,
  PhoneCall,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/types";

interface DashboardHeaderProps {
  user: {
    name: string;
    email: string;
    role: UserRole;
  };
  onToggleSidebar?: () => void;
}

export default function DashboardHeader({
  user,
  onToggleSidebar,
}: DashboardHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      router.push("/login");
    }
  };

  const roleBadgeVariants: Record<UserRole, "teal" | "navy" | "destructive"> = {
    patient: "teal",
    doctor: "navy",
    admin: "destructive",
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0f2744] text-teal-400 flex items-center justify-center font-bold">
            <Shield className="w-4 h-4 fill-teal-400/20" />
          </div>
          <span className="font-bold text-[#0f2744] text-base tracking-tight hidden sm:inline">
            Dengue<span className="text-teal-600">Guard</span>
          </span>
        </Link>

        <span className="text-slate-300 hidden sm:inline">|</span>

        <Badge variant={roleBadgeVariants[user.role]} className="uppercase text-[10px] tracking-wider font-bold">
          {user.role} Portal
        </Badge>
      </div>

      {/* Right: Quick Emergency / Actions / User / Logout */}
      <div className="flex items-center gap-3">
        <a
          href="tel:16263"
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold hover:bg-teal-100 transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
          <span>Hotline: 16263</span>
        </a>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs">
            {user.name.charAt(0)}
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-[#0f2744] leading-tight truncate max-w-[140px]">
              {user.name}
            </span>
            <span className="text-[10px] text-slate-500 truncate max-w-[140px]">
              {user.email}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-slate-500 hover:text-red-600 hover:bg-red-50 p-2 h-auto"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

