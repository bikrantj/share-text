import { clsx, type ClassValue } from "clsx";
import { intervalToDuration } from "date-fns";
import { customAlphabet } from "nanoid";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRandomId = () => {
  const nanoid = customAlphabet(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    4
  );
  return nanoid(4);
};

export const getExpiryDate = (hours: number) => {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
};

export function getExpiryDifference(createdAt: Date, expiresAt: Date) {
  const now = new Date(); // Current time
  const expiryDate = new Date(expiresAt); // Convert expiresAt to a Date object

  // If the expiry date is in the past, return "Expired"
  if (expiryDate < now) {
    return "Expired";
  }

  // Calculate the difference between now and the expiry date
  const duration = intervalToDuration({
    start: now,
    end: expiryDate,
  });

  // Format the duration into a human-readable string
  return `Expires in ${duration.days} days, ${duration.hours} hours, ${duration.minutes} minutes`;
}
export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (
    process.env.VERCEL_ENV === "production" &&
    process.env.VERCEL_PROJECT_PRODUCTION_URL
  ) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
};
