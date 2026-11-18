import { notFound, redirect } from "next/navigation";
import AccountEditor from "@/components/dashboard/AccountEditor";
import { getSession } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/models";

type Search = Promise<{ q?: string; role?: string; status?: string; page?: string }>;

export default async function AdminAccountsPage({ searchParams }: { searchParams: Search }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") notFound();

  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const role = params.role === "doctor" || params.role === "patient" ? params.role : "";
  const inactive = params.status === "inactive";
  const requestedPage = Number(params.page);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 && requestedPage <= 100_000 ? requestedPage : 1;
  const limit = 20;
  const search = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  await connectDB();
  const accounts = await User.find({
    role: { $in: role ? [role] : ["doctor", "patient"] },
    deactivatedAt: inactive ? { $ne: null } : null,
    ...(query ? { $or: [{ name: search }, { email: search }] } : {}),
  }).select("name email phone role")
    .sort({ name: 1, _id: 1 }).skip((page - 1) * limit).limit(limit + 1).lean();
  const pageUrl = (number: number) => `/admin/accounts?${new URLSearchParams({
    q: query, role, status: inactive ? "inactive" : "active", page: String(number),
  })}`;

  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <header className="rounded-2xl bg-indigo-950 px-5 py-7 text-white sm:p-8">
        <h1 className="text-3xl font-bold tracking-tight">Manage accounts</h1>
        <p className="mt-2 text-sm text-indigo-100">Edit, deactivate, or restore doctor and patient accounts.</p>
      </header>
      <form action="/admin/accounts" className="grid items-end gap-3 rounded-xl border bg-white p-4 sm:grid-cols-[2fr_1fr_1fr_auto]">
        <label className="grid gap-1 text-sm font-semibold">Name or email
          <input name="q" type="search" defaultValue={query} maxLength={100} className="min-h-11 rounded-lg border px-3" />
        </label>
        <label className="grid gap-1 text-sm font-semibold">Role
          <select name="role" defaultValue={role} className="min-h-11 rounded-lg border bg-white px-3">
            <option value="">All roles</option><option value="doctor">Doctors</option><option value="patient">Patients</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold">Status
          <select name="status" defaultValue={inactive ? "inactive" : "active"} className="min-h-11 rounded-lg border bg-white px-3">
            <option value="active">Active</option><option value="inactive">Inactive</option>
          </select>
        </label>
        <button className="min-h-11 rounded-lg bg-indigo-800 px-4 text-sm font-semibold text-white">Apply filters</button>
      </form>
      {accounts.length === 0 && <p className="rounded-xl border bg-white p-5 text-sm text-slate-700">No accounts match these filters.</p>}
      <ul className="space-y-3">
        {accounts.slice(0, limit).map((account) => (
          <li key={String(account._id)}>
            <AccountEditor account={{
              id: String(account._id), name: account.name, email: account.email, phone: account.phone ?? "", role: account.role,
            }} inactive={inactive} />
          </li>
        ))}
      </ul>
      {(page > 1 || accounts.length > limit) && (
        <nav aria-label="Account pages" className="flex items-center gap-4 text-sm">
          {page > 1 && <a href={pageUrl(page - 1)} className="text-indigo-800 underline">Previous page</a>}
          <span>Page {page}</span>
          {accounts.length > limit && <a href={pageUrl(page + 1)} className="text-indigo-800 underline">Next page</a>}
        </nav>
      )}
    </section>
  );
}
