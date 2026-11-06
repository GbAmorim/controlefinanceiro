// Intl.NumberFormat formata números conforme o país/idioma
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

export function formatCurrency(value) {
    return currencyFormatter.format(value);
}

// "2026-11-05" -> "05/11/2026"
// Separamos a string manualmente de propósito: criar um Date a partir
// dela pode errar o dia por causa de fuso horário.
export function formatDate(isoDate) {
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
}

// Data de hoje no formato "AAAA-MM-DD" usando o fuso LOCAL.
// (toISOString sozinho usa UTC e, à noite no Brasil, retornaria "amanhã".)
export function todayISO() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
}

const MONTH_NAMES = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
];

// "2026-11" -> "nov/26"
export function formatMonthLabel(monthKey) {
    const [year, month] = monthKey.split("-");
    return `${MONTH_NAMES[Number(month) - 1]}/${year.slice(2)}`;
}

// Mês atual no formato "AAAA-MM"
export function currentMonthKey() {
    return todayISO().slice(0, 7);
}
