"use client";

import type { ReactNode } from "react";
import { signOut } from "next-auth/react";

type SignOutButtonProps = {
  className?: string;
  children?: ReactNode;
};

export function SignOutButton({ className, children }: SignOutButtonProps) {
  const handleClick = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children ?? "Odhlásiť sa"}
    </button>
  );
}

