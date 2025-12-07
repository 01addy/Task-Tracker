// src/components/ThemeToggle.js
import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  // mounted prevents SSR mismatch: we don't read/write localStorage until client mount
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setMounted(true);
    try {
      const t = localStorage.getItem("theme");
      if (t === "dark") {
        setTheme("dark");
        document.documentElement.classList.add("dark");
      } else {
        setTheme("light");
        document.documentElement.classList.remove("dark");
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      if (theme === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", theme);
    } catch (e) {}
  }, [theme, mounted]);

  // don't render different icon at SSR -> client mismatch; render nothing until mounted
  if (!mounted) {
    return (
      <button className="p-2 rounded" aria-hidden="true" />
    );
  }

  return (
    <button
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      aria-label="Toggle theme"
      className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      title="Toggle theme"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
