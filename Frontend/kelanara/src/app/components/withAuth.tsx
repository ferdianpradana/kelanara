"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import type { ComponentType } from "react";

interface TokenPayload {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: string[] = []
) => {
  const Protected = (props: P) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const decoded = jwtDecode<TokenPayload>(token);

        if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
          router.replace("/unauthorized");
        }
      } catch (err) {
        console.error("Token error:", err);
        router.replace("/login");
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return Protected;
};

export default withAuth;
