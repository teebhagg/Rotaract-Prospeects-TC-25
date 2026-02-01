# Accessing Better Auth Users

## Overview

Better Auth creates its own tables in the database for authentication:
- `user` - User records (shared with Prisma User model)
- `account` - Authentication accounts (passwords, OAuth providers)
- `session` - Active user sessions
- `verification` - Email verification tokens

## Accessing Auth Users via Prisma

Since Better Auth and Prisma share the same `user` table, you can access users using Prisma:

```typescript
import { prisma } from '@/db'

// Get all users
const users = await prisma.user.findMany()

// Get user by ID
const user = await prisma.user.findUnique({
  where: { id: 'user_id_here' }
})

// Get user by email
const user = await prisma.user.findUnique({
  where: { email: 'admin@example.com' }
})

// Get user with all details
const user = await prisma.user.findUnique({
  where: { email: 'admin@example.com' },
  select: {
    id: true,
    email: true,
    name: true,
    role: true,
    emailVerified: true,
    createdAt: true,
  }
})
```

## Accessing Better Auth Account Data

To access authentication data (like account records, sessions), you'll need to query Better Auth's tables directly:

```typescript
import { prisma } from '@/db'

// Get account records (contains password hashes, OAuth tokens)
const accounts = await prisma.$queryRaw`
  SELECT * FROM account 
  WHERE "userId" = ${userId}
`

// Get user sessions
const sessions = await prisma.$queryRaw`
  SELECT * FROM session 
  WHERE "userId" = ${userId}
  ORDER BY "createdAt" DESC
`

// Get account by provider
const credentialAccount = await prisma.$queryRaw`
  SELECT * FROM account 
  WHERE "userId" = ${userId} 
  AND "providerId" = 'credential'
`
```

## Accessing via Better Auth API

You can also use Better Auth's API on the server:

```typescript
import { auth } from '@/lib/auth'

// Get user by ID (server-side)
const user = await auth.api.getUser({ 
  userId: 'user_id_here' 
})

// List all users (if your Better Auth config supports it)
// Note: Better Auth doesn't have a built-in list users API
// Use Prisma for listing users
```

## Accessing Current Session

On the client-side:

```typescript
import { authClient } from '@/lib/auth-client'

// Get current session
const { data: session } = authClient.useSession()

if (session?.user) {
  console.log('User ID:', session.user.id)
  console.log('Email:', session.user.email)
  console.log('Name:', session.user.name)
  console.log('Role:', session.user.role) // From additionalFields
}
```

On the server-side (in route loaders):

```typescript
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/some-route')({
  loader: async () => {
    const session = await authClient.getSession()
    if (session?.user) {
      const userId = session.user.id
      const userRole = session.user.role
      // Use the session data
    }
  }
})
```

## Querying Better Auth Tables Directly

If you need to query Better Auth tables that aren't in your Prisma schema:

```typescript
import { prisma } from '@/db'

// Get all accounts
const accounts = await prisma.$queryRaw`
  SELECT * FROM account
`

// Get active sessions
const activeSessions = await prisma.$queryRaw`
  SELECT s.*, u.email, u.name 
  FROM session s
  JOIN "user" u ON s."userId" = u.id
  WHERE s."expiresAt" > NOW()
  ORDER BY s."createdAt" DESC
`

// Get verification tokens
const verifications = await prisma.$queryRaw`
  SELECT * FROM verification
  WHERE "expiresAt" > NOW()
`
```

## Creating Users with Authentication

When creating users programmatically, ensure both the `user` table and `account` table are updated:

1. Create user in `user` table (via Prisma)
2. Create account record in `account` table with hashed password
3. Use `providerId = 'credential'` for email/password accounts

See `prisma/seed.ts` for an example of creating users with passwords.

## Important Notes

- The `user` table is shared between Prisma and Better Auth
- Password hashes are stored in the `account` table with `providerId = 'credential'`
- User IDs should be compatible between Prisma and Better Auth
- Better Auth's `additionalFields` (like `role`) are stored in the `user` table
- Sessions are managed by Better Auth and stored in the `session` table

## Better Auth Table Structure

```
user
  - id (TEXT, primary key)
  - email (TEXT, unique)
  - name (TEXT, nullable)
  - emailVerified (BOOLEAN)
  - image (TEXT, nullable)
  - role (TEXT, from additionalFields)
  - createdAt (TIMESTAMP)
  - updatedAt (TIMESTAMP)

account
  - id (TEXT, primary key)
  - userId (TEXT, foreign key to user.id)
  - accountId (TEXT)
  - providerId (TEXT, e.g., 'credential')
  - password (TEXT, hashed password for credential provider)
  - accessToken, refreshToken (for OAuth providers)
  - createdAt, updatedAt (TIMESTAMP)

session
  - id (TEXT, primary key)
  - userId (TEXT, foreign key to user.id)
  - expiresAt (TIMESTAMP)
  - token (TEXT)
  - ipAddress, userAgent (TEXT, nullable)
  - createdAt, updatedAt (TIMESTAMP)

verification
  - id (TEXT, primary key)
  - identifier (TEXT)
  - value (TEXT)
  - expiresAt (TIMESTAMP)
  - createdAt, updatedAt (TIMESTAMP)
```


