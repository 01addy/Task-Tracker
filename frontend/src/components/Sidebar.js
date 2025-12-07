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
      // open on desktop by default, close on mobile
      if (mobile) {
        closeSidebar();
      } else {
        openSidebar();
      }
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [openSidebar, closeSidebar]);

  // fallback event listener so header can force-open the sidebar
  useEffect(() => {
    const handler = () => {
      if (typeof openSidebar === "function") openSidebar();
    };
    window.addEventListener("tasktracker:openSidebar", handler);
    return () => window.removeEventListener("tasktracker:openSidebar", handler);
  }, [openSidebar]);

  const showOverlay = mounted && isMobile && isSidebarOpen;

  // visibility controlled by isSidebarOpen for all breakpoints
  const translateClass = mounted ? (isSidebarOpen ? "translate-x-0" : "-translate-x-full") : "-translate-x-full";

  const projects = React.useMemo(() => {
    if (!Array.isArray(tasks) || tasks.length === 0) return [];
    const seen = new Set();
    const list = [];
    for (const t of tasks) {
      const p = (t.project || "").trim();
      if (!p) continue;
      if (!seen.has(p)) {
        seen.add(p);
        list.push(p);
      }
    }
    return list;
  }, [tasks]);

  return (
    <>
      {mounted && (
        <div
          onClick={() => {
            if (showOverlay) closeSidebar();
          }}
          className={classNames(
            "fixed inset-0 bg-black/30 z-30 transition-opacity duration-300 ease-in-out md:hidden",
            { "opacity-100 pointer-events-auto": showOverlay, "opacity-0 pointer-events-none": !showOverlay }
          )}
          aria-hidden={!showOverlay}
        />
      )}

      <aside
        className={classNames(
          // control visibility via transform for all sizes
          "fixed left-0 top-0 h-full w-72 p-4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-800 z-40 transform transition-transform duration-300 ease-in-out will-change-transform",
          translateClass
        )}
        aria-hidden={mounted ? !isSidebarOpen : undefined}
      >
        <button
          onClick={() => {
            if (typeof toggleSidebar === "function") {
              toggleSidebar();
            } else if (typeof closeSidebar === "function" && isSidebarOpen) {
              closeSidebar();
            } else if (typeof openSidebar === "function" && !isSidebarOpen) {
              openSidebar();
            }
          }}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700 md:hidden focus:outline-none"
          title="Toggle sidebar"
        >
          <HiOutlineMenu className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div>
            <nav className="space-y-2">
              <NavItem href="/" icon={FaTasks} selected={pathname === "/" && !query.project}>All Tasks</NavItem>
              <NavItem href="/today" icon={FaCalendarDay} selected={pathname === "/today"}>Today</NavItem>
              <NavItem href="/week" icon={FaRegCalendarAlt} selected={pathname === "/week"}>This Week</NavItem>
              <NavItem href="/completed" icon={FaCheckCircle} selected={pathname === "/completed"}>Completed</NavItem>
            </nav>
          </div>

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
                    onClick={() => closeSidebar()}
                    className={classNames(
                      "flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left",
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
