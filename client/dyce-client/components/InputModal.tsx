import { cn } from "@/lib/utils";
import React from "react";

interface InputModalProps {
  title: string;
  description: string;
  children: React.ReactNode;
  handleSubmit: () => void;
  disabled?: boolean;
  classNameActive?: string;
  btnLabel: string;
  setShowModal: (show: boolean) => void;
  showModal: boolean;
}

const InputModal = ({
  title,
  description,
  children,
  handleSubmit,
  disabled,
  btnLabel,
  setShowModal,
  showModal,
}: InputModalProps) => {
  if (!showModal) return null;
  return (
    <>
      <div className="fixed h-screen inset-0 bg-dark/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl border border-light/10 max-w-md w-full max-h-[90vh] overflow-auto">
          <div className="p-6 border-b border-light/10">
            <h2 className="font-serif text-xl text-light">{title}</h2>
            <p className="text-light/60 text-sm mt-1">{description}</p>
          </div>

          <div className="p-6 space-y-4">{children}</div>

          <div className="p-6 border-t border-light/10 flex gap-4">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 py-3 bg-light/10 rounded-2xl text-light/70 font-rounded font-medium hover:bg-light/20 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={disabled}
              className={cn(
                "flex-1 py-3 rounded-2xl font-rounded font-medium transition-all bg-light/10 text-light/40 cursor-not-allowed",
                !disabled &&
                  "bg-gradient-to-r from-primary to-emotional text-white hover:scale-105 cursor-pointer"
              )}
              //   className={`flex-1 py-3 rounded-2xl font-rounded font-medium transition-all ${
              //     passwordForm.currentPassword &&
              //     passwordForm.newPassword &&
              //     passwordForm.confirmPassword
              //       ? "bg-gradient-to-r from-primary to-emotional text-white hover:scale-105"
              //       : "bg-light/10 text-light/40 cursor-not-allowed"
              //   }`}
            >
              {btnLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InputModal;
