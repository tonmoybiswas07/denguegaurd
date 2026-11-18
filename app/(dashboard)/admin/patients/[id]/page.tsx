import ClinicalPatientDetails from "@/components/dashboard/ClinicalPatientDetails";

export default async function PatientPage({ params }: { params: Promise<{ id: string }> }) {
  return <ClinicalPatientDetails role="admin" patientId={(await params).id} />;
}
