import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaTasks, FaCalendarDay, FaRegCalendarAlt, FaCheckCircle } from "react-icons/fa/index.js";
import { HiOutlineMenu } from "react-icons/hi/index.js";
import { useUiStore } from "../stores/useUiStore";
import { useTasks } from "../stores/useTasks";
import classNames from "classnames";

const NavItem = ({ href, icon: Icon, children, selected }) => (
  <Link
    href={href}
    className={classNames(
      "flex items-center gap-3 px-3 py-2 rounded-lg",
      selected ? "pill-selected" : "hover:bg-gray-100 dark:hover:bg-gray-800"
    )}
    aria-current={selected ? "page" : undefined}
  >
    <span className="text-lg"><Icon /></span>
    <span className="font-medium">{children}</span>
  </Link>
);

export default function Sidebar() {
  const router = useRouter();
  const pathname = router.pathname;
  const query = router.query;

  const isSidebarOpen = useUiStore((s) => s.isSidebarOpen);
  const openSidebar = useUiStore((s) => s.openSidebar);
  const closeSidebar = useUiStore((s) => s.closeSidebar);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  const tasks = useTasks((s) => s.tasks);

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);

    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Desktop open, mobile closed by default
      if (mobile) closeSidebar();
      else openSidebar();
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [openSidebar, closeSidebar]);

  const showOverlay = mounted && isMobile && isSidebarOpen;

  const translateClass = mounted ? (isSidebarOpen ? "translate-x-0" : "-translate-x-full") : "-translate-x-full";

  const projects = React.useMemo(() => {
    if (!Array.isArray(tasks) || tasks.length === 0) return [];
    const seen = new Set();
    return tasks
      .map((t) => (t.project || "").trim())
      .filter((p) => p && !seen.has(p) && seen.add(p));
  }, [tasks]);

  return (
    <>
      {/* Overlay (mobile only) */}
      {mounted && (
        <div
          onClick={() => showOverlay && closeSidebar()}
          className={classNames(
            "fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ease-in-out md:hidden",
            showOverlay ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          aria-hidden={!showOverlay}
        />
      )}

      {/* Sidebar */}
      <aside
        className={classNames(
          "fixed left-0 top-0 h-full w-72 p-4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-800 z-50 transform transition-transform duration-300 ease-in-out",
          translateClass,
          "md:top-12 md:h-[calc(100vh-3rem)]"
        )}
      >
        {/* Mobile close button */}
        <button
          onClick={toggleSidebar}
          aria-label="Close sidebar"
          className="absolute top-3 right-3 z-60 w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700 md:hidden"
        >
          <HiOutlineMenu className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <nav className="space-y-2">
            <NavItem href="/" icon={FaTasks} selected={pathname === "/" && !query.project}>
              All Tasks
            </NavItem>
            <NavItem href="/today" icon={FaCalendarDay} selected={pathname === "/today"}>
              Today
            </NavItem>
            <NavItem href="/week" icon={FaRegCalendarAlt} selected={pathname === "/week"}>
              This Week
            </NavItem>
            <NavItem href="/completed" icon={FaCheckCircle} selected={pathname === "/completed"}>
              Completed
            </NavItem>
          </nav>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="text-xs text-gray-400 uppercase mb-3">Projects</div>

            <div className="space-y-2">
              {projects.length === 0 ? (
                <div className="text-sm text-gray-500">No projects yet</div>
              ) : (
                projects.map((p) => (
                  <Link
                    key={p}
                    href={{ pathname: "/", query: { project: p } }}
                    onClick={closeSidebar}
                    className={classNames(
                      "flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
                      query.project === p ? "pill-selected" : ""
                    )}
                  >
                    <span className="w-3 h-3 rounded-full" style={{ background: "#a78bfa" }} />
                    <span className="truncate">{p}</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
