import { useState } from "react";
import { CATEGORIES } from "../utils/categories";
import { todayISO } from "../utils/format";

export default function TransactionForm({ onAdd }) {
    const [type, setType] = useState("despesa");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState(CATEGORIES.despesa[0]);
    const [date, setDate] = useState(todayISO());

    // Ao trocar receita/despesa, a lista de categorias muda,
    // então precisamos escolher uma categoria válida para o novo tipo.
    function handleTypeChange(newType) {
        setType(newType);
        setCategory(CATEGORIES[newType][0]);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const value = Number(amount);
        if (!description.trim() || !(value > 0)) return;

        const ok = await onAdd({
            type,
            description: description.trim(),
            amount: value,
            category,
            date,
        });

        // Só limpa se o banco confirmou
        if (ok) {
            setDescription("");
            setAmount("");
        }
    }

    return (
        <form className="card form" onSubmit={handleSubmit}>
            <h2>Nova transação</h2>

            <div className="type-toggle">
                <button
                    type="button"
                    className={type === "despesa" ? "active negative-bg" : ""}
                    onClick={() => handleTypeChange("despesa")}
                >
                    Despesa
                </button>
                <button
                    type="button"
                    className={type === "receita" ? "active positive-bg" : ""}
                    onClick={() => handleTypeChange("receita")}
                >
                    Receita
                </button>
            </div>

            <label>
                Descrição
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex.: Mercado"
                />
            </label>

            <label>
                Valor (R$)
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                />
            </label>

            <label>
                Categoria
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {CATEGORIES[type].map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Data
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </label>

            <button type="submit" className="submit-btn">
                Adicionar
            </button>
        </form>
    );
}
