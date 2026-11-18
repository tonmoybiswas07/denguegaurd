"use client";

import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  FileText,
  AlertTriangle,
  Send,
  Eye,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";

export default function DoctorDashboardPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [notesModalAppointment, setNotesModalAppointment] = useState<any | null>(null);
  const [doctorNoteInput, setDoctorNoteInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/doctor/appointments");
      const data = await res.json();
      if (data.success) {
        setAppointments(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId: string, status: string) => {
    try {
      const res = await fetch("/api/doctor/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, status }),
      });
      if (res.ok) fetchAppointments();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notesModalAppointment) return;

    try {
      const res = await fetch("/api/doctor/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: notesModalAppointment._id,
          doctorNotes: doctorNoteInput,
        }),
      });
      if (res.ok) {
        setNotesModalAppointment(null);
        setDoctorNoteInput("");
        fetchAppointments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const confirmedCount = appointments.filter((a) => a.status === "confirmed").length;
  const completedCount = appointments.filter((a) => a.status === "completed").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col justify-between gap-5 rounded-2xl border border-sky-200 border-l-4 border-l-sky-700 bg-white p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f2744] mt-1">
            Consultation desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage appointments, review patient records, and record follow-up notes.
          </p>
        </div>

        <a href="/doctor/patients" className="inline-flex min-h-11 shrink-0 items-center self-start rounded-lg bg-sky-800 px-4 text-sm font-semibold text-white hover:bg-sky-900 sm:self-auto">Authorized patients</a>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-5 space-y-1.5 border-amber-200 bg-amber-50/40">
          <div className="flex items-center justify-between text-xs text-amber-800 font-semibold">
            <span>Pending Consultation Requests</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-3xl font-black text-amber-900 block">{pendingCount}</span>
          <span className="text-[11px] text-amber-700">Awaiting your approval</span>
        </Card>

        <Card className="p-5 space-y-1.5 border-teal-200 bg-teal-50/40">
          <div className="flex items-center justify-between text-xs text-teal-800 font-semibold">
            <span>Active Confirmed Patients</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <span className="text-3xl font-black text-teal-900 block">{confirmedCount}</span>
          <span className="text-[11px] text-teal-700">Monitoring daily vitals</span>
        </Card>

        <Card className="p-5 space-y-1.5 border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Completed Consultations</span>
            <Stethoscope className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-black text-slate-800 block">{completedCount}</span>
          <span className="text-[11px] text-slate-500">Resolved cases</span>
        </Card>
      </div>

      {/* Consultation Request Queue */}
      <Card className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-[#0f2744]">
            Patient Consultation Inbox & Triage Queue
          </h3>
          <p className="text-xs text-slate-500">
            Approve requests to unlock full longitudinal CBC reports and platelet histories.
          </p>
        </div>

        {appointments.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-xs">
            No appointment requests currently in queue.
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((app) => (
              <div
                key={app._id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                      {app.patientId?.name?.charAt(0) || "P"}
                    </div>
                    <div>
                      <span className="font-bold text-[#0f2744] text-sm block">
                        {app.patientId?.name || "Patient"}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        Slot: {app.timeSlot} • Date: {new Date(app.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        app.status === "confirmed"
                          ? "success"
                          : app.status === "completed"
                          ? "navy"
                          : app.status === "cancelled"
                          ? "destructive"
                          : "warning"
                      }
                    >
                      {app.status}
                    </Badge>

                    {app.status === "confirmed" && app.patientId?._id && (
                      <a
                        href={`/doctor/patients/${app.patientId._id}`}
                        className={`${buttonVariants({ variant: "outline", size: "sm" })} gap-1.5`}
                      >
                        <Eye aria-hidden="true" className="size-3.5 text-teal-600" />
                        View patient details
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
                  <strong className="block text-slate-900 font-semibold mb-0.5">
                    Patient Symptoms Summary:
                  </strong>
                  <p>{app.symptomsSummary}</p>
                </div>

                {app.doctorNotes && (
                  <div className="p-3 rounded-lg bg-teal-50 border border-teal-100 text-teal-900">
                    <strong className="block font-bold mb-0.5">Your Clinical Notes:</strong>
                    <p>{app.doctorNotes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100">
                  {app.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleUpdateStatus(app._id, "confirmed")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-7 px-3 text-xs"
                      >
                        Accept Appointment
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(app._id, "cancelled")}
                        className="text-red-600 hover:bg-red-50 border-red-200 h-7 px-3 text-xs"
                      >
                        Decline
                      </Button>
                    </>
                  )}

                  {app.status === "confirmed" && (
                    <>
                      <Button
                        size="sm"
                        variant="navy"
                        onClick={() => {
                          setNotesModalAppointment(app);
                          setDoctorNoteInput(app.doctorNotes || "");
                        }}
                        className="h-7 px-3 text-xs gap-1"
                      >
                        <FileText className="w-3 h-3 text-teal-400" />
                        <span>Add Clinical Instructions</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleUpdateStatus(app._id, "completed")}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold h-7 px-3 text-xs"
                      >
                        Mark as Completed
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ADD INSTRUCTIONS MODAL */}
      {notesModalAppointment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#0f2744]">
              Add Clinical Follow-Up Guidance
            </h3>
            <p className="text-xs text-slate-500">
              Guidance for patient: <strong>{notesModalAppointment.patientId?.name}</strong>
            </p>

            <form onSubmit={handleSaveNotes} className="space-y-3">
              <textarea
                rows={4}
                required
                placeholder="e.g. Continue ORS 2.5L/day. Check CBC again in 24 hours. If platelet < 50k or persistent vomiting occurs, proceed to emergency triage."
                value={doctorNoteInput}
                onChange={(e) => setDoctorNoteInput(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-600"
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setNotesModalAppointment(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Save & Notify Patient
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

