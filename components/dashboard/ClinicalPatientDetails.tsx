import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSession } from "@/lib/auth/jwt";
import { readClinicalPatient } from "@/lib/patients/clinicalAccess";

const dateFormat = new Intl.DateTimeFormat("en-BD", {
  dateStyle: "medium",
  timeZone: "Asia/Dhaka",
});

function displayDate(value?: Date) {
  return value ? dateFormat.format(value) : undefined;
}

function Fields({ entries }: { entries: [string, ReactNode][] }) {
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {entries.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="text-sm font-medium text-slate-600">{label}</dt>
          <dd className="wrap-break-word text-sm text-slate-900">{value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

function reportLink(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") {
      return <a href={url.href} rel="noreferrer" className="text-teal-800 underline">Open report</a>;
    }
  } catch {
    if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) {
      return <a href={value} className="text-teal-800 underline">Open report</a>;
    }
  }
  return undefined;
}

export default async function ClinicalPatientDetails({ role, patientId }: {
  role: "admin" | "doctor";
  patientId: string;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== role) notFound();

  const result = await readClinicalPatient(session, patientId);
  if (result.status !== 200) notFound();
  const { patient, profile, records, appointments } = result.data;
  const panel = "space-y-4 rounded-xl border bg-white p-5 sm:p-6";

  return (
    <article className="mx-auto max-w-5xl space-y-5 px-4 py-8 sm:px-6">
      <header>
        <a href={`/${role}/patients`} className="text-sm font-semibold text-teal-800 underline">Back to patients</a>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">{patient.name}</h1>
      </header>

      <section className={panel}>
        <h2 className="text-xl font-bold">Patient profile</h2>
        <Fields entries={[
          ["Patient ID", String(patient._id)],
          ["Email", patient.email],
          ["Phone", patient.phone || undefined],
          ["Registered", displayDate(patient.createdAt)],
          ["Account verified", patient.isVerified ? "Yes" : "No"],
          ["Date of birth", displayDate(profile?.dateOfBirth)],
          ["Gender", profile?.gender],
          ["Blood group", profile?.bloodGroup],
          ["District", profile?.district],
          ["Address", profile?.address || undefined],
          ["Emergency contact", profile?.emergencyContactName || undefined],
          ["Emergency contact phone", profile?.emergencyContactPhone || undefined],
          ["Allergies", profile?.allergies?.join(", ") || undefined],
          ["Medical history", profile?.medicalHistory?.join(", ") || undefined],
        ]} />
      </section>

      <section className={panel}>
        <h2 className="text-xl font-bold">Vitals and CBC history</h2>
        {records.length === 0 && <p className="text-sm text-slate-600">No health records have been added.</p>}
        {records.map((record) => (
          <div key={String(record._id)} className="space-y-3 border-t pt-4">
            <h3 className="font-semibold">{displayDate(record.recordDate)}</h3>
            <Fields entries={[
              ["Temperature", record.temperature == null ? undefined : `${record.temperature} °F`],
              ["Platelets", record.plateletCount == null ? undefined : `${record.plateletCount.toLocaleString("en-BD")} / µL`],
              ["Hematocrit", record.hematocrit == null ? undefined : `${record.hematocrit}%`],
              ["White blood cells", record.wbcCount == null ? undefined : `${record.wbcCount.toLocaleString("en-BD")} / µL`],
              ["Symptoms", record.symptoms?.join(", ") || undefined],
              ["Notes", record.notes || undefined],
              ["Lab report", reportLink(record.reportFileUrl)],
            ]} />
          </div>
        ))}
      </section>

      <section className={panel}>
        <h2 className="text-xl font-bold">{role === "doctor" ? "Appointments with you" : "Appointment history"}</h2>
        {appointments.length === 0 && <p className="text-sm text-slate-600">No appointments have been recorded.</p>}
        {appointments.map((appointment) => (
          <div key={String(appointment._id)} className="space-y-3 border-t pt-4">
            <h3 className="font-semibold">{displayDate(appointment.date)} · {appointment.timeSlot}</h3>
            <Fields entries={[
              ["Doctor", appointment.doctorId?.name],
              ["Status", <span className="capitalize">{appointment.status}</span>],
              ["Symptoms summary", appointment.symptomsSummary || undefined],
              ["Doctor notes", appointment.doctorNotes || undefined],
              ["Prescription notes", appointment.prescriptionNotes || undefined],
              ["Follow-up date", displayDate(appointment.followUpDate)],
            ]} />
          </div>
        ))}
      </section>
    </article>
  );
}
