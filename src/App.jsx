import { useTheme } from "./hooks/useTheme";
import { useAuth } from "./hooks/useAuth";
import Login from "./components/Login";
import Dashboard from "./Dashboard";

export default function App() {
    const { theme, setTheme } = useTheme();
    const { session, loading, signIn, signUp, signOut } = useAuth();

    if (loading) {
        return (
            <div className="container">
                <p className="muted">Carregando...</p>
            </div>
        );
    }

    // Sem sessão: mostra o login. Com sessão: mostra o app.
    if (!session) {
        return <Login onSignIn={signIn} onSignUp={signUp} />;
    }

    return (
        <Dashboard
            session={session}
            theme={theme}
            setTheme={setTheme}
            onSignOut={signOut}
        />
    );
}
