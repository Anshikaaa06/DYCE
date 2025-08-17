import React, { useState } from "react";
import InputModal from "../InputModal";
import { Profile } from "@/types/profile";
import { Upload, X } from "lucide-react";
import { axiosClient } from "@/lib/axios-client";
import { toast } from "sonner";

interface PhotoGridItem {
  id?: string;
  url: string;
  order?: number;
  createdAt?: string;
  isNew?: boolean;
  file?: File | null;
}

const PhotoEditModal = ({
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
  const [photoGrid, setPhotoGrid] = useState<(PhotoGridItem | null)[]>(
    Array.from({ length: 6 }, (_, i) => profile.profileImages[i] || null)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpload = (index: number, file: File) => {
    const url = URL.createObjectURL(file); // preview
    const updated = [...photoGrid];
    updated[index] = { url, file, isNew: true };
    setPhotoGrid(updated);
  };

  const handleRemove = (index: number) => {
    const updated = [...photoGrid];
    updated[index] = null;
    setPhotoGrid(updated);
  };

  const handleSave = async () => {
    if (!isValidForm()) {
      toast.error("Please upload at least 3 photos.");
      return;
    }
    setIsSubmitting(true);
    try {
      const finalData = photoGrid
        .map((item, index) => {
          if (!item) return null;
          return {
            id: item.id,
            url: item.url,
            isNew: item.isNew || false,
            file: item.file,
            order: index,
          };
        })
        .filter(Boolean);

      const formData = new FormData();
      formData.append("photos", JSON.stringify(finalData));

      finalData.forEach((p, i) => {
        if (p?.isNew && p.file) {
          formData.append(`file_${i}`, p.file);
        }
      });

      const res = await axiosClient.post("/profile/update-images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res.data.success) toast.error("Failed to update photos.");
    } catch (error) {
      console.error("Error updating photos:", error);
      toast.error("An error occurred while updating photos. Please try again.");
    }
    setIsSubmitting(false);
    setProfileUpdated(prev=>!prev);
    setShowModal(false);
  };

  const isValidForm = () => {
    return photoGrid.filter(Boolean).length >= 3;
  };

  return (
    <>
      <InputModal
        title="Update Profile"
        description="Change your profile details."
        handleSubmit={handleSave}
        btnLabel="Update Profile"
        setShowModal={setShowModal}
        showModal={showModal}
        disabled={!isValidForm() || isSubmitting}
      >
        <label className="block text-light/80 font-medium mb-4">Photos</label>
        <div className="bg-light/10 backdrop-blur-sm rounded-3xl p-6 border border-light/20">
          <div>
            <div className="grid grid-cols-2 gap-3">
              {photoGrid.map((photo, ind) => (
                <div
                  key={ind}
                  className="relative aspect-square bg-light/5 border-2 border-dashed border-light/20 rounded-2xl flex flex-col items-center justify-center p-4 hover:border-light/40 transition-colors cursor-pointer group"
                >
                  {photo ? (
                    <div className="relative w-full h-full">
                      <img
                        src={photo.url}
                        alt={`Photo ${ind + 1}`}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                      <button
                        onClick={() => handleRemove(ind)}
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
                        accept="image/*"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files) {
                            handleUpload(ind, files[0]);
                          }
                        }}
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
      </InputModal>
    </>
  );
};

export default PhotoEditModal;
