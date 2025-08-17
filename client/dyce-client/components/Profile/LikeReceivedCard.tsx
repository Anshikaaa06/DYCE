import { ArrowRight, Heart } from "lucide-react";
import Image from "next/image";
import React from "react";

const LikeReceivedCard = ({
  recentLikes,
  setShowLikesModal,
}: {
  recentLikes: { avatar: string; name: string; time: string }[];
  setShowLikesModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-emotional" />
            <h3 className="font-sans font-semibold text-lg text-light">
              You&apos;ve got 47 likes!
            </h3>
          </div>
          <button
            onClick={() => setShowLikesModal(true)}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex -space-x-2">
          {recentLikes.map((like, index) => (
            <Image
              key={index}
              src={like.avatar}
              alt={like.name}
              width={40}
              height={40}
              className="rounded-full border-2 border-dark object-cover"
            />
          ))}
          <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-dark flex items-center justify-center">
            <span className="text-primary text-xs font-bold">+44</span>
          </div>
        </div>
        <p className="text-light/60 text-sm mt-3">
          See who&apos;s interested in your vibe
        </p>
      </div>
    </>
  );
};

export default LikeReceivedCard;
