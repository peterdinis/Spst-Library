"use client";

import { useState, useEffect } from "react";

export function useIsDesktop(breakpoint = 768) {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= breakpoint);
    
    // Initial check
    check();
    
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isDesktop;
}
