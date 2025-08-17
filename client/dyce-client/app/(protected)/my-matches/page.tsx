"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  HeartCrack,
} from "lucide-react";
import { axiosClient } from "@/lib/axios-client";
import { toast } from "sonner";
import BlockModal from "@/components/Matching/BlockModal";
import BottomNavigation from "@/components/BottomNavigation";
import { Profile } from "@/types/profile";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import MyMatchesModal from "@/components/MyMatchesModal";

export interface MatchesItemType {
  compatibility: number;
  createdAt: string;
  id: string;
  user: Profile;
}

const MyMatches = () => {
  const [profiles, setProfiles] = useState<MatchesItemType[]>([]);
  const [showUnmatchModal, setShowUnmatchModal] = useState(false);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number>(0);

  const handleUnmatch = async () => {
    try {
      if (!matchId) {
        toast.error("No match selected to unmatch.");
        return;
      }
      await axiosClient.post(`/matches/unmatch/${matchId}`);
      setProfiles((prev) => prev.filter((profile) => profile.id !== matchId));
      setShowUnmatchModal(false);
      toast.success("Unmatched successfully.");
    } catch (error) {
      setShowUnmatchModal(false);
      toast.error("Failed to unmatch. Please try again later.");
      console.error("Error unmatching profile:", error);
    }
  };

  useEffect(() => {
    const showProfiles = async () => {
      try {
        const resp = await axiosClient.get("/matches", {
          params: {
            inDetail: true,
          },
        });
        setProfiles((prev) => [...prev, ...resp.data.matches]);
      } catch (error) {
        toast.error("Failed to load profiles. Please try again later.");
        console.error("Error fetching profiles:", error);
      }
    };

    showProfiles();
  }, []);

  if (profiles.length === 0) {
    return (
      <div className="min-h-screen bg-dark text-light flex items-center justify-center pb-20">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-serif mb-2">No matches yet!</h2>
          <p className="text-light/70">
            Check out the profiles for new vibes ✨
          </p>
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
      </div>

      {/* Main Content - with padding bottom for navigation */}

      <MyMatchesModal
        setShowUnmatchModal={setShowUnmatchModal}
        setMatchId={setMatchId}
        profile={profiles[selectedProfileIndex]}
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
      />

      <div className="relative grid grid-cols-2 pb-25 p-3 gap-2">
        {profiles.map((profile, index) => (
          <div
            className="relative rounded-lg shadow-md bg-light/10 "
            key={index}
            onClick={() => {
              setSelectedProfileIndex(index);
              setShowProfileModal(true);
            }}
          >
            <div className="w-full h-[300px] relative">
              <Image
                src={`${profile.user.profileImages[0].url}`}
                alt={`Profile image ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4 gap-2 flex items-center z-10">
                {/* <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/messages");
                  }}
                  className="p-2 bg-dark/50 backdrop-blur-sm rounded-full text-light/70 hover:text-light transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </button> */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMatchId(profile.id);
                    setShowUnmatchModal(true);
                  }}
                  className="p-2 bg-red-400 backdrop-blur-sm rounded-full text-light/70 hover:text-light transition-colors"
                >
                  <HeartCrack className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 flex items-center justify-between w-full  p-3">
                <div>
                  <div className="flex items-center gap-1">
                    <h2 className="text-md font-semibold">
                      {profile.user.name},
                    </h2>
                    <h2 className="text-md font-semibold">
                      {profile.user.age}
                    </h2>
                  </div>
                  <h2 className="text-md font-medium">
                    {profile.user.college}
                  </h2>
                </div>
                {/* <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/messages");
                  }}
                  className=" rounded-full text-primary hover:text-light transition-colors"
                >
                  <MessageCircle className="w-7 h-7" />
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNavigation />

      {/* Unmatch Modal */}
      {showUnmatchModal && (
        <BlockModal
          handleClose={() => setShowUnmatchModal(false)}
          handleBlock={handleUnmatch}
          title="Unmatch this profile?"
          desc="Are you sure you want to unmatch this profile? They won't show up again and can't interact with you."
          btnLabel="Unmatch"
          className="z-50"
        />
      )}
    </div>
  );
};

export default MyMatches;
