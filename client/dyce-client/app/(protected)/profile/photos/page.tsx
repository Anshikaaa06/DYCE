"use client";
import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Upload, X, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/Progressbar";
import { toast } from "sonner";
import { axiosClient } from "@/lib/axios-client";

export type PhotoKey = `photo_${1 | 2 | 3 | 4 | 5 | 6}`;

const PhotosPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    photo_1: null,
    photo_2: null,
    photo_3: null,
    photo_4: null,
    photo_5: null,
    photo_6: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const photoSlots = [
    { id: 1, prompt: "Your fest fit" },
    { id: 2, prompt: "Lecture mood" },
    { id: 3, prompt: "Something aesthetic" },
    { id: 4, prompt: "Your best vibe" },
    { id: 5, prompt: "Campus life" },
    { id: 6, prompt: "Just you being you" },
  ];

  const handleRemovePhoto = (key: PhotoKey) => {
    setFormData((prev) => ({
      ...prev,
      [key]: null,
    }));
  };

  const handleUploadPhotos =async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    // Check if at least 3 photos are uploaded
    const uploadedPhotos = Object.values(formData).filter(
      (photo) => photo !== null
    ).length;

    if (uploadedPhotos < 3) {
      alert("Please upload at least 3 photos.");
      return;
    }
    setIsLoading(true);
    try {
      const imageData = new FormData();
      Object.entries(formData).forEach(([_, value]) => {
        if (value) {
          imageData.append("images", value);
        }
      });
      
      const resp = await axiosClient.post("/profile/upload-images", imageData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (resp.status === 201) {
        toast.success("Photos uploaded successfully!");
        router.push("/profile/prompts");
      }

    } catch (error) {
      console.error("Error uploading photos:", error);
      toast.error(
        "An error occurred while uploading photos. Please try again."
      );
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
            href="/profile/interests"
            className="p-2 hover:bg-light/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-light/70" />
          </a>
          {/* <a
            href="/profile/prompts"
            className="text-light/60 text-sm hover:text-light/80 transition-colors"
          >
            Skip for now
          </a> */}
        </div>

        <ProgressBar currentStep={4} totalSteps={5} />

        {/* Main Content */}
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-primary mb-2">
              Picture perfect moments 📸
            </h1>
            <p className="text-light/70 text-sm">
              Upload photos that capture your vibe and make your profile pop.
            </p>
          </div>

          <div className="space-y-8">
            {/* Photo Upload */}
            <div>
              <label className="block text-light/80 font-medium mb-2">
                Add some photos 📸 (Upload atleast 3 photos)
              </label>
              <p className="text-light/60 text-sm mb-4">
                You can skip now and update later anytime.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {photoSlots.map((slot, ind) => (
                  <div
                    key={slot.id}
                    className="relative aspect-square bg-light/5 border-2 border-dashed border-light/20 rounded-2xl flex flex-col items-center justify-center p-4 hover:border-light/40 transition-colors cursor-pointer group"
                  >
                    {formData[`photo_${ind + 1}` as PhotoKey] !== null ? (
                      <div className="relative w-full h-full">
                        <img
                          src={URL.createObjectURL(
                            formData[`photo_${ind + 1}` as PhotoKey]!
                          )}
                          alt={`Photo ${ind + 1}`}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                        <button
                          onClick={() =>
                            handleRemovePhoto(`photo_${ind + 1}` as PhotoKey)
                          }
                          className="absolute top-2 right-2 bg-light/10 hover:bg-light/20 text-light rounded-full p-1 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          type="file"
                          name={`photo_${ind + 1}`}
                          value={
                            formData[`photo_${ind + 1}` as PhotoKey] ||
                            undefined
                          }
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              [`photo_${ind + 1}`]: e.target.files?.[0] || null,
                            }))
                          }
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Upload className="w-6 h-6 text-light/40 group-hover:text-light/60 transition-colors mb-2" />
                        <span className="text-xs text-light/60 text-center font-rounded">
                          Upload you best shot
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleUploadPhotos}
            className="w-full mt-8 py-4 rounded-2xl font-rounded font-medium text-lg transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-emotional text-white hover:shadow-xl hover:scale-105"
            disabled={isLoading || Object.values(formData).filter(photo => photo !== null).length < 3}
          >
            Almost There
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin inline-block ml-2" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotosPage;
