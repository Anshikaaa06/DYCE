"use client";

import React, { useEffect, useState } from "react";
import {
  Camera,
  Edit3,
  Heart,
  MessageCircle,
  Target,
  TrendingUp,
  Settings,
  Eye,
  Flag,
  Loader,
  Bubbles,
  Pencil,
} from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { useRouter } from "next/navigation";
import { axiosClient } from "@/lib/axios-client";
import { toast } from "sonner";
import { Profile } from "@/types/profile";
import { MOODS } from "@/constants/campus_options";
import EditModal from "@/components/Profile/EditModal";
import FunPromptEditModal from "@/components/Profile/FunPromptEditModal";
import { getConnectionIntent } from "@/lib/utils";
import Image from "next/image";
import PhotoEditModal from "@/components/Profile/PhotoEditModal";

interface Stat {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

interface AnonymousComment {
  id: string;
  content: string;
  timestamp: string;
}

interface MoodType {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

interface StatsResponse {
  likesReceived: string;
  matchesCount: string;
  commentsReceived: string;
  messagesReceived: string;
}

const PersonalProfilePage = () => {
  const [currentMood, setCurrentMood] = useState<MoodType>({
    id: "love",
    emoji: "💞",
    label: "Looking for love",
    color: "text-emotional",
  });
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileStats, setProfileStats] = useState<Stat[]>([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [anonymousComments, setAnonymousComments] = useState<
    AnonymousComment[]
  >([]);
  const router = useRouter();
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [showFunPromptModal, setShowFunPromptModal] = useState({
    active: false,
    prompt: "" as string | undefined,
    promptName: "" as string,
  });
  const [showPhotoEditModal, setShowPhotoEditModal] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  const createStatArray = (stats: StatsResponse): Stat[] => {
    return [
      {
        icon: <Heart className="w-5 h-5" />,
        label: "Likes received",
        value: stats.likesReceived,
        color: "text-emotional",
      },
      {
        icon: <MessageCircle className="w-5 h-5" />,
        label: "Messages this week",
        value: stats.matchesCount,
        color: "text-primary",
      },
      {
        icon: <Target className="w-5 h-5" />,
        label: "Matches Count",
        value: stats.matchesCount,
        color: "text-accent",
      },
      {
        icon: <TrendingUp className="w-5 h-5" />,
        label: "Comment Received",
        value: stats.commentsReceived,
        color: "text-blue-400",
      },
    ];
  };

  const getPronouns = (gender: string) =>
    gender === "male"
      ? "He/Him"
      : gender === "female"
      ? "She/Her"
      : "They/Them";

  const getProfile = async () => {
    try {
      const profileResp = await axiosClient.get("/profile");
      setProfile(profileResp.data.profile);

      getCurrentMood(profileResp.data.profile.currentMood);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data. Please try again later.");
    }
  };
  const getProfileStats = async () => {
    try {
      const statResp = await axiosClient.get("/profile/stats");
      setProfileStats(createStatArray(statResp.data.stats as StatsResponse));
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile stats. Please try again later.");
    }
  };
  const getProfileComments = async () => {
    try {
      const commentsResp = await axiosClient.get("/profile/comments", {
        params: {
          limit: 5,
        },
      });
      setAnonymousComments(
        commentsResp.data.comments.map((comment: any) => ({
          id: comment.commenterId,
          content: comment.content,
          timestamp: new Date(comment.createdAt).toLocaleString(),
        }))
      );
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile comments. Please try again later.");
    }
  };

  const handleCurrentMoodChange = async (mood: MoodType) => {
    setCurrentMood(mood);
    try {
      const resp = await axiosClient.put("/profile", {
        currentMood: mood.id,
      });
      if (resp.status !== 200) {
        toast.error("Failed to update mood. Please try again.");
        return;
      }
    } catch (error) {
      toast.error("An error occurred while updating your mood.");
      console.error("Error updating mood:", error);
    } finally {
      setShowMoodModal(false);
    }
  };

  const getCurrentMood = (currentMood: string) => {
    try {
      setCurrentMood(MOODS.filter((mood) => mood.id === currentMood)[0]);
    } catch (error) {
      console.error("Error fetching current mood:", error);
    }
  };

  const getProfileCompletion = async () => {
    try {
      const resp = await axiosClient.get("/profile/completion");
      setProfileCompletion(resp.data.percentage);
    } catch (error) {
      console.error("Error fetching profile completion:", error);
      toast.error("Failed to load profile completion. Please try again later.");
    }
  };

  useEffect(() => {
    getProfile();
    getProfileCompletion();
    getProfileStats();
    getProfileComments();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUpdated]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark">
        <Loader className="animate-spin text-primary" size={25} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-light">
      <EditModal
        setProfileUpdated={setProfileUpdated}
        profile={profile}
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModal}
      />
      <FunPromptEditModal
        showModal={showFunPromptModal}
        setShowModal={setShowFunPromptModal}
        setProfileUpdated={setProfileUpdated}
      />
      <PhotoEditModal
        profile={profile}
        showModal={showPhotoEditModal}
        setShowModal={setShowPhotoEditModal}
        setProfileUpdated={setProfileUpdated}
      />
      {/* Header */}
      <div className="p-4 border-b border-light/10">
        <div className="flex items-center justify-between">
          {/* <h1 className="font-serif text-2xl text-primary">Your Vibe</h1> */}
          <Image
            src="/dyce-logo.png"
            alt="logo"
            className="object-cover"
            width={100}
            height={80}
          />

          <button
            onClick={() => router.push("/settings")}
            className="p-2 hover:bg-light/10 rounded-full transition-colors"
          >
            <Settings className="w-5 h-5 text-light/70" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Profile Completion */}
        {profileCompletion < 100 && (
          <div className="bg-gradient-to-r from-primary/20 to-emotional/20 rounded-2xl p-4 border border-primary/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-light font-medium">
                Complete your profile
              </span>
              <span className="text-primary font-bold">
                {profileCompletion}%
              </span>
            </div>
            <div className="w-full bg-light/10 rounded-full h-2 mb-3">
              <div
                className="bg-gradient-to-r from-primary to-emotional h-2 rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            <p className="text-light/70 text-sm">
              Add more photos and prompts to boost your matches! ✨
            </p>
          </div>
        )}

        {/* Profile Overview */}
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Image
                src={profile.profileImages[0]?.url}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-2xl object-cover"
              />
              <button
                onClick={() => setShowPhotoEditModal(true)}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-sans font-bold text-xl text-light">
                  {profile.name}, {profile.age}
                </h2>
                <span className="bg-primary/20 px-2 py-1 rounded-full text-primary text-xs font-rounded">
                  {profile.college}
                </span>
              </div>
              <p className="text-light/70 text-sm mb-2">
                {profile.height}cm • {getPronouns(profile.gender)}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-rounded ">
                  {profile.personalityType}
                </span>
                <span className="bg-emotional/20 text-emotional px-3 py-1 rounded-full text-xs font-rounded">
                  {getConnectionIntent(profile.connectionIntent!)?.label}
                </span>
              </div>
              <button
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                onClick={() => setShowUpdateModal(true)}
              >
                <Edit3 className="w-4 h-4" />
                <span className="font-rounded font-medium">Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Current Mood */}
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans font-semibold text-lg text-light">
              Current Mood
            </h3>
            <button
              onClick={() => setShowMoodModal(true)}
              className="text-primary hover:text-primary/80 transition-colors font-rounded font-medium"
            >
              Change Mood
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-2xl">
              {currentMood.emoji}
            </div>
            <div>
              <p className="text-light font-medium">{currentMood.label}</p>
              <p className="text-light/60 text-sm">Visible to your matches</p>
            </div>
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="grid grid-cols-2 gap-4">
          {profileStats.map((stat, index) => (
            <div
              key={index}
              className="bg-light/5 backdrop-blur-sm rounded-2xl p-4 border border-light/10"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color.replace(
                  "text-",
                  "bg-"
                )}/20`}
              >
                <div className={stat.color}>{stat.icon}</div>
              </div>
              <p className="text-2xl font-bold text-light mb-1">{stat.value}</p>
              <p className="text-light/60 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Anonymous Comments */}
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-accent" />
            <h3 className="font-sans font-semibold text-lg text-light">
              What others are saying about you...
            </h3>
          </div>
          <div className="space-y-4">
            {anonymousComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-light/5 rounded-2xl p-4 border border-light/10"
              >
                <p className="text-light/80 text-sm mb-2 italic">
                  &quot;{comment.content}&quot;
                </p>
                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-2">
                    <span className="text-light/50 text-xs">
                      {comment.timestamp}
                    </span>
                    <button className="p-1 hover:bg-light/10 rounded transition-colors">
                      <Flag className="w-3 h-3 text-light/40" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {anonymousComments.length === 0 && (
              <p className="text-light/60 text-sm text-center">
                No comments yet.
              </p>
            )}
          </div>
        </div>

        <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans font-semibold text-lg text-light">
              Interests
            </h3>
          </div>
          <div className="flex items-center flex-wrap gap-3 ">
            {profile.interests.map((interest, ind) => (
              <span
                className="bg-primary/20 px-3 py-1 rounded-full text-primary text-m font-rounded"
                key={ind}
              >
                {interest}
              </span>
            ))}
          </div>
          {profile.favoriteArtist && profile.favoriteArtist.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4 mt-5">
                <h3 className="font-sans font-semibold text-lg text-light">
                  Favourite Artists
                </h3>
              </div>
              <div className="flex items-center flex-wrap gap-3 ">
                {profile.favoriteArtist.map((favArtist, ind) => (
                  <span
                    className="bg-primary/20 px-3 py-1 rounded-full text-primary text-m font-rounded"
                    key={ind}
                  >
                    {favArtist}
                  </span>
                ))}
              </div>
            </>
          )}
          <div className="flex items-center justify-between mb-4 mt-5">
            <h3 className="font-sans font-semibold text-lg text-light">
              Hangout Spots
            </h3>
          </div>
          <div className="flex items-center flex-wrap gap-3 ">
            <span className="bg-emotional/20 px-3 py-1 rounded-full text-emotional text-m font-rounded">
              {profile.hangoutSpot?.split("-").join(" ") || "Not specified"}
            </span>
          </div>
        </div>

        <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-emotional" />
            <h3 className="font-sans font-semibold text-lg text-light">
              Ideal first date would be...
            </h3>
            <button
              onClick={() =>
                setShowFunPromptModal({
                  active: true,
                  prompt: profile.funPrompt1,
                  promptName: "funPrompt1",
                })
              }
              className=" text-primary hover:text-primary/80 transition-colors font-rounded font-medium"
            >
              <Pencil size={20} />
            </button>
          </div>
          <div className="space-y-4">
            {profile.funPrompt1 ? (
              <div className="bg-light/5 rounded-2xl p-4 border border-light/10">
                <p className="text-light/80 text-sm mb-2 italic">
                  &quot;{profile.funPrompt1}&quot;
                </p>
              </div>
            ) : (
              <p className="text-light/80 text-sm mb-2 italic px-4">
                Not Specified.
              </p>
            )}
          </div>
        </div>
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-emerald-500" />
            <h3 className="font-sans font-semibold text-lg text-light">
              Chai or Coffee...
            </h3>
            <button
              onClick={() =>
                setShowFunPromptModal({
                  active: true,
                  prompt: profile.funPrompt2,
                  promptName: "funPrompt2",
                })
              }
              className="text-primary hover:text-primary/80 transition-colors font-rounded font-medium"
            >
              <Pencil size={20} />
            </button>
          </div>
          <div className="space-y-4">
            {profile.funPrompt2 ? (
              <div className="bg-light/5 rounded-2xl p-4 border border-light/10">
                <p className="text-light/80 text-sm mb-2 italic">
                  &quot;{profile.funPrompt2}&quot;
                </p>
              </div>
            ) : (
              <p className="text-light/80 text-sm mb-2 italic px-4">
                Not Specified.
              </p>
            )}
          </div>
        </div>
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10">
          <div className="flex items-center gap-2 mb-4">
            <Bubbles className="w-5 h-5 text-primary" />
            <h3 className="font-sans font-semibold text-lg text-light">
              I can&apos;t stop talking about...
            </h3>

            <button
              onClick={() =>
                setShowFunPromptModal({
                  active: true,
                  prompt: profile.funPrompt3,
                  promptName: "funPrompt3",
                })
              }
              className="text-primary hover:text-primary/80 transition-colors font-rounded font-medium"
            >
              <Pencil size={20} />
            </button>
          </div>
          <div className="space-y-4">
            {profile.funPrompt3 ? (
              <div className="bg-light/5 rounded-2xl p-4 border border-light/10">
                <p className="text-light/80 text-sm mb-2 italic">
                  &quot;{profile.funPrompt3}&quot;
                </p>
              </div>
            ) : (
              <p className="text-light/80 text-sm mb-2 italic px-4">
                Not Specified.
              </p>
            )}
          </div>
        </div>

        <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-sans font-semibold text-lg text-light">
              Photos
            </h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {profile.profileImages.map((image, ind) => (
                <div
                  key={image.id}
                  className="relative aspect-square bg-light/5 border-2 border-dashed border-light/20 rounded-2xl flex flex-col items-center justify-center p-4 hover:border-light/40 transition-colors cursor-pointer group"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={image.url}
                      alt={`Photo ${ind + 1}`}
                      width={132}
                      height={132}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <BottomNavigation />

      {/* Mood Selection Modal */}
      {showMoodModal && (
        <div className="fixed inset-0 bg-dark/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10 max-w-sm mx-4 w-full">
            <h2 className="font-serif text-xl text-light mb-4 text-center">
              Set Your Mood
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {MOODS.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => {
                    handleCurrentMoodChange(mood);
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    currentMood.label.includes(mood.label)
                      ? "border-primary bg-primary/20"
                      : "border-light/20 bg-light/5 hover:border-light/40"
                  }`}
                >
                  <div className="text-2xl mb-2">{mood.emoji}</div>
                  <div className={`text-sm font-rounded ${mood.color}`}>
                    {mood.label}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowMoodModal(false)}
              className="w-full py-3 bg-light/10 rounded-2xl text-light/70 font-rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalProfilePage;
