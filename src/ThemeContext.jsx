import { createContext, useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("cyberTheme") !== "light"; }
    catch { return true; }
  });

  useEffect(() => {
    const mode = dark ? "dark" : "light";
    localStorage.setItem("cyberTheme", mode);
    document.documentElement.setAttribute("data-theme", mode);
    document.documentElement.classList.toggle("theme-light", !dark);
    document.documentElement.classList.toggle("theme-dark", dark);
    document.body.style.backgroundColor = "";
    document.body.style.color = "";
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

// ── Moon / Sun Toggle ─────────────────────────────────────────────────────────
export function ThemeToggle({ className = "" }) {
  const { dark, toggle } = useTheme();
  return (
    <motion.button
      onClick={toggle}
      className={`relative w-14 h-7 rounded-full border transition-colors flex items-center px-1 ${className}`}
      style={{
        background: dark ? "rgba(34,211,238,0.1)" : "rgba(248,250,252,0.8)",
        borderColor: dark ? "rgba(34,211,238,0.3)" : "rgba(15,23,42,0.15)",
        boxShadow: dark ? "0 0 12px rgba(34,211,238,0.15)" : "0 2px 8px rgba(0,0,0,0.08)",
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {/* Thumb */}
      <motion.div
        className="absolute w-5 h-5 rounded-full flex items-center justify-center"
        style={{ background: dark ? "#22D3EE" : "#0F172A" }}
        animate={{ left: dark ? "calc(100% - 22px)" : "4px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {dark
          ? <Moon size={11} className="text-[#080C14]" />
          : <Sun  size={11} className="text-white"    />
        }
      </motion.div>
    </motion.button>
  );
}
