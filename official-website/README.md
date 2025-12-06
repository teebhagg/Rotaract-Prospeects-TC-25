# Rotaract TC-25 Official Website

Next.js 14 website for Rotaract TC-25, built with Sanity CMS integration, Tailwind CSS v4, ShadCN UI, and Framer Motion.

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **ShadCN UI** components (all rounded)
- **Framer Motion** for animations
- **Sanity CMS** integration with GROQ queries
- **No caching** - always fresh data (`force-dynamic`, `revalidate: 0`)
- **SEO optimized** with metadata from Sanity
- **Fully responsive** design
- **Accessible** components

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root of the `official-website` directory:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
REVALIDATION_SECRET=your-secret-token
```

3. Get your Sanity project ID:
   - Use the same project ID from your CMS setup
   - Make sure the dataset matches (default: `production`)

4. Run the development server:
```bash
npm run dev
```

The website will be available at `http://localhost:3000`

## Project Structure

```
official-website/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── about/              # About page
│   ├── projects/           # Projects listing and detail pages
│   ├── events/             # Events listing and detail pages
│   ├── blog/               # Blog listing and detail pages
│   ├── leadership/         # Leadership page
│   ├── gallery/            # Gallery page
│   ├── contact/             # Contact page
│   └── api/revalidate/     # Webhook endpoint for Sanity
├── components/
│   ├── ui/                 # ShadCN UI components
│   ├── global/             # Navbar, Footer
│   ├── layout/             # Section container, Page header
│   ├── sections/           # Home page sections
│   └── cards/              # Card components
├── sanity/
│   ├── lib/                # Sanity client and image utilities
│   ├── queries/            # GROQ queries
│   └── types/              # TypeScript types
└── lib/
    ├── utils.ts            # Utility functions
    └── animations.ts       # Framer Motion variants
```

## Pages

- **Home** (`/`) - Hero, featured projects, events, blog posts, partners, CTA
- **About** (`/about`) - Mission, vision, values, leadership, timeline
- **Projects** (`/projects`) - All projects listing
- **Project Detail** (`/projects/[slug]`) - Individual project page
- **Events** (`/events`) - Upcoming and past events
- **Event Detail** (`/events/[slug]`) - Individual event page
- **Blog** (`/blog`) - All blog posts
- **Blog Post** (`/blog/[slug]`) - Individual blog post with portable text
- **Leadership** (`/leadership`) - Leadership team grid
- **Gallery** (`/gallery`) - Photo gallery with masonry layout
- **Contact** (`/contact`) - Contact form and information

## Caching & Data Fetching

All pages use:
- `export const dynamic = 'force-dynamic'`
- `export const revalidate = 0`
- `cache: 'no-store'` in all Sanity fetches

This ensures **always fresh data** from Sanity CMS.

## Webhook Revalidation

To enable automatic revalidation when content changes in Sanity:

1. Go to your Sanity project settings
2. Navigate to API → Webhooks
3. Create a new webhook:
   - URL: `https://your-website.com/api/revalidate?secret=your-secret-token`
   - Trigger: "Document created/updated/deleted"
   - Dataset: `production`
4. Add the same secret to your `.env.local` as `REVALIDATION_SECRET`

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Your Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Your Sanity dataset (default: `production`)
- `REVALIDATION_SECRET` - Secret token for webhook revalidation

## Styling

- **Theme**: Pink color scheme (easily changeable in `tailwind.config.ts`)
- **Components**: All ShadCN UI components are rounded
- **Animations**: Framer Motion variants in `/lib/animations.ts`

## Type Safety

All Sanity schemas have corresponding TypeScript types in `/sanity/types/index.ts`. GROQ queries are fully typed.

## Deployment

This project can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Any Node.js hosting**

Make sure to set all environment variables in your hosting platform's dashboard.

