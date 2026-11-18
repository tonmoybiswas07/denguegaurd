import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth/jwt";
import { listClinicalPatients, patientsPerPage } from "@/lib/patients/clinicalAccess";

export type ClinicalSearchParams = Promise<{ q?: string | string[]; page?: string | string[] }>;

export default async function ClinicalPatientList({ role, searchParams }: {
  role: "admin" | "doctor";
  searchParams: ClinicalSearchParams;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== role) notFound();

  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const requestedPage = typeof params.page === "string" ? Number(params.page) : 1;
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 && requestedPage <= 100_000 ? requestedPage : 1;
  const path = `/${role}/patients`;
  const patients = await listClinicalPatients(session, query, page);

  const pageUrl = (number: number) => `${path}?${new URLSearchParams({ q: query, page: String(number) })}`;
  return (
    <section className="mx-auto max-w-4xl space-y-5 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{role === "admin" ? "Patients" : "Authorized patients"}</h1>
        <p className="mt-2 text-sm text-slate-600">{role === "admin" ? "Find registered patients and review their records." : "View records for patients with a confirmed appointment with you."}</p>
        {role === "admin" && <a href="/admin/accounts?role=patient" className="mt-3 inline-block text-sm font-semibold text-indigo-800 underline">Manage patient accounts</a>}
      </header>
      {patients === null ? (
        <p role="status" className="rounded-xl border bg-white p-5">Once your doctor profile is approved, your eligible patients will appear here.</p>
      ) : (
        <>
          <form action={path} className="flex flex-wrap items-end gap-2">
            <label className="flex min-w-48 flex-1 flex-col gap-1 text-sm font-semibold">Patient name
              <input type="search" name="q" defaultValue={query} maxLength={100} className="min-h-11 rounded-lg border bg-white px-3" />
            </label>
            <button className="min-h-11 rounded-lg bg-teal-800 px-4 font-semibold text-white">Search</button>
            {query && <a href={path} className="px-2 py-3 text-sm text-teal-800 underline">Clear</a>}
          </form>
          {patients.length ? (
            <ul className="divide-y rounded-xl border bg-white">
              {patients.slice(0, patientsPerPage).map((patient) => (
                <li key={String(patient._id)}>
                  <a href={`${path}/${patient._id}`} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 hover:bg-teal-50">
                    <span>
                      <span className="block font-semibold">{patient.name}</span>
                      <span className="text-xs text-slate-600">ID ending in {String(patient._id).slice(-8)}</span>
                    </span>
                    <span className="text-sm text-teal-800 underline">View details</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : <p role="status" className="rounded-xl border bg-white p-5">No patients found.</p>}
          {(page > 1 || patients.length > patientsPerPage) && (
            <nav aria-label="Patient pages" className="flex flex-wrap items-center gap-4 text-sm">
              {page > 1 && <a href={pageUrl(page - 1)} className="text-teal-800 underline">Previous page</a>}
              <span>Page {page}</span>
              {patients.length > patientsPerPage && <a href={pageUrl(page + 1)} className="text-teal-800 underline">Next page</a>}
            </nav>
          )}
        </>
      )}
    </section>
  );
}
