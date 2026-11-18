export const themeStorageKey = "dengueguard-theme";

export const initializeTheme = `(() => {
  const preference = window.matchMedia("(prefers-color-scheme: dark)");
  const key = ${JSON.stringify(themeStorageKey)};
  const syncTheme = () => {
    let saved;
    try { saved = window.localStorage.getItem(key); } catch {}
    document.documentElement.dataset.theme = saved === "dark" || saved === "light"
      ? saved
      : preference.matches ? "dark" : "light";
  };
  syncTheme();
  preference.addEventListener("change", syncTheme);
  window.addEventListener("storage", (event) => {
    if (event.key === key || event.key === null) syncTheme();
  });
})();`;
