import { currentMonthKey } from "./format";

// Função pura: mesma entrada, sempre a mesma saída, sem efeitos colaterais.
// Isso a torna fácil de entender e de testar.
export function getTotals(transactions) {
    let income = 0;
    let expense = 0;

    for (const t of transactions) {
        if (t.type === "receita") income += t.amount;
        else expense += t.amount;
    }

    return { income, expense, balance: income - expense };
}

// Gastos de um mês agrupados por categoria, do maior para o menor.
// Resultado: [{ name: "Moradia", value: 1200 }, { name: "Lazer", value: 300 }, ...]
export function getExpensesByCategory(transactions, monthKey) {
    const totals = {};

    for (const t of transactions) {
        if (t.type !== "despesa" || !t.date.startsWith(monthKey)) continue;
        totals[t.category] = (totals[t.category] || 0) + t.amount;
    }

    return Object.entries(totals)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
}

// Receitas e despesas dos últimos N meses (incluindo meses sem movimento)
export function getMonthlySummary(transactions, monthsBack = 6) {
    const now = new Date();
    const months = [];

    for (let i = monthsBack - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        months.push({ key, receitas: 0, despesas: 0 });
    }

    for (const t of transactions) {
        const entry = months.find((m) => m.key === t.date.slice(0, 7));
        if (!entry) continue; // transação fora da janela dos 6 meses
        if (t.type === "receita") entry.receitas += t.amount;
        else entry.despesas += t.amount;
    }

    return months;
}

// Meses disponíveis para o seletor, do mais recente para o mais antigo
export function getAvailableMonths(transactions, extra = []) {
    const set = new Set([currentMonthKey(), ...extra]);
    for (const t of transactions) set.add(t.date.slice(0, 7));
    return [...set].sort().reverse();
}

// Totais (receita, despesa, saldo) apenas de um mês
export function getMonthStats(transactions, monthKey) {
    const monthTransactions = transactions.filter((t) =>
        t.date.startsWith(monthKey),
    );
    return getTotals(monthTransactions);
}

// "2026-01" -> "2025-12"
export function getPreviousMonthKey(monthKey) {
    const [year, month] = monthKey.split("-").map(Number);
    // month é 1-12, mas o Date usa 0-11. O índice do mês atual é month - 1,
    // então o anterior é month - 2. O Date corrige sozinho o -1 (vira dezembro).
    const d = new Date(year, month - 2, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
