import Link from "next/link";
import React from "react";

const MatchModal = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-dark/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-primary/20 to-emotional/20 backdrop-blur-sm rounded-3xl p-8 text-center border border-light/20 max-w-sm mx-4">
        <div className="text-6xl mb-4">💜</div>
        <h2 className="font-serif text-3xl text-primary mb-2">
          It&apos;s a DYCE match!
        </h2>
        <p className="text-light/80 mb-6">
          You both vibed with each other. Start a convo?
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-light/10 rounded-2xl text-light/70 font-rounded"
          >
            Maybe Later
          </button>
          <button className="flex-1 py-3 bg-gradient-to-r from-primary to-emotional rounded-2xl text-white font-rounded">
            <Link href="/messages">Let&apos;s Chat!</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;
