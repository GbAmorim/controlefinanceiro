import { useState, useEffect } from "react";

const STORAGE_KEY = "settings";
const DEFAULTS = { savingsGoal: 0, budgets: {} };

export function useSettings() {
    const [settings, setSettings] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            // O spread mescla: valores salvos sobrescrevem os padrões,
            // e campos novos que criarmos no futuro não quebram dados antigos.
            return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
        } catch {
            return DEFAULTS;
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }, [settings]);

    function setSavingsGoal(value) {
        setSettings((prev) => ({ ...prev, savingsGoal: value }));
    }

    function setBudget(category, value) {
        setSettings((prev) => ({
            ...prev,
            // [category] entre colchetes usa o VALOR da variável como nome da chave
            budgets: { ...prev.budgets, [category]: value },
        }));
    }

    return { settings, setSavingsGoal, setBudget };
}
