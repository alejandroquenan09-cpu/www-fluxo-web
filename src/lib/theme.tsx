import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Appearance = "light" | "dark";
const ThemeContext = createContext<{ theme: Appearance; toggleTheme: () => void }>({ theme: "light", toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Appearance>("light");
  useEffect(() => {
    try { setTheme(localStorage.getItem("fluxo-theme") === "dark" ? "dark" : "light"); } catch { /* Storage is optional. */ }
    const sync = (event: StorageEvent) => {
      if (event.key === "fluxo-theme") setTheme(event.newValue === "dark" ? "dark" : "light");
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem("fluxo-theme", next); } catch { /* Switching remains available. */ }
  };
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);
