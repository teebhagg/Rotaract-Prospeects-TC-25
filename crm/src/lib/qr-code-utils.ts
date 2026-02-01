import { addDays, format, isAfter, isBefore } from "date-fns"
import {
    meetingQRCodeSchema,
    meetingQRCodesArraySchema,
    type MeetingQRCode
} from "./qr-code-schemas"

// Re-export for convenience
export type { MeetingQRCode, MeetingQRCodesArray } from "./qr-code-schemas"

/**
 * Safely parse QR codes from database JSON field
 * Returns validated array or empty array if invalid
 */
export function parseQRCodesFromDB(qrCodesJson: any): MeetingQRCode[] {
  if (!qrCodesJson) return []
  
  try {
    return meetingQRCodesArraySchema.parse(qrCodesJson)
  } catch (error) {
    console.error("Invalid QR codes format in database:", error)
    return []
  }
}

/**
 * Validate a single QR code entry
 */
export function validateQRCode(qrCode: unknown): MeetingQRCode | null {
  try {
    return meetingQRCodeSchema.parse(qrCode)
  } catch {
    return null
  }
}

/**
 * Safely add QR code to array, replacing existing entry for same date
 */
export function upsertQRCode(
  qrCodes: MeetingQRCode[], 
  newQRCode: MeetingQRCode
): MeetingQRCode[] {
  const filtered = qrCodes.filter(qr => qr.date !== newQRCode.date)
  return [...filtered, newQRCode].sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Get QR code for a specific date from the array
 */
export function getQRCodeForDate(
  qrCodes: MeetingQRCode[], 
  date: Date
): MeetingQRCode | null {
  const dateStr = format(date, 'yyyy-MM-dd')
  return qrCodes.find(qr => qr.date === dateStr) || null
}

/**
 * Check if a date is within the next 30 days (rolling window)
 */
export function shouldGenerateQRCode(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const thirtyDaysFromNow = addDays(today, 30)
  const dateOnly = new Date(date)
  dateOnly.setHours(0, 0, 0, 0)
  
  // Date should be today or in the future, but not more than 30 days away
  return (isAfter(dateOnly, today) || dateOnly.getTime() === today.getTime()) && 
         (isBefore(dateOnly, thirtyDaysFromNow) || dateOnly.getTime() === thirtyDaysFromNow.getTime())
}

/**
 * Cleanup QR codes older than 30 days
 */
export function cleanupOldQRCodes(qrCodes: MeetingQRCode[]): MeetingQRCode[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const thirtyDaysAgo = addDays(today, -30)
  
  return qrCodes.filter(qr => {
    const qrDate = new Date(qr.date)
    qrDate.setHours(0, 0, 0, 0)
    return isAfter(qrDate, thirtyDaysAgo) || qrDate.getTime() === thirtyDaysAgo.getTime()
  })
}

