import { formatCurrency } from "../utils/format";

export default function SavingsGoal({ goal, saved, onChange }) {
    // Limita entre 0 e 100 para a barra nunca "vazar" nem ficar negativa
    const progress =
        goal > 0 ? Math.max(0, Math.min(100, (saved / goal) * 100)) : 0;
    const reached = goal > 0 && saved >= goal;

    return (
        <div className="card">
            <h2>Meta de economia</h2>

            <label className="inline-field">
                Quanto quero guardar por mês (R$)
                <input
                    type="number"
                    min="0"
                    step="10"
                    value={goal || ""}
                    onChange={(e) => onChange(Number(e.target.value))}
                    placeholder="0,00"
                />
            </label>

            {goal > 0 ? (
                <>
                    <div className="progress">
                        <div
                            className={`progress-fill ${reached ? "ok" : ""}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="muted small">
                        Guardado no mês: {formatCurrency(saved)} de{" "}
                        {formatCurrency(goal)} ({Math.round(progress)}%)
                    </p>
                </>
            ) : (
                <p className="muted small">
                    Defina um valor para acompanhar seu progresso no mês.
                </p>
            )}
        </div>
    );
}
