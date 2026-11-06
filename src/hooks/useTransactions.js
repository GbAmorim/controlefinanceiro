import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Carrega as transações ao abrir
    useEffect(() => {
        async function load() {
            const { data, error } = await supabase
                .from("transactions")
                .select("*")
                .order("date", { ascending: false });

            if (error) setError(error.message);
            else setTransactions(data);
            setLoading(false);
        }
        load();
    }, []);

    // Devolve true/false para o formulário saber se deu certo
    async function addTransaction(fields) {
        const { data, error } = await supabase
            .from("transactions")
            .insert(fields)
            .select()
            .single();

        if (error) {
            setError(error.message);
            return false;
        }
        setError(null);
        setTransactions((prev) => [data, ...prev]);
        return true;
    }

    async function removeTransaction(id) {
        const { error } = await supabase
            .from("transactions")
            .delete()
            .eq("id", id);

        if (error) {
            setError(error.message);
            return;
        }
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    }

    return { transactions, loading, error, addTransaction, removeTransaction };
}
