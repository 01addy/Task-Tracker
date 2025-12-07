import React, { useEffect, useState } from "react";
import { useUiStore } from "../stores/useUiStore";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../stores/useAuth";
import { useRouter } from "next/router";
import { FiLogOut } from "react-icons/fi/index.js";
import { HiOutlineMenu } from "react-icons/hi/index.js";

export default function Header() {
  const router = useRouter();

  const { user, isAuthenticated, logout } = useAuth((s) => ({
    user: s.user,
    isAuthenticated: s.isAuthenticated,
    logout: s.logout,
  }));

  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const openSidebar = useUiStore((s) => s.openSidebar);
  const closeSidebar = useUiStore((s) => s.closeSidebar);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleRoute = () => closeSidebar();
    router.events.on("routeChangeStart", handleRoute);
    return () => router.events.off("routeChangeStart", handleRoute);
  }, [router, closeSidebar]);

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {/* SINGLE hamburger button */}
        <button
          type="button"
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => {
            // DEBUG: log click + toggle + store preview
            try {
              console.log("[DEBUG] Header hamburger clicked - before toggle");
            } catch (e) {}

            try {
              toggleSidebar();
              console.log("[DEBUG] toggleSidebar() called.");
            } catch (e) {
              console.error("[DEBUG] toggleSidebar() threw:", e);
            }

            try {
              // Zustand hook function exposes getState
              const st = typeof useUiStore.getState === "function" ? useUiStore.getState() : null;
              console.log("[DEBUG] store state after toggle:", st);
            } catch (e) {
              console.warn("[DEBUG] cannot read store.getState()", e);
            }

            try {
              window.dispatchEvent(new CustomEvent("tasktracker:openSidebar"));
              console.log("[DEBUG] dispatched event tasktracker:openSidebar");
            } catch (e) {
              console.warn("[DEBUG] dispatch event failed", e);
            }
          }}
          aria-label="Toggle menu"
          title="Toggle menu"
        >
          <HiOutlineMenu className="w-6 h-6 text-gray-700 dark:text-gray-100" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg avatar-gradient flex items-center justify-center shadow-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="3" y="3" width="18" height="18" rx="5" fill="white" />
              <path
                d="M7 12l3 3 7-7"
                stroke="var(--accent-2)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="text-indigo-600 dark:text-indigo-300 font-semibold text-lg">TaskTracker</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {mounted && isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full avatar-gradient flex items-center justify-center text-white font-semibold shadow text-sm">
              {user.name
                ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")
                : user.email
                ? user.email[0].toUpperCase()
                : "U"}
            </div>

            <button
              onClick={async () => {
                await logout();
                router.replace("/login");
              }}
              className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-100 hover:underline whitespace-nowrap"
              aria-label="Logout"
            >
              <FiLogOut className="w-5 h-5 text-gray-700 dark:text-gray-100" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div style={{ width: 1 }} aria-hidden />
        )}
      </div>
    </header>
  );
}
