# CDN + CMS Video Optimization - Design Spec

**Date:** 2026-05-01  
**Phase:** 3 of CRM Core Overhaul  
**Status:** Approved by User

---

## Overview

This design specifies the CDN + CMS Video Optimization for the Rotaract TC-25 official website. Sanity already serves videos from its CDN (`cdn.sanity.io`) by default — we just need to enable it and add video fields to relevant schemas.

**Goals:**
- Enable Sanity CDN for faster video delivery
- Add video fields to event and project schemas (for recordings/promo videos)
- Enhance video components to handle Sanity video assets

---

## Section 1: Architecture

**Current State:**
- Videos uploaded to Sanity via `type: 'file'` with `accept: 'video/*'`
- `useCdn: false` in Sanity client (no CDN caching)
- Hero section supports video background (HTML `<video>` tag)
- No video fields on event/project schemas

**Proposed Architecture (Simplified):**

```
┌─────────────────────────────────────────────┐
│           Video System                       │
├─────────────────────────────────────────────┤
│                                              │
│  ┌──────────────┐     ┌──────────────┐ │
│  │  Sanity CMS  │     │  Website     │ │
│  │  Studio      │────▶│  (Next.js)   │ │
│  └──────────────┘     └──────────────┘ │
│         │                      │               │
│         ▼                      ▼               │
│  ┌──────────────┐     ┌──────────────┐ │
│  │  Video       │     │  Video       │ │
│  │  Schemas     │     │  Components  │ │
│  └──────────────┘     └──────────────┘ │
│         │                      │               │
│         └──────────────┬──────────────┘ │
│                        ▼                   │
│                 ┌──────────────┐        │
│                 │  Sanity CDN  │        │
│                 │  (cdn.sanity.io)        │
│                 └──────────────┘        │
└─────────────────────────────────────────────┘
```

**Key Changes:**
1. Set `useCdn: true` in Sanity client
2. Add video fields to event and project schemas
3. Enhance video components for better playback

**Modified Files:**
```
cms/schemas/
├── homePage.ts        # Already has video field (no change needed)
├── event.ts           # ADD: video field for event recordings
└── project.ts         # ADD: promoVideo field

official-website/
├── sanity/
│   └── lib/
│       └── client.ts    # MODIFY: Set useCdn: true
└── components/
    ├── sections/
    │   ├── hero-section.tsx      # Already works (no change needed)
    │   ├── event-video.tsx      # NEW: Event video component
    │   └── project-video.tsx    # NEW: Project promo video
    └── ui/
        └── video-player.tsx     # NEW: Reusable video player
```

---

## Section 2: Sanity Schema Changes

**1. Event Schema (`cms/schemas/event.ts`):**
```typescript
// ADD to existing fields array:
defineField({
  name: 'video',
  title: 'Event Recording',
  description: 'Upload video recording of the event',
  type: 'file',
  options: {
    accept: 'video/*',
  },
}),
```

**2. Project Schema (`cms/schemas/project.ts`):**
```typescript
// ADD to existing fields array:
defineField({
  name: 'promoVideo',
  title: 'Promo Video',
  description: 'Upload promo video for this project',
  type: 'file',
  options: {
    accept: 'video/*',
  },
}),
```

**3. Home Page Schema (`cms/schemas/homePage.ts`):**
- Already has `video` field (no changes needed)
- Already stores video as `type: 'file'` with `accept: 'video/*'`

---

## Section 3: Client Configuration

**Modified File:** `official-website/sanity/lib/client.ts`

```typescript
import {createClient} from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,  // ← CHANGE from false to true
  perspective: 'published',
})

// Also create a client that can fetch drafts for debugging
export const clientWithDrafts = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,  // ← CHANGE from false to true
  perspective: 'raw',
})

export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: {
  query: string
  params?: Record<string, unknown>
  tags?: string[]
}): Promise<T> {
  return client.fetch<T>(query, params, {
    cache: 'no-store',
    next: {
      tags,
    },
  })
```

**What This Does:**
- `useCdn: true` tells Sanity to serve assets (images, videos) from `cdn.sanity.io` instead of `api.sanity.io`
- Videos are automatically cached at edge locations for faster delivery
- No code changes needed for video playback — URLs remain the same format

---

## Section 4: Video Components

**1. Reusable Video Player (`official-website/components/ui/video-player.tsx` - NEW):**
```typescript
interface VideoPlayerProps {
  src: string
  mimeType?: string
  title?: string
  className?: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
}

export function VideoPlayer({
  src,
  mimeType = 'video/mp4',
  title = 'Video',
  className = 'w-full rounded-lg',
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true,
}: VideoPlayerProps) {
  return (
    <video
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      controls={controls}
      className={className}
      aria-label={title}
    >
      <source src={src} type={mimeType} />
      <source src={src} type="video/webm" />
      Your browser does not support the video tag.
    </video>
  )
}
```

**2. Event Video Section (`official-website/components/sections/event-video.tsx` - NEW):**
```typescript
interface EventVideoProps {
  video: { asset?: { url: string; mimeType?: string } }
  title?: string
}

export function EventVideoSection({ video, title = 'Event Recording' }: EventVideoProps) {
  if (!video?.asset?.url) return null

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>}
        <VideoPlayer
          src={video.asset.url}
          mimeType={video.asset.mimeType}
          title={title}
          autoPlay={false}
        />
      </div>
    </section>
  )
}
```

**3. Project Promo Video (`official-website/components/sections/project-video.tsx` - NEW):**
```typescript
interface ProjectVideoProps {
  video: { asset?: { url: string; mimeType?: string } }
  title?: string
}

export function ProjectVideoSection({ video, title = 'Project Promo' }: ProjectVideoProps) {
  if (!video?.asset?.url) return null

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>}
        <VideoPlayer
          src={video.asset.url}
          mimeType={video.asset.mimeType}
          title={title}
          autoPlay={true}
          muted={true}
          loop={true}
        />
      </div>
    </section>
  )
}
```

**4. Hero Section (`official-website/components/sections/hero-section.tsx`):**
- Already works with Sanity video
- No changes needed — just ensure `useCdn: true` is set
- Video URL format: `https://cdn.sanity.io/files/{projectId}/{dataset}/...`

---

## Section 5: Sanity Queries

**1. Event Query (`official-website/sanity/queries/events.ts`):**
```typescript
// ADD to existing query:
export const eventQuery = groq`*[_type == "event" && slug.current == $slug][0]{
  ...,
  video{
    asset->{
      _id,
      url,
      mimeType,
      size
    }
  }
}`
```

**2. Project Query (`official-website/sanity/queries/projects.ts`):**
```typescript
// ADD to existing query:
export const projectQuery = groq`*[_type == "project" && slug.current == $slug][0]{
  ...,
  promoVideo{
    asset->{
      _id,
      url,
      mimeType,
      size
    }
  }
}`
```

**3. Home Page Query (`official-website/sanity/queries/homePage.ts`):**
- Already fetches `hero.video` with asset URL
- No changes needed

---

## Section 6: Data Flow

**Flow 1: Video Upload & Playback**
```
Admin uploads video in Sanity Studio (event or project)
  ↓
Sanity processes video → stores in Sanity cloud
  ↓
URL returned: https://cdn.sanity.io/files/{projectId}/{dataset}/...
  ↓
URL stored in event.video or project.promoVideo
  ↓
Website fetches data via GROQ query
  ↓
Returns: { video: { asset: { url: "...", mimeType: "video/mp4" } } }
  ↓
<VideoPlayer src={video.asset.url} />
  ↓
Video loads from Sanity CDN (cached at edge)
```

**Flow 2: Hero Video (Already Works)**
```
Admin uploads video in Sanity Studio (homePage.hero.video)
  ↓
URL stored in hero.video.asset.url
  ↓
HomePage component fetches data
  ↓
<video src={videoUrl} /> (already implemented)
  ↓
Video loads from Sanity CDN (after enabling useCdn: true)
```

**Data Flow Diagram:**
```
┌──────────┐     ┌───────────┐     ┌─────────────┐
│  UI      │────▶│  Sanity     │────▶│  Sanity     │
│  (Next.js)│◀────│  Client     │◀────│  CDN        │
└──────────┘     └───────────┘     │  (cdn.sanity│
                        │                      │  .io)       │
                        │                      └─────────────┘
```

---

## Section 7: Error Handling

**1. Missing Video Handling:**
```typescript
// In VideoPlayer component:
if (!src) {
  return (
    <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
      <p className="text-muted-foreground">No video available</p>
    </div>
  )
}
```

**2. Unsupported Format Handling:**
```typescript
// Already handled by <source> tags with multiple formats:
<video controls>
  <source src={src} type={mimeType} />
  <source src={src} type="video/mp4" />
  <source src={src} type="video/webm" />
  Your browser does not support the video tag.
</video>
```

**3. Sanity Client Error Handling:**
```typescript
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: {
  query: string
  params?: Record<string, unknown>
  tags?: string[]
}): Promise<T> {
  try {
    return await client.fetch<T>(query, params, {
      cache: 'no-store',
      next: { tags },
    })
  } catch (error) {
    console.error('❌ Error fetching from Sanity:', error)
    throw error
  }
}
```

---

## Section 8: Testing Strategy

**1. Unit Tests:**
```typescript
describe('VideoPlayer', () => {
  test('renders video when src provided', () => {
    render(<VideoPlayer src="https://cdn.sanity.io/video.mp4" />)
    expect(screen.getByLabelText('Video')).toBeInTheDocument()
  })

  test('shows fallback when no src', () => {
    render(<VideoPlayer src="" />)
    expect(screen.getByText('No video available')).toBeInTheDocument()
  })
})
```

**2. Integration Tests:**
```typescript
describe('Sanity Client', () => {
  test('uses CDN when useCdn is true', () => {
    // Verify client config
    expect(client.config().useCdn).toBe(true)
  })
})
```

**3. Component Tests:**
```typescript
describe('EventVideoSection', () => {
  test('renders when video exists', () => {
    const mockVideo = { asset: { url: 'https://cdn.sanity.io/video.mp4', mimeType: 'video/mp4' } }
    render(<EventVideoSection video={mockVideo} />)
    expect(screen.getByText('Event Recording')).toBeInTheDocument()
  })

  test('returns null when no video', () => {
    const { container } = render(<EventVideoSection video={{}} />)
    expect(container.firstChild).toBeNull()
  })
})
```

**4. E2E Tests (Future):**
- Upload video in Sanity Studio → Verify CDN URL in response
- Load website page with video → Verify video plays from CDN
- Check hero section video loads correctly

**5. Test Coverage Goals:**
- Components: 70%+ coverage
- Sanity queries: Verify CDN URLs returned

---

## Summary

This design enables Sanity CDN for faster video delivery and adds video fields to event and project schemas.

**Key Changes:**
- Set `useCdn: true` in Sanity client (one line change)
- Add `video` field to event schema
- Add `promoVideo` field to project schema
- Create reusable `VideoPlayer` component
- Create `EventVideoSection` and `ProjectVideoSection` components

**No External CDN Needed:**
- Sanity already serves videos from `cdn.sanity.io`
- Just enable CDN caching with `useCdn: true`
- Videos automatically cached at edge locations

**Next Step:** Implementation (after all specs are reviewed)
