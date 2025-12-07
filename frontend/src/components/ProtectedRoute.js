import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../stores/useAuth";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const loadingUser = useAuth((s) => s.loading);
  const router = useRouter();

  useEffect(() => {
    if (!loadingUser && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loadingUser, router]);

  if (!isAuthenticated) return null;
  return children;
}
