export const CATEGORIES = {
    despesa: [
        "Moradia",
        "Alimentação",
        "Transporte",
        "Saúde",
        "Lazer",
        "Compras",
        "Educação",
        "Contas e assinaturas",
        "Outros",
    ],
    receita: ["Salário", "Freelance", "Investimentos", "Outros"],
};

// Categorias onde é mais fácil cortar gastos.
// Moradia, Saúde, Educação e Transporte ficam de fora: costumam ser fixas.
export const FLEXIBLE_CATEGORIES = [
    "Alimentação",
    "Lazer",
    "Compras",
    "Contas e assinaturas",
    "Outros",
];
