import { createServerFn } from "@tanstack/react-start"
import { addDays, addMonths, format, getDay } from "date-fns"
import * as QRCode from "qrcode"
import {
    cleanupOldQRCodes,
    getQRCodeForDate,
    parseQRCodesFromDB,
    shouldGenerateQRCode,
    upsertQRCode,
    type MeetingQRCode
} from "../../lib/qr-code-utils"
import { getMeetingsAsEvents, updateMeetingQRCodes } from "../../services/crm"
import { type Calendar, type CalendarEvent } from "./types"

// Calendars data
export const calendars: Calendar[] = [
  {
    id: "meeting",
    name: "Meetings",
    color: "bg-blue-500",
    visible: true,
    type: "work"
  },
  {
    id: "event",
    name: "Events",
    color: "bg-green-500",
    visible: true,
    type: "shared"
  },
  {
    id: "personal",
    name: "Personal",
    color: "bg-purple-500",
    visible: true,
    type: "personal"
  }
]

  // Helper function to generate QR code for a specific meeting instance
  async function generateQRCodeForInstance(
    meetingId: string, 
    instanceDate: Date,
    existingQRCodes: MeetingQRCode[] = []
  ): Promise<{ qrCode: MeetingQRCode | null; wasGenerated: boolean }> {
    try {
      // Check if QR code already exists for this date
      const existing = getQRCodeForDate(existingQRCodes, instanceDate);
      if (existing) {
        return { qrCode: existing, wasGenerated: false };
      }

      // Only generate if date is within 30 days
      if (!shouldGenerateQRCode(instanceDate)) {
        return { qrCode: null, wasGenerated: false };
      }

      // Format date as YYYY-MM-DD
      const dateStr = format(instanceDate, 'yyyy-MM-dd');
      
      // Generate the check-in URL with meeting ID and specific instance date
      const baseUrl = process.env.APP_URL || process.env.VITE_APP_URL || 'http://localhost:3000';
      const qrCodeUrl = `${baseUrl}/attendance?meeting=${meetingId}&date=${dateStr}`;
      
      // Generate QR code as base64 data URL
      const qrCodeImage = await QRCode.toDataURL(qrCodeUrl, {
        width: 300,
        margin: 2,
        errorCorrectionLevel: 'M',
      });
      
      const qrCode: MeetingQRCode = {
        date: dateStr,
        qrCodeImage,
        qrCodeUrl,
      };

      return { qrCode, wasGenerated: true };
    } catch (error) {
      console.error('Error generating QR code for instance:', error);
      return { qrCode: null, wasGenerated: false };
    }
  }

  // Generate recurring events from a meeting
  async function generateRecurringEvents(
    meeting: {
      id: string
      title: string
      date: Date | null
      type: string
      repeat?: "everyday" | "weekdays" | "weekends" | "custom" | "none"
      customDays?: string[]
      exceptions?: string[]
      location?: string
      notes?: string
      time?: string
      duration?: string
      qrCodes?: any
      qrCodeImage?: string
      qrCodeUrl?: string
      createdAt: Date
    }
  ): Promise<{ events: CalendarEvent[]; updatedQRCodes: MeetingQRCode[] }> {
    const events: CalendarEvent[] = []
    const now = new Date()
    
    // Parse and validate QR codes from database
    let qrCodes = parseQRCodesFromDB(meeting.qrCodes)
    
    // For recurring meetings, use createdAt as start date. For non-recurring, use the stored date
    const startDate = meeting.date 
      ? new Date(meeting.date)
      : new Date(meeting.createdAt)
    
    // Generate events up to 1 year from the meeting creation date, or 3 months from today, whichever is later
    const endDate = new Date(Math.max(
      addMonths(new Date(meeting.createdAt), 12).getTime(),
      addMonths(now, 3).getTime()
    ))

    // If no repeat, just return the single event (must have a date)
    if (!meeting.repeat || meeting.repeat === "none") {
      if (!meeting.date) {
        // Non-recurring meeting must have a date
        return { events: [], updatedQRCodes: qrCodes }
      }
      
      // Get or generate QR code for non-recurring meeting
      let qrCode: MeetingQRCode | null = getQRCodeForDate(qrCodes, startDate)
      
      // If no QR code exists, generate one
      if (!qrCode) {
        const qrResult = await generateQRCodeForInstance(meeting.id, startDate, qrCodes)
        if (qrResult.qrCode) {
          qrCode = qrResult.qrCode
          if (qrResult.wasGenerated) {
            qrCodes = upsertQRCode(qrCodes, qrCode)
          }
        }
      }
      
      // Fallback to legacy fields if no QR code in array
      const qrCodeImage = qrCode?.qrCodeImage || (meeting as any).qrCodeImage || null
      const qrCodeUrl = qrCode?.qrCodeUrl || (meeting as any).qrCodeUrl || null
      
      return {
        events: [{
          id: meeting.id, // Use the meeting ID directly as the event ID
          title: meeting.title,
          date: startDate,
          time: meeting.time || format(startDate, "h:mm a"),
          duration: meeting.duration || "1 hour",
          type: meeting.type as "club_meeting" | "meeting" | "event" | "personal" | "task" | "reminder",
          location: meeting.location || "",
          color: getEventColor(meeting.type),
          description: meeting.notes || meeting.title,
          repeat: "none",
          customDays: [],
          qrCodeImage,
          qrCodeUrl,
        }],
        updatedQRCodes: qrCodes
      }
    }

    // Generate events based on repeat pattern
    // All recurring events share the same ID (meeting.id) for easier updates
    let currentDate = new Date(startDate)
    
    // Parse exception dates (stored as ISO date strings, compare by date only)
    const exceptionDates = (meeting.exceptions || []).map(ex => {
      const exDate = new Date(ex)
      return format(exDate, "yyyy-MM-dd")
    })

    while (currentDate <= endDate) {
      let shouldInclude = false

      switch (meeting.repeat) {
        case "everyday":
          shouldInclude = true
          break
        case "weekdays":
          const dayOfWeek = getDay(currentDate)
          shouldInclude = dayOfWeek >= 1 && dayOfWeek <= 5 // Monday to Friday
          break
        case "weekends":
          const dayOfWeekend = getDay(currentDate)
          shouldInclude = dayOfWeekend === 0 || dayOfWeekend === 6 // Saturday or Sunday
          break
        case "custom":
          if (meeting.customDays && meeting.customDays.length > 0) {
            const currentDayName = format(currentDate, "EEE")
            shouldInclude = meeting.customDays.includes(currentDayName)
          }
          break
      }

      // Check if this date is in the exceptions list
      const currentDateStr = format(currentDate, "yyyy-MM-dd")
      const isException = exceptionDates.includes(currentDateStr)

      if (shouldInclude && !isException) {
        // Create a new date with the same time as the original meeting
        const eventDate = new Date(currentDate)
        eventDate.setHours(startDate.getHours(), startDate.getMinutes(), startDate.getSeconds(), startDate.getMilliseconds())
        
        // Get or generate QR code for this specific instance
        let qrCode: MeetingQRCode | null = getQRCodeForDate(qrCodes, eventDate)
        
        // Only generate if within 30 days and doesn't exist
        if (!qrCode && shouldGenerateQRCode(eventDate)) {
          const qrResult = await generateQRCodeForInstance(meeting.id, eventDate, qrCodes)
          if (qrResult.qrCode && qrResult.wasGenerated) {
            qrCode = qrResult.qrCode
            qrCodes = upsertQRCode(qrCodes, qrCode)
          }
        }
        
        // Fallback to legacy fields if no QR code in array
        const qrCodeImage = qrCode?.qrCodeImage || (meeting as any).qrCodeImage || null
        const qrCodeUrl = qrCode?.qrCodeUrl || (meeting as any).qrCodeUrl || null
        
        events.push({
          id: meeting.id, // Same ID for all recurring events
          title: meeting.title,
          date: eventDate,
          time: meeting.time || format(startDate, "h:mm a"), // Use stored time or format from date
          duration: meeting.duration || "1 hour", // Use stored duration or default
          type: meeting.type as "club_meeting" | "meeting" | "event" | "personal" | "task" | "reminder",
          location: meeting.location || "",
          color: getEventColor(meeting.type),
          description: meeting.notes || meeting.title,
          repeat: meeting.repeat,
          customDays: meeting.customDays || [],
          qrCodeImage,
          qrCodeUrl,
        })
      }

      // Move to next day
      currentDate = addDays(currentDate, 1)
    }

    // Cleanup old QR codes before returning
    qrCodes = cleanupOldQRCodes(qrCodes)

    return { events, updatedQRCodes: qrCodes }
  }

  // Convert database meetings to calendar events
  // This is a server function to avoid bundling Prisma in client code
  export const getCalendarData = createServerFn({ method: "GET" }).handler(async () => {
    const meetingEvents = await getMeetingsAsEvents()

    // Expand recurring meetings into multiple events
    const allEvents: CalendarEvent[] = []
    const qrCodeUpdates: Array<{ meetingId: string; qrCodes: MeetingQRCode[] }> = []
    
    // Process meetings sequentially to handle async QR code generation
    for (const meeting of meetingEvents) {
      const result = await generateRecurringEvents({
        id: meeting.id || `meeting-${Date.now()}`,
        title: meeting.title,
        date: meeting.date ? new Date(meeting.date) : null, // Can be null for recurring meetings
        type: meeting.type,
        repeat: meeting.repeat,
        customDays: meeting.customDays,
        exceptions: meeting.exceptions,
        location: meeting.location,
        notes: meeting.notes,
        time: meeting.time,
        duration: meeting.duration,
        qrCodes: (meeting as any).qrCodes,
        qrCodeImage: (meeting as any).qrCodeImage,
        qrCodeUrl: (meeting as any).qrCodeUrl,
        createdAt: meeting.createdAt ? new Date(meeting.createdAt) : new Date()
      })
      
      allEvents.push(...result.events)
      
      // Track QR code updates if they changed
      if (result.updatedQRCodes.length > 0 || (meeting as any).qrCodes !== result.updatedQRCodes) {
        qrCodeUpdates.push({
          meetingId: meeting.id,
          qrCodes: result.updatedQRCodes
        })
      }
    }
    
    // Persist QR code updates via server function (only if updates exist)
    if (qrCodeUpdates.length > 0) {
      await updateMeetingQRCodes({ 
        data: { updates: qrCodeUpdates.map(({ meetingId, qrCodes }) => ({
          meetingId,
          qrCodes
        })) }
      })
    }

    // Sort events by date
    const events = allEvents.sort((a, b) => a.date.getTime() - b.date.getTime())

  // Create event dates with counts
  const eventDates = events.reduce((acc, event) => {
    const dateKey = format(event.date, "yyyy-MM-dd")
    const existing = acc.find(d => format(d.date, "yyyy-MM-dd") === dateKey)
    if (existing) {
      existing.count++
    } else {
      acc.push({
        date: new Date(event.date),
        count: 1
      })
    }
    return acc
  }, [] as { date: Date; count: number }[])

    return {
      events,
      eventDates,
      calendars
    }
  })

function getEventColor(type: string): string {
  const colorMap: Record<string, string> = {
    meeting: "bg-blue-500",
    event: "bg-green-500",
    personal: "bg-purple-500",
    task: "bg-orange-500",
    reminder: "bg-pink-500",
    // Club meetings (single, predefined type for now)
    club_meeting: "bg-blue-500",
  }
  return colorMap[type as keyof typeof colorMap] || "bg-gray-500"
}
