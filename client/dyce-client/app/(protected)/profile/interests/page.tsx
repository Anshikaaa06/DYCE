"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  X,
  Search,
  ChevronDown,
  Loader,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/Progressbar";
import { ARTISTS_OPTIONS, INTERESTS_OPTIONS } from "@/constants/interests";
import MultiSelect from "@/components/MultiSelect";
import { toast } from "sonner";
import { axiosClient } from "@/lib/axios-client";
import { CONNECTION_INTENTS } from "@/constants/campus_options";

type CONNECTION_INTENT_TYPE = 'study_buddy' | 'fest_and_fun' | 'genuine_connection' | 'just_vibing' | 'its_complicated'

const InterestsPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    interests: [] as string[],
    favoriteArtists: [] as string[],
    connectionIntent: "" as CONNECTION_INTENT_TYPE,
  });
  const [interestLimit, setInterestLimit] = useState(16);
  const [filteredInterests, setFilteredInterests] = useState(
    INTERESTS_OPTIONS.slice(0, interestLimit)
  );
  const [interestQuery, setInterestQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const filterInterests = () => {
    if (!interestQuery.trim()) {
      setFilteredInterests(INTERESTS_OPTIONS.slice(0, interestLimit));
      return;
    }

    const lowerQuery = interestQuery.toLowerCase();
    const filtered = INTERESTS_OPTIONS.filter(
      (interest) =>
        interest.name.toLowerCase().includes(lowerQuery) ||
        interest.value.toLowerCase().includes(lowerQuery)
    );
    setFilteredInterests(filtered);
  };

  const removeArtist = (artist: string) => {
    setFormData((prev) => ({
      ...prev,
      favoriteArtists: prev.favoriteArtists.filter((a) => a !== artist),
    }));
  };

  const handleShowMoreInterests = () => {
    setInterestLimit((prev) =>
      prev + 16 > INTERESTS_OPTIONS.length
        ? INTERESTS_OPTIONS.length
        : prev + 16
    );
    filterInterests();
  };

  const handleArtistSelection = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      favoriteArtists: prev.favoriteArtists.includes(value)
        ? prev.favoriteArtists
        : [...prev.favoriteArtists, value],
    }));
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (
      formData.interests.length === 0 &&
      formData.favoriteArtists.length === 0 && 
      !formData.connectionIntent
    ) {
      router.push("/profile/photos");
      return;
    }

    setIsLoading(true);
    try {
      const resp = await axiosClient.put("/profile", {
        interests: formData.interests,
        favoriteArtist: formData.favoriteArtists,
        connectionIntent: formData.connectionIntent,
      });

      if (resp.status !== 200) {
        toast.error("Failed to update profile. Please try again.");
        return;
      }

      router.push("/profile/photos");
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      filterInterests();
    }, 300);
    
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interestQuery]);

  return (
    <div className="min-h-screen bg-dark text-light px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <a
            href="/profile/campus"
            className="p-2 hover:bg-light/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-light/70" />
          </a>
          <a
            href="/profile/photos"
            className="text-light/60 text-sm hover:text-light/80 transition-colors"
          >
            Skip for now
          </a>
        </div>

        <ProgressBar currentStep={3} totalSteps={5} />

        {/* Main Content */}
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-primary mb-2">
              Show your colors! 🎨
            </h1>
            <p className="text-light/70 text-sm">
              Let your personality shine through.
            </p>
          </div>

          <div className="space-y-8">
            {/* Interests */}
            <div>
              <label className="block text-light/80 font-medium mb-4">
                What are you into? 💫
              </label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {filteredInterests.map((interest) => (
                  <button
                    key={interest.value}
                    onClick={() => handleInterestToggle(interest.value)}
                    className={`p-3 rounded-2xl border-2 transition-all duration-300 text-sm ${
                      formData.interests.includes(interest.value)
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-light/20 bg-light/5 text-light/70 hover:border-light/40"
                    }`}
                  >
                    <span className="font-rounded font-medium">
                      {interest.icon} {interest.name}
                    </span>
                  </button>
                ))}
              </div>
              {!interestQuery && interestLimit < INTERESTS_OPTIONS.length && (
                <div className="flex items-center justify-end mb-4">
                  <button
                    onClick={handleShowMoreInterests}
                    className="text-primary font-medium transition-colors flex items-center"
                  >
                    More <ChevronDown />
                  </button>
                </div>
              )}

              {/* Custom Interest Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={interestQuery}
                  onChange={(e) => setInterestQuery(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 p-3 bg-light/10 border border-light/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-light text-sm"
                />
                <button
                  className="p-3 bg-primary/20 border border-primary/40 rounded-2xl text-primary hover:bg-primary/30 transition-colors"
                  onClick={filterInterests}
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-light/80 font-medium mb-4">
                Tell us what you are looking for?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {CONNECTION_INTENTS.map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        connectionIntent: spot.id as CONNECTION_INTENT_TYPE,
                      }))
                    }
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                      formData.connectionIntent === spot.id
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

            {/* Favorite Artists */}
            <div>
              <label className="block text-light/80 font-medium mb-4">
                Favorite Artists 🎭
              </label>
              <div className="flex gap-2 mb-3">
                <MultiSelect
                  options={ARTISTS_OPTIONS}
                  onChange={handleArtistSelection}
                />
              </div>

              {/* Artist Tags */}
              <div className="flex flex-wrap gap-2">
                {formData.favoriteArtists.map((artist, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-accent/20 text-accent rounded-full text-sm font-rounded"
                  >
                    {artist}
                    <button
                      onClick={() => removeArtist(artist)}
                      className="hover:text-accent/70 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleSubmit}
            className="w-full mt-8 py-4 rounded-2xl font-rounded font-medium text-lg transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-emotional text-white hover:shadow-xl hover:scale-105"
            disabled={isLoading}
          >
            Continue
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

export default InterestsPage;
