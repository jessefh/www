"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
      setIsLight(document.documentElement.dataset.theme === "light");
    }, []);

    function toggle() {
      const next = isLight ? "dark" : "light";
      try {
        if (next === "dark") {
          delete document.documentElement.dataset.theme;
        } else {
          document.documentElement.dataset.theme = "light";
        }
        localStorage.setItem("theme", next);
      } catch (e) {}
      setIsLight(next === "light");
    }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-pressed={isLight}
    >
      {isLight ? "Dark Mode" : "Light Mode"}
    </button>
  );
}
