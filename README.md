# Minhas Finanças

Aplicativo web de controle financeiro pessoal. Cadastre receitas e despesas, acompanhe para onde o dinheiro está indo em gráficos claros, defina metas de economia e limites por categoria e receba dicas de onde cortar gastos.

Todas as análises e dicas são calculadas por regras simples em código. O projeto **não usa nenhuma API de IA**.

> **Demo:** https://controlefinanceiro-zeta-peach.vercel.app/

<!-- Dica: adicione aqui um print da tela. Ex.: ![Tela principal](docs/screenshot.png) -->

## Funcionalidades

- **Login e dados por usuário:** cada pessoa tem sua conta e só enxerga os próprios dados.
- **Receitas e despesas:** cadastro com descrição, valor, categoria e data.
- **Resumo:** total de receitas, despesas e saldo.
- **Gráfico de gastos por categoria:** rosca com seletor de mês, legenda com percentuais e destaque da categoria de maior gasto.
- **Receitas vs. despesas:** gráfico de barras dos últimos 6 meses.
- **Meta de economia mensal:** barra de progresso baseada no saldo do mês.
- **Limites por categoria:** barras que ficam amarelas a partir de 80% e vermelhas ao passar do limite.
- **Onde economizar:** dicas geradas por regras (saldo negativo, meta não atingida, categoria acima do limite, categoria que subiu mais de 20% em relação ao mês anterior).
- **Lista de transações:** filtro por mês, paginação ("Mostrar mais") e remoção.
- **Temas de cor:** Claro, Escuro, Oceano e Rosa, escolhidos em um menu de engrenagem e lembrados pelo navegador.
- **Responsivo:** funciona em celular, tablet e desktop.

## Tecnologias

- [React](https://react.dev/) com JavaScript
- [Vite](https://vite.dev/) como ferramenta de build
- [Recharts](https://recharts.org/) para os gráficos
- [Supabase](https://supabase.com/) para banco de dados (PostgreSQL) e autenticação
- [lucide-react](https://lucide.dev/) para ícones
- CSS puro com variáveis (temas)
- ESLint para análise de código
- [Vercel](https://vercel.com/) para publicação

## Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- Uma conta gratuita no [Supabase](https://supabase.com/)

### 1. Clonar e instalar

```bash
git clone https://github.com/SEU_USUARIO/financas.git
cd financas
npm install
```

### 2. Configurar o Supabase

Crie um projeto no Supabase e, no **SQL Editor**, execute:

```sql
-- Tabela de transações
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users(id) on delete cascade,
  type text not null check (type in ('receita', 'despesa')),
  description text not null,
  amount numeric(12,2) not null check (amount > 0),
  category text not null,
  date date not null,
  created_at timestamptz not null default now()
);

-- Configurações (uma linha por usuário)
create table settings (
  user_id uuid primary key default auth.uid()
    references auth.users(id) on delete cascade,
  savings_goal numeric(12,2) not null default 0,
  budgets jsonb not null default '{}'
);

-- Segurança por linha (RLS)
alter table transactions enable row level security;
alter table settings enable row level security;

create policy "transacoes do proprio usuario" on transactions
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "configuracoes do proprio usuario" on settings
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
```

Durante o desenvolvimento, se quiser testar sem confirmar e-mail, desative **Confirm email** em **Authentication → Providers → Email**. Reative antes de abrir o app para outras pessoas.

### 3. Variáveis de ambiente

Na raiz do projeto, crie o arquivo `.env.local`:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica
```

Os valores ficam em **Project Settings → API** no painel do Supabase. Use a chave pública (*anon* ou *publishable*). Nunca use a chave `service_role` no frontend.

O arquivo `.env.local` já é ignorado pelo Git e não deve ser enviado ao repositório.

### 4. Iniciar

```bash
npm run dev
```

Abra o endereço exibido no terminal (normalmente `http://localhost:5173`).

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção na pasta `dist` |
| `npm run preview` | Serve localmente a versão de produção |
| `npm run lint` | Verifica o código com o ESLint |

## Estrutura do projeto

```
src/
  components/     Peças visuais (formulário, gráficos, cards, login...)
  hooks/          Lógica reutilizável (useAuth, useTheme, useTransactions, useSettings)
  lib/            Conexão com o Supabase
  utils/          Funções puras: cálculos, formatação, categorias, temas e regras de dicas
  App.jsx         Decide entre tela de login e painel
  Dashboard.jsx   Tela principal do usuário logado
  index.css       Estilos globais e temas
```

Decisões de arquitetura:

- **Estado no componente pai:** os dados ficam em hooks e descem por props aos componentes.
- **Dados derivados são calculados, não guardados:** saldo, totais e dicas são recalculados a partir das transações.
- **Lógica separada da tela:** os cálculos em `utils/` são funções puras, fáceis de entender e testar.
- **Segurança no banco:** o isolamento entre usuários é garantido por RLS no Supabase, não pelo código do frontend.

## Como personalizar

**Adicionar ou trocar um tema:**
1. Inclua o tema em `src/utils/themes.js`.
2. Crie o bloco `[data-theme="nome"]` em `src/index.css`, definindo as mesmas variáveis dos outros temas.

**Alterar categorias:** edite `src/utils/categories.js`. A lista `FLEXIBLE_CATEGORIES` define onde o app sugere cortes primeiro.

**Criar ou ajustar dicas:** as regras ficam em `src/utils/insights.js`, cada uma em um bloco `if` independente.

## Publicação (Vercel)

1. Envie o código para um repositório no GitHub.
2. Na Vercel, importe o repositório (o Vite é detectado automaticamente).
3. Cadastre as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
4. No Supabase, em **Authentication → URL Configuration**, configure o **Site URL** com o endereço da Vercel e adicione-o, junto com `http://localhost:5173`, nas **Redirect URLs**.

As variáveis `VITE_*` são embutidas durante o build: ao alterá-las, é necessário um novo deploy.

## Limitações conhecidas

- Por padrão, o Supabase devolve no máximo 1000 linhas por consulta, então contas com muito histórico podem ter transações antigas fora dos totais.
- Ainda não é possível editar uma transação (apenas remover e cadastrar de novo).
- Valores em reais (BRL).

## Ideias para o futuro

- Editar transações
- Exportar para CSV/Excel
- Transações recorrentes (aluguel, assinaturas)
- Tratamento do limite de 1000 linhas
- Instalação como PWA no celular

## Licença

Projeto pessoal de estudo.
