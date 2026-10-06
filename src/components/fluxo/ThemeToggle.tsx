import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button type="button" variant="glass" size="icon" onClick={toggleTheme}
      aria-label="Cambiar tema" aria-pressed={theme === "dark"}
      title={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
      className={`h-9 w-9 shrink-0 rounded-full text-primary ${className}`}>
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
