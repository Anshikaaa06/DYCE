"use client";

import { useAuthStore } from "@/stores/auth-store";
import { Loader } from "lucide-react";
import React, { useEffect } from "react";
import { useShallow } from "zustand/shallow";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, isCheckingAuth, checkAuth } =
    useAuthStore(
      useShallow((state) => ({
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        isCheckingAuth: state.isCheckingAuth,
        checkAuth: state.checkAuth,
      }))
    );

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthenticated && !isCheckingAuth) {
      window.location.href = "/login";
    }
  }, [isAuthenticated, isCheckingAuth]);

  if (isLoading || !isAuthenticated || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark">
        <Loader className="animate-spin text-primary" size={25} />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedLayout;
