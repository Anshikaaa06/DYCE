"use client";

import React, { useEffect } from "react";
import {
  Heart,
  Shield,
  Users,
  Zap,
  Smartphone,
  Chrome,
  Share,
  CircleCheck,
  Clock,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Home = () => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/matching");
    }
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <>
      <div className="min-h-screen bg-dark text-light overflow-hidden">
        {/* Navigation */}
        <nav className="px-4 py-6 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Image
              src="/dyce-logo.png"
              alt="logo"
              className="object-cover"
              width={100}
              height={80}
            />

            <div className="flex gap-4">
              {!isAuthenticated ? (
                <>
                  <a
                    href="/login"
                    className="px-4 py-2 text-light/80 hover:text-light transition-colors"
                  >
                    Login
                  </a>
                  <a
                    href="/signup"
                    className="px-6 py-2 bg-gradient-to-r from-primary to-emotional rounded-full text-white font-rounded font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    Get Started
                  </a>
                </>
              ) : (
                <a
                  href="/matching"
                  className="px-6 py-2 bg-gradient-to-r from-primary to-emotional rounded-full text-white font-rounded font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Dyce me in!
                </a>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="px-4 py-12 md:px-8 lg:px-12 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
              <span className="text-primary">DYCE</span> it right.
            </h1>
            <p className="text-xl md:text-2xl text-light/80 mb-8 animate-slide-up">
              Where NSUT & IGDTUW meet, match, and vibe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <a
                href="/signup"
                className="px-8 py-4 bg-gradient-to-r from-primary to-emotional rounded-full text-white font-rounded font-medium text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 min-w-[200px]"
              >
                Start Your Vibe
              </a>
              <div className="text-light/60 text-sm">
                Campus crushes, verified.
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="px-4 py-16 md:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-light/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-light/10 transition-all duration-300 animate-fade-in">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-sans font-semibold text-lg mb-2">
                  Verified Campus Circle
                </h3>
                <p className="text-light/70 text-sm">
                  Only .ac.in emails allowed. Real students. Real vibes. No
                  catfish, no creeps.
                </p>
              </div>

              <div className="bg-light/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-light/10 transition-all duration-300 animate-fade-in">
                <div className="w-12 h-12 bg-emotional/20 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-emotional" />
                </div>
                <h3 className="font-sans font-semibold text-lg mb-2">
                  Anonymous Icebreakers
                </h3>
                <p className="text-light/70 text-sm">
                  Break the ice without pressure. DYCE lets you send anonymous
                  compliments or interest signals. They respond if they’re
                  curious. No awkward DMs.
                </p>
              </div>

              <div className="bg-light/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-light/10 transition-all duration-300 animate-fade-in">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-sans font-semibold text-lg mb-2">
                  Intelligent Match Ranking
                </h3>
                <p className="text-light/70 text-sm">
                  Not just swipe. Smart connect. We use interest, personality,
                  and mutual intent—not just appearance—to show you the most
                  compatible profiles.
                </p>
              </div>

              <div className="bg-light/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-light/10 transition-all duration-300 animate-fade-in">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-sans font-semibold text-lg mb-2">
                  Blind Dating
                </h3>
                <p className="text-light/70 text-sm">
                  Fall for their words, not their looks. Chat anonymously based
                  on shared vibes. Photos unlock only when you
                  both connect deeply.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 py-16 md:px-8 lg:px-12 bg-light/5">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="font-pacifico text-3xl md:text-4xl mb-12 text-primary">
              Not just a match. A moment.
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="animate-fade-in">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-emotional rounded-full flex items-center justify-center mx-auto mb-4 text-white font-rounded font-bold text-xl">
                  1
                </div>
                <h3 className="font-sans font-semibold text-xl mb-2">
                  Verify Your Campus
                </h3>
                <p className="text-light/70">
                  Sign up with your college email. NSUT or IGDTUW only.
                </p>
              </div>

              <div className="animate-fade-in">
                <div className="w-16 h-16 bg-gradient-to-r from-emotional to-accent rounded-full flex items-center justify-center mx-auto mb-4 text-white font-rounded font-bold text-xl">
                  2
                </div>
                <h3 className="font-sans font-semibold text-xl mb-2">
                  Build Your Vibe
                </h3>
                <p className="text-light/70">
                  Get curated profiles based on shared vibes, interests, and
                  compatibility.
                </p>
              </div>

              <div className="animate-fade-in">
                <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-rounded font-bold text-xl">
                  3
                </div>
                <h3 className="font-sans font-semibold text-xl mb-2">
                  Swipe Into Something Real
                </h3>
                <p className="text-light/70">
                  No filters, no pressure—just genuine college connections.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Install PWA Section */}
        <section className="px-4 py-16 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-sans font-bold text-3xl md:text-4xl mb-8">
              Install <span className="text-primary">DYCE</span>
            </h2>
            <p className="text-light/80 text-lg mb-12">
              Get the full app experience. Add DYCE to your home screen.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-light/5 rounded-2xl p-8">
                <Smartphone className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-sans font-semibold text-xl mb-4">
                  On Mobile
                </h3>
                <div className="text-left space-y-2 text-light/70">
                  <p>1. Open DYCE in your browser</p>
                  <p>
                    2. Tap the share button <Share className="inline w-4 h-4" />
                  </p>
                  <p>3. Select &quot;Add to Home Screen&quot;</p>
                  <p>4. Tap &quot;Add&quot; to install</p>
                </div>
              </div>

              <div className="bg-light/5 rounded-2xl p-8">
                <Chrome className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-sans font-semibold text-xl mb-4">
                  On Desktop
                </h3>
                <div className="text-left space-y-2 text-light/70">
                  <p>1. Look for the install icon in your address bar</p>
                  <p>2. Click &quot;Install&quot; when prompted</p>
                  <p>3. Or use Chrome menu → &quot;Install DYCE&quot;</p>
                  <p>4. Launch from your desktop</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="px-4 py-16 md:px-8 lg:px-12 bg-light/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-sans font-bold text-3xl md:text-4xl mb-12">
              Meet our team
            </h2>
            <div className="grid md:grid-cols-3 gap-4 ">
              <div className="bg-light/10 rounded-2xl p-6">
                <div className="relative w-20 h-20 bg-gradient-to-r from-primary to-emotional rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                  <Image
                    src="/avyakt.jpeg"
                    alt="Avyakt Jain"
                    className="rounded-full object-cover"
                    fill
                    sizes="80px"
                  />
                </div>
                <h3 className="font-sans font-semibold text-lg mb-1">
                  Avyakt Jain
                </h3>
                <p className="text-primary text-sm mb-2">
                  Co-Founder & Machine Learning Developer
                </p>
                <p className="text-light/70 text-sm">NSUT CSAI &apos;28</p>
              </div>

              <div className="bg-light/10 rounded-2xl p-6">
                <div className="relative w-20 h-20 bg-gradient-to-r from-accent to-primary rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                  <Image
                    src="/roshan.jpeg"
                    alt="Roshan Sharma"
                    className="rounded-full object-cover"
                    fill
                    sizes="80px"
                  />
                </div>
                <h3 className="font-sans font-semibold text-lg mb-1">
                  Roshan Sharma
                </h3>
                <p className="text-primary text-sm mb-2">
                  Co-Founder & Full Stack Developer
                </p>
                <p className="text-light/70 text-sm">NSUT CSAI &apos;28</p>
              </div>

              <div className="bg-light/10 rounded-2xl p-6">
                <div className="relative w-20 h-20 bg-gradient-to-r from-primary to-emotional rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                  <Image
                    src="/anshika.png"
                    alt="Anshika Prasad"
                    className="rounded-full object-cover"
                    fill
                    sizes="80px"
                  />
                </div>
                <h3 className="font-sans font-semibold text-lg mb-1">
                  Anshika Prasad
                </h3>
                <p className="text-primary text-sm mb-2">
                  Co-Founder & Frontend Developer
                </p>
                <p className="text-light/70 text-sm">IGDTUW ECE-AI &apos;27</p>
              </div>

              <div className="bg-light/10 rounded-2xl p-6 md:col-start-2">
                <div className="relative w-20 h-20 bg-gradient-to-r from-primary to-emotional rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                  <Image
                    src="/anushka.jpeg"
                    alt="Anushka Sharma"
                    className="rounded-full object-cover"
                    fill
                    sizes="80px"
                  />
                </div>
                <h3 className="font-sans font-semibold text-lg mb-1">
                  Anushka Sharma
                </h3>
                <p className="text-primary text-sm mb-2">
                  Co-Founder & Backend Developer
                </p>
                <p className="text-light/70 text-sm">IGDTUW ECE-AI &apos;27</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 py-12 md:px-8 lg:px-12 border-t border-light/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-8">
              <Image
                src="/dyce-logo.png"
                alt="logo"
                className="object-cover"
                width={100}
                height={80}
              />

              <div className="flex flex-wrap gap-6 text-light/70">
                <a href="#" className="hover:text-light transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-light transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-light transition-colors">
                  Support
                </a>
                <a href="#" className="hover:text-light transition-colors">
                  Contact
                </a>
                <a href="#" className="hover:text-light transition-colors">
                  Instagram
                </a>
              </div>
            </div>
            <div className="text-center mt-8 text-light/50 text-sm">
              © 2025 DYCE. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
