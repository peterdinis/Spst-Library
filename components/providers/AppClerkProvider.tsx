"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { FC, ReactNode } from "react";

type AppClerkProviderProps = {
  children: ReactNode;
};

const AppClerkProvider: FC<AppClerkProviderProps> = ({children}: AppClerkProviderProps) => {
    return (
        <ClerkProvider>
            {children}
        </ClerkProvider>
    )
}

export default AppClerkProvider;