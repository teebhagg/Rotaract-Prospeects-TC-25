import { prisma } from '@/db'

export async function getAttendanceStats() {
  const [totalMembers, totalMeetings, totalAttendance] = await Promise.all([
    prisma.member.count(),
    prisma.meeting.count(),
    prisma.attendance.count(),
  ])

  // Attendance records currently represent "present" check-ins.
  // Rate is computed as a percentage of possible attendances (members * meetings).
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

function tryParseMeetingFromCode(code: string): { meetingId: string; date?: Date } | null {
  try {
    // `code` might be an encoded URL string
    const raw = decodeURIComponent(code)
    const url = new URL(raw)
    const meetingId = url.searchParams.get('meeting') || url.searchParams.get('meetingId')
    const dateStr = url.searchParams.get('date')
    if (!meetingId) return null
    return { meetingId, date: dateStr ? new Date(dateStr) : undefined }
  } catch {
    return null
  }
}

/**
 * Mark attendance using a QR "code".
 *
 * The current DB schema stores meeting check-in QR codes as URLs (see `Meeting.qrCodes`).
 * This helper supports codes that are full URLs (or URL-encoded URLs) containing
 * `?meeting=<id>&date=YYYY-MM-DD`.
 */
export async function markAttendanceByQrCode(code: string, memberName: string) {
  const parsed = tryParseMeetingFromCode(code)
  if (!parsed) {
    throw new Error('Invalid QR code')
  }

  const meeting = await prisma.meeting.findUnique({ where: { id: parsed.meetingId } })
  if (!meeting) {
    throw new Error('Invalid QR code')
  }

  const member =
    (await prisma.member.findFirst({
      where: { name: { equals: memberName, mode: 'insensitive' } },
    })) ??
    (await prisma.member.create({
      data: { name: memberName },
    }))

  const attendance = await prisma.attendance.create({
    data: {
      memberId: member.id,
      meetingId: meeting.id,
      attendanceId: `QR-${Date.now()}`,
      date: parsed.date ?? new Date(),
      notes: 'Recorded via QR code',
    },
  })

  // Some routes expect `status`; our schema does not currently include it.
  return { ...attendance, status: 'PRESENT' as const }
}



