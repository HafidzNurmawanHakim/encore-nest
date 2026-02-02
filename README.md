<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <span>+</span>
  <a href="https://encore.dev" target="blank"><img src="https://encore.dev/assets/logo_dark.svg" width="120" alt="Encore Logo" /></a>
</p>

# Encore + NestJS Boilerplate

A minimalist yet powerful boilerplate combining the **Cloud Infrastructure** capabilities of [Encore](https://encore.dev) with the **Architecture** of [NestJS](https://nestjs.com).

## Project Analysis

This project integrates two powerful tools:

1.  **Encore**: Handles the API definition (Gateway), Infrastructure-as-Code (IaC), and distributed tracing.
2.  **NestJS**: Manages the application logic, Dependency Injection (DI), and module organization.

**Key Characteristic**:

- **Hybrid Entry Point**: The entry point is `src/encore.service.ts` which initializes the NestJS `ApplicationContext`. Encore handles the HTTP layer, and requests are proxied to NestJS services via function calls.
- **DTOs**: Uses Classes with `class-validator` decorators for runtime validation.

## Project Setup

```bash
$ npm install
```

## Running the Project

```bash
# Run locally with Encore
$ encore run
```

---

## ✅ Implemented Features

### 1. Robust Validation

- [x] **DTOs are Classes** with `class-validator` decorators.
- [x] **Validation Helper**: `src/common/helpers/validation.helper.ts` provides `validateDto()` that maps errors to Encore `APIError`.

### 2. Folder Structure (Simplified & Flat)

```
src/
├── common/
│   ├── helpers/
│   │   └── validation.helper.ts   # Reusable DTO validation
│   └── schema/
│       └── user/
│           └── user.schema.ts     # Drizzle schema
├── module/
│   └── user/
│       ├── dto/
│       │   └── user.dto.ts        # DTOs + Pagination types
│       ├── user.entity.ts         # Domain Entity + IUserRepository
│       ├── user.repository.ts     # Drizzle implementation
│       ├── user.service.ts        # Business logic
│       ├── user.controller.ts     # Encore API handlers
│       └── user.module.ts         # NestJS DI module
└── applicationContext.ts          # Resolves Nest services for Encore
```

### 3. Pagination

- [x] `GET /users` now supports `?page=1&limit=10` query params.
- [x] Returns `PaginatedResponse` with `meta` (total, page, limit, totalPages).

### 4. Abstraction (Repository Pattern)

- [x] `IUserRepository` interface decouples service from ORM.
- [x] `UserRepository` implements the interface using Drizzle.
- [x] Easy to swap to Prisma/TypeORM by creating a new repository class.

---

## 🔲 TODOs for Production

### 1. Structured Logging

- [ ] **Install Pino**: `npm install nestjs-pino pino-http`
- [ ] **Configure AppModule**: Import `LoggerModule.forRoot(...)`.

### 2. Database & Config

- [ ] **Config**: Use `@nestjs/config` for environment variables.
- [ ] **Migrations**: Run `encore db migrate` or `npm run drizzle:migrate`.

### 3. Error Handling

- [ ] **Global Exception Mapping**: Catch NestJS exceptions and map to `APIError`.

---

## Standard NestJS Scripts

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
