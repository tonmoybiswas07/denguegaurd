import ClinicalPatientList, { type ClinicalSearchParams } from "@/components/dashboard/ClinicalPatientList";

export default function PatientsPage({ searchParams }: { searchParams: ClinicalSearchParams }) {
  return <ClinicalPatientList role="doctor" searchParams={searchParams} />;
}
