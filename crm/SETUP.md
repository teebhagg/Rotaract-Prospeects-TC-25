# CRM Dashboard Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- npm or pnpm package manager

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the `crm` directory with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/crm_db"
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
```

Generate a Better Auth secret:

```bash
npx @better-auth/cli secret
```

Copy the generated secret to your `.env.local` file.

### 3. Database Setup

#### Run Prisma Migrations

```bash
npm run db:push
```

Or create a migration:

```bash
npm run db:migrate
```

#### Run Better Auth Migrations

Better Auth needs to create its own tables:

```bash
npx @better-auth/cli migrate
```

This will create the necessary authentication tables in your database.

### 4. Generate Prisma Client

```bash
npm run db:generate
```

### 5. Create Initial Admin User

Since registration is disabled, you'll need to create users through Better Auth's API or directly in the database.

#### Option 1: Using Better Auth API (Recommended)

You can create a script to create the first admin user:

```typescript
// scripts/create-admin.ts
import { auth } from './src/lib/auth'

// Create admin user
await auth.api.signUpEmail({
  body: {
    email: 'admin@example.com',
    password: 'secure-password',
    name: 'Admin User',
  },
})
```

#### Option 2: Direct Database Insert

Insert directly into Better Auth's user table and then sync with our User model.

### 6. Sync Better Auth Users with User Model

Better Auth creates its own user table. You'll need to sync Better Auth users with the User model in Prisma. You can do this by:

1. Creating a sync script that reads from Better Auth's user table
2. Or manually creating User records that match Better Auth users

The User model uses `id` as the primary key, which should match Better Auth's user ID.

### 7. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## User Roles

The system supports three roles:

- **MAIN_ADMIN**: Can create other admins and assistants, full access
- **ASSISTANT**: Admin privileges but cannot create user profiles
- **MEMBER**: Regular users, can view their own profile and attendance

## Features

### Authentication
- Login-only (no registration)
- Role-based access control
- Session management

### Dashboard
- Attendance statistics
- Meeting overview
- User metrics

### Meetings
- Create meetings with date ranges
- Mark cancelled days
- Generate QR codes per meeting day
- Calendar interface

### Attendance
- QR code-based attendance marking
- API endpoint for separate QR attendance page
- Individual and overall attendance tracking

### User Management
- View all users (MAIN_ADMIN and ASSISTANT)
- View individual user profiles
- Attendance history per user

## QR Code Attendance

Each meeting day generates a unique QR code. The QR code contains a URL that points to:

```
/api/attendance/qr?code=<qr-code-token>
```

This endpoint can be used by a separate web page where members can scan the QR code and enter their name to mark attendance.

## API Endpoints

### QR Code Attendance

**GET** `/api/attendance/qr?code=<qr-code>`
- Validates QR code and returns meeting day information

**POST** `/api/attendance/qr`
- Body: `{ code: string, userName: string }`
- Marks attendance for the user

## Database Schema

### Models

- **User**: Organization members with roles
- **Meeting**: Meetings with date ranges and cancelled days
- **MeetingDay**: Individual days of meetings with QR codes
- **Attendance**: Attendance records linking users to meeting days

## Troubleshooting

### Authentication Issues

- Ensure `BETTER_AUTH_SECRET` is set
- Run Better Auth migrations: `npx @better-auth/cli migrate`
- Check that the database connection is working

### Database Issues

- Run Prisma migrations: `npm run db:push`
- Generate Prisma client: `npm run db:generate`
- Check database connection string in `.env.local`

### QR Code Issues

- Ensure `qrcode` package is installed
- Check that meeting days are being generated correctly
- Verify QR code tokens are unique

## Development

### Running Migrations

```bash
npm run db:migrate
```

### Viewing Database

```bash
npm run db:studio
```

### Generating Types

```bash
npm run db:generate
```

## Production Deployment

1. Set production environment variables
2. Run database migrations
3. Build the application: `npm run build`
4. Start the production server

## Notes

- Better Auth creates its own user tables separate from the Prisma User model
- Users need to be synced between Better Auth and the User model
- QR codes expire after the meeting day + 1 day
- Only MAIN_ADMIN can create new users


