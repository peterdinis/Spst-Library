"use client";

import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "./useProfile";

export type AppRole = "STUDENT" | "TEACHER";

export const useRoleCheck = (allowedRoles: AppRole[] | AppRole) => {
  const router = useRouter();

  const { data: profile, isLoading, error } = useProfile({
    retry: false,
    refetchOnWindowFocus: false,
  });

  const rolesArray = useMemo(
    () => (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]),
    [allowedRoles],
  );

  const hasRole = useMemo(() => {
    if (!profile) return false;
    return rolesArray.includes(profile.role.name as AppRole);
  }, [profile, rolesArray]);

  const isStudent = profile?.role.name === "STUDENT";
  const isTeacher = profile?.role.name === "TEACHER";

  const isUnauthorized =
    !isLoading &&
    !!profile &&
    !rolesArray.includes(profile.role.name as AppRole);

  useEffect(() => {
    if (isUnauthorized) {
      router.replace("/unauthorized");
    }
  }, [isUnauthorized, router]);

  return {
    profile,
    isLoading,
    error,
    hasRole,
    isStudent,
    isTeacher,
    isUnauthorized,
  };
};
