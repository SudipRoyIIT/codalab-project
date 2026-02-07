// src/components/ThemeContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" || 
           (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark-mode");
      root.style.setProperty("--header-bg", "#1e293b");
      root.style.setProperty("--card-bg", "#334155");
      root.style.setProperty("--dark-color", "#f1f5f9");
      root.style.setProperty("--light-color", "#0f172a");
      root.style.setProperty("--border-color", "#475569");
    } else {
      root.classList.remove("dark-mode");
      root.style.setProperty("--header-bg", "#ffffff");
      root.style.setProperty("--card-bg", "#ffffff");
      root.style.setProperty("--dark-color", "#333333");
      root.style.setProperty("--light-color", "#f8f9fa");
      root.style.setProperty("--border-color", "#dee2e6");
    }
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};