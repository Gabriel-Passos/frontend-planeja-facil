> Em desenvolvimento ⚠

# 💰 Planeja Fácil — Frontend

Aplicação web para controle de finanças pessoais, permitindo organizar receitas e despesas por ano e por mês, com colaboração entre múltiplos usuários por meio de papéis de acesso.

Este repositório contém o **frontend** da aplicação, consumindo a API REST do [backend](https://github.com/Gabriel-Passos/backend-planeja-facil) construído em NestJS.

---

## 🚀 Tecnologias

- **React** + **Vite**
- **TypeScript**
- **React Router v7**
- **Formik** + **Yup** — formulários e validação
- **shadcn/ui** — componentes de interface
- **Axios** — cliente HTTP com interceptor de refresh token

---

## ✨ Funcionalidades

- 🔐 Autenticação com JWT (access + refresh token via cookie `httpOnly`)
- ✉️ Confirmação de e-mail não bloqueante (usuário navega normalmente enquanto vê um aviso)
- 🔁 Recuperação e redefinição de senha
- 📅 Organização financeira por **Ano** → **Mês** → **Lançamentos** (receitas e despesas)
- 👥 Controle de acesso por papéis: **Admin**, **Editor** e **Participante**
- 💾 Autosave dos cartões de mês
- 🗑️ Exclusão suave (soft delete) com opção de restauração

---

## 📁 Estrutura de pastas

O projeto segue uma organização **baseada em features**:

```
src/
├── features/
│   ├── auth/
│   ├── years/
│   ├── month-cards/
│   └── entries/
├── shared/
│   ├── components/
│   ├── hooks/
│   └── services/
├── lib/
│   └── axios.ts       # cliente Axios + interceptor de refresh token
└── routes/
```

---

## ⚙️ Configuração e execução

### Pré-requisitos
- Node.js 18+
- Backend rodando localmente (ou URL da API configurada)

### Instalação

```bash
git clone <url-do-repositorio>
cd planeja-facil-frontend
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

### Rodando em desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Build de produção

```bash
npm run build
```

---

## 🔒 Autenticação

O fluxo de autenticação utiliza **access token** em memória e **refresh token** armazenado em cookie `httpOnly`, com rotação automática e detecção de reuso. O cliente Axios possui um interceptor que renova o access token automaticamente quando expira, enfileirando as requisições feitas durante a renovação.

---

## 📌 Status do projeto

Backend em estágio avançado de desenvolvimento. Frontend em construção — telas de autenticação, gerenciamento de anos e lançamentos financeiros sendo implementadas.

---

<p align="center">Feito com 💙 para ajudar a organizar as finanças de forma simples.</p>
