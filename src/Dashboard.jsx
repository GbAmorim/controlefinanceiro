import { useTransactions } from "./hooks/useTransactions";
import { useSettings } from "./hooks/useSettings";
import {
    getTotals,
    getMonthStats,
    getExpensesByCategory,
} from "./utils/calculations";
import { getInsights } from "./utils/insights";
import { currentMonthKey } from "./utils/format";
import ThemeMenu from "./components/ThemeMenu";
import Summary from "./components/Summary";
import CategoryChart from "./components/CategoryChart";
import MonthlyChart from "./components/MonthlyChart";
import SavingsGoal from "./components/SavingsGoal";
import Insights from "./components/Insights";
import BudgetList from "./components/BudgetList";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";

export default function Dashboard({ session, theme, setTheme, onSignOut }) {
    const { transactions, loading, error, addTransaction, removeTransaction } =
        useTransactions();
    const { settings, setSavingsGoal, setBudget } = useSettings(
        session.user.id,
    );

    if (loading) {
        return (
            <div className="container">
                <p className="muted">Carregando seus dados...</p>
            </div>
        );
    }

    const totals = getTotals(transactions);
    const monthKey = currentMonthKey();
    const monthStats = getMonthStats(transactions, monthKey);
    const monthExpenses = getExpensesByCategory(transactions, monthKey);
    const insights = getInsights({ transactions, monthKey, settings });

    return (
        <div className="container">
            <header className="header">
                <h1>Minhas Finanças</h1>
                <div className="header-right">
                    <span className="muted small user-email">
                        {session.user.email}
                    </span>
                    <button className="ghost-btn" onClick={onSignOut}>
                        Sair
                    </button>
                    <ThemeMenu theme={theme} onChange={setTheme} />
                </div>
            </header>

            {error && <div className="msg error">Erro: {error}</div>}

            <Summary
                income={totals.income}
                expense={totals.expense}
                balance={totals.balance}
            />

            <div className="charts-grid">
                <CategoryChart transactions={transactions} />
                <MonthlyChart transactions={transactions} />
            </div>

            <div className="goals-grid">
                <div className="stack">
                    <SavingsGoal
                        goal={settings.savingsGoal}
                        saved={monthStats.balance}
                        onChange={setSavingsGoal}
                    />
                    <Insights insights={insights} />
                </div>
                <BudgetList
                    expensesByCategory={monthExpenses}
                    budgets={settings.budgets}
                    onChange={setBudget}
                />
            </div>

            <div className="main-grid">
                <TransactionForm onAdd={addTransaction} />
                <TransactionList
                    transactions={transactions}
                    onRemove={removeTransaction}
                />
            </div>
        </div>
    );
}
