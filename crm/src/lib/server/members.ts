import { prisma } from '@/db'

export async function getMembers() {
  return prisma.member.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          attendance: true,
        },
      },
    },
  })
}

export async function getMemberById(id: string) {
  return prisma.member.findUnique({
    where: { id },
    include: {
      attendance: {
        include: {
          meetings: true,
        },
      },
      _count: {
        select: {
          attendance: true,
        },
      },
    },
  })
}

export async function createMember(data: {
  name: string
  email?: string
  department?: string
  phone?: string
}) {
  return prisma.member.create({
    data,
  })
}

export async function updateMember(
  id: string,
  data: {
    name?: string
    email?: string
    department?: string
    phone?: string
  }
) {
  return prisma.member.update({
    where: { id },
    data,
  })
}

export async function deleteMember(id: string) {
  return prisma.member.delete({
    where: { id },
  })
}

export async function getMemberStats(memberId: string) {
  const presentCount = await prisma.attendance.count({
    where: { memberId },
  })

  const totalMeetings = await prisma.meeting.count()

  const attendanceRate = totalMeetings > 0 ? (presentCount / totalMeetings) * 100 : 0

  return {
    totalMeetings,
    presentCount,
    absentCount: totalMeetings - presentCount,
    attendanceRate: Math.round(attendanceRate * 100) / 100,
  }
}


