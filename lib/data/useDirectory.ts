"use client";

import { useEffect, useState } from "react";

interface DirectoryResponse<T> {
  success: boolean;
  source: "registry" | "demo";
  data: T[];
}

export function useDirectory<T>(url: string) {
  const [result, setResult] = useState<DirectoryResponse<T> | null>(null);
  const [error, setError] = useState(false);
  const [request, setRequest] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(url, { signal: controller.signal });
        const body: DirectoryResponse<T> = await response.json();
        if (!response.ok || !body.success) throw new Error("Directory request failed");
        if (!controller.signal.aborted) setResult(body);
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    }
    void load();
    return () => controller.abort();
  }, [url, request]);

  function reload() {
    setError(false);
    setResult(null);
    setRequest((previous) => previous + 1);
  }

  return { items: result?.data ?? [], source: result?.source, loading: !result && !error, error, reload };
}
