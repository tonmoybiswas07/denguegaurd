import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DengueGuard – Smart Dengue Prevention & Management System",
  description:
    "A comprehensive healthcare intelligence platform providing real-time dengue surveillance, clinical symptom triage, hospital & blood donor matching, and patient health tracking.",
  keywords: [
    "Dengue",
    "Healthcare",
    "Prevention",
    "Symptom Checker",
    "Hospital Finder",
    "Blood Donor",
    "Bangladesh Dengue Surveillance",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 antialiased selection:bg-teal-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
