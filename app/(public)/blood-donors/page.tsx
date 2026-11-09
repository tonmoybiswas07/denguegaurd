"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HeartHandshake,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Shield,
  Send,
  AlertCircle,
  Lock,
  UserPlus,
  Droplet,
  MapPin,
  Calendar,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BLOOD_GROUPS, BANGLADESH_DISTRICTS } from "@/lib/constants";
import { MOCK_DONORS, type BloodDonorItem } from "@/lib/data/mockData";

export default function BloodDonorsPage() {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("All");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
  const [onlyPlateletDonors, setOnlyPlateletDonors] = useState<boolean>(false);
  const [requestModalDonor, setRequestModalDonor] = useState<BloodDonorItem | null>(null);
  const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);

  // Form state for contact request
  const [patientName, setPatientName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [bloodUnitsNeeded, setBloodUnitsNeeded] = useState("1");
  const [urgencyNote, setUrgencyNote] = useState("");

  const filteredDonors = MOCK_DONORS.filter((donor) => {
    const matchesGroup =
      selectedBloodGroup === "All" || donor.bloodGroup === selectedBloodGroup;
    const matchesDistrict =
      selectedDistrict === "All" || donor.district === selectedDistrict;
    const matchesPlatelet = !onlyPlateletDonors || donor.isPlateletDonor;

    return matchesGroup && matchesDistrict && matchesPlatelet;
  });

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
    setTimeout(() => {
      // simulate modal close
      setRequestSubmitted(false);
      setRequestModalDonor(null);
      setPatientName("");
      setHospitalName("");
      setContactNumber("");
      setUrgencyNote("");
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
            <HeartHandshake className="w-3.5 h-3.5 text-red-600" />
            <span>Emergency Blood & Platelet Donor Network</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0f2744] tracking-tight">
            Find Blood & Apheresis Platelet Donors
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Coordinated, privacy-preserving donor discovery. Connect with voluntary donors without exposing personal contact numbers to public scrapers.
          </p>
        </div>

        <Link href="/register" className="shrink-0">
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold gap-2 shadow-sm">
            <UserPlus className="w-4 h-4" />
            <span>Register as a Donor</span>
          </Button>
        </Link>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
        <Lock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-900">Privacy Safeguard Policy:</strong> In compliance with DengueGuard privacy rules, donor telephone numbers are never published openly. Submitting an emergency contact request transmits an encrypted SMS/notification directly to the verified donor with your hospital and requisition details.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Blood Group Select */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Required Blood Group:
            </label>
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            >
              <option value="All">All Blood Groups (Any)</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  Group {bg}
                </option>
              ))}
            </select>
          </div>

          {/* District Select */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Patient Location (District):
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            >
              <option value="All">All Districts</option>
              {BANGLADESH_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Platelet Donor Filter */}
          <div className="flex items-end pb-1.5">
            <label className="flex items-center gap-2 cursor-pointer text-slate-800 text-xs font-bold">
              <input
                type="checkbox"
                checked={onlyPlateletDonors}
                onChange={(e) => setOnlyPlateletDonors(e.target.checked)}
                className="rounded border-slate-300 text-red-600 focus:ring-red-500 h-4 w-4"
              />
              <span>Platelet Donors (Apheresis Eligible)</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Found <strong>{filteredDonors.length}</strong> matching verified donors
          </span>
          <span className="text-teal-700 font-semibold">
            Status: Live Availability
          </span>
        </div>
      </div>

      {/* Donors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDonors.map((donor) => (
          <Card key={donor.id} className="p-5 flex flex-col justify-between hover:border-red-300 transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-red-100/80 border border-red-200 text-red-700 flex items-center justify-center font-black text-lg">
                  {donor.bloodGroup}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={donor.isAvailable ? "success" : "secondary"}>
                    {donor.isAvailable ? "Available" : "Recently Donated"}
                  </Badge>
                  {donor.isPlateletDonor && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Apheresis Platelets
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#0f2744] text-base">
                  {donor.name}
                </h4>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{donor.area}, {donor.district}</span>
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Total Donations:</span>
                  <strong className="text-slate-800">{donor.totalDonations} times</strong>
                </div>
                <div className="flex justify-between">
                  <span>Last Donation:</span>
                  <span className="text-slate-500">{donor.lastDonationDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100">
              <Button
                onClick={() => setRequestModalDonor(donor)}
                disabled={!donor.isAvailable}
                className="w-full bg-[#0f2744] hover:bg-[#16365c] text-white text-xs font-semibold gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-teal-400" />
                <span>Request Contact</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* PRIVACY CONTACT REQUEST MODAL */}
      {requestModalDonor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <Badge variant="destructive">CONFIDENTIAL REQUISITION</Badge>
                <h3 className="text-lg font-bold text-[#0f2744] mt-1">
                  Request Donor: {requestModalDonor.name} ({requestModalDonor.bloodGroup})
                </h3>
              </div>
              <button
                onClick={() => setRequestModalDonor(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
              >
                ×
              </button>
            </div>

            {requestSubmitted ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-emerald-950">
                  Contact Request Dispatched
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  An encrypted alert has been delivered to <strong>{requestModalDonor.name}</strong>. If accepted, the donor will contact your given number: <strong>{contactNumber}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Patient Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rafiqul Islam"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Admitted Hospital / Clinic:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dhaka Medical College"
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Attendant Contact Phone:
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 01711XXXXXX"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Units Required:
                    </label>
                    <select
                      value={bloodUnitsNeeded}
                      onChange={(e) => setBloodUnitsNeeded(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                    >
                      <option value="1">1 Bag / Unit</option>
                      <option value="2">2 Bags / Units</option>
                      <option value="3">3+ Bags (Apheresis / Severe)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Clinical Urgency:
                    </label>
                    <select className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white">
                      <option>Immediate / Within 3 Hours</option>
                      <option>Today (Within 12 Hours)</option>
                      <option>Scheduled for Tomorrow</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Special Instructions / Platelet Count (optional):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Patient platelet is 25,000; apheresis machine is ready."
                    value={urgencyNote}
                    onChange={(e) => setUrgencyNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setRequestModalDonor(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Verified Request</span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

