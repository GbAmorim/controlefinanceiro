import { CATEGORIES } from "../utils/categories";
import { formatCurrency } from "../utils/format";

export default function BudgetList({ expensesByCategory, budgets, onChange }) {
    return (
        <div className="card">
            <h2>Limites por categoria</h2>
            <p className="muted small">
                Defina um teto mensal. Deixe vazio para não ter limite.
            </p>

            <ul className="budget-list">
                {CATEGORIES.despesa.map((category) => {
                    const spent =
                        expensesByCategory.find((c) => c.name === category)
                            ?.value || 0;
                    const limit = budgets[category] || 0;
                    const pct = limit > 0 ? (spent / limit) * 100 : 0;
                    const status =
                        pct > 100 ? "over" : pct >= 80 ? "warning" : "ok";

                    return (
                        <li key={category} className="budget-item">
                            <div className="budget-top">
                                <div>
                                    <div>{category}</div>
                                    <div className="muted small">
                                        {formatCurrency(spent)}
                                        {limit > 0 &&
                                            ` de ${formatCurrency(limit)}`}
                                    </div>
                                </div>
                                <input
                                    type="number"
                                    min="0"
                                    step="10"
                                    value={limit || ""}
                                    onChange={(e) =>
                                        onChange(
                                            category,
                                            Number(e.target.value),
                                        )
                                    }
                                    placeholder="Limite"
                                />
                            </div>

                            {limit > 0 && (
                                <div className="progress">
                                    <div
                                        className={`progress-fill ${status}`}
                                        style={{
                                            width: `${Math.min(pct, 100)}%`,
                                        }}
                                    />
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
