// frontend/src/components/ProtectedRoute.js
"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@apollo/client";
import { AuthContext } from "@/context/AuthContext";
import { GET_USER } from "@/graphql/userQueries";

export default function ProtectedRoute(Component) {
  return function ProtectedComponent(props) {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const pathname = usePathname();
    const [profileChecked, setProfileChecked] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    const { data, loading: userLoading } = useQuery(GET_USER, {
      variables: { id: user?.userId },
      skip: !user,
    });

    useEffect(() => {
      if (!mounted) return;
      if (!authLoading && !user) {
        router.replace("/login");
        return;
      }
      if (data?.getUser) {
        const { age, gender, searchGender } = data.getUser;
        if ((!age || !gender || !searchGender) && pathname !== "/profile") {
          router.replace("/profile");
        }
        setProfileChecked(true);
      }
    }, [mounted, data, authLoading, user, pathname, router]);

    if (authLoading || userLoading || !profileChecked) {
      return <p>Cargando...</p>;
    }

    if (!user) return null;

    return <Component {...props} />;
  };
}
