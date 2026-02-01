import { z } from "zod"

// Zod schema for a single QR code entry
export const meetingQRCodeSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  qrCodeImage: z.string().startsWith("data:image/", "QR code image must be a data URL"),
  qrCodeUrl: z.string().url("QR code URL must be a valid URL"),
})

// Zod schema for the QR codes array
export const meetingQRCodesArraySchema = z.array(meetingQRCodeSchema)

// Type inference from Zod schemas
export type MeetingQRCode = z.infer<typeof meetingQRCodeSchema>
export type MeetingQRCodesArray = z.infer<typeof meetingQRCodesArraySchema>


