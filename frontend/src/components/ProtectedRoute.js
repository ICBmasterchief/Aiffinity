// src/components/ProtectedRoute.js
"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function ProtectedRoute(Component) {
  return function ProtectedComponent(props) {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.replace("/login");
      }
    }, [user, router]);

    if (!user) {
      return null; // O muestra un indicador de carga
    }

    return <Component {...props} />;
  };
}
