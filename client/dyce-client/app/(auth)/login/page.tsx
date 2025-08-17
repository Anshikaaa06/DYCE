"use client";

import React, { useState } from "react";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isLoading = useAuthStore((state) => state.isLoading);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/matching");
    } catch (error) {
      console.log(error);
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-dark text-light flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-light/70 hover:text-light mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="font-serif text-4xl text-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-light/80">Let&apos;s get you back to matching.</p>
        </div>

        {/* Login Form */}
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-8 border border-light/10 animate-fade-in">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-light/80 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light/40" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@nsut.ac.in"
                  className="w-full pl-12 pr-4 py-4 bg-light/10 border border-light/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-light"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-light/80 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-4 bg-light/10 border border-light/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-light"
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
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a
                href="/forgot-password" className="text-primary hover:text-primary/80 text-sm transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!email || !password}
              className={`w-full py-4 rounded-2xl font-rounded font-medium text-lg transition-all duration-300 ${
                email && password
                  ? "bg-gradient-to-r from-primary to-emotional text-white hover:shadow-xl hover:scale-105"
                  : "bg-light/10 text-light/40 cursor-not-allowed"
              }`}
            >
              DYCE Me In {
                isLoading && <Loader className="w-5 h-5 animate-spin inline-block ml-2" />
              }
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <span className="text-light/70">New here? </span>
            <a
              href="/signup"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Create your vibe → Sign Up
            </a>
          </div>
        </div>

        {/* Features Reminder */}
        <div className="mt-8 bg-light/5 rounded-2xl p-4 text-center">
          <p className="text-light/70 text-sm mb-2">
            Swipe into something real
          </p>
          <div className="flex justify-center gap-4 text-xs">
            <span className="bg-primary/20 px-3 py-1 rounded-full text-primary">
              Blind Dating
            </span>
            <span className="bg-emotional/20 px-3 py-1 rounded-full text-emotional">
              Vibe Quiz
            </span>
            <span className="bg-accent/20 px-3 py-1 rounded-full text-accent">
              Campus Only
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;