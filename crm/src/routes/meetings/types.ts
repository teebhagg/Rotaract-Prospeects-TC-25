export interface CalendarEvent {
  id: string
  title: string
  date: Date
  time: string
  duration: string
  // Event type. We will standardize to a single club-meeting type for now
  // and keep the rest for backward compatibility.
  type: "club_meeting" | "meeting" | "event" | "personal" | "task" | "reminder"
  location: string
  color: string
  description?: string
  // Repeat/pattern metadata for the event
  repeat?: "everyday" | "weekdays" | "weekends" | "custom" | "none"
  // If repeat is custom, store the selected days (e.g. Mon, Tue, ...)
  customDays?: string[]
  // QR code for meeting check-in
  qrCodeImage?: string
  qrCodeUrl?: string
}

export interface Calendar {
  id: string
  name: string
  color: string
  visible: boolean
  type: "personal" | "work" | "shared"
}
