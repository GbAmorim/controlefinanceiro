import { useState } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import {
    getExpensesByCategory,
    getAvailableMonths,
} from "../utils/calculations";
import {
    formatCurrency,
    formatMonthLabel,
    currentMonthKey,
} from "../utils/format";
import { CHART_COLORS } from "../utils/chartColors";

export default function CategoryChart({ transactions }) {
    const [month, setMonth] = useState(currentMonthKey());

    const months = getAvailableMonths(transactions, [month]);

    // Adiciona a cor de cada fatia nos próprios dados: o Recharts lê "fill"
    const data = getExpensesByCategory(transactions, month).map((item, i) => ({
        ...item,
        fill: CHART_COLORS[i % CHART_COLORS.length],
    }));

    const total = data.reduce((sum, item) => sum + item.value, 0);
    const top = data[0];

    return (
        <div className="card">
            <div className="chart-header">
                <h2>Gastos por categoria</h2>
                <select
                    className="month-select"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                >
                    {months.map((m) => (
                        <option key={m} value={m}>
                            {formatMonthLabel(m)}
                        </option>
                    ))}
                </select>
            </div>

            {data.length === 0 ? (
                <p className="muted">Nenhuma despesa neste mês.</p>
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={55}
                                outerRadius={90}
                                paddingAngle={2}
                                stroke="var(--surface)"
                            />
                            <Tooltip
                                formatter={(value) => formatCurrency(value)}
                                contentStyle={{
                                    background: "var(--surface)",
                                    border: "1px solid var(--border)",
                                    borderRadius: 8,
                                    color: "var(--text)",
                                }}
                                itemStyle={{ color: "var(--text)" }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    <p className="insight">
                        Maior gasto: <strong>{top.name}</strong> (
                        {Math.round((top.value / total) * 100)}% das despesas)
                    </p>

                    <ul className="legend">
                        {data.map((item) => (
                            <li key={item.name}>
                                <span
                                    className="legend-dot"
                                    style={{ background: item.fill }}
                                />
                                <span className="legend-name">{item.name}</span>
                                <span className="muted">
                                    {Math.round((item.value / total) * 100)}%
                                </span>
                                <strong>{formatCurrency(item.value)}</strong>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
