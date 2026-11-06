import { formatCurrency } from "../utils/format";

export default function Summary({ income, expense, balance }) {
    return (
        <div className="summary">
            <div className="card">
                <span className="muted">Receitas</span>
                <strong className="amount positive">
                    {formatCurrency(income)}
                </strong>
            </div>
            <div className="card">
                <span className="muted">Despesas</span>
                <strong className="amount negative">
                    {formatCurrency(expense)}
                </strong>
            </div>
            <div className="card">
                <span className="muted">Saldo</span>
                <strong
                    className={`amount ${balance >= 0 ? "positive" : "negative"}`}
                >
                    {formatCurrency(balance)}
                </strong>
            </div>
        </div>
    );
}
