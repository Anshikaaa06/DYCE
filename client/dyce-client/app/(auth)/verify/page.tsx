"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Loader, RotateCcw } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const isLoading = useAuthStore((state) => state.isLoading);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const verifyEmail = useAuthStore((state) => state.verifyEmail);
  const router = useRouter();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setCountdown(60);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const handleSubmit:
    | React.FormEventHandler<HTMLFormElement>
    | undefined = async (e) => {
    e.preventDefault();
    try {
      await verifyEmail(otp.join(""));
      router.push("/profile/basic");
      setOtp(["", "", "", "", "", ""]);
      toast.success("Email verified successfully");
    } catch (error) {
      console.log(error);
      toast.error("Please enter a valid verification code");
    } finally {
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <div className="min-h-screen bg-dark text-light flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <a
            href="/signup"
            className="inline-flex items-center gap-2 text-light/70 hover:text-light mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign Up
          </a>
          <h1 className="font-serif text-4xl text-primary mb-2">
            Verify Your Email
          </h1>
          <p className="text-light/80 mb-2">
            We sent a code to your college email
          </p>
          <p className="text-light/60 text-sm">
            Check your inbox for the 6-digit verification code
          </p>
        </div>

        {/* OTP Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-light/5 backdrop-blur-sm rounded-3xl p-8 border border-light/10 animate-fade-in"
        >
          {/* OTP Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-light/80 mb-4 text-center">
              Enter verification code
            </label>
            <div className="flex gap-3 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 md:w-14 md:h-14 text-center text-xl font-bold bg-light/10 border border-light/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-light transition-all"
                />
              ))}
            </div>
          </div>

          {/* Resend Section */}
          <div className="text-center mb-6">
            {canResend ? (
              <button
                onClick={handleResend}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Resend Code
              </button>
            ) : (
              <p className="text-light/60 text-sm">
                Resend code in {countdown}s
              </p>
            )}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={!isOtpComplete || isLoading}
            className={`w-full py-4 rounded-2xl font-rounded font-medium text-lg transition-all duration-300 ${
              isOtpComplete
                ? "bg-gradient-to-r from-primary to-emotional text-white hover:shadow-xl hover:scale-105"
                : "bg-light/10 text-light/40 cursor-not-allowed"
            }`}
          >
            Verify and Match{" "}
            {isLoading && (
              <Loader className="w-5 h-5 animate-spin inline-block ml-2" />
            )}
          </button>
        </form>

        {/* Help Text */}
        <div className="mt-8 bg-light/5 rounded-2xl p-4 text-center">
          <p className="text-light/70 text-sm mb-2">
            Didn&apos;t receive the code?
          </p>
          <div className="text-xs text-light/60 space-y-1">
            <p>• Check your spam/junk folder</p>
            <p>• Make sure you used your college email</p>
            <p>• The code expires in 10 minutes</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 flex justify-center">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div className="w-2 h-2 bg-light/30 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
