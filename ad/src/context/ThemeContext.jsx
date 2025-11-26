import React, { useState, createContext, useContext } from "react";

// Theme configuration as used in components
const THEME_CONFIG = {
  light: {
    PRIMARY_COLOR: "#1A1265", // Deep Indigo
    SECONDARY_COLOR: "#F5F5F5", // Light Gray/Cream
    BASE_BG: "#FFFFFF", // White Background
    DARK_TEXT: "#111111", // Near Black Text
    MID_TEXT: "#666666", // Medium Gray Text
    HOVER_BG: "#EEEEEE",
    DANGER_COLOR: "#EF4444",
    SUCCESS_COLOR: "#10B981",
    ICON: "sun", // Icon name as string, component override in consumer
  },
  dark: {
    PRIMARY_COLOR: "#9BA3FF", // Light Indigo/Periwinkle
    SECONDARY_COLOR: "#1F2937", // Dark Slate Gray
    BASE_BG: "#111827", // Charcoal/Near-Black Background
    DARK_TEXT: "#F9FAFB", // White Text
    MID_TEXT: "#9CA3AF", // Light Gray Text
    HOVER_BG: "#374151",
    DANGER_COLOR: "#F87171",
    SUCCESS_COLOR: "#34D399",
    ICON: "moon", // Icon name as string, component override in consumer
  },
};

// Theme context and theme provider
const ThemeContext = createContext({
  themeColors: THEME_CONFIG.dark,
  toggleTheme: () => {},
  themeMode: "dark",
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState("dark");
  const themeColors = THEME_CONFIG[themeMode];

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const contextValue = { themeColors, toggleTheme, themeMode };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
