# Patient Issues Resolution Platform (MediResolve)

A full-stack medical issue reporting and tracking system.

## Features
- **Patient Portal**: Submit and track complaints with a live timeline.
- **Admin Dashboard**: Comprehensive overview with Recharts analytics.
- **Role-based Auth**: Secure JWT-based authentication for Patients and Admins.
- **Modern UI**: Hospital-themed design with glassmorphism and animations.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Recharts.
- **Backend**: Node.js, Express, Prisma (PostgreSQL).
- **Security**: JWT, BcryptJS.

## Setup Instructions

### 1. Database Setup
1. Create a PostgreSQL database (e.g., on Supabase or locally).
2. Update `backend/.env` with your `DATABASE_URL`.

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## User Roles (Sample Data)
- **Admin**: `admin@mediresolve.com` / `admin123`
- **Patient**: `john@example.com` / `patient123`

## Deployment
- **Frontend**: Deploy to Vercel (connect GitHub and set root directory to `frontend`).
- **Backend**: Deploy to Render (set root directory to `backend`, add env vars).

# cloud-file
