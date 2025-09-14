import { Tokens } from "@/types/authTypes";
import { useMutation } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useRefreshToken = () => {
  return useMutation<Tokens, Error, { userId: number; refreshToken: string }>({
    mutationKey: ["refreshToken"],
    mutationFn: async (body) => {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Refresh token failed");
      }

      return res.json();
    },
  });
};
