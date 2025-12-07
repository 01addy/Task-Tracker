import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "./Header";

// Sidebar is client-only (it reads window, uses state)
const Sidebar = dynamic(() => import("./Sidebar"), { ssr: false });

export default function Layout({ children }) {
  useEffect(() => {
    // clear class on mount/unmount just in case
    const clear = () => document.body.classList.remove("mobile-menu-open");
    window.addEventListener("beforeunload", clear);
    return () => window.removeEventListener("beforeunload", clear);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header sits at the top and is sticky */}
      <Header />

      {/* Content area: sidebar + main.
          On small screens Sidebar will overlay (handled by Sidebar's classes).
          On md+ the Sidebar is static and participates in the flex layout below the header. */}
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen">
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
