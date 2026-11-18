"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Account {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export default function AccountEditor({ account, inactive }: { account: Account; inactive: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ error: boolean; text: string }>();

  async function submit(change: { action: "deactivate" | "restore" } | { action: "edit"; name: string; email: string; phone: string }) {
    if (busy) return;
    setBusy(true);
    setMessage(undefined);
    try {
      const response = await fetch(`/api/admin/accounts/${account.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(change),
      });
      const body = await response.json();
      if (!response.ok || !body.success) {
        setMessage({ error: true, text: body.error || "The change could not be saved." });
        return;
      }
      setEditing(false);
      setConfirm(false);
      setMessage({ error: false, text: "Account updated." });
      router.refresh();
    } catch {
      setMessage({ error: true, text: "The change could not be saved. Try again." });
    } finally {
      setBusy(false);
    }
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    void submit({ action: "edit", name: String(values.get("name")), email: String(values.get("email")), phone: String(values.get("phone")) });
  }

  const field = "min-h-10 rounded-lg border px-3 font-normal";
  return (
    <div className="space-y-3 rounded-xl border bg-white p-4" aria-busy={busy}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold capitalize text-indigo-800">{account.role} · {inactive ? "Inactive" : "Active"}</p>
          <h2 className="wrap-break-word font-bold">{account.name}</h2>
          <p className="wrap-break-word text-sm text-slate-600">{account.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {account.role === "patient" && <a href={`/admin/patients/${account.id}`} className="inline-flex h-8 items-center px-2 text-sm text-indigo-800 underline">Patient details</a>}
          <Button size="sm" variant="outline" aria-expanded={editing} disabled={busy} onClick={() => { setEditing(!editing); setConfirm(false); setMessage(undefined); }}>Edit</Button>
          {inactive
            ? <Button size="sm" variant="navy" disabled={busy} onClick={() => submit({ action: "restore" })}>Restore</Button>
            : <Button size="sm" variant="outline" aria-expanded={confirm} disabled={busy} className="text-rose-800" onClick={() => { setConfirm(!confirm); setEditing(false); setMessage(undefined); }}>Deactivate</Button>}
        </div>
      </div>
      {editing && (
        <form onSubmit={save} className="grid gap-3 border-t pt-3 sm:grid-cols-3">
          <label className="grid gap-1 text-sm font-semibold">Name<input name="name" defaultValue={account.name} required maxLength={100} className={field} /></label>
          <label className="grid gap-1 text-sm font-semibold">Email<input name="email" defaultValue={account.email} type="email" required maxLength={254} className={field} /></label>
          <label className="grid gap-1 text-sm font-semibold">Phone<input name="phone" defaultValue={account.phone} type="tel" maxLength={25} className={field} /></label>
          <div className="sm:col-span-3"><Button type="submit" variant="navy" disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button></div>
        </form>
      )}
      {confirm && (
        <div className="space-y-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-950">
          <p><strong>Deactivate {account.name}?</strong> Their sessions will end and their records will be retained.</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="destructive" disabled={busy} onClick={() => submit({ action: "deactivate" })}>Confirm deactivation</Button>
            <Button size="sm" variant="outline" disabled={busy} onClick={() => setConfirm(false)}>Cancel</Button>
          </div>
        </div>
      )}
      {message && <p role={message.error ? "alert" : "status"} className={message.error ? "text-sm text-rose-800" : "text-sm text-teal-800"}>{message.text}</p>}
    </div>
  );
}
