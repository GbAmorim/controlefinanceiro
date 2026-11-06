import { useState } from "react";

export default function Login({ onSignIn, onSignUp }) {
    const [mode, setMode] = useState("entrar"); // "entrar" ou "criar"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null); // { type, text }
    const [busy, setBusy] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setBusy(true);
        setMessage(null);

        if (mode === "entrar") {
            const error = await onSignIn(email, password);
            if (error) setMessage({ type: "error", text: error });
        } else {
            const { error, needsConfirmation } = await onSignUp(
                email,
                password,
            );
            if (error) {
                setMessage({ type: "error", text: error });
            } else if (needsConfirmation) {
                setMessage({
                    type: "info",
                    text: "Conta criada! Confirme pelo e-mail que enviamos e depois entre.",
                });
            }
        }

        setBusy(false);
    }

    return (
        <div className="container login-wrap">
            <h1>Minhas Finanças</h1>

            <form className="card form" onSubmit={handleSubmit}>
                <h2>{mode === "entrar" ? "Entrar" : "Criar conta"}</h2>

                <label>
                    E-mail
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>

                <label>
                    Senha
                    <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>

                {message && (
                    <div className={`msg ${message.type}`}>{message.text}</div>
                )}

                <button type="submit" className="submit-btn" disabled={busy}>
                    {busy
                        ? "Aguarde..."
                        : mode === "entrar"
                          ? "Entrar"
                          : "Criar conta"}
                </button>

                <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                        setMode(mode === "entrar" ? "criar" : "entrar");
                        setMessage(null);
                    }}
                >
                    {mode === "entrar"
                        ? "Não tem conta? Criar agora"
                        : "Já tem conta? Entrar"}
                </button>
            </form>
        </div>
    );
}
