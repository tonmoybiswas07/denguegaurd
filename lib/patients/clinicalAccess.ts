import { isObjectIdOrHexString } from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Appointment, AuditLog, DoctorProfile, HealthRecord, PatientProfile, User } from "@/models";
import type { UserSession } from "@/types";

const confirmed = "confirmed";
export const patientsPerPage = 25;

export async function listClinicalPatients(session: UserSession, query: string, page: number) {
  if (session.role !== "admin" && session.role !== "doctor") return null;
  await connectDB();

  const filter = {
    role: "patient" as const,
    ...(query ? { name: new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") } : {}),
  };

  const patients = User.find(filter);
  if (session.role === "doctor") {
    const approved = await DoctorProfile.exists({ userId: session.id, verificationStatus: "approved" });
    if (!approved) return null;
    const patientIds = await Appointment.distinct("patientId", { doctorId: session.id, status: confirmed });
    patients.where("_id").in(patientIds);
  }

  return patients.select("name").sort({ name: 1, _id: 1 })
    .skip((page - 1) * patientsPerPage).limit(patientsPerPage + 1).lean();
}

export async function readClinicalPatient(session: UserSession, patientId: string) {
  if (session.role !== "doctor" && session.role !== "admin") return { status: 403 } as const;
  if (!isObjectIdOrHexString(patientId)) return { status: 404 } as const;
  await connectDB();

  const appointmentFilter = { patientId, ...(session.role === "doctor" ? { doctorId: session.id } : {}) };
  if (session.role === "doctor") {
    const [approved, appointment] = await Promise.all([
      DoctorProfile.exists({ userId: session.id, verificationStatus: "approved" }),
      Appointment.exists({ ...appointmentFilter, status: confirmed }),
    ]);
    if (!approved || !appointment) {
      await AuditLog.create({
        userId: session.id,
        action: "UNAUTHORIZED_PATIENT_RECORD_ACCESS_BLOCKED",
        resource: "PATIENT_RECORD",
        resourceId: patientId,
      });
      return { status: 403 } as const;
    }
  }

  const patient = await User.findOne({ _id: patientId, role: "patient" })
    .select("name email phone createdAt isVerified").lean();
  if (!patient) return { status: 404 } as const;

  const [profile, records, appointments] = await Promise.all([
    PatientProfile.findOne({ userId: patientId }).lean(),
    HealthRecord.find({ patientId }).sort({ recordDate: -1 }).lean(),
    Appointment.find(appointmentFilter).populate<{ doctorId: { name: string } | null }>("doctorId", "name").sort({ date: -1 }).lean(),
  ]);

  await AuditLog.create({
    userId: session.id,
    action: "PATIENT_RECORD_VIEWED",
    resource: "HEALTH_RECORD",
    resourceId: patientId,
    details: { patientId, recordsCount: records.length },
  });

  return { status: 200, data: { patient, profile, records, appointments } } as const;
}
