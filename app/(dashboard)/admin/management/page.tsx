"use client";

import { useState } from "react";
import DirectoryStatus from "@/components/common/DirectoryStatus";
import { Button } from "@/components/ui/button";
import { useDirectory } from "@/lib/data/useDirectory";

interface PendingDonor {
  _id: string;
  name: string;
  phone: string;
  bloodGroup: string;
  district: string;
  area: string;
}

export default function AdminManagementPage() {
  const directory = useDirectory<PendingDonor>("/api/admin/donors");
  const [saving, setSaving] = useState<string>();
  const [feedback, setFeedback] = useState<{ error: boolean; message: string }>();

  async function review(donor: PendingDonor, status: "Verified" | "Suspended") {
    if (saving) return;
    setSaving(donor._id);
    setFeedback(undefined);
    try {
      const response = await fetch("/api/admin/donors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: donor._id, status }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setFeedback({ error: true, message: result.error || "Could not save the decision." });
        if (response.status === 409) directory.reload();
        return;
      }
      setFeedback({ error: false, message: status === "Verified" ? "Donor approved for public listing." : "Registration declined." });
      directory.reload();
    } catch {
      setFeedback({ error: true, message: "Could not save the decision. Please try again." });
    } finally {
      setSaving(undefined);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Donor verification</h1>
        <p className="mt-2 text-slate-600">Review registrations before they appear in the public donor directory.</p>
      </header>
      {feedback && <p role={feedback.error ? "alert" : "status"} className={feedback.error ? "text-rose-800" : "text-teal-800"}>{feedback.message}</p>}
      <DirectoryStatus {...directory} />
      {directory.source && directory.items.length === 0 && <p className="rounded-xl border bg-white p-5 text-slate-600">No registrations are waiting for review.</p>}
      <ul className="space-y-3">
        {directory.items.map((donor) => (
          <li key={donor._id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-white p-5">
            <div>
              <h2 className="font-bold">{donor.name} · {donor.bloodGroup}</h2>
              <p className="text-sm text-slate-600">{donor.area}, {donor.district}</p>
              <a className="text-sm text-teal-800 underline" href={`tel:${donor.phone}`}>{donor.phone}</a>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" disabled={!!saving} aria-label={`Decline registration for ${donor.name}`} onClick={() => review(donor, "Suspended")}>Decline</Button>
              <Button variant="navy" disabled={!!saving} aria-label={`Approve registration for ${donor.name}`} onClick={() => review(donor, "Verified")}>Approve</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
