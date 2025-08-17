"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  X,
  Filter,
  Shield,
  Sparkles,
  Bubbles,
  MessageCircle,
  GraduationCap,
  School,
} from "lucide-react";
import { axiosClient } from "@/lib/axios-client";
import { toast } from "sonner";
import MatchModal from "@/components/Matching/MatchModal";
import FilterModal from "@/components/Matching/FilterModal";
import BlockModal from "@/components/Matching/BlockModal";
import { useSwipeHandler } from "@/hooks/useSwipeHandler";
import { cn, getConnectionIntent } from "@/lib/utils";
import BottomNavigation from "@/components/BottomNavigation";
import { Profile } from "@/types/profile";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import NotificationWidget from "@/components/NotificationWidget";
import { useAuthStore } from "@/stores/auth-store";

export interface FiltersType {
  college: string;
  ageRange: [number, number];
  personality: string[];
}

const MatchingPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [whisperText, setWhisperText] = useState("");
  const [revealOnMatch, setRevealOnMatch] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [filters, setFilters] = useState<FiltersType>({
    college: "",
    ageRange: [18, 25],
    personality: [] as string[],
  });
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuthStore((state) => state);

  const currentProfile = profiles[currentIndex];

  const handleSwipe = async (direction: "left" | "right") => {
    if (direction === "right") {
      try {
        const likeResponse = await axiosClient.post(
          `/matches/like/${currentProfile.id}`,
          null
        );

        if (likeResponse.data.success) {
          if (whisperText.trim()) {
            await axiosClient.post(`/matches/comment/${currentProfile.id}`, {
              content: whisperText,
              anonymous: revealOnMatch ? likeResponse.data.isMatch : false,
            });
          }
          setShowMatch(likeResponse.data.isMatch);
          setTimeout(() => setShowMatch(false), 3000);
        }
      } catch (error: any) {
        console.log("Error liking profile:", error);
        toast.error(error.response?.data?.message || "Failed to like profile.");
      }
    } else {
      await axiosClient.post(`/matches/pass/${currentProfile.id}`, null);
    }

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % profiles.length);
      setWhisperText("");
      setRevealOnMatch(false);
    }, 300);
  };

  const {
    ref: cardRef,
    dragOffset,
    isDragging,
  } = useSwipeHandler({
    onSwipe: handleSwipe,
    threshold: 100,
  });

  const blockProfile = async () => {
    try {
      await axiosClient.post(`/matches/block/${currentProfile.id}`);
      toast.success("Profile blocked successfully.");
      handleSwipe("left");
      setCurrentIndex((prev) => (prev + 1) % profiles.length);
    } catch (error: any) {
      console.error("Error blocking profile:", error);
      toast.error(error.response?.data?.message || "Failed to block profile.");
    }
  };

  useEffect(() => {
    const showProfiles = async () => {
      try {
        const resp = await axiosClient.get("/matches/profiles", {
          params: {
            college: filters.college,
            minAge: filters.ageRange[0],
            maxAge: filters.ageRange[1],
            personalityTypes: filters.personality,
            page: pageNumber,
            gender: user.gender === "male" ? "female" : "male",
          },
        });

        if (resp.data.success) {
          setHasMore(resp.data.pagination.hasMore);
          const fetchedProfiles = resp.data.profiles;
          if (fetchedProfiles.length > 0) {
            setProfiles((prev) => [...prev, ...fetchedProfiles]);
          }
        }
      } catch (error) {
        toast.error("Failed to load profiles. Please try again later.");
        console.error("Error fetching profiles:", error);
      }
    };

    showProfiles();
  }, [pageNumber, filters, user.gender]);

  useEffect(() => {
    if (profiles.length - currentIndex <= 3 && hasMore) {
      setPageNumber((prev) => prev + 1);
    }
  }, [currentIndex, profiles.length, hasMore]);

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-dark text-light flex flex-col items-center justify-center pb-20">
        <div className="w-full flex items-center justify-between p-4 border-b border-light/10">
          <Image
            src="/dyce-logo.png"
            alt="logo"
            className="object-cover"
            width={100}
            height={80}
          />

          <div className="flex gap-4">
            <NotificationWidget />
          </div>
        </div>
        <div className="text-center flex-1 flex flex-col items-center justify-center">
          <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-serif mb-2">No more profiles!</h2>
          <p className="text-light/70">Check back later for new vibes ✨</p>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-light relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-light/10">
        {/* <div className="font-serif text-2xl text-primary">DYCE</div> */}
        <Image
          src="/dyce-logo.png"
          alt="logo"
          className="object-cover"
          width={100}
          height={80}
        />
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(true)}
            className="py-2 px-3 block bg-primary rounded-lg hover:bg-light/20 transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
          <NotificationWidget />
        </div>
      </div>

      {/* Main Content - with padding bottom for navigation */}
      <div className="flex-1 flex items-center justify-center p-4 pb-24">
        <div className="relative w-full max-w-sm">
          <div
            ref={cardRef}
            className={cn(
              `bg-light/5 backdrop-blur-sm rounded-3xl border border-light/10 overflow-hidden cursor-grab active:cursor-grabbing transition-transform duration-300`,
              isDragging && "scale-105"
            )}
            style={{
              transform: `translateX(${dragOffset}px) rotate(${
                dragOffset * 0.1
              }deg)`,
            }}
          >
            {/* Profile Image */}
            <div className="relative h-[80vh] bg-gradient-to-br from-primary/20 to-emotional/20">
              {/* <img
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}${currentProfile.profileImages[0].url}`}
                alt={currentProfile.name}
                className="w-full h-full object-cover"
              /> */}

              <Swiper
                modules={[Pagination]}
                onTouchStart={(s, e) => e.stopPropagation()}
                onTouchEnd={(s, e) => e.stopPropagation()}
                onTouchMove={(s, e) => e.stopPropagation()}
                slidesPerView={1}
                loop
                pagination={{ clickable: true }}
              >
                {currentProfile.profileImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative h-[80vh]">
                      <Image
                        src={`${image.url}`}
                        alt={currentProfile.name}
                        fill
                        className="w-full h-full object-cover"
                        priority
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setShowBlockModal(true)}
                  className="p-2 bg-dark/50 backdrop-blur-sm rounded-full text-light/70 hover:text-light transition-colors"
                >
                  <Shield className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="rounded-2xl p-4">
                  <div className="bg-emotional/20 px-2 py-1 rounded-full text-emotional text-[13px] font-bold w-max font-rounded mb-2">
                    {currentProfile.currentMood}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-sans font-bold text-xl text-light">
                      {currentProfile.name}, {currentProfile.age}
                    </h3>
                  </div>
                  <h2 className="text-light/80 text-md font-medium mb-2 flex items-center gap-3">
                    <School size={20} fontWeight={800} />
                    {currentProfile.college}
                  </h2>
                  <h2 className="text-light/80 text-md font-medium mb-2 flex items-center gap-3">
                    <GraduationCap size={27} fontWeight={800} />
                    {currentProfile.branch}
                  </h2>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-light/80 text-sm font-medium mb-2">
                  About me
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-accent/15 text-accent px-4 py-1.5 rounded-full text-[13px] font-rounded">
                    {currentProfile.height} cm
                  </span>
                  <span className="bg-accent/15 text-accent px-4 py-1.5 rounded-full text-[13px] font-rounded">
                    {
                      getConnectionIntent(currentProfile.connectionIntent!)
                        ?.label
                    }
                  </span>
                  <span className="bg-accent/15 text-accent px-4 py-1.5 rounded-full text-[13px] font-rounded">
                    {currentProfile.personalityType}
                  </span>
                  {currentProfile.hangoutSpot && (
                    <span className="bg-accent/15 text-accent px-4 py-1.5 rounded-full text-[13px] font-rounded">
                      {currentProfile.hangoutSpot}
                    </span>
                  )}
                  {currentProfile.campusVibeTags.length > 0 &&
                    currentProfile.campusVibeTags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-accent/15 text-accent px-4 py-1.5 rounded-full text-[13px] font-rounded"
                      >
                        {tag.split("-").join(" ")}
                      </span>
                    ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-light/80 text-sm font-medium mb-2">
                  I&apos;m looking for
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-emotional/15 text-emotional px-4 py-1.5 rounded-full text-[13px] font-rounded">
                    {currentProfile.connectionIntent?.split("-").join(" ")}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-light/80 text-sm font-medium mb-2">
                  My interests
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.interests.length > 0 &&
                    currentProfile.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-primary/15 text-primary px-4 py-1.5 rounded-full text-[13px] font-rounded"
                      >
                        {interest.split("-").join(" ")}
                      </span>
                    ))}
                  {currentProfile.favoriteArtist &&
                    currentProfile.favoriteArtist.map((favArtist, index) => (
                      <span
                        key={index}
                        className="bg-primary/15 text-primary px-4 py-1.5 rounded-full text-[13px] font-rounded"
                      >
                        {favArtist.split("-").join(" ")}
                      </span>
                    ))}
                </div>
              </div>

              {/* Whisper Input */}
              {currentProfile.allowComments && (
                <div className="mb-6">
                  <h4 className="text-light/80 text-sm font-medium mb-2">
                    Drop a whisper 💭
                  </h4>
                  <input
                    type="text"
                    value={whisperText}
                    onChange={(e) => setWhisperText(e.target.value)}
                    placeholder="Hey, you crushed it at the debate..."
                    className="w-full p-3 bg-light/10 border border-light/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-light text-sm"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="reveal"
                      checked={revealOnMatch}
                      onChange={(e) => setRevealOnMatch(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="reveal" className="text-light/60 text-xs">
                      Reveal me if we match
                    </label>
                  </div>
                </div>
              )}

              {/* Fun Prompts */}
              <div className="space-y-4">
                {currentProfile.funPrompt1 && (
                  <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10">
                    <div className="flex items-center gap-2 mb-4">
                      <Heart className="w-5 h-5 text-emotional" />
                      <h3 className="font-sans font-semibold text-lg text-light">
                        Ideal first date would be...
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-light/5 rounded-2xl p-4 border border-light/10">
                        <p className="text-light/80 text-sm mb-2 italic">
                          &quot;{currentProfile.funPrompt1}&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {currentProfile.funPrompt2 && (
                  <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageCircle className="w-5 h-5 text-emerald-500" />
                      <h3 className="font-sans font-semibold text-lg text-light">
                        Chai or Coffee...
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-light/5 rounded-2xl p-4 border border-light/10">
                        <p className="text-light/80 text-sm mb-2 italic">
                          &quot;{currentProfile.funPrompt2}&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {currentProfile.funPrompt3 && (
                  <div className="bg-dark/5 backdrop-blur-sm rounded-3xl p-6 border border-dark/10 shadow-md shadow-dark/70">
                    <div className="flex items-center gap-2 mb-4">
                      <Bubbles className="w-5 h-5 text-primary" />
                      <h3 className="font-sans font-semibold text-lg text-light">
                        I can&apos;t stop talking about...
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-light/5 rounded-2xl p-4 border border-light/10">
                        <p className="text-light/80 text-sm mb-2 italic">
                          &quot;{currentProfile.funPrompt3}&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 mt-6">
            <button
              onClick={() => handleSwipe("left")}
              className="w-16 h-16 bg-light/10 hover:bg-light/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <X className="w-8 h-8 text-light/70" />
            </button>
            <button
              onClick={() => handleSwipe("right")}
              className="w-16 h-16 bg-gradient-to-r from-primary to-emotional rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <Heart className="w-8 h-8 text-white" />
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-light/60 text-sm">
              <span className="text-light/40">←</span> Not your vibe{" "}
              <span className="text-primary">•</span> Let&apos;s DYCE it!{" "}
              <span className="text-light/40">→</span>
            </p>
          </div>
        </div>
      </div>

      <BottomNavigation />

      {/* Match Modal */}
      {showMatch && <MatchModal onClose={() => setShowMatch(false)} />}

      {/* Filters Modal */}
      {showFilters && (
        <FilterModal
          filters={filters}
          setFilters={setFilters}
          setShowFilters={setShowFilters}
        />
      )}

      {/* Block Modal */}
      {showBlockModal && (
        <BlockModal
          handleClose={() => setShowBlockModal(false)}
          handleBlock={() => {
            blockProfile();
          }}
          title="Block this profile?"
          desc="Are you sure you want to block this profile? They won't show up again and can't interact with you."
          btnLabel="Block"
        />
      )}
    </div>
  );
};

export default MatchingPage;
