"use client";

import { Moon, Sun } from "lucide-react";
import { themeStorageKey } from "@/lib/theme";

export default function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      window.localStorage.setItem(themeStorageKey, next);
    } catch {
      // The current page still uses the selected theme when storage is unavailable.
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title="Toggle color theme"
      className="theme-toggle inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border bg-white text-slate-700 transition-colors hover:bg-slate-100"
    >
      <span className="theme-to-dark">
        <Moon aria-hidden="true" size={18} />
        <span className="sr-only">Switch to dark mode</span>
      </span>
      <span className="theme-to-light">
        <Sun aria-hidden="true" size={18} />
        <span className="sr-only">Switch to light mode</span>
      </span>
    </button>
  );
}
