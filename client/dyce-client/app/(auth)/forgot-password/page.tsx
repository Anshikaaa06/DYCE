"use client";

import React, { useState } from "react";
import { ArrowLeft, Mail, Loader, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const { isLoading, error, message } = useAuthStore();
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@(nsut\.ac\.in|igdtuw\.ac\.in)$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Please enter a valid NSUT or IGDTUW email");
      return;
    }

    try {
      await forgotPassword(email);
      if (error) {
        toast.error(message);
        return;
      }
      setEmailSent(true);
      // toast.success(message || "Reset email sent successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleResend = async () => {
    try {
      await forgotPassword(email);
      if (error) {
        toast.error(message);
        return;
      }
      toast.success("Reset link sent successfully!");
      setEmailSent(true);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

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
            {emailSent ? "Check Your Email" : "Forgot Password?"}
          </h1>
          <p className="text-light/80">
            {emailSent
              ? "We've sent a password reset link to your email"
              : "No worries, we'll help you reset it"}
          </p>
        </div>

        {/* Form */}
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-8 border border-light/10 animate-fade-in">
          {!emailSent ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-light/80 mb-2"
                >
                  College Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light/40" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@nsut.ac.in"
                    className={`w-full pl-12 pr-4 py-4 bg-light/10 border rounded-2xl focus:outline-none focus:ring-2 transition-all ${
                      email && validateEmail(email)
                        ? "border-primary focus:ring-primary/50 text-light"
                        : email && !validateEmail(email)
                        ? "border-red-500 focus:ring-red-500/50 text-red-400"
                        : "border-light/20 focus:ring-primary/50 text-light"
                    }`}
                  />
                </div>
                {email && !validateEmail(email) && (
                  <p className="text-red-400 text-sm mt-2">
                    Please use your NSUT (@nsut.ac.in) or IGDTUW (@igdtuw.ac.in)
                    email
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!validateEmail(email) || isLoading}
                className={`w-full py-4 rounded-2xl font-rounded font-medium text-lg transition-all duration-300 ${
                  validateEmail(email) && !isLoading
                    ? "bg-gradient-to-r from-primary to-emotional text-white hover:shadow-xl hover:scale-105"
                    : "bg-light/10 text-light/40 cursor-not-allowed"
                }`}
              >
                Send Reset Link{" "}
                {isLoading && (
                  <Loader className="w-5 h-5 animate-spin inline-block ml-2" />
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              {/* Success Icon */}
              <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>

              {/* Success Message */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-light">Email Sent!</h3>
                <p className="text-light/70 text-sm">
                  We&apos;ve sent a password reset link to{" "}
                  <span className="text-primary font-medium">{email}</span>
                </p>
                <p className="text-light/60 text-xs">
                  The link will expire in 1 hour
                </p>
              </div>

              {/* Resend Button */}
              <button
                onClick={handleResend}
                disabled={isLoading}
                className="w-full py-3 rounded-2xl font-rounded font-medium text-light/80 bg-light/10 hover:bg-light/20 transition-all duration-300 border border-light/20"
              >
                Resend Email{" "}
                {isLoading && (
                  <Loader className="w-4 h-4 animate-spin inline-block ml-2" />
                )}
              </button>
            </div>
          )}

          {/* Back to Login */}
          <div className="text-center mt-6">
            <span className="text-light/70">Remember your password? </span>
            <a
              href="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Back to Login
            </a>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-light/60 text-sm">
            Can&apos;t find the email? Check your spam folder!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
