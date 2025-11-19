"use client";

import { FluentProvider, SSRProvider, webLightTheme, webDarkTheme } from "@fluentui/react-components";
import { Loader2 } from "lucide-react";
import { createContext, Suspense, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default function AppFluentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Načítaj uloženú tému z localStorage
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Alebo zisti systémovú tému
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setTheme(systemTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const fluentTheme = theme === "dark" ? webDarkTheme : webLightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <SSRProvider>
        <FluentProvider theme={fluentTheme}>
          <Suspense fallback={<div className="container">
            <Loader2 className="circle one" />
          </div> }>
            {children}
          </Suspense>
        </FluentProvider>
      </SSRProvider>
    </ThemeContext.Provider>
  );
}