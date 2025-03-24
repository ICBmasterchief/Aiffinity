// frontend/src/components/ProtectedRoute.js
"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function ProtectedRoute(Component) {
  return function ProtectedComponent(props) {
    const { user, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.replace("/login");
      }
    }, [user, loading, router]);

    if (loading) {
      return <p>Cargando...</p>;
    }

    if (!user) {
      return null;
    }

    return <Component {...props} />;
  };
}
