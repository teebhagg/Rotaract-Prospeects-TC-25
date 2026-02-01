// Server-only file - do not import in client code
// Runtime check - this will throw if somehow imported on client
// These imports are externalized by Vite config for SSR
// They should never be bundled for the client
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
// import { PrismaClient } from './generated/prisma/client.js'

if (typeof window !== 'undefined') {
  throw new Error('db.ts can only be imported on the server')
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

declare global {
  var __prisma: PrismaClient | undefined
}

export const prisma = globalThis.__prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}
