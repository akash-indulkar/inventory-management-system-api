# 📦 Inventory Management System API

A RESTful Inventory Management System built with Node.js, Express, Prisma, MySQL, JWT authentication and Docker. It provides APIs for managing Admins, Suppliers, Products, and Reports with robust validation and authentication.

🔗 **Live Demo:** [https://ims-api.akashindulkar.in](https://ims-api.akashindulkar.in)

---

## 🚀 Features

- Email OTP verification for signup and password reset
- JWT-based authentication
- Supplier CRUD operations
- Product CRUD operations with stock management
- Reports:
  - Products below `low_stock_threshold`
  - Products grouped by suppliers
- Request validation using **Zod**
- Database management with **Prisma ORM** and **MySQL**
- Fully tested with **Jest + Supertest**
- Dockerized with **Docker & Docker-Compose**
- Deployed on **AWS** with **Nginx proxy**

---

## 📁 Project Structure

```
inventory-management-system-api/
├── src/
│   ├── @types/              # types
│   ├── config/              # DB, Redis, Mailer, JWT config
│   ├── controllers/         # Route controllers
│   ├── DTO/                 # Data transfer objects interfaces
│   ├── middlewares/         # Authentication, Validation
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic & DB operations
│   ├── utils/               # Helper functions
│   │   └── mapper/          # DTO object mappers
│   ├── validators/          # zod schema
│   ├── app.ts               # Express app definition
│   └── server.ts            # app entry
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # DB migrations
├── tests/                   # Unit tests
├── .env.example             # Environment variable template
├── Dockerfile               # Dockerfile for the app
├── docker-compose.yml       # Docker compose file for app
├── openapi.yaml             # OpenAPI specification
├── package.json
├── tsconfig.json
├── jest.config.ts           # jest configuration
└── README.md
```

---

## 🛠️ Setup & Run Locally

### 1. Clone the repo

```bash
git clone https://github.com/akash-indulkar/inventory-management-system-api.git
cd inventory-management-system-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root (refer `.env.example`)

### 4. Run database migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the server

```bash
npm run dev
```

**--OR--**

### Run with docker compose:

```bash
docker-compose up --build
```

Server will be running at:  
👉 **http://localhost:3000**

---

## 📑 API Endpoints

⚠️ **All endpoints (except admin signup, login, and password reset) require a valid JWT:**

```
Authorization: Bearer <token>
```

### 🔑 Admin

- `POST /admin/signup` → Register new admin, sends OTP to email
- `POST /admin/signup/verify` → Verify OTP & create admin, return JWT token
- `POST /admin/login` → Login admin, return JWT token
- `POST /admin/password-reset/request` → Request OTP for password reset
- `POST /admin/password-reset/confirm` → Confirm OTP and reset password
- `GET /admin/profile` → Get admin profile

### 👥 Suppliers

- `POST /supplier` → Add new supplier
- `GET /supplier` → Get all suppliers
- `GET /supplier/:id` → Get supplier by ID
- `PUT /supplier/:id` → Update supplier
- `DELETE /supplier/:id` → Delete supplier

### 📦 Products

- `POST /products` → Add new product
- `GET /products` → Get all products
- `GET /products/:id` → Get product by ID
- `PUT /products/:id` → Update product
- `DELETE /products/:id` → Delete product
- `PATCH /products/:id/increase` → Increase stock
- `PATCH /products/:id/decrease` → Decrease stock

### 📊 Reports

- `GET /reports/stock` → Get products which are below low_stock_threshold
- `GET /reports/suppliers` → Get products grouped by supplier

## 📬 Postman Collection

You can explore and test the APIs using the Postman Collection:

[Open Postman Collection](https://www.postman.com/lunar-module-saganist-87648693/workspace/public-space/collection/28815450-f56279d4-b14a-4ccb-a087-ac01d93bb62e?action=share&creator=28815450)

**OpenAPI Specification:** Check `openapi.yaml` in the root folder

---

## 🧪 Running Tests

This project uses **Jest + Supertest** for unit testing.

**Run tests:**

```bash
npm run test
```

**Run with open handle detection:**

```bash
npx jest --detectOpenHandles
```

---

## 📝 Assumptions & Design Choices

- **JWT Authentication:** All protected routes require a valid token.
- **Mocking in Tests:** Prisma, Redis, and Email services are mocked in tests for isolation.
- **Validation:** All request bodies are validated with Zod before hitting controllers.
- **Database:** MySQL is the target DB, but Prisma allows easy migration to other databases.
- **Scalability:** Project structured with controllers, services, routes, and middlewares for clean separation.

## ✅ Status

- ✅ Admin authentication & OTP
- ✅ Supplier CRUD
- ✅ Product CRUD + Stock management
- ✅ low_stock_threshold Reports
- ✅ Jest + Supertest tests
- ✅ Dockerized & deployed on AWS
