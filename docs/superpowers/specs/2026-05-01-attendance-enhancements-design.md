# Attendance Enhancements - Design Spec

**Date:** 2026-05-01  
**Phase:** 2 of CRM Core Overhaul  
**Status:** Approved by User

---

## Overview

This design specifies enhancements to the Attendance System of the Rotaract TC-25 CRM. The system uses QR codes (meeting-specific, projected on screen) for check-in via a separate attendance app.

**Goals:**
- QR code improvements (generation, bulk ops, download, meeting start time)
- Real-time attendance dashboard (live feed, counts, auto-refresh)
- Late arrival tracking (`isLate` flag based on meeting start time)
- Enhanced reporting (per-member, per-meeting, trends, exportable reports)

---

## Section 1: Architecture

**Current State:**
- `Attendance` model with basic fields (memberId, meetingId, date)
- `Meeting` model with QR codes (`qrCodes` JSON array for 30-day rolling window)
- Separate attendance app (`/attendance`) with QR scanning
- CRM has attendance matrix page with records view

**Proposed Architecture:**

```
┌─────────────────────────────────────┐
│              Attendance System              │
├─────────────────────────────────────┤
│                                             │
│  ┌──────────────┐     ┌──────────────┐ │
│  │  Attendance  │     │  CRM          │ │
│  │  App          │────▶│  Dashboard   │ │
│  │  (QR Scan)  │◀────│  (TanStack)  │ │
│  └──────────────┘     └──────────────┘ │
│         │                      │               │
│         ▼                      ▼               │
│  ┌──────────────┐     ┌──────────────┐ │
│  │  Services    │     │  Services    │ │
│  │  - QR Gen   │     │  - Reporting │ │
│  │  - Check-in │     │  - Real-time │ │
│  │  - Late     │     │  - Analytics │ │
│  └──────────────┘     └──────────────┘ │
│         │                      │                │
│         └──────────────┬──────────────┘ │
│                        ▼                   │
│                 ┌──────────────┐        │
│                 │  Prisma/     │        │
│                 │  PostgreSQL   │        │
│                 └──────────────┘        │
└─────────────────────────────────────┘
```

**Key Points:**
- QR codes = per-meeting only (projected on screen), NOT personal member QR codes
- Single attendance record per meeting (no check-out)
- Late arrival tracking with `isLate` flag

**New Files Structure:**
```
crm/src/
├── routes/attendance/
│   ├── index.tsx        # Real-time dashboard (NEW)
│   ├── $meetingId.tsx # Meeting-specific attendance (NEW)
│   └── reports.tsx    # Enhanced reporting (NEW)
├── routes/meetings/$meetingId/
│   └── qr-manager.tsx    # QR code bulk management (NEW)
├── services/
│   ├── qr-code-service.ts      # QR generation, bulk ops, expiry (NEW)
│   ├── realtime-service.ts     # Real-time updates (SSE) (NEW)
│   └── attendance-report.ts    # Reporting queries (NEW)
└── lib/server/
    ├── qr-codes.ts             # QR code utilities (existing, enhance)
    └── attendance-analytics.ts # Analytics queries (NEW)
```

---

## Section 2: Data Model (Minimal Changes)

**Current Models:**
```prisma
model Attendance {
  id           String    @id @default(cuid())
  memberId     String
  meetingId    String
  attendanceId String
  date         DateTime
  notes        String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  member       Member    @relation(fields: [memberId], references: [id], onDelete: Cascade)
  meetings     Meeting[] @relation("AttendanceToMeeting")
}

model Meeting {
  id          String        @id @default(cuid())
  date        DateTime?
  title       String?
  notes       String?
  location    String?
  type        MeetingType   @default(CLUB_MEETING)
  repeat      RepeatPattern @default(NONE)
  time        String?
  duration    String?
  customDays  String[]
  exceptions  String[]
  qrCodes     Json?        // [{ date, qrCodeImage, qrCodeUrl }]
  qrCodeImage String?      // DEPRECATED
  qrCodeUrl   String?      // DEPRECATED
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  attendance  Attendance[]
}
```

**Proposed Changes (Minimal):**

```prisma
model Attendance {
  id           String    @id @default(cuid())
  memberId     String
  meetingId    String
  attendanceId String
  date         DateTime
  isLate       Boolean   @default(false)  // NEW: Late arrival flag
  notes        String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  member       Member    @relation(fields: [memberId], references: [id], onDelete: Cascade)
  meetings     Meeting[] @relation("AttendanceToMeeting")
  
  @@index([memberId])
  @@index([meetingId])
  @@index([date])
  @@index([isLate])  // NEW
  @@map("attendance")
}

model Meeting {
  id            String        @id @default(cuid())
  date          DateTime?
  title         String?
  notes         String?
  location      String?
  type          MeetingType   @default(CLUB_MEETING)
  repeat        RepeatPattern @default(NONE)
  time          String?        // Existing: e.g., "19:00"
  duration      String?
  customDays    String[]
  exceptions    String[]
  qrCodes       Json?          // [{ date, qrCodeImage, qrCodeUrl }]
  
  // NEW field for late tracking:
  startTime    String?        // Meeting start time "19:00" for late calculation
  
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  attendance    Attendance[]
  
  @@index([date])
}
```

**Migration Strategy:**
- Add `isLate` field to Attendance (default false, not null)
- Add `startTime` field to Meeting (optional, string "HH:MM" format)
- Late calculation logic in application code (compare check-in time vs startTime)
- No breaking changes to existing queries

---

## Section 3: UI Components & User Flows

**1. Enhanced CRM Attendance Page (`/attendance`):**
- Keep existing matrix + records tabs
- Add "Real-time" tab (NEW): Live attendance feed, auto-refresh every 30s
- Add filters: by date range, meeting, member type, late status
- Show stats: total checked in, late arrivals, attendance rate

**2. Meeting-Specific Attendance (`/meetings/$meetingId/attendance` - NEW):**
- Add attendance tab to meeting details page
- Show: who's checked in, arrival times, late flags
- Bulk actions: export attendance list, send reminders to no-shows

**3. QR Code Manager (`/meetings/$meetingId/qr-manager` - NEW):**
- View all QR codes for recurring meeting (30-day window)
- Download individual QR as PNG/PDF
- Bulk download all QR codes as ZIP
- Set meeting start time (for late calculation)

**4. New Components:**

```
realtime-attendance.tsx   # Live attendance feed
attendance-stats.tsx     # Stats with late count
qr-code-list.tsx        # QR codes list with download
attendance-report.tsx    # Report generator
```

**5. User Flows:**

**Flow 1: Generate & Download QR Codes**
```
Admin edits meeting → Sets start time (e.g., "19:00")
  ↓
System auto-generates QR for today (if in 30-day window)
  ↓
Admin opens QR Manager → Sees all QR codes for next 30 days
  ↓
Download individual QR as PNG → Project on screen
  OR
Bulk download all as ZIP
```

**Flow 2: Real-time Attendance Tracking**
```
Meeting in progress...
  ↓
Admin opens /attendance → Clicks "Real-time" tab
  ↓
Live feed shows:
  - Total checked in: 42
  - Late arrivals: 8
  - Recent check-ins (last 5)
  ↓
Auto-refresh every 30 seconds
```

**Flow 3: Late Arrival Flagging**
```
Member scans QR code → Opens attendance app
  ↓
App reads meetingId + date from QR
  ↓
App fetches meeting details (including startTime)
  ↓
Member submits name → Attendance recorded
  ↓
Backend checks: check-in time > startTime → isLate = true
```

---

## Section 4: Server Functions & API

**1. Real-time Attendance Service (`src/services/realtime-service.ts`):**
```typescript
// Server-Sent Events for real-time attendance
export async function getRealtimeAttendance(meetingId?: string) {
  const where: any = {}
  if (meetingId) where.meetingId = meetingId
  
  const attendances = await prisma.attendance.findMany({
    where,
    include: {
      member: { select: { id: true, name: true, memberType: true } },
      meetings: { select: { id: true, title: true, startTime: true } }
    },
    orderBy: { date: 'desc' },
    take: 50
  })
  
  return attendances.map(a => ({
    id: a.id,
    memberName: a.member.name,
    memberType: a.member.memberType,
    meetingTitle: a.meetings[0]?.title || 'Unknown',
    date: a.date,
    isLate: a.isLate
  }))
}
```

**2. QR Code Service (`src/services/qr-code-service.ts`):**
```typescript
import QRCode from 'qrcode'

export async function generateMeetingQRCode(meetingId: string, date: string) {
  const url = `${process.env.ATTENDANCE_APP_URL}/attendance?meeting=${meetingId}&date=${date}`
  
  const qrCodeImage = await QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: { dark: '#000', light: '#FFF' }
  })
  
  return {
    date,
    qrCodeImage,
    qrCodeUrl: url
  }
}

export async function addQRCodeToMeeting(meetingId: string, qrCode: any) {
  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } })
  const qrCodes = meeting?.qrCodes || []
  
  // Remove old entries (older than 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
  const filtered = qrCodes.filter((qc: any) => new Date(qc.date) >= thirtyDaysAgo)
  filtered.push(qrCode)
    
  return prisma.meeting.update({
    where: { id: meetingId },
    data: { qrCodes: filtered }
  })
}
```

**3. Attendance Reporting (`src/services/attendance-report.ts`):**
```typescript
export async function getAttendanceTrends(months: number = 6) {
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - months)
    
  const attendances = await prisma.attendance.findMany({
    where: { date: { gte: startDate } },
    include: {
      member: { select: { id: true, name: true, memberType: true } },
      meetings: { select: { title: true, date: true, startTime: true } }
    }
  })
    
  // Group by month
  const trends = attendances.reduce((acc: any, att) => {
    const month = new Date(att.createdAt).toISOString().slice(0, 7)
    if (!acc[month]) acc[month] = { total: 0, late: 0 }
    acc[month].total++
    if (att.isLate) acc[month].late++
    return acc
  }, {})
    
  return trends
}

export async function getMemberAttendanceReport(memberId: string) {
  return prisma.attendance.findMany({
    where: { memberId },
    include: { meetings: { select: { title: true, date: true, startTime: true } } },
    orderBy: { date: 'desc' }
  })
}
```

**4. Enhanced Attendance Recording (`src/services/attendance.ts` - update existing):**
```typescript
export const recordAttendance = createServerFn({ method: "POST" })
  .inputValidator((data: { memberId: string; meetingId?: string; date?: string }) => data)
  .handler(async ({ data: { memberId, meetingId, date } }) => {
    const { prisma } = await import("@/db");
    
    // Determine the meeting
    let meeting = null;
    if (meetingId) {
      meeting = await prisma.meeting.findUnique({ where: { id: meetingId } })
      if (!meeting) throw new Error("Meeting not found")
    } else {
      // Find or create today's meeting
      const today = new Date();
      const todayStart = new Date(today.setHours(0, 0, 0, 0));
      const todayEnd = new Date(today.setHours(23, 59, 59, 999));
        
      meeting = await prisma.meeting.findFirst({
        where: { date: { gte: todayStart, lt: todayEnd } }
      })
        
      if (!meeting) {
        meeting = await prisma.meeting.create({
          data: { date: new Date(), notes: "Attendance meeting created automatically" }
        })
      }
    }
    
    // Check for duplicate attendance
    const attendanceDate = date ? new Date(date) : new Date();
    const attendanceDateStart = new Date(attendanceDate);
    attendanceDateStart.setHours(0, 0, 0, 0);
    const attendanceDateEnd = new Date(attendanceDate);
    attendanceDateEnd.setHours(23, 59, 59, 999);
    
    const existingAttendance = await prisma.attendance.findFirst({
      where: { memberId, meetingId: meeting.id, date: { gte: attendanceDateStart, lt: attendanceDateEnd } }
    });
    
    if (existingAttendance) throw new Error("Attendance already recorded for this meeting")
    
    // Determine if late
    let isLate = false
    if (meeting.startTime) {
      const [hours, minutes] = meeting.startTime.split(':').map(Number)
      const meetingStartTime = new Date(attendanceDate)
      meetingStartTime.setHours(hours, minutes, 0, 0)
        
      // Check if check-in time is after start time
      const checkInTime = new Date() // Current time
      isLate = checkInTime > meetingStartTime
    }
    
    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        memberId,
        meetingId: meeting.id,
        attendanceId: `ATT-${Date.now()}`,
        date: attendanceDate,
        isLate,
        notes: "Recorded via attendance app"
      }
    })
    
    return attendance
  })
```

---

## Section 5: Data Flow

**Main User Flows:**

**Flow 1: Real-time Attendance Dashboard**
```
Admin opens /attendance → Clicks "Real-time" tab
  ↓
Client starts polling (SSE or 30s interval)
  ↓
GET /api/attendance/realtime?meetingId=...
  ↓
Service: getRealtimeAttendance(meetingId)
  ↓
Prisma: attendance.findMany with member + meeting includes
  ↓
Return: [{ memberName, memberType, meetingTitle, date, isLate }]
  ↓
UI updates: total count, late count, recent check-ins list
  ↓
Auto-refresh after 30 seconds
```

**Flow 2: QR Code Generation & Download**
```
Admin edits meeting → Sets startTime (e.g., "19:00")
  ↓
System checks if today is within 30-day window
  ↓
If yes: generateMeetingQRCode(meetingId, today)
  ↓
QR Code Service: generates PNG data URL + URL
  ↓
Add to Meeting.qrCodes array (replace if date exists)
  ↓
Admin opens QR Manager → Sees all QR codes for next 30 days
  ↓
Click "Download PNG" → Download individual QR
  OR
Click "Download ZIP" → Bulk download all QR codes
  ↓
Project QR on screen during meeting
```

**Flow 3: Late Arrival Detection**
```
Member scans QR code → Opens attendance app with meetingId + date
  ↓
Member submits name → POST /api/attendance/record
  ↓
Backend: recordAttendance({ memberId, meetingId, date })
  ↓
Fetch meeting.startTime (e.g., "19:00")
  ↓
Get current time (check-in time)
  ↓
Compare: isLate = currentTime > startTime
  ↓
Create Attendance record with isLate flag
  ↓
Return attendance record
```

**Flow 4: Attendance Reporting**
```
Admin clicks "Reports" tab → Select report type
  ↓
Option A: Per-Member Report
  - Select member → GET /api/attendance/report?memberId=...
  - Service: getMemberAttendanceReport(memberId)
  - Return: [{ meetingTitle, date, isLate }]
    
Option B: Trends Report
  - Select date range → GET /api/attendance/trends?months=6
  - Service: getAttendanceTrends(months)
  - Return: { "2026-05": { total: 42, late: 8 }, ... }
  ↓
Render chart (recharts) + export button (CSV/Excel)
```

**Data Flow Diagram:**
```
┌──────────┐     ┌───────────┐     ┌─────────────┐
│  UI      │────▶│  Server Fn   │────▶│  Service    │
│ (CRM +   │◀────│  (TanStack)  │◀────│  Layer      │
│  Attendance│     └───────────┘     └──────┬──────┘
│  App)    │                        │
└──────────┘                        ▼
                                 ┌─────────────┐
                                 │  Prisma     │
                                 │  (Postgres) │
                                 └─────────────┘
```

---

## Section 6: Error Handling & Validation

**1. Input Validation (Zod Schemas):**
```typescript
import { z } from 'zod'

export const RecordAttendanceSchema = z.object({
  memberId: z.string().min(1),
  meetingId: z.string().optional(),
  date: z.string().optional()  // YYYY-MM-DD format
})

export const GenerateQRCodeSchema = z.object({
  meetingId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
})
```

**2. Error Handling Strategy:**
```typescript
export class AttendanceAlreadyRecordedError extends Error {
  constructor(memberId: string, meetingId: string) {
    super(`Attendance already recorded for member ${memberId} in meeting ${meetingId}`)
    this.name = 'AttendanceAlreadyRecordedError'
  }
}

export class MeetingNotFoundError extends Error {
  constructor(meetingId: string) {
    super(`Meeting with ID ${meetingId} not found`)
    this.name = 'MeetingNotFoundError'
  }
}
```

**3. UI Error Handling:**
- Show toast notifications (sonner) for success/error
- Real-time feed shows error state if API fails
- QR generation errors displayed inline

**4. Real-time Feed Error Handling:**
```typescript
// Client-side polling with error handling
let retryCount = 0
const maxRetries = 3

async function pollRealtimeAttendance() {
  try {
    const data = await getRealtimeAttendance()
    retryCount = 0  // Reset on success
    updateUI(data)
  } catch (error) {
    retryCount++
    if (retryCount >= maxRetries) {
      showError("Lost connection to attendance feed")
    }
  } finally {
    setTimeout(pollRealtimeAttendance, 30000)  // 30s
  }
}
```

---

## Section 7: Testing Strategy

**1. Unit Tests (Vitest):**
```typescript
describe('Attendance Service', () => {
  test('records attendance with late flag', async () => {
    // Create meeting with startTime
    const meeting = await prisma.meeting.create({
      data: { startTime: '19:00', date: new Date() }
    })
    
    // Mock check-in time to 19:30 (late)
    const checkInTime = new Date()
    checkInTime.setHours(19, 30, 0, 0)
    
    const attendance = await recordAttendance({
      memberId: 'member-1',
      meetingId: meeting.id
    })
    
    expect(attendance.isLate).toBe(true)
  })
  
  test('recordAttendance generates QR code for today', async () => {
    const qrCode = await generateMeetingQRCode('meeting-1', '2026-05-01')
    expect(qrCode.qrCodeImage).toContain('data:image/')
    expect(qrCode.qrCodeUrl).toContain('meeting=meeting-1')
  })
})
```

**2. Integration Tests:**
```typescript
describe('Attendance Server Functions', () => {
  test('getRealtimeAttendance returns recent check-ins', async () => {
    const result = await getRealtimeAttendance('meeting-1')
    expect(result).toBeInstanceOf(Array)
    expect(result[0]).toHaveProperty('memberName')
    expect(result[0]).toHaveProperty('isLate')
  })
  
  test('prevents duplicate attendance', async () => {
    await expect(async () => {
      await recordAttendance({
        memberId: 'member-1',
        meetingId: 'meeting-1'
      })
    }).rejects.toThrow('already recorded')
  })
})
```

**3. Component Tests (Testing Library):**
```typescript
describe('RealtimeAttendance', () => {
  test('renders live feed', () => {
    render(<RealtimeAttendance meetingId="meeting-1" />)
    expect(screen.getByText('Live Attendance')).toBeInTheDocument()
  })
  
  test('shows late arrivals count', () => {
    render(<AttendanceStats attendances={mockAttendances} />)
    expect(screen.getByText('Late: 8')).toBeInTheDocument()
  })
})
```

**4. E2E Tests (Future - Playwright/Cypress):**
- QR code generation flow: Create meeting → Set start time → Generate QR → Download
- Real-time feed: Open attendance page → Verify live updates
- Late detection: Check in after start time → Verify isLate = true

**5. Test Coverage Goals:**
- Services: 80%+ coverage
- Server Functions: 70%+ coverage
- Components: Key flows tested (real-time feed, QR manager)

---

## Summary

This design adds 2 new fields (`Attendance.isLate` and `Meeting.startTime`) and enhances the attendance system with real-time dashboard, better QR code management, late arrival tracking, and enhanced reporting.

**Key Features:**
- QR codes are meeting-specific only (projected on screen)
- Single attendance record per meeting (no check-out)
- Late arrival detection based on meeting start time
- Real-time attendance dashboard with live feed
- Enhanced reporting (per-member, trends, exportable)

**Next Phase:** CDN + CMS Video Optimization (hybrid approach for website videos)
