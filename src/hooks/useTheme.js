import { useState, useEffect } from "react";
import { THEMES } from "../utils/themes";

export function useTheme() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem("theme");
        // Só aceita o valor salvo se ele ainda for um tema existente
        return THEMES.some((t) => t.id === saved) ? saved : "claro";
    });
    // Sempre que "theme" mudar: aplica no HTML e salva no navegador
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    return { theme, setTheme };
}
