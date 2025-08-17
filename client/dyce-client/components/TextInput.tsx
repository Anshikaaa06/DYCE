import { cn } from "@/lib/utils";
import React from "react";

const TextInput = ({
  value,
  name,
  onChange,
  label,
  placeholder,
  type = "text",
  className,
  required
}: {
  value: string | number | undefined;
  name:string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  label: string;
  placeholder?: string;
  type?: string;
  className?: string;
  required?: boolean;
}) => {
  return (
    <>
      <div>
        <label className="block text-light/80 text-sm font-medium mb-2">
          {label}
        </label>
        <input
          type={type}
          value={value}
          name={name}
          onChange={onChange}
          className={cn(
            "w-full p-3 bg-light/10 border border-light/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-light",
            className
          )}
          required={required}
          placeholder={placeholder}
        />
      </div>
    </>
  );
};

export default TextInput;
