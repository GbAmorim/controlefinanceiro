import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1) Ao abrir o app, verifica se já existe um login salvo
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false);
        });

        // 2) Fica "ouvindo": avisa quando a pessoa entra ou sai
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
        });

        // Função de limpeza: roda quando o componente sai da tela
        return () => subscription.unsubscribe();
    }, []);

    // Retorna a mensagem de erro, ou null se deu certo
    async function signIn(email, password) {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return error ? error.message : null;
    }

    async function signUp(email, password) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) return { error: error.message };
        // Sem sessão = o Supabase está pedindo confirmação por e-mail
        return { error: null, needsConfirmation: !data.session };
    }

    async function signOut() {
        await supabase.auth.signOut();
    }

    return { session, loading, signIn, signUp, signOut };
}
