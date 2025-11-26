# 🍕 LanchApp - API de Delivery

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

> Backend completo para gestão de pedidos de uma lanchonete/pizzaria, controlando desde o cadastro de usuários e produtos até o fluxo de entrega e acompanhamento de status em tempo real.

---

## 💻 Sobre o Projeto

Este projeto foi desenvolvido com o objetivo de simular um cenário real de **Food Delivery**. A aplicação permite que clientes façam pedidos (escolhendo entre Delivery ou Retirada), acompanhem o status e gerenciem seus endereços. Para o estabelecimento, o sistema oferece controle de cardápio, gestão de categorias e uma fila de pedidos para a cozinha.

O foco principal foi aplicar os princípios de **Clean Code**, arquitetura em camadas e modelagem de dados relacional robusta.

---

## ⚙️ Funcionalidades

### 🔐 Autenticação e Segurança

- [x] Cadastro de usuários com criptografia de senha (Bcrypt).
- [x] Login e Autenticação via Token JWT.
- [x] Middlewares para proteção de rotas (apenas usuários logados acessam recursos críticos).
- [x] Recuperação de perfil do usuário logado.

### 📦 Gestão de Produtos (Cardápio)

- [x] Cadastro de Categorias.
- [x] Cadastro de Produtos com upload de imagem (Banner).
- [x] Listagem de produtos filtrados por categoria.

### 📍 Endereços

- [x] Cadastro de múltiplos endereços por usuário.
- [x] Validação de endereços para pedidos do tipo Delivery.

### 🛒 Pedidos (O Coração da Aplicação)

- [x] Criação de pedidos com itens múltiplos.
- [x] Suporte a diferentes tipos de pedido: **Delivery**, **Retirada (Pickup)** e **Mesa (Dine-in)**.
- [x] Validação de regras de negócio (ex: Delivery exige endereço, Mesa exige número da mesa).
- [x] Histórico de pedidos do usuário.
- [x] Detalhes completos de um pedido específico.

### 🍳 Painel da Cozinha / Admin

- [x] Listagem de todos os pedidos em aberto.
- [x] Fluxo de atualização de status: `PENDING` -> `IN_PREPARATION` -> `READY` -> `ON_THE_WAY` -> `FINISHED`.

---

## 🛠 Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias:

- **[Node.js](https://nodejs.org/en/)** - Runtime JavaScript.
- **[Express](https://expressjs.com/)** - Framework para construção da API.
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JS para tipagem estática e código mais seguro.
- **[Prisma ORM](https://www.prisma.io/)** - ORM moderno para interação com o banco de dados.
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional.
- **[Multer](https://github.com/expressjs/multer)** - Para upload de arquivos (imagens dos produtos).
- **[JWT](https://jwt.io/)** - Para autenticação segura.
- **[Cors](https://www.npmjs.com/package/cors)** - Para permitir requisições externas.

---

## 🗄️ Modelagem de Dados

O banco de dados foi estruturado para garantir a integridade das informações, especialmente no histórico de preços dos pedidos.

_Principais Relacionamentos:_

- **User** 1:N **Orders**
- **User** 1:N **Addresses**
- **Category** 1:N **Products**
- **Order** N:N **Products** (através da tabela pivô **Items**)

> _Destaque:_ A tabela de Itens armazena o preço histórico do produto no momento da compra, evitando inconsistências financeiras caso o preço do produto mude futuramente.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/).
Além disso é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/).

### 🎲 Rodando a API (Servidor)

```bash
# Clone este repositório
$ git clone [https://github.com/](https://github.com/)[SEU_USUARIO]/[NOME_DO_REPO].git

# Acesse a pasta do projeto no terminal/cmd
$ cd [NOME_DO_REPO]

# Instale as dependências
$ npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env na raiz do projeto e preencha conforme o .env.example
# Exemplo: DATABASE_URL="postgresql://user:password@localhost:5432/pizzaria?schema=public"
# Exemplo: JWT_SECRET="sua_chave_secreta"

# Execute as Migrations do Prisma para criar as tabelas
$ npx prisma migrate dev

# Execute a aplicação em modo de desenvolvimento
$ npm run dev

# O servidor iniciará na porta:3333 - acesse <http://localhost:3333>
```
