"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { unauthorized } from "next/navigation";
import Loading from "../loading/loading";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Don't do anything while loading

    if (!user) {
      router.push("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      unauthorized();
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) return <Loading />;
  if (!user) return null; // Will be redirected by useEffect
  if (!allowedRoles.includes(user.role)) return null; // Will be redirected by useEffect

  return children;
}
