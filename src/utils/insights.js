import {
    getExpensesByCategory,
    getMonthStats,
    getPreviousMonthKey,
} from "./calculations";
import { FLEXIBLE_CATEGORIES } from "./categories";
import { formatCurrency } from "./format";

// Cada insight: { type: "alert" | "tip" | "good", text: "..." }
export function getInsights({ transactions, monthKey, settings }) {
    const insights = [];
    const { income, expense, balance } = getMonthStats(transactions, monthKey);
    const byCategory = getExpensesByCategory(transactions, monthKey);

    // Sem movimento no mês: nada a analisar
    if (income === 0 && expense === 0) return insights;

    // Regra 1: gastando mais do que ganha
    if (balance < 0) {
        insights.push({
            type: "alert",
            text: `Suas despesas superam as receitas em ${formatCurrency(-balance)} neste mês.`,
        });
    }

    // Regra 2: meta de economia
    const goal = settings.savingsGoal;
    if (goal > 0) {
        const missing = goal - balance; // quanto falta para chegar na meta

        if (missing <= 0) {
            insights.push({
                type: "good",
                text: `Meta de economia batida! Você já guardou ${formatCurrency(balance)} neste mês.`,
            });
        } else {
            const flexible = byCategory.filter((c) =>
                FLEXIBLE_CATEGORIES.includes(c.name),
            );
            const flexibleTotal = flexible.reduce((sum, c) => sum + c.value, 0);

            if (flexibleTotal >= missing) {
                // Quantos % dos gastos flexíveis precisariam ser cortados
                const pct = Math.ceil((missing / flexibleTotal) * 100);
                const names = flexible
                    .slice(0, 3)
                    .map((c) => c.name)
                    .join(", ");
                insights.push({
                    type: "tip",
                    text: `Faltam ${formatCurrency(missing)} para a meta. Reduzir cerca de ${pct}% dos gastos flexíveis (${names}) cobriria essa diferença.`,
                });
            } else {
                insights.push({
                    type: "alert",
                    text: `Faltam ${formatCurrency(missing)} para a meta, e os gastos flexíveis (${formatCurrency(flexibleTotal)}) não bastam. Revise também as despesas fixas ou aumente a receita.`,
                });
            }
        }
    }

    // Regra 3: categorias acima do limite definido
    for (const c of byCategory) {
        const limit = settings.budgets[c.name];
        if (limit > 0 && c.value > limit) {
            insights.push({
                type: "alert",
                text: `${c.name} passou do limite em ${formatCurrency(c.value - limit)}.`,
            });
        }
    }

    // Regra 4: categorias que subiram bastante em relação ao mês anterior
    const previous = getExpensesByCategory(
        transactions,
        getPreviousMonthKey(monthKey),
    );
    for (const c of byCategory) {
        const before = previous.find((p) => p.name === c.name)?.value || 0;
        const grew = c.value > before * 1.2 && c.value - before >= 50;
        if (before > 0 && grew) {
            const pct = Math.round(((c.value - before) / before) * 100);
            insights.push({
                type: "tip",
                text: `${c.name} subiu ${pct}% em relação ao mês passado (${formatCurrency(before)} → ${formatCurrency(c.value)}).`,
            });
        }
    }

    // Tudo certo: nenhuma regra gerou alerta
    if (insights.length === 0) {
        insights.push({
            type: "good",
            text: "Nenhum ponto de atenção neste mês. Continue assim!",
        });
    }

    return insights;
}
