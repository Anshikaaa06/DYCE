import { CONNECTION_INTENTS } from "@/constants/campus_options";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getConnectionIntent = (connectionIntent: string) => {
  try {
    return CONNECTION_INTENTS.filter(
      (connection) => connection.id === connectionIntent
    )[0];
  } catch (error) {
    console.error("Error fetching connection intent:", error);
    return CONNECTION_INTENTS[0];
  }
};
