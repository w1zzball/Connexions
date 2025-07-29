import { useEffect, useState } from "react";
import "./ThemeToggle.css";
export default function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        // Check for saved theme or fall back to system
        return localStorage.getItem("theme") ||
            (window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light");
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <div id="theme-toggle-container">
            <button
                id="theme-toggle-button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle light/dark mode"
            >
                {theme === "dark" ? (
                    <i className="fa-regular fa-moon"></i>
                ) : (
                    <i className="fa-solid fa-moon"></i>
                )}
            </button>
        </div>
    );
}