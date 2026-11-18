"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Users,
  Stethoscope,
  Hospital,
  HeartHandshake,
  AlertTriangle,
  FileText,
  CheckCircle2,
  XCircle,
  FolderLock,
  RefreshCw,
  Database,
  Building2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [seedMessage, setSeedMessage] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, doctorsRes, logsRes] = await Promise.all([
        fetch("/api/admin/overview"),
        fetch("/api/admin/doctors"),
        fetch("/api/admin/audit-logs"),
      ]);

      const statsData = await statsRes.json();
      const doctorsData = await doctorsRes.json();
      const logsData = await logsRes.json();

      if (statsData.success) setStats(statsData.data);
      if (doctorsData.success) setDoctors(doctorsData.data || []);
      if (logsData.success) setAuditLogs(logsData.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoctorVerify = async (doctorProfileId: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch("/api/admin/doctors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorProfileId, verificationStatus: status }),
      });
      if (res.ok) fetchAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSeedDatabase = async () => {
    setSeedMessage("Seeding database...");
    try {
      const res = await fetch("/api/seed");
      const data = await res.json();
      setSeedMessage(data.message || "Seeding completed successfully.");
      fetchAdminData();
    } catch (e) {
      setSeedMessage("Seeding failed.");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col justify-between gap-5 rounded-3xl bg-indigo-950 p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Administration
          </h1>
          <p className="mt-2 text-sm text-indigo-100">
            Review activity, verify doctors, and manage patient and doctor accounts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a href="/admin/accounts" className="inline-flex min-h-10 items-center rounded-xl bg-indigo-100 px-4 text-sm font-semibold text-indigo-950 hover:bg-white">Manage accounts</a>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchAdminData}
            className="text-xs gap-1.5 h-8 border-slate-300"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </Button>

          {process.env.NODE_ENV !== "production" && (
          <Button
            size="sm"
            onClick={handleSeedDatabase}
            className="bg-slate-800 hover:bg-slate-900 text-white text-xs gap-1.5 h-8"
          >
            <Database className="w-3.5 h-3.5 text-teal-400" />
            <span>Initialize Seed DB</span>
          </Button>
          )}
        </div>
      </div>

      {seedMessage && (
        <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold">
          {seedMessage}
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Registered Users</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-[#0f2744] block">
            {stats?.totalUsers || 3}
          </span>
          <span className="text-[11px] text-slate-500 block">
            Patients: {stats?.totalPatients || 1} • Doctors: {stats?.totalDoctors || 1}
          </span>
        </Card>

        <Card className="p-5 space-y-2 border-amber-200 bg-amber-50/30">
          <div className="flex items-center justify-between text-xs text-amber-800 font-semibold">
            <span>Pending Doctor Verifications</span>
            <Stethoscope className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-amber-900 block">
            {stats?.pendingDoctors || 0}
          </span>
          <span className="text-[11px] text-amber-700 block">
            BMDC Credential Audits
          </span>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Verified Hospitals</span>
            <Hospital className="w-4 h-4 text-teal-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-[#0f2744] block">
            {stats?.totalHospitals || 10}
          </span>
          <span className="text-[11px] text-teal-700 font-semibold block">
            Active Bed Telemetry
          </span>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Blood Donors in Pool</span>
            <HeartHandshake className="w-4 h-4 text-red-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-[#0f2744] block">
            {stats?.totalDonors || 8}
          </span>
          <span className="text-[11px] text-slate-500 block">
            Apheresis Ready
          </span>
        </Card>
      </div>

      {/* Doctor Verification Queue */}
      <Card className="p-6 space-y-4">
        <div>
          <Badge variant="navy">MEDICAL CREDENTIALS</Badge>
          <h3 className="text-lg font-bold text-[#0f2744] mt-1">
            Doctor Registration & BMDC Verification Requests
          </h3>
          <p className="text-xs text-slate-500">
            Approve verified physicians before granting access to patient clinical health records.
          </p>
        </div>

        {doctors.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No doctor records currently loaded.</p>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Doctor Name</th>
                  <th className="py-3 px-4">BMDC Reg No.</th>
                  <th className="py-3 px-4">Specialization</th>
                  <th className="py-3 px-4">Hospital Affiliation</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#0f2744]">
                      {doc.userId?.name || "Dr. Practitioner"}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {doc.bmdcRegistrationNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{doc.specialization}</td>
                    <td className="py-3 px-4 text-slate-600">{doc.hospitalAffiliation}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          doc.verificationStatus === "approved"
                            ? "success"
                            : doc.verificationStatus === "rejected"
                            ? "destructive"
                            : "warning"
                        }
                      >
                        {doc.verificationStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      {doc.verificationStatus !== "approved" && (
                        <Button
                          size="sm"
                          onClick={() => handleDoctorVerify(doc._id, "approved")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-7 px-2.5 font-semibold"
                        >
                          Approve
                        </Button>
                      )}
                      {doc.verificationStatus !== "rejected" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDoctorVerify(doc._id, "rejected")}
                          className="text-red-600 hover:bg-red-50 border-red-200 text-[11px] h-7 px-2.5"
                        >
                          Reject
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Security & HIPAA Audit Logs */}
      <Card className="p-6 space-y-4">
        <div>
          <Badge variant="teal">AUDIT TRAIL & COMPLIANCE</Badge>
          <h3 className="text-lg font-bold text-[#0f2744] mt-1">
            System Security & Data Access Logs
          </h3>
          <p className="text-xs text-slate-500">
            Immutable log recording authentication attempts, record inspections, and administrative role modifications.
          </p>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User Action</th>
                <th className="py-3 px-4">Resource Target</th>
                <th className="py-3 px-4">User Initiator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#0f2744]">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 font-mono text-teal-700">
                    {log.resource}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {log.userId?.name || log.userId?.email || "System / Guest"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

