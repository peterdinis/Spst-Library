"use client";

import { signOut } from "next-auth/react";

type SignOutButtonProps = {
  className?: string;
};

export function SignOutButton({ className }: SignOutButtonProps) {
  const handleClick = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      Odhlásiť sa
    </button>
  );
}

