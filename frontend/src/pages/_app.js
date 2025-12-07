// src/pages/_app.js
import "../styles/globals.css";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAuth } from "../stores/useAuth";
import api from "../lib/api";
import { getAccessToken } from "../lib/auth";
import Layout from "../components/Layout";

function AuthInitializer({ children }) {
  const setUser = useAuth((s) => s.setUser);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          
          if (mounted) setUser(null);
          return;
        }

        const { data } = await api.get("/api/auth/me");
        if (mounted) setUser(data?.user || null);
      } catch (e) {
        
        try {
          const { data } = await api.get("/api/auth/me");
          if (mounted) setUser(data?.user || null);
        } catch (_) {
          if (mounted) setUser(null);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [setUser]);

  return children;
}

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    try {
      const t = localStorage.getItem("theme");
      if (t === "dark") document.documentElement.classList.add("dark");
    } catch {}
  }, []);

  return (
    <AuthInitializer>
      <Layout>
        <Component {...pageProps} />
        <Toaster />
      </Layout>
    </AuthInitializer>
  );
}

export default MyApp;
