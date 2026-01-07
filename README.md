# RevoBank API
Backend REST API for a simple digital banking system built with NestJS, Prisma ORM, PostgreSQL (Supabase). Deployed on Railway.

The purpose of this project is to learn about how backend system works. This is a milestone 4 assignment.

## Deployment
**Base API URL:** <br>
Railway: [https://revobank-adsrchve.up.railway.app](https://revobank-adsrchve.up.railway.app)

**Swagger Documentation** <br>
Swagger UI: [https://revobank-adsrchve.up.railway.app/api](https://revobank-adsrchve.up.railway.app/api)

## Railway Deployment
**Build Command** <br>
```
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy
pnpm run build
```
**Start Command** <br>
```
pnpm run start:prod
```

## Tech Stack
- NestJS
- Prisma ORM
- PostgreSQL (Supabase)
- JWT Authentication
- Railway Deployment
- pnpm Package Manager

## Local Development Setup
### 1. Clone Repository
```
git clone https://github.com/Revou-FSSE-Jun25/milestone-4-adsrchve.git
cd milestone-4-adsrchve
```

### 2. Install Dependencies
```
pnpm install
```

### 3. Environment Variables
Create `.env` files 
```
DATABASE_URL=(your database connection)
DIRECT_URL=(your database)
JWT_SECRET=(your secret key)
```

### 4. Run Migration and Start Server
```
pnpm prisma migrate dev
pnpm run start:dev
```

## Authentication API
### Register
POST `/auth/register`
```
{
  "email": "anindya@mail.com",
  "password": "anin123",
  "name": "Anindya"
}
```

### Login
POST `/auth/login`
```
{
  "email": "anindya@mail.com",
  "password": "anin123"
}
Response:
```json
{
  "accessToken": "JWT_TOKEN",
  "user": {
    "id": 1,
    "email": "anindya@mail.com",
    "name": "Anindya",
    "role": "USER"
  }
}
```
Use this token for protected routes:
```
Authorization: Bearer JWT_TOKEN
```

## Testing
This project includes **unit tests for core business logic services**:
- `TransactionService`: deposit, withdraw, transfer, balance validation, and unauthorized access
- `AccountService`: account creation, retrieval, access control, and balance handling

Run all tests:
```
pnpm test
```

Generate coverage report:
```
pnpm run test:cov
```

## Author
**Anindya Nitisara Dwi Sukmawati**<br>
RevoU Fullstack Software Engineering Program