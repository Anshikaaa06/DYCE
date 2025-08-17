"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Loader,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { resetPassword, isLoading, error, message, expired } = useAuthStore();

  const [isValidToken, setIsValidToken] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
    }
  }, [token]);

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword(token, password);
      if (error) {
        toast.error(message);
        if (expired) {
          setIsValidToken(false);
        }
        return;
      }

      setResetSuccess(true);
      toast.success("Password reset successful!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-dark text-light flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl text-red-400 mb-2">
              Invalid Link
            </h1>
            <p className="text-light/80">
              This password reset link is invalid or has expired
            </p>
          </div>

          <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-8 border border-light/10 text-center">
            <div className="mx-auto w-16 h-16 bg-red-400/20 rounded-full flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-red-400" />
            </div>

            <h3 className="text-lg font-medium text-light mb-4">
              Link Expired
            </h3>
            <p className="text-light/70 text-sm mb-6">
              Password reset links expire after 1 hour for security reasons
            </p>

            <div className="space-y-3">
              <button
                onClick={() => router.push("/forgot-password")}
                className="w-full py-3 rounded-2xl font-rounded font-medium bg-gradient-to-r from-primary to-emotional text-white hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Request New Link
              </button>

              <button
                onClick={() => router.push("/login")}
                className="w-full py-3 rounded-2xl font-rounded font-medium text-light/80 bg-light/10 hover:bg-light/20 transition-all duration-300 border border-light/20"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-dark text-light flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl text-primary mb-2">
              Password Reset!
            </h1>
            <p className="text-light/80">
              Your password has been successfully reset
            </p>
          </div>

          <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-8 border border-light/10 text-center">
            <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>

            <h3 className="text-lg font-medium text-light mb-4">All Set!</h3>
            <p className="text-light/70 text-sm mb-6">
              You can now login with your new password
            </p>

            <button
              onClick={handleLoginRedirect}
              className="w-full py-4 rounded-2xl font-rounded font-medium text-lg bg-gradient-to-r from-primary to-emotional text-white hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Continue to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-light flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <a
            href="/login"
            className="inline-flex items-center gap-2 text-light/70 hover:text-light mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </a>
          <h1 className="font-serif text-4xl text-primary mb-2">
            Reset Password
          </h1>
          <p className="text-light/80">Enter your new password below</p>
        </div>

        {/* Reset Form */}
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-8 border border-light/10 animate-fade-in">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* New Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-light/80 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className={`w-full pl-12 pr-12 py-4 bg-light/10 border rounded-2xl focus:outline-none focus:ring-2 transition-all ${
                    password && validatePassword(password)
                      ? "border-primary focus:ring-primary/50 text-light"
                      : password && !validatePassword(password)
                      ? "border-red-500 focus:ring-red-500/50 text-red-400"
                      : "border-light/20 focus:ring-primary/50 text-light"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-light/40 hover:text-light/60 transition-colors"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
              {password && !validatePassword(password) && (
                <p className="text-red-400 text-sm mt-2">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-light/80 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light/40" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`w-full pl-12 pr-12 py-4 bg-light/10 border rounded-2xl focus:outline-none focus:ring-2 transition-all ${
                    confirmPassword && password === confirmPassword
                      ? "border-primary focus:ring-primary/50 text-light"
                      : confirmPassword && password !== confirmPassword
                      ? "border-red-500 focus:ring-red-500/50 text-red-400"
                      : "border-light/20 focus:ring-primary/50 text-light"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-light/40 hover:text-light/60 transition-colors"
                >
                  {showConfirmPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-red-400 text-sm mt-2">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                !validatePassword(password) ||
                password !== confirmPassword ||
                isLoading
              }
              className={`w-full py-4 rounded-2xl font-rounded font-medium text-lg transition-all duration-300 ${
                validatePassword(password) &&
                password === confirmPassword &&
                !isLoading
                  ? "bg-gradient-to-r from-primary to-emotional text-white hover:shadow-xl hover:scale-105"
                  : "bg-light/10 text-light/40 cursor-not-allowed"
              }`}
            >
              Reset Password{" "}
              {isLoading && (
                <Loader className="w-5 h-5 animate-spin inline-block ml-2" />
              )}
            </button>
          </form>
        </div>

        {/* Security Note */}
        <div className="mt-8 bg-light/5 rounded-2xl p-4 text-center">
          <p className="text-light/70 text-sm">
            Choose a strong password that you haven&apos;t used before
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
