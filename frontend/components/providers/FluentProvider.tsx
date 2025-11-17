"use client";

import { FluentProvider, SSRProvider, webLightTheme } from "@fluentui/react-components";

export default function AppFluentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SSRProvider>
        <FluentProvider theme={webLightTheme}>{children}</FluentProvider>;
    </SSRProvider>
  )
}
