# 🍕 LanchApp - API de Delivery

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-729B1B?style=for-the-badge&logo=vitest&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3068B7?style=for-the-badge&logo=zod&logoColor=white)

> Backend completo para gestão de pedidos de uma lanchonete/pizzaria, focado em segurança, testes automatizados e arquitetura escalável.

---

## 💻 Sobre o Projeto

Este projeto simula um cenário real de **Food Delivery**. A aplicação permite que clientes façam pedidos (Delivery, Retirada ou Mesa), acompanhem o status em tempo real e gerenciem seus endereços. Para o estabelecimento, o sistema oferece controle total do cardápio e um fluxo de pedidos otimizado para a cozinha.

O foco principal foi aplicar **Clean Code**, arquitetura em camadas, testes de integração e validações rigorosas de segurança.

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
- **[Multer](https://github.com/expressjs/multer)** - Upload de arquivos.

---

## 📚 Documentação da API (Swagger)

A API possui documentação interativa completa. Após rodar o projeto, acesse:
