import { useState } from "react";
import { formatCurrency, formatDate, formatMonthLabel } from "../utils/format";
import { getAvailableMonths } from "../utils/calculations";

const PAGE_SIZE = 15;

export default function TransactionList({ transactions, onRemove }) {
    const [month, setMonth] = useState("todos");
    const [visible, setVisible] = useState(PAGE_SIZE);

    if (transactions.length === 0) {
        return (
            <div className="card">
                <h2>Transações</h2>
                <p className="muted">
                    Nenhuma transação ainda. Adicione a primeira!
                </p>
            </div>
        );
    }

    // Funil de dados: todas -> filtradas por mês -> ordenadas -> só as visíveis
    const filtered = transactions.filter(
        (t) => month === "todos" || t.date.startsWith(month),
    );
    const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));
    const shown = sorted.slice(0, visible);
    const remaining = sorted.length - shown.length;

    function handleMonthChange(newMonth) {
        setMonth(newMonth);
        setVisible(PAGE_SIZE); // ao trocar o filtro, volta para a 1ª "página"
    }

    return (
        <div className="card">
            <div className="list-header">
                <h2>Transações</h2>
                <select
                    className="month-select"
                    value={month}
                    onChange={(e) => handleMonthChange(e.target.value)}
                >
                    <option value="todos">Todos os meses</option>
                    {getAvailableMonths(transactions).map((m) => (
                        <option key={m} value={m}>
                            {formatMonthLabel(m)}
                        </option>
                    ))}
                </select>
            </div>

            {sorted.length === 0 ? (
                <p className="muted">Nenhuma transação neste mês.</p>
            ) : (
                <>
                    <ul className="transaction-list">
                        {shown.map((t) => (
                            <li key={t.id} className="transaction-item">
                                <div>
                                    <strong>{t.description}</strong>
                                    <div className="muted small">
                                        {t.category} · {formatDate(t.date)}
                                    </div>
                                </div>
                                <div className="transaction-right">
                                    <span
                                        className={`amount ${t.type === "receita" ? "positive" : "negative"}`}
                                    >
                                        {t.type === "receita" ? "+" : "-"}{" "}
                                        {formatCurrency(t.amount)}
                                    </span>
                                    <button
                                        className="remove-btn"
                                        onClick={() => onRemove(t.id)}
                                        aria-label={`Remover ${t.description}`}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <p className="muted small">
                        Mostrando {shown.length} de {sorted.length}
                    </p>

                    {remaining > 0 && (
                        <button
                            className="ghost-btn more-btn"
                            onClick={() => setVisible((v) => v + PAGE_SIZE)}
                        >
                            Mostrar mais {Math.min(PAGE_SIZE, remaining)}
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
