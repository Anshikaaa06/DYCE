"use client";

import React, { useState } from "react";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Loader } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isValid, setIsValid] = useState({isValid: false, college: ""});
  const signup = useAuthStore((state) => state.signup);
  const isLoading = useAuthStore((state) => state.isLoading);
  const router = useRouter();

  const validateEmail = (email: string) => {
    if (/^[a-zA-Z0-9._%+-]+@nsut\.ac\.in$/.test(email)) {
      return { isValid: true, college: "NSUT" };
    }

    if (/^[a-zA-Z0-9._%+-]+@igdtuw\.ac\.in$/.test(email)) {
      return { isValid: true, college: "IGDTUW" };
    }

    return { isValid: false, college: "" };
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsValid(validateEmail(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isValid.isValid && password) {
        
        await signup({ name, email, password, college: isValid.college });
        toast.success(
          "Sign Up Successful! Please check your email for verification."
        );
        router.push("/verify");
      } else {
        toast.error("Please enter a valid NSUT or IGDTUW email and a password");
        console.error("Invalid email or password");
      }
    } catch (error) {
      console.log(error);
      toast.error("Sign Up failed. Please try again.");
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
          <h1 className="font-serif text-4xl text-primary mb-2">Join DYCE</h1>
          <p className="text-light/80">Campus crushes, verified.</p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-8 border border-light/10 animate-fade-in">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-light/80 mb-2"
              >
                Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light/40" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className={`w-full pl-12 pr-4 py-4 bg-light/10 border rounded-2xl focus:outline-none focus:ring-2 transition-all ${
                    name && "border-primary focus:ring-primary/50 text-light"
                  }`}
                />
              </div>
            </div>

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
                  onChange={handleEmailChange}
                  placeholder="@nsut.ac.in or @igdtuw.ac.in"
                  className={`w-full pl-12 pr-4 py-4 bg-light/10 border rounded-2xl focus:outline-none focus:ring-2 transition-all ${
                    email && isValid.isValid
                      ? "border-primary focus:ring-primary/50 text-light"
                      : email && !isValid.isValid
                      ? "border-red-500 focus:ring-red-500/50 text-red-400"
                      : "border-light/20 focus:ring-primary/50 text-light"
                  }`}
                />
              </div>
              {email && !isValid.isValid && (
                <p className="text-red-400 text-sm mt-2">
                  Please use your NSUT (@nsut.ac.in) or IGDTUW (@igdtuw.ac.in)
                  email
                </p>
              )}
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
                  placeholder="Create a strong password"
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
                href="#"
                className="text-primary hover:text-primary/80 text-sm transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid.isValid || !password || isLoading}
              className={`w-full py-4 rounded-2xl font-rounded font-medium text-lg transition-all duration-300 ${
                isValid && password
                  ? "bg-gradient-to-r from-primary to-emotional text-white hover:shadow-xl hover:scale-105"
                  : "bg-light/10 text-light/40 cursor-not-allowed"
              }`}
            >
              Let&apos;s DYCE{" "}
              {isLoading && (
                <Loader className="w-5 h-5 animate-spin inline-block ml-2" />
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <span className="text-light/70">Already got a vibe? </span>
            <a
              href="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Login instead
            </a>
          </div>
        </div>

        {/* College Info */}
        <div className="mt-8 text-center">
          <div className="text-light/60 text-sm mb-4">
            Exclusively for students of:
          </div>
          <div className="flex justify-center gap-6 text-sm">
            <div className="bg-primary/20 px-4 py-2 rounded-full text-primary">
              NSUT
            </div>
            <div className="bg-accent/20 px-4 py-2 rounded-full text-accent">
              IGDTUW
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;