"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Sparkles,
  MessageCircle,
  Bubbles,
  Loader,
} from "lucide-react";
import ProgressBar from "@/components/Progressbar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { axiosClient } from "@/lib/axios-client";

const PromptsPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    funPrompt1: "",
    funPrompt2: "",
    funPrompt3: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async () => {
    if (!formData.funPrompt1 && !formData.funPrompt2 && !formData.funPrompt3) {
      router.replace("/matching");
      return;
    }
    setIsLoading(true);

    try {
      const resp = await axiosClient.put("/profile", {
        funPrompt1: formData.funPrompt1,
        funPrompt2: formData.funPrompt2,
        funPrompt3: formData.funPrompt3,
      });

      if (resp.status !== 200) {
        toast.error("Failed to update profile. Please try again.");
        return;
      }

      router.push("/matching");
    } catch (error) {
      toast.error("Failed to save prompts. Please try again.");
      console.error("Error saving prompts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-light px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <a
            href="/profile/photos"
            className="p-2 hover:bg-light/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-light/70" />
          </a>
          <button
            onClick={() => router.replace("/matching")}
            className="text-light/60 text-sm hover:text-light/80 transition-colors"
          >
            Finish later
          </button>
        </div>

        <ProgressBar currentStep={5} totalSteps={5} />

        {/* Main Content */}
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-primary mb-2">
              Final touches! ✨
            </h1>
            <p className="text-light/70 text-sm">
              Help others get to know the real you.
            </p>
          </div>

          <div className="space-y-8">
            {/* Bio Prompt */}
            <div className="bg-light/5 rounded-2xl p-6 border border-light/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-9 bg-emotional/20 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-emotional" />
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-light">
                    Ideal first date would be...
                  </h3>
                  <p className="text-light/60 text-sm">
                    Describe the kind of vibe you&apos;d love to start things off
                    with.
                  </p>
                </div>
              </div>
              <textarea
                value={formData.funPrompt1}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    funPrompt1: e.target.value,
                  }))
                }
                placeholder="Ideal first date would be something chill like grabbing coffee and walking around campus or finding a quiet spot to talk and get to know each other better"
                rows={6}
                className="w-full p-4 bg-light/10 border border-light/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-light resize-none text-sm"
                maxLength={300}
              />
              <div className="text-right mt-2">
                <span className="text-light/50 text-xs">
                  {formData.funPrompt1.length}/300
                </span>
              </div>
            </div>

            {/* Chai or Coffee */}
            <div className="bg-light/5 rounded-2xl p-6 border border-light/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-9 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-light">
                    Chai or Coffee...
                  </h3>
                  <p className="text-light/60 text-sm">
                    Pick your fuel for deep talks and late-night study sessions.
                  </p>
                </div>
              </div>
              <textarea
                value={formData.funPrompt2}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    funPrompt2: e.target.value,
                  }))
                }
                placeholder="Chai or Coffee… depends on the mood — coffee for focus, chai for vibes"
                rows={6}
                className="w-full p-4 bg-light/10 border border-light/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-light resize-none text-sm"
                maxLength={300}
              />
              <div className="text-right mt-2">
                <span className="text-light/50 text-xs">
                  {formData.funPrompt2.length}/300
                </span>
              </div>
            </div>

            <div className="bg-light/5 rounded-2xl p-6 border border-light/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-9 bg-primary/20 rounded-full flex items-center justify-center">
                  <Bubbles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-light">
                    I can&apos;t stop talking about...
                  </h3>
                  <p className="text-light/60 text-sm">
                    That one topic you bring up in almost every conversation
                  </p>
                </div>
              </div>
              <textarea
                value={formData.funPrompt3}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    funPrompt3: e.target.value,
                  }))
                }
                placeholder="I can't stop talking about random conspiracy theories, oddly specific memes, and my favorite comfort shows"
                rows={5}
                className="w-full p-4 bg-light/10 border border-light/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-light resize-none text-sm"
                maxLength={200}
              />
              <div className="text-right mt-2">
                <span className="text-light/50 text-xs">
                  {formData.funPrompt3.length}/200
                </span>
              </div>
            </div>
          </div>

          {/* Finish Button */}
          <button
            onClick={handleFinish}
            className="w-full mt-8 py-4 rounded-2xl font-rounded font-medium text-lg transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-primary via-emotional to-accent text-white hover:shadow-xl hover:scale-105"
            disabled={isLoading}
          >
            <Sparkles className="w-5 h-5" />
            Start Matching!
            <Sparkles className="w-5 h-5" />
            {isLoading && (
              <Loader className="w-5 h-5 animate-spin inline-block ml-2" />
            )}
          </button>

          {/* Completion Message */}
          <div className="mt-6 text-center">
            <div className="bg-gradient-to-r from-primary/20 to-emotional/20 rounded-2xl p-4 border border-primary/30">
              <p className="text-light/80 text-sm mb-2">
                🎉 You&apos;re all set to start vibing!
              </p>
              <p className="text-light/60 text-xs">
                Your profile will be reviewed and activated within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptsPage;
