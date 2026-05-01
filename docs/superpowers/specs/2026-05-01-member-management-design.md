# Member Management - Design Spec

**Date:** 2026-05-01  
**Phase:** 1 of CRM Core Overhaul  
**Status:** Approved by User

---

## Overview

This design specifies the enhancements to the Member Management subsystem of the Rotaract TC-25 CRM. The CRM is built with TanStack Start, Prisma ORM (PostgreSQL), and React.

**Goals:**
- Richer member profiles with photos, social links, interests, skills
- Invitation & referral system with tracking
- Member activity timeline
- Bulk operations (import/export)
- Communication tracking

---

## Section 1: Architecture

**Current State:**
- `Member` model with basic fields
- Simple member list page with table view
- Basic CRUD via `members.tsx` routes
- Member-attendance relationship exists but limited tracking

**Proposed Architecture:**

```
┌─────────────────────────────────────────────────────┐
│                   Member Management                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐     ┌──────────────┐            │
│  │  UI Layer    │     │  API Layer   │            │
│  │  (TanStack   │────▶│  (Server     │            │
│  │   Router)    │◀────│   Functions) │            │
│  └──────────────┘     └──────────────┘            │
│         │                      │                     │
│         ▼                      ▼                     │
│  ┌──────────────┐     ┌──────────────┐            │
│  │  Components  │     │  Services    │            │
│  │  - Profile   │     │  - Member    │            │
│  │  - Activity  │     │  - Invitation│            │
│  │  - Import/   │     │  - Export    │            │
│  │    Export    │     │  - Comm.     │            │
│  └──────────────┘     └──────────────┘            │
│                            │                        │
│                            ▼                        │
│                    ┌──────────────┐                  │
│                    │  Prisma/     │                  │
│                    │  PostgreSQL   │                  │
│                    └──────────────┘                  │
└─────────────────────────────────────────────────────┘
```

**New Files Structure:**
```
crm/src/
├── routes/members/
│   ├── index.tsx              # Enhanced member list with filters, bulk ops
│   ├── $memberId.tsx          # Enhanced profile page
│   ├── components/
│   │   ├── member-profile.tsx  # Richer profile with tabs
│   │   ├── member-activity.tsx # Activity timeline
│   │   ├── invitation-tree.tsx # Referral tree visualization
│   │   ├── import-dialog.tsx   # CSV/Excel import
│   │   ├── export-dialog.tsx   # Export options
│   │   └── communication-log.tsx # Comm. tracking
├── services/
│   ├── member-service.ts       # Enhanced member operations
│   ├── invitation-service.ts   # Referral tracking
│   └── export-service.ts       # Import/export logic
└── lib/server/
    ├── members-extended.ts      # Extended member queries
    └── communications.ts       # Communication logging
```

---

## Section 2: Data Model (Migration-Safe)

**Current `Member` model:**
```prisma
model Member {
  id                String       @id @default(cuid())
  name              String
  email             String?      @unique
  phone             String?
  status            String?
  bio               String?
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt
  location          String?
  occupation        String?
  whatsapp          String?
  memberType        MemberType  @default(GUEST)
  invitedByMemberId String?
  invitedBy         Member?      @relation("MemberInvites", fields: [invitedByMemberId], references: [id])
  invitedGuests     Member[]     @relation("MemberInvites")
  attendance        Attendance[]
}
```

**Proposed Enhanced `Member` model (Phase 1 - Additive Only):**
```prisma
model Member {
  id                String       @id @default(cuid())
  name              String
  email             String?      @unique
  phone             String?
  status            String?      // KEEP as String for now - migrate later
  bio               String?
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt
  location          String?
  occupation        String?
  whatsapp          String?
  memberType        MemberType  @default(GUEST)
  joinedAt          DateTime?    // NEW: When they officially joined
  photo             String?      // NEW: Profile photo URL
  socialLinks       Json?        // NEW: { twitter, linkedin, instagram }
  interests         String[]     // NEW: Array of interests
  skills            String[]     // NEW: Array of skills
  
  // Relations (all new)
  invitedByMemberId String?
  invitedBy         Member?      @relation("MemberInvites", fields: [invitedByMemberId], references: [id])
  invitedGuests     Member[]     @relation("MemberInvites")
  attendance        Attendance[]
  activities        MemberActivity[]  // NEW
  sentInvitations   Invitation[] @relation("Inviter")  // NEW
  communications   Communication[]   // NEW
  tags              MemberTag[]      // NEW: Many-to-many with tags

  @@index([name])
  @@index([email])
  @@index([phone])
  @@index([invitedByMemberId])
  @@map("member")
}

// NEW Models (all optional/additive - no breaking changes)
model MemberTag {
  id        String   @id @default(cuid())
  name      String
  color     String?  // For UI display
  members   Member[]
  createdAt DateTime @default(now())
}

model MemberActivity {
  id        String     @id @default(cuid())
  memberId  String
  type      ActivityType
  title     String
  description String?
  metadata  Json?
  createdAt DateTime   @default(now())
  
  member    Member   @relation(fields: [memberId], references: [id], onDelete: Cascade)
  
  @@index([memberId])
  @@index([type])
}

enum ActivityType {
  ATTENDANCE
  INVITATION_SENT
  INVITATION_ACCEPTED
  PROFILE_UPDATED
  ROLE_CHANGED
  NOTE_ADDED
}

model Invitation {
  id             String      @id @default(cuid())
  inviterId      String
  inviteeEmail   String?
  inviteePhone   String?
  inviteeName    String?
  status         InviteStatus @default(PENDING)
  sentAt         DateTime    @default(now())
  respondedAt    DateTime?
  convertedToMemberId String?
  convertedMember Member?     @relation("InvitationConversion")
  notes          String?
  
  inviter        Member    @relation("Inviter", fields: [inviterId], references: [id])
  
  @@index([inviterId])
  @@index([status])
}

enum InviteStatus {
  PENDING
  ACCEPTED
  EXPIRED
  CANCELLED
}

model Communication {
  id          String        @id @default(cuid())
  memberId    String
  type        CommType
  direction   CommDirection
  subject     String?
  content     String
  status      CommStatus?
  metadata    Json?
  createdAt   DateTime    @default(now())
  
  member      Member    @relation(fields: [memberId], references: [id], onDelete: Cascade)
  
  @@index([memberId])
  @@index([type])
}

enum CommType {
  EMAIL
  SMS
  WHATSAPP
  IN_APP
}

enum CommDirection {
  INBOUND
  OUTBOUND
}

enum CommStatus {
  SENT
  DELIVERED
  OPENED
  FAILED
}
```

**Migration Strategy:**
1. **Phase 1 (This design):** Add all new fields as optional/nullable, keep `status` as `String?`
2. **Phase 2 (Later):** Migrate status data, then change to `MemberStatus` enum
3. **Backward compatibility:** All existing code using `member.status` continues to work

---

## Section 3: UI Components & User Flows

**1. Enhanced Member List Page (`/members`)**
- Keep existing table view, add new columns: Photo, Tags, Member Type, Joined Date, Last Activity
- Add advanced filters: by Tags, Member Type, Status, Join Date range, Activity level
- Add bulk operations toolbar: Bulk tag, Bulk export, Bulk email/SMS, Bulk status update
- Add import/export buttons in header

**2. Member Profile Page (`/members/$memberId`)**
- Convert to tabbed interface:
  - **Overview Tab:** Photo, basic info, quick stats (attendance rate, meetings attended, invite count)
  - **Activity Tab:** Timeline of activities (attendance, invites sent, profile updates)
  - **Invitations Tab:** Tree/list of invited members, invitation status tracking
  - **Communications Tab:** Log of emails/SMS/calls with this member
  - **Edit Tab:** Full profile editing with all new fields

**3. New Components:**

```
member-profile.tsx        # Main profile with tabs
member-activity.tsx       # Activity timeline component
invitation-tree.tsx        # Visual tree of invited members
communication-log.tsx     # Communication history
import-dialog.tsx          # CSV/Excel import with field mapping
export-dialog.tsx          # Export options (CSV, Excel, PDF)
member-tags.tsx            # Tag management
member-photo-upload.tsx    # Photo upload component
```

**4. User Flows:**

**Flow 1: Import Members**
```
User clicks "Import" → Upload CSV/Excel → Map fields (name→name, email→email, etc.)
→ Preview mapped data → Confirm import → Batch create members → Show results
```

**Flow 2: Send Invitation**
```
User clicks "Invite" on member → Enter invitee details (email/phone/name)
→ Select invitation type → Send (log to Communication) → Track in Invitation model
→ Invitee accepts → Auto-create member with invitedBy set
```

**Flow 3: Activity Tracking**
```
Member checks in → Attendance created → MemberActivity (type: ATTENDANCE) auto-created
Member sends invitation → Invitation created → MemberActivity (type: INVITATION_SENT)
Member profile updated → MemberActivity (type: PROFILE_UPDATED)
```

---

## Section 4: Server Functions & API

**New/Enhanced Server Functions:**

**1. Member Queries (`src/lib/server/members-extended.ts`):**
```typescript
export async function getMemberWithDetails(id: string) {
  return prisma.member.findUnique({
    where: { id },
    include: {
      activities: { orderBy: { createdAt: 'desc' } },
      sentInvitations: { orderBy: { sentAt: 'desc' } },
      communications: { orderBy: { createdAt: 'desc' } },
      tags: true,
      invitedGuests: { select: { id, name, memberType, joinedAt } },
      attendance: { include: { meetings: true } }
    }
  })
}

export async function getMembersWithFilters(filters: {
  search?: string
  memberType?: MemberType
  status?: string
  tags?: string[]
  joinedAfter?: Date
  joinedBefore?: Date
}) {
  return prisma.member.findMany({
    where: {
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } }
        ]
      }),
      ...(filters.memberType && { memberType: filters.memberType }),
      ...(filters.status && { status: filters.status }),
      ...(filters.tags && filters.tags.length > 0 && {
        tags: { some: { id: { in: filters.tags } } }
      }),
      ...(filters.joinedAfter && { joinedAt: { gte: filters.joinedAfter } }),
      ...(filters.joinedBefore && { joinedAt: { lte: filters.joinedBefore } })
    },
    include: { tags: true, _count: { select: { attendance: true, sentInvitations: true } } }
  })
}
```

**2. Activity Logging (`src/lib/server/member-activity.ts`):**
```typescript
export async function logMemberActivity(data: {
  memberId: string
  type: ActivityType
  title: string
  description?: string
  metadata?: any
}) {
  return prisma.memberActivity.create({
    data: {
      memberId: data.memberId,
      type: data.type,
      title: data.title,
      description: data.description,
      metadata: data.metadata
    }
  })
}
```

**3. Invitation Service (`src/services/invitation-service.ts`):**
```typescript
export async function createInvitation(data: {
  inviterId: string
  inviteeEmail?: string
  inviteePhone?: string
  inviteeName?: string
}) {
  const invitation = await prisma.invitation.create({
    data: {
      inviterId: data.inviterId,
      inviteeEmail: data.inviteeEmail,
      inviteePhone: data.inviteePhone,
      inviteeName: data.inviteeName
    }
  })
  
  // Log activity
  await logMemberActivity({
    memberId: data.inviterId,
    type: 'INVITATION_SENT',
    title: `Invited ${data.inviteeName || data.inviteeEmail || data.inviteePhone}`,
    metadata: { invitationId: invitation.id }
  })
  
  return invitation
}
```

**4. Import/Export Service (`src/services/export-service.ts`):**
```typescript
export async function importMembers(csvData: any[]) {
  const results = { success: 0, failed: 0, errors: [] }
  
  for (const row of csvData) {
    try {
      await prisma.member.create({
        data: {
          name: row.name,
          email: row.email || undefined,
          phone: row.phone || undefined,
          memberType: row.memberType || 'GUEST',
          joinedAt: row.joinedAt ? new Date(row.joinedAt) : null
        }
      })
      results.success++
    } catch (error) {
      results.failed++
      results.errors.push(`Failed: ${row.name} - ${error.message}`)
    }
  }
  
  return results
}

export async function exportMembers(filters?: any) {
  const members = await getMembersWithFilters(filters)
  return members.map(m => ({
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone,
    memberType: m.memberType,
    status: m.status,
    joinedAt: m.joinedAt?.toISOString()
  }))
}
```

**5. TanStack Server Functions (`src/server-fns/members-extended.ts`):**
```typescript
export const getMemberDetails = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => getMemberWithDetails(data.id))

export const importMembers = createServerFn({ method: "POST" })
  .inputValidator((data: { members: any[] }) => data)
  .handler(async ({ data }) => importMembers(data.members))
```

---

## Section 5: Data Flow

**Main User Flows:**

**Flow 1: View Member Profile with Activities**
```
User navigates to /members/$memberId
  ↓
Server Function: getMemberDetails(id)
  ↓
Service: getMemberWithDetails(id)
  ↓
Prisma Query: member.findUnique({
  include: { activities, sentInvitations, communications, tags, invitedGuests, attendance }
})
  ↓
Return data to UI
  ↓
Render tabs: Overview | Activity | Invitations | Communications
```

**Flow 2: Import Members (Bulk Operation)**
```
User clicks "Import" button
  ↓
Show ImportDialog component
  ↓
User uploads CSV/Excel file
  ↓
Client: Parse file (papaparse for CSV)
  ↓
Show preview with field mapping options
  ↓
User confirms mapping
  ↓
Server Function: importMembers(data)
  ↓
Service: importMembers(csvData)
  ↓
Loop: For each row → prisma.member.create()
  ↓
Log activity for each created member (optional)
  ↓
Return results: { success: N, failed: M, errors: [] }
  ↓
Show results toast
  ↓
Refresh member list
```

**Flow 3: Send Invitation**
```
User clicks "Invite" button on member profile
  ↓
Show invitation form (invitee name/email/phone)
  ↓
User fills form and submits
  ↓
Server Function: createInvitation(data)
  ↓
Service: createInvitation(data)
  ↓
Prisma: invitation.create()
  ↓
Log MemberActivity (type: INVITATION_SENT)
  ↓
Log Communication (type: EMAIL/SMS, direction: OUTBOUND)
  ↓
Return invitation
  ↓
Send email/SMS (integration point - Phase 2)
  ↓
Show success toast
```

**Flow 4: Log Activity Automatically**
```
Member checks in via attendance app
  ↓
Attendance record created
  ↓
Trigger: logMemberActivity({
  memberId,
  type: 'ATTENDANCE',
  title: 'Attended meeting',
  metadata: { meetingId, attendanceId }
})
  ↓
MemberActivity record created
```

**Data Flow Diagram (Simplified):**
```
┌──────────┐     ┌──────────────┐     ┌─────────────┐
│  UI      │────▶│  Server Fn   │────▶│  Service    │
│ (Routes) │◀────│  (TanStack)  │◀────│  Layer      │
└──────────┘     └──────────────┘     └──────┬──────┘
                                        │
                                        ▼
                                 ┌─────────────┐
                                 │  Prisma     │
                                 │  (Postgres) │
                                 └─────────────┘
```

---

## Section 6: Error Handling & Validation

**1. Input Validation (Zod Schemas):**
```typescript
export const UpdateMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  occupation: z.string().optional(),
  location: z.string().optional(),
  memberType: z.enum(['GUEST', 'PROSPECT', 'ROTARACTOR']).optional(),
  joinedAt: z.date().optional(),
  socialLinks: z.object({
    twitter: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal(''))
  }).optional(),
  interests: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional()
})

export const CreateInvitationSchema = z.object({
  inviterId: z.string().min(1),
  inviteeEmail: z.string().email().optional(),
  inviteePhone: z.string().optional(),
  inviteeName: z.string().min(2, "Name must be at least 2 characters")
}).refine(data => data.inviteeEmail || data.inviteePhone, {
  message: "Either email or phone is required"
})

export const ImportMemberSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  memberType: z.enum(['GUEST', 'PROSPECT', 'ROTARACTOR']).optional(),
  status: z.string().optional()
})
```

**2. Error Handling Strategy:**
```typescript
export class MemberNotFoundError extends Error {
  constructor(id: string) {
    super(`Member with ID ${id} not found`)
    this.name = 'MemberNotFoundError'
  }
}

export class DuplicateEmailError extends Error {
  constructor(email: string) {
    super(`Member with email ${email} already exists`)
    this.name = 'DuplicateEmailError'
  }
}

export class InvitationFailedError extends Error {
  constructor(message: string) {
    super(`Invitation failed: ${message}`)
    this.name = 'InvitationFailedError'
  }
}

export async function updateMemberProfile(id: string, data: UpdateMemberInput) {
  try {
    const validated = UpdateMemberSchema.parse(data)
    
    const existing = await prisma.member.findUnique({ where: { id } })
    if (!existing) throw new MemberNotFoundError(id)
    
    if (validated.email && validated.email !== existing.email) {
      const duplicate = await prisma.member.findUnique({ 
        where: { email: validated.email } 
      })
      if (duplicate) throw new DuplicateEmailError(validated.email)
    }
    
    return await prisma.member.update({
      where: { id },
      data: validated
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`)
    }
    throw error
  }
}
```

**3. UI Error Handling:**
- Show toast notifications (sonner) for success/error
- Form validation errors displayed inline (react-hook-form + zod)
- Error boundaries for component failures
- Empty states for no data (e.g., no activities, no invitations)

**4. Import Error Handling:**
```typescript
interface ImportResult {
  success: number
  failed: number
  errors: Array<{ row: number; name: string; error: string }>
  warnings: Array<{ row: number; message: string }>
}

// Show import results dialog
// - Green: N members imported successfully
// - Red: M rows failed (with details)
// - Yellow: K warnings (e.g., duplicate emails skipped)
```

---

## Section 7: Testing Strategy

**1. Unit Tests (Vitest):**
```typescript
describe('Member Service', () => {
  test('getMemberWithDetails returns member with relations', async () => {
    const member = await getMemberWithDetails('test-id')
    expect(member.activities).toBeDefined()
    expect(member.sentInvitations).toBeDefined()
    expect(member.communications).toBeDefined()
  })
  
  test('importMembers handles valid CSV data', async () => {
    const result = await importMembers([
      { name: 'John Doe', email: 'john@test.com' },
      { name: 'Jane Smith', phone: '1234567890' }
    ])
    expect(result.success).toBe(2)
    expect(result.failed).toBe(0)
  })
  
  test('importMembers handles duplicates gracefully', async () => {
    const result = await importMembers([
      { name: 'Duplicate', email: 'existing@test.com' }
    ])
    expect(result.failed).toBe(1)
    expect(result.errors.length).toBeGreaterThan(0)
  })
})
```

**2. Integration Tests:**
```typescript
describe('Member Server Functions', () => {
  test('getMemberDetails returns 404 for non-existent member', async () => {
    const result = await getMemberDetails({ id: 'non-existent' })
    expect(result).toBeNull()
  })
  
  test('createInvitation creates activity log', async () => {
    const invitation = await createInvitation({
      inviterId: 'member-1',
      inviteeName: 'New Person'
    })
    
    const activities = await prisma.memberActivity.findMany({
      where: { memberId: 'member-1', type: 'INVITATION_SENT' }
    })
    
    expect(activities.length).toBeGreaterThan(0)
  })
})
```

**3. Component Tests (Testing Library):**
```typescript
describe('MemberProfile', () => {
  test('renders tabs correctly', () => {
    render(<MemberProfile member={mockMember} />)
    
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Activity')).toBeInTheDocument()
    expect(screen.getByText('Invitations')).toBeInTheDocument()
    expect(screen.getByText('Communications')).toBeInTheDocument()
  })
  
  test('activity timeline shows entries', () => {
    render(<MemberActivity activities={mockActivities} />)
    expect(screen.getByText('Attended meeting')).toBeInTheDocument()
  })
})
```

**4. E2E Tests (Future - Playwright/Cypress):**
- Import flow: Upload CSV → Map fields → Confirm → Verify results
- Invitation flow: Send invite → Check invitation list → Verify activity log
- Profile update: Edit profile → Save → Verify changes persisted

**5. Test Coverage Goals:**
- Services: 80%+ coverage
- Server Functions: 70%+ coverage
- Components: Key flows tested (profile view, import, invitation)

---

## Summary

This design adds 4 new Prisma models (MemberTag, MemberActivity, Invitation, Communication) and extends the Member model with 6 new optional fields. The approach is migration-safe, keeping the existing `status` field as `String?` to avoid breaking changes.

**Key Features:**
- Richer member profiles with photos, social links, interests, skills, tags
- Invitation & referral system with tracking
- Member activity timeline (auto-logging)
- Bulk operations (import/export CSV/Excel)
- Communication tracking log

**Next Phase:** Meeting Management improvements (templates, recurring UX, agendas, categories, attendance expectations)
