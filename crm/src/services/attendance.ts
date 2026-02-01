import { createServerFn } from "@tanstack/react-start";

export const findMemberByName = createServerFn({ method: "GET" })
  .inputValidator((data: { name: string }) => data)
  .handler(async ({ data: { name } }) => {
    const { prisma } = await import("@/db");
    const member = await prisma.member.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      },
      include: {
        attendance: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)), // Today's attendance
              lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
          }
        }
      }
    });

    return member;
  });

export const createMemberAndAttendance = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    const { prisma } = await import("@/db");
    // Create the member
    const member = await prisma.member.create({
      data: {
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        bio: data.bio || undefined,
        occupation: data.occupation || undefined,
        status: "Active", // Default status for new members
        memberType: data.memberType || "GUEST",
        invitedByMemberId: data.invitedByMemberId || undefined,
      },
    });

    // Create or find today's meeting
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const todayEnd = new Date(today.setHours(23, 59, 59, 999));

    let meeting = await prisma.meeting.findFirst({
      where: {
        date: {
          gte: todayStart,
          lt: todayEnd
        }
      }
    });

    if (!meeting) {
      meeting = await prisma.meeting.create({
        data: {
          date: new Date(),
          notes: "Attendance meeting created automatically"
        }
      });
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        memberId: member.id,
        meetingId: meeting.id,
        attendanceId: `ATT-${Date.now()}`,
        date: new Date(),
        notes: "Recorded via attendance app"
      }
    });

    return { member, attendance };
  });

export const recordAttendance = createServerFn({ method: "POST" })
  .inputValidator((data: { memberId: string; meetingId?: string; date?: string }) => data)
  .handler(async ({ data: { memberId, meetingId, date } }) => {
    const { prisma } = await import("@/db");

    console.log('I am here');
    console.log('memberId', memberId);
    console.log('meetingId', meetingId);
    console.log('date', date);
    
    // Determine the meeting to use
    let meeting = null;
    
    if (meetingId) {
      // If meeting ID is provided from QR code, use that specific meeting
      meeting = await prisma.meeting.findUnique({
        where: { id: meetingId }
      });
      
      if (!meeting) {
        throw new Error("Meeting not found");
      }
    } else {
      // Otherwise, create or find today's meeting
      const today = new Date();
      const todayStart = new Date(today.setHours(0, 0, 0, 0));
      const todayEnd = new Date(today.setHours(23, 59, 59, 999));

      meeting = await prisma.meeting.findFirst({
        where: {
          date: {
            gte: todayStart,
            lt: todayEnd
          }
        }
      });

      if (!meeting) {
        meeting = await prisma.meeting.create({
          data: {
            date: new Date(),
            notes: "Attendance meeting created automatically"
          }
        });
      }
    }

    // Check if attendance already exists for the same date
    const attendanceDate = date ? new Date(date) : new Date();
    const attendanceDateStart = new Date(attendanceDate);
    attendanceDateStart.setHours(0, 0, 0, 0);
    const attendanceDateEnd = new Date(attendanceDate);
    attendanceDateEnd.setHours(23, 59, 59, 999);

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        memberId,
        meetingId: meeting.id,
        date: {
          gte: attendanceDateStart,
          lt: attendanceDateEnd
        }
      }
    });

    if (existingAttendance) {
      throw new Error("Attendance already recorded for this meeting");
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        memberId,
        meetingId: meeting.id,
        attendanceId: `ATT-${Date.now()}`,
        date: attendanceDate,
        notes: "Recorded via attendance app"
      }
    });

    return attendance;
  });