import { cn } from "@/lib/utils";
import React from "react";

const BlockModal = ({
  handleClose,
  handleBlock,
  title,
  desc,
  btnLabel="Block",
  className
}: {
  handleClose: () => void;
  handleBlock: () => void;
  title: string;
  desc: string;
  btnLabel: string;
  className?: string;
}) => {
  return (
    <>
      <div className={cn("fixed inset-0 bg-dark/90 backdrop-blur-sm flex items-center justify-center z-50", className)}>
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10 max-w-sm mx-4 z-100">
          <h2 className="font-serif text-xl text-light mb-2">
            {title}
          </h2>
          <p className="text-light/70 text-sm mb-6">
            {desc}
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleClose}
              className="flex-1 py-3 bg-light/10 rounded-2xl text-light/70 font-rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleBlock}
              className="flex-1 py-3 bg-red-500 rounded-2xl text-white font-rounded"
            >
              {btnLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlockModal;
