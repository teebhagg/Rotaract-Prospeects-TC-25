import { PrismaPg } from '@prisma/adapter-pg'
import { randomBytes, scrypt } from 'node:crypto'
import { promisify } from 'node:util'
import { PrismaClient } from '@prisma/client'

const scryptAsync = promisify(scrypt)

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

// Hash password using scrypt (Better Auth's default hashing method)
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const buf = (await scryptAsync(password, salt, 64)) as Buffer
  return `${buf.toString('hex')}.${salt}`
}

async function main() {
  console.log('🌱 Seeding database...')

  const adminEmail = 'admin@example.com'
  const adminPassword = 'Admin@123' // ⚠️  Change this to a secure password in production!
  const adminName = 'Admin User'

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (existingAdmin) {
    // Check if account table exists first
    let accountExists: Array<{ count: bigint }> = []
    try {
      accountExists = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count FROM account 
        WHERE "userId" = ${existingAdmin.id} AND "providerId" = 'credential'
      `
    } catch (error) {
      // Account table doesn't exist - Better Auth migrations haven't been run
      console.log('⚠️  Account table does not exist.')
      console.log('⚠️  Please run Better Auth migrations first:')
      console.log('   npm run auth:migrate')
      console.log('   (or: dotenv -e .env.local -- npx @better-auth/cli migrate)')
      console.log('')
      console.log('   Then run the seed again: npm run db:seed')
      console.log('')
      console.log('   Admin user exists but cannot login until account table is created.')
      return
    }

    if (accountExists[0]?.count === BigInt(0)) {
      // User exists but account doesn't - create the account record
      console.log('⚠️  Admin user exists but account record is missing, creating account...')
      const hashedPassword = await hashPassword(adminPassword)
      
      await prisma.$executeRaw`
        INSERT INTO account (id, "userId", "accountId", "providerId", "password", "createdAt", "updatedAt")
        VALUES (
          gen_random_uuid()::text,
          ${existingAdmin.id},
          ${adminEmail},
          'credential',
          ${hashedPassword},
          NOW(),
          NOW()
        )
        ON CONFLICT DO NOTHING
      `

      console.log(`✅ Created account record for admin user`)
      console.log('✅ User can now login with:')
      console.log(`   Email: ${adminEmail}`)
      console.log(`   Password: ${adminPassword}`)
    } else {
      console.log('⚠️  Admin user already exists with account record, skipping creation')
      console.log(`   Email: ${existingAdmin.email}`)
      console.log(`   ID: ${existingAdmin.id}`)
      console.log(`   Role: ${existingAdmin.role}`)
    }
  } else {
    try {
      // Check if account table exists before creating user
      let accountTableExists = false
      try {
        await prisma.$queryRaw`SELECT 1 FROM account LIMIT 1`
        accountTableExists = true
      } catch {
        accountTableExists = false
      }

      if (!accountTableExists) {
        console.log('⚠️  Account table does not exist.')
        console.log('⚠️  Please run Better Auth migrations first:')
        console.log('   npm run auth:migrate')
        console.log('   (or: dotenv -e .env.local -- npx @better-auth/cli migrate)')
        console.log('')
        console.log('   Then run the seed again: npm run db:seed')
        return
      }

      // Create user in Prisma (Better Auth uses the same 'user' table)
      const hashedPassword = await hashPassword(adminPassword)
      const userId = randomBytes(16).toString('hex')

      // Create user record
      const adminUser = await prisma.user.create({
        data: {
          id: userId,
          email: adminEmail,
          name: adminName,
          role: 'MAIN_ADMIN',
          emailVerified: true, // Set to true for admin
        },
      })

      // Create account record in Better Auth's account table
      // Better Auth stores credentials in the 'account' table with providerId = 'credential'
      await prisma.$executeRaw`
        INSERT INTO account (id, "userId", "accountId", "providerId", "password", "createdAt", "updatedAt")
        VALUES (
          gen_random_uuid()::text,
          ${userId},
          ${adminEmail},
          'credential',
          ${hashedPassword},
          NOW(),
          NOW()
        )
        ON CONFLICT DO NOTHING
      `

      console.log(`✅ Created admin user: ${adminUser.email}`)
      console.log(`   ID: ${adminUser.id}`)
      console.log(`   Role: ${adminUser.role}`)
      console.log('')
      console.log('✅ User can now login with:')
      console.log(`   Email: ${adminEmail}`)
      console.log(`   Password: ${adminPassword}`)
      console.log('')
      console.log('⚠️  IMPORTANT: Change the default password after first login!')
    } catch (error) {
      console.error('❌ Error creating admin user:', error)
      throw error
    }
  }

  console.log('✅ Seeding complete')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
