import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { format } from "date-fns";
import * as QRCode from "qrcode";
import { z } from "zod";
import {
    cleanupOldQRCodes,
    parseQRCodesFromDB,
    type MeetingQRCode
} from "../lib/qr-code-utils";

const getSession = async () => {
  const request = getRequest();
  if (!request) return null;
  try {
    const { auth } = await import("../lib/auth");
    return await auth.api.getSession({ headers: request.headers });
  } catch {
    return null;
  }
};

export const getMembers = createServerFn({ method: "GET" }).handler(
  async () => {
    const { prisma } = await import("@/db");
    await getSession();
    const members = await prisma.member.findMany({
      // include: {
      //   attendance: true,
      // },
      // orderBy: { createdAt: "desc" },
    });
    console.log(members);
    return members;
  },
);

export const getStats = createServerFn({ method: "GET" }).handler(async () => {
  const { prisma } = await import("@/db");
  const memberCount = await prisma.member.count();
  const meetingCount = await prisma.meeting.count();
  const totalAttendance = await prisma.attendance.count();

  return {
    memberCount,
    meetingCount,
    totalAttendance,
  };
});

const memberSchema = z.object({
  name: z.string(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),
  skills: z.array(z.string()).optional().nullable(),

});

// Correcting to inputValidator per the demo found in the project
export const createMember = createServerFn({ method: "POST" })
  .inputValidator((data: any) => memberSchema.parse(data))
  .handler(async ({ data }) => {
    const { prisma } = await import("@/db");
    return await prisma.member.create({
      data: {
        ...data,
        email: data.email || undefined,
        phone: data.phone || undefined,
        whatsapp: data.whatsapp || undefined,
        status: data.status || undefined,
        bio: data.bio || undefined,
        location: data.location || undefined,
        occupation: data.occupation || undefined,
      },
    });
  });

export const getMemberById = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data: { id } }) => {
    const { prisma } = await import("@/db");
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        attendance: {
          include: {
            meetings: true,
          },
        },
      },
    });

    if (!member) {
      throw new Error("Member not found");
    }

    return member;
  });

export const updateMember = createServerFn({ method: "POST" })
  .inputValidator((data: any) =>
    z
      .object({
        id: z.string(),
        data: memberSchema.partial(),
      })
      .parse(data))
  .handler(async ({ data: { id, data } }) => {
    const { prisma } = await import("@/db");
    return await prisma.member.update({
      where: { id },
      data: {
        ...data,
        email: data.email || undefined,
        phone: data.phone || undefined,
        whatsapp: data.whatsapp || undefined,
        status: data.status || undefined,
        bio: data.bio || undefined,
        location: data.location || undefined,
        occupation: data.occupation || undefined,
      },
    });
  });

export const getMeetingsAsEvents = createServerFn({ method: "GET" }).handler(
  async () => {
    const { prisma } = await import("@/db");
    const meetings = await prisma.meeting.findMany({
      include: {
        attendance: {
          include: {
            member: true
          }
        }
      },
      orderBy: { date: "desc" },
    });

    return meetings.map((meeting) => ({
      id: meeting.id,
      title: meeting.title || `Meeting - ${meeting.notes || 'Attendance Meeting'}`,
      date: meeting.date || null, // Can be null for recurring meetings
      type: 'club_meeting' as const,
      attendees: meeting.attendance?.map((a) => a.member?.name).filter(Boolean) || [],
      repeat: meeting.repeat ? meeting.repeat.toLowerCase() as "everyday" | "weekdays" | "weekends" | "custom" | "none" : "none",
      customDays: meeting.customDays || [],
      exceptions: (meeting as any).exceptions || [],
      location: meeting.location || undefined,
      notes: meeting.notes || undefined,
      time: meeting.time || undefined,
      duration: meeting.duration || undefined,
      qrCodes: (meeting as any).qrCodes || undefined,
      qrCodeImage: (meeting as any).qrCodeImage || undefined,
      qrCodeUrl: (meeting as any).qrCodeUrl || undefined,
      createdAt: meeting.createdAt,
    }));
  },
);

// Server function to update QR codes for meetings
export const updateMeetingQRCodes = createServerFn({ method: "POST" })
  .inputValidator((data: any) => {
    return {
      updates: z.array(z.object({
        meetingId: z.string(),
        qrCodes: z.array(z.object({
          date: z.string(),
          qrCodeImage: z.string(),
          qrCodeUrl: z.string(),
        })),
      })).parse(data.updates),
    }
  })
  .handler(async ({ data }) => {
    const { prisma } = await import("@/db");
    await Promise.all(
      data.updates.map(({ meetingId, qrCodes }: { meetingId: string; qrCodes: any[] }) =>
        prisma.meeting.update({
          where: { id: meetingId },
          data: { qrCodes: qrCodes as any }
        })
      )
    )
    return { success: true }
  })

// Helper function to generate QR code for a meeting
async function generateQRCode(meetingId: string, meetingDate: Date | null): Promise<{ qrCodeImage: string | null; qrCodeUrl: string | null }> {
  try {
    // Only generate QR code if meeting has a date (non-recurring or specific instance)
    if (!meetingDate) {
      return { qrCodeImage: null, qrCodeUrl: null };
    }

    // Format date as YYYY-MM-DD
    const dateStr = format(meetingDate, 'yyyy-MM-dd');
    
    // Generate the check-in URL with meeting ID and date
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    const qrCodeUrl = `${baseUrl}/attendance?meeting=${meetingId}&date=${dateStr}`;
    
    // Generate QR code as base64 data URL
    const qrCodeImage = await QRCode.toDataURL(qrCodeUrl, {
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'M',
    });
    
    return { qrCodeImage, qrCodeUrl };
  } catch (error) {
    console.error('Error generating QR code:', error);
    return { qrCodeImage: null, qrCodeUrl: null };
  }
}

// Update an existing Meeting entry
export const updateMeeting = createServerFn({ method: "POST" })
  .inputValidator((data: any) => {
    // Must have an ID to update
    if (!data.id) {
      throw new Error("Meeting ID is required for update")
    }
    
    const repeat = (data.repeat ?? "none").toLowerCase()
    const isRecurring = repeat !== "none"
    
    return {
      id: data.id,
      date: isRecurring ? null : (data.date ?? null),
      title: data.title ?? null,
      notes: data.notes ?? null,
      location: data.location ?? null,
      type: data.type ?? "club_meeting",
      repeat: data.repeat ?? "none",
      customDays: data.customDays ?? null,
      exceptions: (data.exceptions ?? null) as any,
      color: data.color ?? null,
      time: data.time ?? null,
      duration: data.duration ?? null,
    } as any
  })
  .handler(async ({ data }) => {
    const { prisma } = await import("@/db");
    // Check if meeting exists
    const existingMeeting = await prisma.meeting.findUnique({
      where: { id: data.id }
    })
    
    if (!existingMeeting) {
      throw new Error("Meeting not found")
    }
    
    // Build data for Prisma update
    const dateValue: Date | null = data.date 
      ? (data.date instanceof Date ? data.date : new Date(data.date))
      : null
    
    const repeat = (data.repeat ?? "none").toLowerCase()
    const isRecurring = repeat !== "none"
    
    // Handle QR codes
    let qrCodes: MeetingQRCode[] = []
    if (isRecurring) {
      // For recurring meetings, initialize empty array or keep existing
      const existingQRCodes = parseQRCodesFromDB((existingMeeting as any).qrCodes)
      qrCodes = cleanupOldQRCodes(existingQRCodes)
    } else if (dateValue) {
      // For non-recurring meetings, generate QR code and store in array format
      const { qrCodeImage, qrCodeUrl } = await generateQRCode(data.id, dateValue);
      if (qrCodeImage && qrCodeUrl) {
        const dateStr = format(dateValue, 'yyyy-MM-dd')
        qrCodes = [{
          date: dateStr,
          qrCodeImage,
          qrCodeUrl,
        }]
      }
    }
    
    const updated = await prisma.meeting.update({
      where: { id: data.id },
      data: {
        date: dateValue, // null for recurring meetings, Date for non-recurring
        title: data.title ?? undefined,
        notes: data.notes ?? undefined,
        location: data.location ?? undefined,
        type: (data.type ?? "club_meeting") as any,
        repeat: (data.repeat ?? "none") as any,
        customDays: data.customDays ?? undefined,
        exceptions: (data.exceptions ?? undefined) as any,
        time: data.time ?? undefined,
        duration: data.duration ?? undefined,
        qrCodes: qrCodes.length > 0 ? (qrCodes as any) : undefined,
        // Keep legacy fields for backward compatibility
        qrCodeImage: qrCodes.length > 0 ? qrCodes[0].qrCodeImage : undefined,
        qrCodeUrl: qrCodes.length > 0 ? qrCodes[0].qrCodeUrl : undefined,
      } as any,
    })
    return updated
  })

// Create a new Meeting entry (local, no remote migration performed here)
export const createMeeting = createServerFn({ method: "POST" })
  .inputValidator((data: any) => {
    // Basic validation; can be expanded later to robustly validate all fields
    // For recurring meetings, date can be null - dates will be calculated from createdAt
    const repeat = (data.repeat ?? "none").toLowerCase()
    const isRecurring = repeat !== "none"
    
    return {
      date: isRecurring ? null : (data.date ?? null),
      title: data.title ?? null,
      notes: data.notes ?? null,
      location: data.location ?? null,
      type: data.type ?? "club_meeting",
      repeat: data.repeat ?? "none",
      customDays: data.customDays ?? null,
      exceptions: (data.exceptions ?? null) as any,
      color: data.color ?? null,
    } as any
  })
  .handler(async ({ data }) => {
    const { prisma } = await import("@/db");
    // Build data for Prisma, mapping to new schema fields if present
    // For recurring meetings, date is null - dates calculated from createdAt
    // For non-recurring meetings, convert date to Date object if it's a string
    const dateValue: Date | null = data.date 
      ? (data.date instanceof Date ? data.date : new Date(data.date))
      : null
    
    const repeat = (data.repeat ?? "none").toLowerCase()
    const isRecurring = repeat !== "none"
    
    // Create meeting first to get ID
    const created = await prisma.meeting.create({
      data: {
        date: dateValue, // null for recurring meetings, Date for non-recurring
        title: data.title ?? undefined,
        notes: data.notes ?? undefined,
        location: data.location ?? undefined,
        type: (data.type ?? "club_meeting") as any,
        repeat: (data.repeat ?? "none") as any,
        customDays: data.customDays ?? undefined,
        exceptions: (data.exceptions ?? undefined) as any,
        qrCodes: isRecurring ? ([] as any) : undefined, // Initialize empty array for recurring
      } as any,
    })
    
    // Generate QR code if meeting has a date (non-recurring) and update
    if (!isRecurring && dateValue) {
      const { qrCodeImage, qrCodeUrl } = await generateQRCode(created.id, dateValue);
      if (qrCodeImage && qrCodeUrl) {
        const dateStr = format(dateValue, 'yyyy-MM-dd')
        const qrCodes: MeetingQRCode[] = [{
          date: dateStr,
          qrCodeImage,
          qrCodeUrl,
        }]
        
        await prisma.meeting.update({
          where: { id: created.id },
          data: {
            qrCodes: qrCodes as any,
            qrCodeImage,
            qrCodeUrl,
          } as any,
        })
      }
    }
    
    // Fetch updated meeting
    const updatedMeeting = await prisma.meeting.findUnique({
      where: { id: created.id }
    })
    
    return updatedMeeting || created;
  })

// Export functions
export const exportMembersCSV = createServerFn({ method: "GET" }).handler(
  async () => {
    const { prisma } = await import("@/db");
    const members = await prisma.member.findMany({
      include: {
        attendance: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Create CSV content
    const csvHeaders = [
      "Name",
      "Email",
      "Phone",
      "Status",
      "Bio",
      "Location",
      "Occupation",
      "Skills",
      "Total Attendance",
      "Created At"
    ];

    const csvRows = members.map((member) => [
      member.name,
      member.email || "",
      member.phone || "",
      member.status || "",
      member.bio || "",
      member.location || "",
      member.occupation || "",
      member.attendance.length.toString(),
      member.createdAt.toISOString()
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    return csvContent;
  },
);

export const exportMembersPDF = createServerFn({ method: "GET" }).handler(
  async () => {
    const { prisma } = await import("@/db");
    const members = await prisma.member.findMany({
      include: {
        attendance: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // For now, return basic data structure that can be used to generate PDF
    // In a real implementation, you would use a PDF library like jsPDF
    return {
      title: "Rotaract Members Report",
      generatedAt: new Date().toISOString(),
      members: members.map((member) => ({
        name: member.name,
        email: member.email,
        phone: member.phone,
        status: member.status,
        totalAttendance: member.attendance.length,
        joinedAt: member.createdAt.toISOString()
      }))
    };
  },
);

// Import function
export const importMembersCSV = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    const { prisma } = await import("@/db");
    const { csvData } = data;
    const results = [];
    const lines = csvData.split('\n').filter((line: string) => line.trim());

    // Skip header row
    const dataLines = lines.slice(1);

    for (const line of dataLines) {
      try {
        const [name, email, phone, whatsapp, status, bio, location, occupation, skillsStr] = line.split(',').map((cell: string) => cell.replace(/^"|"$/g, '').trim());

        if (!name) continue; // Skip empty rows

        const skills = skillsStr ? skillsStr.split(/[,;]/).map((s: string) => s.trim()).filter(Boolean) : [];

        const memberData = {
          name,
          email: email || undefined,
          phone: phone || undefined,
          whatsapp: whatsapp || undefined,
          status: status || undefined,
          bio: bio || undefined,
          location: location || undefined,
          occupation: occupation || undefined,
          skills,
        };

        const createdMember = await prisma.member.create({
          data: {
            name: memberData.name,
            email: memberData.email || undefined,
            phone: memberData.phone || undefined,
            whatsapp: memberData.whatsapp || undefined,
            status: memberData.status || undefined,
            bio: memberData.bio || undefined,
            location: memberData.location || undefined,
            occupation: memberData.occupation || undefined,
          },
        });
        results.push({ success: true, data: createdMember });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.push({ success: false, error: errorMessage, data: line });
      }
    }
    return results;
  });
