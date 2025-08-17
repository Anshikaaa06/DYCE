import React, { useEffect, useState } from "react";
import InputModal from "../InputModal";
import { toast } from "sonner";
import TextInput from "../TextInput";
import { Profile } from "@/types/profile";
import {
  CAMPUS_VIBE_OPTIONS,
  CONNECTION_INTENTS,
  HANGOUT_SPOTS,
  PERSONALITY_TYPES,
} from "@/constants/campus_options";
import { ChevronDown, Search, X } from "lucide-react";
import { ARTISTS_OPTIONS, INTERESTS_OPTIONS } from "@/constants/interests";
import MultiSelect from "../MultiSelect";
import { axiosClient } from "@/lib/axios-client";

const EditModal = ({
  profile,
  showModal,
  setShowModal,
  setProfileUpdated,
}: {
  profile: Profile;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setProfileUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [updatedProfileFormData, setUpdatedProfileFormData] =
    useState<Profile>(profile);
  const [interestLimit, setInterestLimit] = useState(16);
  const [filteredInterests, setFilteredInterests] = useState(
    INTERESTS_OPTIONS.slice(0, interestLimit)
  );
  const [interestQuery, setInterestQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!isValidForm()) {
      toast.error("Fill the required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      const resp = await axiosClient.put("/profile", {
        ...updatedProfileFormData,
      });
      if (resp.status === 200) {
        toast.success("Profile updated successfully!");
        setShowModal(false);
      }
      setProfileUpdated((prev) => !prev);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedProfileFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCampusVibeToggle = (vibeId: string) => {
    setUpdatedProfileFormData((prev) => ({
      ...prev,
      campusVibeTags: prev.campusVibeTags.includes(vibeId)
        ? prev.campusVibeTags.filter((id) => id !== vibeId)
        : [...prev.campusVibeTags, vibeId],
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setUpdatedProfileFormData((prev) => ({
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
    setUpdatedProfileFormData((prev) => ({
      ...prev,
      favoriteArtist: prev.favoriteArtist?.filter((a) => a !== artist),
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
    setUpdatedProfileFormData((prev) => ({
      ...prev,
      favoriteArtist: prev.favoriteArtist?.includes(value)
        ? prev.favoriteArtist
        : [...(prev.favoriteArtist || []), value],
    }));
  };

  const isValidForm = () => {
    return (
      updatedProfileFormData.name &&
      updatedProfileFormData.age &&
      updatedProfileFormData.height &&
      updatedProfileFormData.campusVibeTags.length > 0 &&
      updatedProfileFormData.hangoutSpot &&
      updatedProfileFormData.personalityType &&
      updatedProfileFormData.interests.length > 0 &&
      updatedProfileFormData.connectionIntent
    );
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      filterInterests();
    }, 300);

    return () => clearTimeout(delayDebounce);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interestQuery]);

  return (
    <>
      <InputModal
        title="Update Profile"
        description="Change your profile details."
        handleSubmit={handleSubmit}
        btnLabel="Update Profile"
        setShowModal={setShowModal}
        showModal={showModal}
        disabled={!isValidForm() || isSubmitting}
      >
        <TextInput
          value={updatedProfileFormData.name}
          name="name"
          onChange={handleInputChange}
          label="Name"
          required
          placeholder="Enter your name"
        />
        <TextInput
          value={updatedProfileFormData.age}
          name="age"
          onChange={handleInputChange}
          label="Age"
          required
          placeholder="Enter your age"
        />
        <TextInput
          value={updatedProfileFormData.height}
          type="number"
          name="height"
          onChange={handleInputChange}
          label="Height"
          required
          placeholder="Enter your height"
        />

        <label className="block text-light/80 font-medium mb-4">
          Campus Vibe Tags
        </label>
        <div className="bg-light/10 backdrop-blur-sm rounded-3xl p-6 border border-light/20">
          <div>
            <div className="grid grid-cols-2 gap-3">
              {CAMPUS_VIBE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleCampusVibeToggle(option.id)}
                  className={`p-3 rounded-2xl border-2 transition-all duration-300 text-sm ${
                    updatedProfileFormData.campusVibeTags.includes(option.id)
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
        </div>
        <label className="block text-light/80 font-medium mb-4">
          Where do you hang out most?
        </label>
        <div className="bg-light/10 backdrop-blur-sm rounded-3xl p-6 border border-light/20">
          <div>
            <div className="grid grid-cols-3 gap-3">
              {HANGOUT_SPOTS.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() =>
                    setUpdatedProfileFormData((prev) => ({
                      ...prev,
                      hangoutSpot: spot.id,
                    }))
                  }
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    updatedProfileFormData.hangoutSpot === spot.id
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
        </div>

        <label className="block text-light/80 font-medium mb-4">
          Personality Type
        </label>
        <div className="bg-light/10 backdrop-blur-sm rounded-3xl p-6 border border-light/20">
          <div>
            <div className="grid grid-cols-3 gap-3">
              {PERSONALITY_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() =>
                    setUpdatedProfileFormData((prev) => ({
                      ...prev,
                      personalityType: type.id as Profile["personalityType"],
                    }))
                  }
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    updatedProfileFormData.personalityType === type.id
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

        <label className="block text-light/80 font-medium mb-4">
          What are you into?
        </label>
        <div className="bg-light/10 backdrop-blur-sm rounded-3xl p-6 border border-light/20">
          <div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {filteredInterests.map((interest) => (
                <button
                  key={interest.value}
                  onClick={() => handleInterestToggle(interest.value)}
                  className={`p-3 rounded-2xl border-2 transition-all duration-300 text-sm ${
                    updatedProfileFormData.interests.includes(interest.value)
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
        </div>

        <label className="block text-light/80 font-medium mb-4">
          Tell us what you are looking for?
        </label>
        <div className="bg-light/10 backdrop-blur-sm rounded-3xl p-6 border border-light/20">
          <div>
            <div className="grid grid-cols-3 gap-3">
              {CONNECTION_INTENTS.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() =>
                    setUpdatedProfileFormData((prev) => ({
                      ...prev,
                      connectionIntent: spot.id,
                    }))
                  }
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    updatedProfileFormData.connectionIntent === spot.id
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
        </div>

        <label className="block text-light/80 font-medium mb-4">
          Favorite Artists
        </label>
        <div className="bg-light/10 backdrop-blur-sm rounded-3xl p-6 border border-light/20">
          <div>
            <div className="flex gap-2 mb-3">
              <MultiSelect
                options={ARTISTS_OPTIONS}
                onChange={handleArtistSelection}
              />
            </div>

            {/* Artist Tags */}
            <div className="flex flex-wrap gap-2">
              {updatedProfileFormData.favoriteArtist?.map((artist, index) => (
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
      </InputModal>
    </>
  );
};

export default EditModal;
