"use client";

interface DirectoryStatusProps {
  loading: boolean;
  error: boolean;
  source?: "registry" | "demo";
  reload: () => void;
}

export default function DirectoryStatus({ loading, error, source, reload }: DirectoryStatusProps) {
  if (loading) return <p role="status" className="rounded-xl border bg-white p-4 text-sm text-slate-700">Loading directory…</p>;
  if (error) {
    return (
      <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
        <p>The directory could not load.</p>
        <button type="button" onClick={reload} className="rounded-lg border border-rose-300 bg-white px-3 py-2 font-semibold">Try again</button>
      </div>
    );
  }
  if (source === "demo") return <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">You’re viewing sample listings because the registry is unavailable.</p>;
  return null;
}
