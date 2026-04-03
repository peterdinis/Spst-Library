"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useIsMounted } from "@/hooks/useIsMounted"

function ThemeProviderInner({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const isMounted = useIsMounted()

  if (!isMounted()) {
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export function ThemeProvider({
  children,
  fallback,
  ...props
}: React.ComponentProps<typeof NextThemesProvider> & {
  fallback?: React.ReactNode
}) {
  return (
    <React.Suspense fallback={fallback ?? null}>
      <ThemeProviderInner {...props}>{children}</ThemeProviderInner>
    </React.Suspense>
  )
}