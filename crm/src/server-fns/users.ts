import { createServerFn } from "@tanstack/react-start"

export const getUsers = createServerFn({ method: "GET" }).handler(async () => {
  const { prisma } = await import("@/db")
  return prisma.user.findMany()
})

export const getUserById = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data: { id } }) => {
    const { prisma } = await import("@/db")
    return prisma.user.findUnique({
      where: { id },
    })
  })



