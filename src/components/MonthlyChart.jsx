import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { getMonthlySummary } from "../utils/calculations";
import { formatCurrency, formatMonthLabel } from "../utils/format";

export default function MonthlyChart({ transactions }) {
    const data = getMonthlySummary(transactions, 6).map((m) => ({
        ...m,
        label: formatMonthLabel(m.key),
    }));

    const axisStyle = { fill: "var(--text-muted)", fontSize: 12 };

    return (
        <div className="card">
            <h2>Receitas vs. despesas</h2>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                    <CartesianGrid stroke="var(--border)" vertical={false} />
                    <XAxis
                        dataKey="label"
                        tick={axisStyle}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={axisStyle}
                        axisLine={false}
                        tickLine={false}
                        width={55}
                        tickFormatter={(v) =>
                            v >= 1000 ? `${+(v / 1000).toFixed(1)}k` : v
                        }
                    />
                    <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        cursor={{ fill: "var(--border)", opacity: 0.4 }}
                        contentStyle={{
                            background: "var(--surface)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                        }}
                        labelStyle={{ color: "var(--text)" }}
                    />
                    <Legend wrapperStyle={{ fontSize: 13 }} />
                    <Bar
                        dataKey="receitas"
                        name="Receitas"
                        fill="var(--positive)"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="despesas"
                        name="Despesas"
                        fill="var(--negative)"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
