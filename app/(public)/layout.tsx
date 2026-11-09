import React from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import EmergencyBanner from "@/components/common/EmergencyBanner";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Advisory Banner with Emergency Hotlines */}
      <EmergencyBanner />

      {/* Sticky Healthcare Navbar */}
      <Navbar />

      {/* Main Public Content */}
      <main className="flex-1 w-full">{children}</main>

      {/* Comprehensive Public Healthcare Footer */}
      <Footer />
    </div>
  );
}

