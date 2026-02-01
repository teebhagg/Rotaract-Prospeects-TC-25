import { createServerFn } from "@tanstack/react-start";
import { addDays, format, getDay } from "date-fns";

const ATTENDANCE_WINDOW_DAYS = 30

type MatrixSession = {
  key: string
  meetingId: string
  title: string
  date: Date
  dateLabel: string
}

function normalizeDateKey(date: Date | string) {
  const value = typeof date === "string" ? new Date(date) : date
  return value.toISOString().slice(0, 10)
}

function shouldIncludeRecurringDate(
  repeat: string,
  customDays: string[] | null | undefined,
  current: Date,
): boolean {
  const lowerRepeat = repeat.toLowerCase()
  const dayOfWeek = getDay(current)
  if (lowerRepeat === "everyday") return true
  if (lowerRepeat === "weekdays") return dayOfWeek >= 1 && dayOfWeek <= 5
  if (lowerRepeat === "weekends") return dayOfWeek === 0 || dayOfWeek === 6
  if (lowerRepeat === "custom" && Array.isArray(customDays)) {
    const shortDay = format(current, "EEE").toLowerCase()
    const longDay = format(current, "EEEE").toLowerCase()
    return customDays.some(
      (day) =>
        day?.toLowerCase().startsWith(shortDay) ||
        day?.toLowerCase().startsWith(longDay),
    )
  }
  return false
}

async function getMeetingSessions(prisma: any, windowStart: Date, windowEnd: Date) {
    const meetings = await prisma.meeting.findMany({
      orderBy: { createdAt: "desc" },
    })

  const sessions: MatrixSession[] = []

  for (const meeting of meetings) {
    const title = meeting.title || meeting.notes || "Meeting"
    const repeat = (meeting.repeat ?? "NONE").toLowerCase()
    const baseTiming = meeting.date
      ? new Date(meeting.date)
      : new Date(meeting.createdAt ?? new Date())
    const exceptions = (meeting.exceptions ?? []).map((ex: string) =>
      normalizeDateKey(ex),
    )

    if (repeat === "none") {
      if (!meeting.date) continue
      const meetingDate = new Date(meeting.date)
      if (meetingDate < windowStart || meetingDate > windowEnd) continue
      const key = `${meeting.id}-${normalizeDateKey(meetingDate)}`
      sessions.push({
        key,
        meetingId: meeting.id,
        title,
        date: meetingDate,
        dateLabel: format(meetingDate, "MMM d, yyyy"),
      })
      continue
    }

    const pointer = new Date(
      Math.max(baseTiming.getTime(), windowStart.getTime()),
    )
    const exceptionSet = new Set(exceptions)
    for (
      let current = new Date(pointer);
      current <= windowEnd;
      current = addDays(current, 1)
    ) {
      if (
        current < windowStart ||
        current < (meeting.date ? new Date(meeting.date) : baseTiming)
      ) {
        continue
      }

      const dateKey = normalizeDateKey(current)
      if (exceptionSet.has(dateKey)) continue

      if (!shouldIncludeRecurringDate(repeat, meeting.customDays, current)) {
        continue
      }

      const eventDate = new Date(current)
      eventDate.setHours(
        baseTiming.getHours(),
        baseTiming.getMinutes(),
        baseTiming.getSeconds(),
        baseTiming.getMilliseconds(),
      )

      const sessionKey = `${meeting.id}-${dateKey}`
      sessions.push({
        key: sessionKey,
        meetingId: meeting.id,
        title,
        date: eventDate,
        dateLabel: format(eventDate, "MMM d, yyyy"),
      })
    }
  }

  // remove duplicates and sort
  const unique = Array.from(
    new Map(sessions.map((session) => [session.key, session])).values(),
  )
  return unique.sort((a, b) => a.date.getTime() - b.date.getTime())
}

export const getAttendanceStats = createServerFn({ method: "GET" }).handler(
  async () => {
    const { prisma } = await import("@/db")
    const [totalMembers, totalMeetings, totalAttendance] = await Promise.all([
      prisma.member.count(),
      prisma.meeting.count(),
      prisma.attendance.count(),
    ])

    const possible = totalMembers * totalMeetings
    const attendanceRate =
      possible > 0 ? Math.round((totalAttendance / possible) * 10000) / 100 : 0

    return {
      totalMembers,
      totalMeetings,
      totalAttendance,
      presentCount: totalAttendance,
      attendanceRate,
    }
  }
)

export const getAttendanceMatrixPageData = createServerFn({ method: "GET" })
  .handler(async () => {
    const { prisma } = await import("@/db")
    const now = new Date()
    const windowEnd = new Date(now)
    windowEnd.setHours(23, 59, 59, 999)
    const windowStart = new Date(windowEnd)
    windowStart.setDate(windowStart.getDate() - ATTENDANCE_WINDOW_DAYS)
    windowStart.setHours(0, 0, 0, 0)

    const [members, sessions, attendances] = await Promise.all([
      prisma.member.findMany({ orderBy: { name: "asc" } }),
    getMeetingSessions(prisma, windowStart, windowEnd),
      prisma.attendance.findMany({
        where: {
          date: {
            gte: windowStart,
            lte: windowEnd,
          },
        },
        include: {
          member: {
            select: {
              id: true,
              name: true,
              createdAt: true,
            },
          },
        },
      }),
    ])

    const attendanceSet = new Set<string>()
    const memberPresentCount: Record<string, number> = {}
    const sessionPresentCount: Record<string, number> = {}

    attendances.forEach((attendance) => {
      const attendanceDateKey = normalizeDateKey(attendance.date)
      const sessionKey = `${attendance.meetingId}-${attendanceDateKey}`
      attendanceSet.add(`${attendance.memberId}-${sessionKey}`)
      memberPresentCount[attendance.memberId] =
        (memberPresentCount[attendance.memberId] ?? 0) + 1
      sessionPresentCount[sessionKey] =
        (sessionPresentCount[sessionKey] ?? 0) + 1
    })

    const matrixRows = members.map((member) => {
      let presentCount = 0
      const records: Record<string, "Present" | "Absent"> = {}

      sessions.forEach((session) => {
        const key = `${member.id}-${session.key}`
        const isPresent = attendanceSet.has(key)
        records[session.key] = isPresent ? "Present" : "Absent"
        if (isPresent) presentCount += 1
      })

      return {
        memberId: member.id,
        name: member.name,
        records,
        presentCount,
        totalCount: sessions.length,
        rate:
          sessions.length > 0
            ? Math.round((presentCount / sessions.length) * 100)
            : 0,
      }
    })

    const totalMembers = members.length
    const totalSessions = sessions.length
    const totalPossible = totalMembers * totalSessions
    const presentCount = attendances.length
    const attendanceRate =
      totalPossible > 0
        ? Math.round((presentCount / totalPossible) * 1000) / 10
        : 0

    const consistentMembers = matrixRows.filter(
      (row) => totalSessions > 0 && row.presentCount === totalSessions,
    ).length

    const sessionWithRates = sessions.map((session) => {
      const present = sessionPresentCount[session.key] ?? 0
      const rate =
        totalMembers > 0 ? Math.round((present / totalMembers) * 100) : 0
      return { session, present, rate }
    })

    const topSession =
      sessionWithRates.length > 0
        ? sessionWithRates.reduce((best, next) =>
            next.rate > best.rate ? next : best,
          )
        : null

    type MemberRecord = (typeof members)[number]
    const membersById = members.reduce<Record<string, MemberRecord>>(
      (acc, member) => {
        acc[member.id] = member
        return acc
      },
      {} as Record<string, MemberRecord>,
    )

    const retentionWindow =
      sessions.length >= 3 ? sessions.slice(-3) : sessions.slice(-sessions.length)
    const retentionRiskCount =
      retentionWindow.length < 3
        ? 0
        : members.filter((member) =>
            retentionWindow.every(
              (session) =>
                !attendanceSet.has(`${member.id}-${session.key}`),
            ),
          ).length

    const cohortStats: Record<
      number,
      { memberCount: number; totalPresent: number }
    > = {}
    matrixRows.forEach((row) => {
      const member = membersById[row.memberId]
      const year = member?.createdAt
        ? new Date(member.createdAt).getFullYear()
        : now.getFullYear()
      const stats = cohortStats[year] ?? { memberCount: 0, totalPresent: 0 }
      stats.memberCount += 1
      stats.totalPresent += row.presentCount
      cohortStats[year] = stats
    })

    const cohortSummary = Object.entries(cohortStats)
      .map(([year, stats]) => ({
        year: Number(year),
        avgSessions: stats.memberCount
          ? stats.totalPresent / stats.memberCount
          : 0,
      }))
      .sort((a, b) => b.avgSessions - a.avgSessions)[0]

    const sessionTitleMap = new Map(
      sessions.map((session) => [session.key, session.title]),
    )

    const listRecords = attendances
      .slice()
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map((attendance) => {
        const dateKey = normalizeDateKey(attendance.date)
        const sessionKey = `${attendance.meetingId}-${dateKey}`
        const meetingName =
          sessionTitleMap.get(sessionKey) ?? `Meeting ${attendance.meetingId}`

        return {
          id: attendance.id,
          member: attendance.member?.name ?? "Unknown Member",
          meeting: meetingName,
          date: format(attendance.date, "MMM d, yyyy"),
          status: "Present",
        }
      })

    return {
      matrix: {
        rows: matrixRows,
        meetings: sessions.map((session) => ({
          id: session.key,
          name: session.title,
          date: session.dateLabel,
        })),
      },
      records: listRecords,
      stats: {
        attendanceRate,
        presentCount,
        totalMembers,
        totalSessions,
        totalPossible,
        consistentMembers,
        retentionWindow: retentionWindow.length,
      },
      insights: {
        topSessionTitle: topSession?.session.title ?? null,
        topSessionRate: topSession?.rate ?? 0,
        activeCohortYear: cohortSummary?.year ?? null,
        activeCohortAvgSessions: cohortSummary
          ? Math.round(cohortSummary.avgSessions * 10) / 10
          : 0,
        retentionRiskCount,
      },
    }
  })


