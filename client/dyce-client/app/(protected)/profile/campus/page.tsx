"use client";
import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Loader } from "lucide-react";
import ProgressBar from "@/components/Progressbar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { axiosClient } from "@/lib/axios-client";
import { CAMPUS_VIBE_OPTIONS, HANGOUT_SPOTS, PERSONALITY_TYPES } from "@/constants/campus_options";

const CampusIdentityPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    campusVibes: [] as string[],
    hangoutSpot: "",
    personalityType: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCampusVibeToggle = (vibeId: string) => {
    setFormData((prev) => ({
      ...prev,
      campusVibes: prev.campusVibes.includes(vibeId)
        ? prev.campusVibes.filter((id) => id !== vibeId)
        : [...prev.campusVibes, vibeId],
    }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (
      formData.campusVibes.length === 0 ||
      !formData.hangoutSpot ||
      !formData.personalityType
    ) {
      alert("Please select all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const resp = await axiosClient.put("/profile", {
        campusVibeTags: formData.campusVibes,
        hangoutSpot: formData.hangoutSpot,
        personalityType: formData.personalityType,
      });
      console.log(resp.data);

      if (resp.status !== 200) {
        toast.error("Failed to update profile. Please try again.");
        return;
      }

      router.push("/profile/interests");
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
      console.error("Error submitting form:", error);
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
            href="/profile/basic"
            className="p-2 hover:bg-light/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-light/70" />
          </a>
          {/* <a
            href="/profile/interests"
            className="text-light/60 text-sm hover:text-light/80 transition-colors"
          >
            Skip for now
          </a> */}
        </div>

        <ProgressBar currentStep={2} totalSteps={5} />

        {/* Main Content */}
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-primary mb-2">
              Your campus vibe? 🎓
            </h1>
            <p className="text-light/70 text-sm">
              These help us understand your scene.
            </p>
          </div>

          <div className="space-y-8">
            {/* Campus Vibe Tags */}
            <div>
              <label className="block text-light/80 font-medium mb-4">
                Campus Vibe Tags 🏫
              </label>
              <div className="grid grid-cols-2 gap-3">
                {CAMPUS_VIBE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleCampusVibeToggle(option.id)}
                    className={`p-3 rounded-2xl border-2 transition-all duration-300 text-sm ${
                      formData.campusVibes.includes(option.id)
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-light/20 bg-light/5 text-light/70 hover:border-light/40"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">{option.emoji}</span>
                      <span className="font-rounded font-medium text-xs leading-tight">
                        {option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Hangout Spots */}
            <div>
              <label className="block text-light/80 font-medium mb-4">
                Where do you hang out most? 📍
              </label>
              <div className="grid grid-cols-3 gap-3">
                {HANGOUT_SPOTS.map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, hangoutSpot: spot.id }))
                    }
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                      formData.hangoutSpot === spot.id
                        ? "border-accent bg-accent/20 text-accent"
                        : "border-light/20 bg-light/5 text-light/70 hover:border-light/40"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-2xl">{spot.emoji}</span>
                      <span className="font-rounded font-medium text-xs text-center">
                        {spot.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Personality Type */}
            <div>
              <label className="block text-light/80 font-medium mb-4">
                Personality Type 🧠
              </label>
              <div className="grid grid-cols-3 gap-3">
                {PERSONALITY_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        personalityType: type.id,
                      }))
                    }
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                      formData.personalityType === type.id
                        ? "border-emotional bg-emotional/20 text-emotional"
                        : "border-light/20 bg-light/5 text-light/70 hover:border-light/40"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-2xl">{type.emoji}</span>
                      <span className="font-rounded font-medium text-xs">
                        {type.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleSubmit}
            className="w-full mt-8 py-4 rounded-2xl font-rounded font-medium text-lg transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-emotional text-white hover:shadow-xl hover:scale-105"
            disabled={isLoading || !formData.hangoutSpot || !formData.personalityType || formData.campusVibes.length === 0}
          >
            Keep Vibing
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin inline-block ml-2" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampusIdentityPage;
