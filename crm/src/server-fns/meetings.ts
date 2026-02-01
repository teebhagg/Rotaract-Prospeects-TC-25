import { createServerFn } from "@tanstack/react-start"

export const getMeetings = createServerFn({ method: "GET" }).handler(async () => {
  const { prisma } = await import("@/db")
  return prisma.meeting.findMany({
    orderBy: { date: "desc" },
  })
})

export const getMeetingById = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data: { id } }) => {
    const { prisma } = await import("@/db")
    return prisma.meeting.findUnique({
      where: { id },
    })
  })

export const createMeeting = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    const { prisma } = await import("@/db")

    // Legacy UI payload compatibility:
    // - `startDate`/`endDate` from the form map to a single `date` + exceptions
    const date: Date | null = data.startDate
      ? data.startDate instanceof Date
        ? data.startDate
        : new Date(data.startDate)
      : data.date
        ? data.date instanceof Date
          ? data.date
          : new Date(data.date)
        : null

    const exceptions: string[] = Array.isArray(data.cancelledDays)
      ? data.cancelledDays
      : Array.isArray(data.exceptions)
        ? data.exceptions
        : []

    return prisma.meeting.create({
      data: {
        title: data.title ?? undefined,
        notes: data.description ?? data.notes ?? undefined,
        location: data.location ?? undefined,
        date,
        exceptions,
      } as any,
    })
  })



