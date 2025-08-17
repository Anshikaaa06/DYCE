import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import React from "react";

const PasswordInput = ({
  value,
  onChange,
  label,
  placeholder,
  className,
  onShowPasswordToggle,
  isPasswordVisible,
}: {
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  label: string;
  placeholder?: string;
  className?: string;
  isPasswordVisible?: boolean;
  onShowPasswordToggle?: () => void;
}) => {
  return (
    <>
      <div>
        <label className="block text-start text-light/80 text-sm font-medium mb-2">
          {label}
        </label>
        <div className="relative">
          <input
            type={isPasswordVisible ? "text" : "password"}
            value={value}
            onChange={onChange}
            className={cn(
              "w-full p-3 bg-light/10 border border-light/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-light pr-12",
              className
            )}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={onShowPasswordToggle}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light/40 hover:text-light/60"
          >
            {isPasswordVisible ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default PasswordInput;
