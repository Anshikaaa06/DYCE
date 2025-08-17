'use client'

import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/matching");
    }
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return <>{children}</>;
};

export default AuthLayout;
