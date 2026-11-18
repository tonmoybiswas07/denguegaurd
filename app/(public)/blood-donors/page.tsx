"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Droplet, Lock, MapPin } from "lucide-react";
import DirectoryStatus from "@/components/common/DirectoryStatus";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BANGLADESH_DISTRICTS, BLOOD_GROUPS } from "@/lib/constants";
import type { BloodDonorItem } from "@/lib/data/mockData";
import { useDirectory } from "@/lib/data/useDirectory";

const field = "mt-1.5 block min-h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900";

export default function BloodDonorsPage() {
  const directory = useDirectory<BloodDonorItem>("/api/donors");
  const [group, setGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [platelets, setPlatelets] = useState(false);
  const [registration, setRegistration] = useState<{ kind: "sending" | "success" | "error"; message: string }>();

  const matches = directory.items.filter((donor) =>
    (!group || donor.bloodGroup === group) &&
    (!district || donor.district.toLowerCase() === district.toLowerCase()) &&
    (!platelets || donor.isPlateletDonor)
  );

  async function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (registration?.kind === "sending") return;
    const form = event.currentTarget;
    const values = new FormData(form);
    setRegistration({ kind: "sending", message: "Submitting registration…" });
    try {
      const response = await fetch("/api/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(values),
          isPlateletDonor: values.has("isPlateletDonor"),
        }),
      });
      const body = await response.json();
      if (!response.ok || !body.success) {
        setRegistration({ kind: "error", message: body.error || "Registration could not be submitted. Please try again." });
        return;
      }
      form.reset();
      setRegistration({ kind: "success", message: body.message });
    } catch {
      setRegistration({ kind: "error", message: "Registration could not be submitted. Please try again." });
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header className="flex flex-wrap items-end justify-between gap-5 rounded-3xl bg-rose-50 p-6 sm:p-9">
        <div>
          <Droplet aria-hidden="true" className="mb-3 size-7 text-rose-700" />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">Blood & platelet donors</h1>
          <p className="mt-3 max-w-2xl text-slate-700">Browse donors by blood group and district. For an urgent request, ask your hospital’s blood bank to coordinate.</p>
        </div>
        <a href="#donor-registration" className="inline-flex min-h-11 items-center rounded-xl bg-rose-800 px-4 font-semibold text-white hover:bg-rose-900">Register to donate</a>
      </header>

      <section aria-labelledby="donor-results" className="space-y-4">
        <div className="grid gap-4 rounded-2xl border bg-white p-5 sm:grid-cols-3">
          <label className="text-sm font-semibold">Blood group
            <select className={field} value={group} onChange={(event) => setGroup(event.target.value)}>
              <option value="">All blood groups</option>
              {BLOOD_GROUPS.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">District
            <select className={field} value={district} onChange={(event) => setDistrict(event.target.value)}>
              <option value="">All districts</option>
              {BANGLADESH_DISTRICTS.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="flex min-h-11 items-center gap-2 self-end text-sm font-semibold">
            <input type="checkbox" className="size-4 accent-rose-800" checked={platelets} onChange={(event) => setPlatelets(event.target.checked)} />
            Platelet donors only
          </label>
        </div>

        <h2 id="donor-results" className="text-xl font-bold">Donor listings</h2>
        <DirectoryStatus {...directory} />
        {directory.source && <p role="status" className="text-sm text-slate-600">{matches.length} {matches.length === 1 ? "match" : "matches"}</p>}
        {directory.source && matches.length === 0 && (
          <div className="rounded-2xl border bg-white p-8 text-center">
            <p className="mb-3">No donors match these filters.</p>
            <Button variant="outline" onClick={() => { setGroup(""); setDistrict(""); setPlatelets(false); }}>Clear filters</Button>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((donor) => (
            <Card key={donor.id} className="space-y-3 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="grid size-11 place-items-center rounded-xl bg-rose-100 font-bold text-rose-900">{donor.bloodGroup}</span>
                {directory.source === "registry" && <Badge variant={donor.isAvailable ? "success" : "secondary"}>{donor.isAvailable ? "Listed as available" : "Unavailable"}</Badge>}
              </div>
              <h3 className="text-lg font-bold">{donor.name}</h3>
              <p className="flex items-center gap-1.5 text-sm text-slate-600"><MapPin aria-hidden="true" size={16} />{donor.area}, {donor.district}</p>
              {donor.isPlateletDonor && <Badge variant="secondary">Platelet donor</Badge>}
            </Card>
          ))}
        </div>
        <Link href="/hospitals" className="inline-block text-sm font-semibold text-teal-800 underline underline-offset-4">Find a hospital</Link>
      </section>

      <section id="donor-registration" tabIndex={-1} className="scroll-mt-24 rounded-3xl border bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-bold tracking-tight">Register to donate</h2>
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-600"><Lock aria-hidden="true" size={16} /> Your phone number stays private.</p>
        <form onSubmit={register} className="mt-6 grid max-w-2xl gap-4 sm:grid-cols-2" aria-busy={registration?.kind === "sending"}>
          <label className="text-sm font-semibold">Full name
            <input name="name" autoComplete="name" required maxLength={100} className={field} />
          </label>
          <label className="text-sm font-semibold">Phone number
            <input name="phone" type="tel" autoComplete="tel" required maxLength={25} className={field} />
          </label>
          <label className="text-sm font-semibold">Blood group
            <select name="bloodGroup" required className={field} defaultValue="">
              <option value="" disabled>Select a blood group</option>
              {BLOOD_GROUPS.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">District
            <select name="district" required className={field} defaultValue="">
              <option value="" disabled>Select a district</option>
              {BANGLADESH_DISTRICTS.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">Area
            <input name="area" required maxLength={100} className={field} />
          </label>
          <label className="flex min-h-11 items-center gap-2 self-end text-sm font-semibold">
            <input name="isPlateletDonor" type="checkbox" className="size-4 accent-rose-800" />
            I can donate platelets
          </label>
          <div className="space-y-3 sm:col-span-2">
            <Button type="submit" className="bg-rose-800 hover:bg-rose-900" disabled={registration?.kind === "sending"}>Submit registration</Button>
            {registration && <p role={registration.kind === "error" ? "alert" : "status"} className={registration.kind === "error" ? "text-sm text-rose-800" : "text-sm text-slate-700"}>{registration.message}</p>}
          </div>
        </form>
      </section>
    </div>
  );
}
