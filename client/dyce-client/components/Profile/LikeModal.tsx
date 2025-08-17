import Image from "next/image";
import React from "react";

const LikeModal = ({
  recentLikes,
  setShowLikesModal,
}: {
  recentLikes: { avatar: string; name: string; time: string }[];
  setShowLikesModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <div className="fixed inset-0 bg-dark/90 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10 max-w-sm mx-4 w-full max-h-[80vh] overflow-y-auto">
          <h2 className="font-serif text-xl text-light mb-4 text-center">
            People who liked you
          </h2>
          <div className="space-y-3 mb-6">
            {recentLikes.map((like, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-light/5 rounded-2xl"
              >
                <Image
                  src={like.avatar}
                  alt={like.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-light font-medium">{like.name}</p>
                  <p className="text-light/60 text-sm">{like.time}</p>
                </div>
                <button className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-rounded">
                  View
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowLikesModal(false)}
            className="w-full py-3 bg-light/10 rounded-2xl text-light/70 font-rounded"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default LikeModal;
