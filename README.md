# Mercadinho do Povo – Admin

Aplicação full-stack para gestão de estoque da mercearia com backend Spring Boot + MySQL e frontend React inspirado no layout fornecido. O painel permite listar, cadastrar, editar e ajustar rapidamente o estoque de produtos.

## Credenciais

A tela de login funciona apenas como bloqueio visual (sem autenticação real). Utilize o usuário padrão abaixo:

- **Usuário:** `admin`
- **Senha:** `123456`

> Qualquer combinação não vazia também é aceita, mas estas credenciais são recomendadas para documentação.

## Stack

- Java 17 / Spring Boot 3.2 / Spring Data JPA / Validation
- MySQL 8 (ou compatível)
- Vite + React 18 + Axios + React Icons

## Pré-requisitos

- Java 17 e Maven 3.9+
- Node.js 18+ e npm
- MySQL em execução (usuário `root`, senha `Samuel57@`)

## Backend

Configurações principais em `backend/src/main/resources/application.properties`. O datasource aponta para `jdbc:mysql://localhost:3306/mercadinho_admin` e cria o banco automaticamente.

### Rodando o backend

```bash
cd backend
mvn spring-boot:run
```

Ao iniciar, um `DataSeeder` popula alguns produtos demo. Ajuste/disable via `backend/src/main/java/com/mercadinho/config/DataSeeder.java`.

### Endpoints principais (`/api/products`)

- `GET /` – lista produtos
- `GET /{id}` – detalhes
- `POST /` – cria produto
- `PUT /{id}` – atualiza produto
- `PATCH /{id}/quantity` – altera quantidade
- `DELETE /{id}` – remove produto

## Frontend

Código em `frontend/`. O Vite proxy redireciona `/api` para `http://localhost:8080`.

### Rodando o frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`. Após o “login”, você verá o dashboard com tabela, botões de venda rápida e modal de cadastro igual ao mockup.

## Ajustes úteis

- Para apontar o frontend para outra URL, defina `VITE_API_URL` (ex.: `VITE_API_URL=https://seuservidor/api/products npm run dev`).
- Para desativar o seeder em produção, execute o backend com o profile `prod`: `mvn spring-boot:run -Dspring-boot.run.profiles=prod`.
- O CORS permite `http://localhost:5173` e `http://localhost:3000`. Adicione origens extras via `app.cors.allowed-origins` no `application.properties`.

Para visualizar a organização completa dos diretórios e arquivos, consulte [`STRUCTURE.md`](STRUCTURE.md).

Sinta-se à vontade para evoluir com autenticação real, dashboards adicionais ou relatórios.
