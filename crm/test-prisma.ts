import { prisma } from './src/lib/prisma';

async function test() {
  try {
    const counts = await prisma.member.count();
    console.log('Member count:', counts);
  } catch (err) {
    console.error('Prisma test failed:', err);
  } finally {
    process.exit();
  }
}

test();
