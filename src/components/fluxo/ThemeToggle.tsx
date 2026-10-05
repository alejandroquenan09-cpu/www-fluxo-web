import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Lee la preferencia guardada o el estado actual de <html>
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("fluxo-theme", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Cambiar tema"
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full glass text-muted-foreground transition-colors hover:text-foreground ${className}`}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-primary transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-primary transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
