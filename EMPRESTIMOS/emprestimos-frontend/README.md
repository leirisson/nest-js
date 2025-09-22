# Sistema de Empréstimos - Frontend

Frontend do sistema de gestão de empréstimos desenvolvido em React com TypeScript.

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Material-UI (MUI)** - Biblioteca de componentes React
- **React Router** - Roteamento para aplicações React
- **TanStack Query** - Gerenciamento de estado do servidor
- **Axios** - Cliente HTTP para requisições à API
- **Vite** - Build tool e dev server

## 📋 Funcionalidades

### 🔐 Autenticação
- Login de usuários
- Controle de sessão
- Rotas protegidas
- Diferentes níveis de acesso (admin/user)

### 👥 Gestão de Clientes
- Cadastro de clientes
- Edição de informações
- Listagem com filtros e paginação
- Validação de CPF e dados

### 💰 Gestão de Empréstimos
- Criação de empréstimos
- Cálculo automático de parcelas
- Acompanhamento de status
- Histórico completo

### 💳 Gestão de Pagamentos
- Registro de pagamentos
- Diferentes métodos de pagamento
- Controle de parcelas em atraso
- Histórico de transações

### 🧾 Recibos
- Geração automática de recibos
- Visualização detalhada
- Download em PDF
- Impressão

### 📊 Dashboard
- Estatísticas em tempo real
- Gráficos de performance
- Resumo financeiro
- Atividades recentes

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- API backend rodando

### Passos para instalação

1. **Instale as dependências**
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente**
   Edite o arquivo `.env` com as configurações corretas:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_APP_NAME=Sistema de Empréstimos
   VITE_APP_VERSION=1.0.0
   ```

3. **Execute o projeto**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**
   - Abra o navegador em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout.tsx      # Layout principal da aplicação
│   └── ProtectedRoute.tsx # Componente de rota protegida
├── contexts/           # Contextos React
│   └── AuthContext.tsx # Contexto de autenticação
├── hooks/              # Hooks customizados
│   └── useApi.ts       # Hooks para integração com API
├── pages/              # Páginas da aplicação
│   ├── Login.tsx       # Página de login
│   ├── Dashboard.tsx   # Dashboard principal
│   ├── Clientes.tsx    # Gestão de clientes
│   ├── Emprestimos.tsx # Gestão de empréstimos
│   ├── Pagamentos.tsx  # Gestão de pagamentos
│   └── Recibos.tsx     # Visualização de recibos
├── services/           # Serviços de API
│   └── api.ts          # Configuração e métodos da API
├── types/              # Definições de tipos TypeScript
│   └── index.ts        # Tipos da aplicação
├── utils/              # Funções utilitárias
│   └── index.ts        # Formatação, validação, etc.
├── App.tsx             # Componente principal
└── main.tsx            # Ponto de entrada da aplicação
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 🌐 Integração com API

O frontend se comunica com a API backend através dos seguintes endpoints:

- **Autenticação**: `/auth/login`, `/auth/me`
- **Clientes**: `/clients` (CRUD completo)
- **Empréstimos**: `/loans` (CRUD completo)
- **Parcelas**: `/installments`
- **Pagamentos**: `/payments` (CRUD completo)
- **Recibos**: `/receipts`
- **Dashboard**: `/dashboard/stats`

## 🎨 Componentes e Temas

O projeto utiliza Material-UI com tema customizado:

- **Cores primárias**: Azul (#1976d2)
- **Cores secundárias**: Rosa (#dc004e)
- **Tipografia**: Roboto
- **Responsividade**: Mobile-first

## 🔒 Segurança

- Autenticação via JWT
- Interceptadores para renovação automática de tokens
- Validação de formulários
- Sanitização de dados
- Rotas protegidas por nível de acesso

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (até 767px)

---

**Desenvolvido com ❤️ usando React + TypeScript + Material-UI**
