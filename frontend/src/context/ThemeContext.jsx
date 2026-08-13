import React, { createContext, useContext, useState } from "react";

export const THEMES = {
  dark: {
    bg: "#0d0e12",
    elevated: "#15161c",
    hover: "#1c1e26",
    border: "#24262f",
    text: "#e8e8ec",
    muted: "#8b8d98",
    accent: "#8b7fff",
    accentSoft: "rgba(139,127,255,0.16)",
    online: "#4ade80",
  },
  light: {
    bg: "#f4f4f6",
    elevated: "#ffffff",
    hover: "#eeeef1",
    border: "#e3e3e8",
    text: "#17181c",
    muted: "#6b6d76",
    accent: "#6c5ce7",
    accentSoft: "rgba(108,92,231,0.10)",
    online: "#16a34a",
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("dark");
  const t = THEMES[mode];

  const vars = {
    "--bg": t.bg,
    "--elevated": t.elevated,
    "--hover": t.hover,
    "--border": t.border,
    "--text": t.text,
    "--muted": t.muted,
    "--accent": t.accent,
    "--accent-soft": t.accentSoft,
    "--online": t.online,
  };

  const toggle = () => setMode((m) => (m === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      <div style={vars} className="w-full h-full bg-[var(--bg)] text-[var(--text)]">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
