import { prisma } from "@/lib/prisma";

async function check() {
  const users = await prisma.user.findMany();
  console.log("Users in DB:", users);
  const accounts = await prisma.account.findMany();
  console.log("Accounts in DB:", accounts);
}

check();
