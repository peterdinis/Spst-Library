import { RegisterDto, Tokens } from "@/types/authTypes";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation<Tokens, Error, RegisterDto>({
    mutationKey: ["registerUser"],
    mutationFn: async (dto) => {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }

      return res.json();
    },
  });
};
