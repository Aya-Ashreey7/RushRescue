import { createContext, useContext } from "react";

interface ThemeToggleContextType {
    toggleDarkMode: () => void;
    darkMode: boolean;
}

export const ThemeToggleContext = createContext<ThemeToggleContextType>({
    toggleDarkMode: () => { },
    darkMode: false,
});

export const useThemeToggle = () => useContext(ThemeToggleContext);
