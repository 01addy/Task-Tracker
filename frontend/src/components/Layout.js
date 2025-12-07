import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "./Header";
import { useRouter } from "next/router";

const Sidebar = dynamic(() => import("./Sidebar"), { ssr: false });

export default function Layout({ children }) {
  const router = useRouter();

  
  const authPages = ["/login", "/signup", "/forgot-password"];
  const isAuthPage = authPages.includes(router.pathname);

  useEffect(() => {
    const clear = () => document.body.classList.remove("mobile-menu-open");
    window.addEventListener("beforeunload", clear);
    return () => window.removeEventListener("beforeunload", clear);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      <Header />

      <div className="flex">
        
        {!isAuthPage && <Sidebar />}

        <div className="flex-1 min-h-screen">
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
