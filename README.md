# 🍕 LanchApp - API de Delivery

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-729B1B?style=for-the-badge&logo=vitest&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3068B7?style=for-the-badge&logo=zod&logoColor=white)

> Backend completo para gestão de pedidos de uma lanchonete/pizzaria, focado em segurança, testes automatizados e arquitetura escalável.

---

## 💻 Sobre o Projeto

Este projeto simula um cenário real de **Food Delivery**. A aplicação permite que clientes façam pedidos (Delivery, Retirada ou Mesa), acompanhem o status em tempo real e gerenciem seus endereços. Para o estabelecimento, o sistema oferece controle total do cardápio e um fluxo de pedidos otimizado para a cozinha.

O foco principal foi aplicar **Clean Code**, arquitetura em camadas, testes de integração e validações rigorosas de segurança.

## 🚀 Diferenciais de Engenharia (Production Ready)

Para elevar o nível de escalabilidade e confiabilidade, foram implementados os seguintes padrões:

### ⚡ Performance com Redis (Cache-Aside Pattern)

Otimização de rotas críticas de consulta para reduzir a carga no banco de dados e o tempo de resposta.

- **Latência Reduzida:** Respostas de categorias e produtos caíram de ~180ms para **<10ms**.
- **Estratégia de Invalidação:** Implementação de limpeza seletiva de cache (`Purge`) em eventos de mutação (Create, Update, Delete) para garantir a consistência dos dados (Data Integrity).

### 🛡️ Resiliência e Segurança de API

- **Rate Limiting:** Camada de proteção contra ataques de força bruta e DoS, limitando requisições abusivas por IP.
- **Global Error Handler:** Middleware centralizado para tratamento de exceções, evitando que falhas exponham detalhes da infraestrutura e garantindo respostas padronizadas.
- **Proteção contra IDOR:** Validações de propriedade de recursos, impedindo que usuários manipulem dados de terceiros.

### 📊 Observabilidade e Logs Estruturados

- Implementação do **Winston Logger** para monitoramento de saúde da aplicação.
- Logs categorizados por níveis (`info`, `warn`, `error`, `http`) com persistência em arquivos rotativos para auditoria e depuração pós-erro.

### 🐳 Infraestrutura como Código (Docker)

- Ambiente 100% conteinerizado com **Docker Compose**, orquestrando PostgreSQL e Redis para garantir paridade total entre os ambientes de desenvolvimento, teste e produção.

---

## ⚙️ Funcionalidades

### 🔐 Autenticação e Segurança Avançada

- [x] Cadastro e Login com **JWT** e Bcrypt.
- [x] **Proteção contra IDOR:** Usuários só podem manipular seus próprios dados (pedidos, endereços).
- [x] **Integridade Financeira:** O preço do item é buscado no banco (evita manipulação via front-end).
- [x] Validação rigorosa de dados de entrada com **Zod**.

### 📦 Gestão de Produtos (Cardápio)

- [x] Cadastro de Categorias e Produtos.
- [x] Upload de imagens (Banner) com Multer.
- [x] Listagem otimizada por categorias.

### 🛒 Pedidos (Core)

- [x] Criação de pedidos complexos (múltiplos itens).
- [x] Sistema de **Rascunho (Draft)**: O pedido começa como um carrinho e só é enviado após confirmação.
- [x] Regras de negócio para **Delivery** (exige endereço) e **Dine-in** (exige mesa).
- [x] Validação de estoque e disponibilidade.

### 🍳 Painel Administrativo / Cozinha

- [x] Controle de status: `PENDING` -> `IN_PREPARATION` -> `READY` -> `ON_THE_WAY` -> `FINISHED`.
- [x] Apenas usuários com permissão ADMIN podem alterar status de pedidos.

---

## 🛠 Tecnologias Utilizadas

- **[Node.js](https://nodejs.org/en/)** & **[Express](https://expressjs.com/)**
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática.
- **[Prisma ORM](https://www.prisma.io/)** - Modelagem de dados e Migrations.
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados.
- **[Vitest](https://vitest.dev/)** - Testes de Integração e E2E.
- **[Zod](https://zod.dev/)** - Validação de Schemas.
- **[Swagger UI](https://swagger.io/)** - Documentação interativa.
- **[Winston](https://www.npmjs.com/package/winston)** para logging profissional.
- **[Express-rate-limit](https://www.npmjs.com/package/express-rate-limit)** para segurança de tráfego.
- **[Multer](https://github.com/expressjs/multer)** - Upload de arquivos.

---

## 🚀 Como Executar

### Pré-requisitos

- Docker e Docker Compose instalados.

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone (https://github.com/JudsonCiribelli/LanchApp)
   ```
2. **Suba a infraestrutura (Postgres & Redis)**
   ```bash
   docker compose up -d
   ```
3. **Configure as variáveis de ambiente**

````Crie um arquivo .env baseado no .env.example.
4. **Instale as dependências e rode o projeto**
```bash
npm install
npx prisma migrate dev
npm run dev
````

## 📚 Documentação da API (Swagger)

- [x] A API possui documentação interativa completa. Após rodar o projeto, acesse: (http://localhost:3/api-docs)

- Desenvolvido por Judson Rodrigues Ciribelli Filho 🚀
