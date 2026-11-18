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
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3">
        Skip to main content
      </a>
      {/* Top Advisory Banner with Emergency Hotlines */}
      <EmergencyBanner />

      {/* Sticky Healthcare Navbar */}
      <Navbar />

      {/* Main Public Content */}
      <main id="main-content" tabIndex={-1} className="flex-1 w-full">{children}</main>

      {/* Comprehensive Public Healthcare Footer */}
      <Footer />
    </div>
  );
}

