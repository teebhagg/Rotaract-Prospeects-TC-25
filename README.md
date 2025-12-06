# Rotaract TC-25 Monorepo

A modern, production-ready monorepo containing a **Sanity CMS** project and a **Next.js 15** official website for Rotaract TC-25.

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Webhook Configuration](#webhook-configuration)
- [Contributing](#contributing)

## 🎯 Overview

This monorepo consists of two integrated projects:

1. **CMS** (`/cms`) - Sanity Studio v3 for content management
2. **Official Website** (`/official-website`) - Next.js 15 website with App Router

Both projects are fully integrated, sharing the same Sanity project ID and dataset for seamless content management.

## 📁 Project Structure

```
rotaract-tc-25/
├── cms/                          # Sanity CMS Studio
│   ├── schemas/                  # Content schemas
│   │   ├── homePage.ts
│   │   ├── aboutPage.ts
│   │   ├── project.ts
│   │   ├── event.ts
│   │   ├── blog.ts
│   │   ├── leadership.ts
│   │   ├── testimonial.ts
│   │   ├── galleryImage.ts
│   │   ├── partner.ts
│   │   └── settings.ts
│   ├── sanity.config.ts          # Sanity configuration
│   └── sanity.cli.ts             # CLI configuration
│
└── official-website/              # Next.js Website
    ├── app/                      # App Router pages
    │   ├── page.tsx              # Home page
    │   ├── about/
    │   ├── projects/
    │   ├── events/
    │   ├── blog/
    │   ├── leadership/
    │   ├── gallery/
    │   ├── contact/
    │   └── api/revalidate/       # Webhook endpoint
    ├── components/                # React components
    │   ├── ui/                   # ShadCN UI components
    │   ├── global/               # Navbar, Footer
    │   ├── layout/               # Layout components
    │   ├── sections/             # Home page sections
    │   ├── cards/                # Card components
    │   └── gallery/              # Gallery components
    ├── sanity/                   # Sanity integration
    │   ├── lib/                  # Client & utilities
    │   ├── queries/              # GROQ queries
    │   └── types/                # TypeScript types
    └── lib/                      # Utilities & animations
```

## 🛠 Tech Stack

### CMS (`/cms`)
- **Sanity v3** - Headless CMS
- **TypeScript** - Type safety
- **Sanity Studio** - Content management interface

### Official Website (`/official-website`)
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first CSS framework
- **ShadCN UI** - Component library
- **Framer Motion** - Animation library
- **Sanity Client** - Content fetching
- **Portable Text** - Rich text rendering
- **Lucide React** - Icon library

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Sanity account ([sanity.io](https://sanity.io))

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rotaract-tc-25
   ```

2. **Set up Sanity CMS**
   ```bash
   cd cms
   npm install
   ```
   
   Create a `.env` file:
   ```env
   SANITY_PROJECT_ID=your-project-id
   SANITY_DATASET=production
   SANITY_API_TOKEN=your-api-token
   ```
   
   Get your project ID from [sanity.io/manage](https://sanity.io/manage)

3. **Set up Official Website**
   ```bash
   cd ../official-website
   npm install --legacy-peer-deps
   ```
   
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   REVALIDATION_SECRET=your-secret-token
   ```
   
   ⚠️ **Important**: Use the same `SANITY_PROJECT_ID` in both projects!

## 💻 Development

### Running the CMS Studio

```bash
cd cms
npm run dev
```

Sanity Studio will be available at `http://localhost:3333/studio`

### Running the Website

```bash
cd official-website
npm run dev
```

The website will be available at `http://localhost:3000`

### Running Both Simultaneously

Open two terminal windows:
- Terminal 1: `cd cms && npm run dev`
- Terminal 2: `cd official-website && npm run dev`

## 🚢 Deployment

### Deploying Sanity Studio

```bash
cd cms
npm run deploy
```

This deploys your Sanity Studio to Sanity's hosting at `https://your-project.sanity.studio`

### Deploying the Website

The website can be deployed to:

- **Vercel** (Recommended)
  ```bash
  cd official-website
  vercel
  ```
  
- **Netlify**
  ```bash
  cd official-website
  netlify deploy
  ```
  
- **Any Node.js hosting**

Make sure to set all environment variables in your hosting platform's dashboard.

## ✨ Features

### CMS Features
- ✅ 10 content schemas (Home, About, Projects, Events, Blog, etc.)
- ✅ Custom desk structure with organized sidebar groups
- ✅ Image optimization with hotspot and crop
- ✅ SEO fields for all content types
- ✅ Singleton patterns for Home, About, and Settings pages
- ✅ Video upload support for hero section
- ✅ Portable Text for rich content

### Website Features
- ✅ Fully responsive design (mobile-first)
- ✅ Server-side rendering with Next.js App Router
- ✅ Dynamic routing for projects, events, and blog posts
- ✅ Image optimization with Next.js Image
- ✅ Staggered scroll animations with Framer Motion
- ✅ Gallery with masonry layout and modal view
- ✅ Contact form with icons
- ✅ SEO optimization with dynamic metadata
- ✅ No caching - always fresh content
- ✅ Webhook revalidation for instant updates

### Design Features
- ✅ Modern UI with Fandango (primary) and Beige (background) color scheme
- ✅ Square edges throughout (`rounded-none`)
- ✅ Smooth animations and transitions
- ✅ Accessible components (WCAG compliant)
- ✅ Custom scrollbars
- ✅ Sticky navbar with scroll-based styling
- ✅ Hero section with video/image background support

## 🔐 Environment Variables

### CMS (`.env`)
```env
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
```

### Official Website (`.env.local`)
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
REVALIDATION_SECRET=your-secret-token
```

## 🔗 Webhook Configuration

To enable automatic website revalidation when content changes in Sanity:

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Navigate to **API** → **Webhooks**
4. Create a new webhook:
   - **URL**: `https://your-website.com/api/revalidate?secret=your-secret-token`
   - **Trigger**: "Document created/updated/deleted"
   - **Dataset**: `production`
   - **HTTP method**: POST
5. Use the same secret in your website's `REVALIDATION_SECRET` environment variable

## 📄 Content Schemas

### Pages (Singletons)
- **homePage** - Home page content with hero, sections, and CTAs
- **aboutPage** - About page with mission, vision, values, and timeline
- **settings** - Site-wide settings (title, logo, SEO, social links)

### Content Types
- **project** - Projects with descriptions, timelines, and donation CTAs
- **event** - Events (upcoming/past) with dates, locations, and descriptions
- **blog** - Blog posts with rich text content and featured status

### People
- **leadership** - Leadership team members with bios and images
- **testimonial** - Community testimonials with images

### Media
- **galleryImage** - Gallery images with categories and descriptions
- **partner** - Partners/sponsors with logos and links

## 🎨 Styling & Theming

### Color Scheme
- **Primary**: Fandango (`#ec4899` / `primary-500`)
- **Background**: Light Beige/Cream (`hsl(45 25% 97%)`)
- **Secondary**: Primary-50 shades for backgrounds

### Design System
- All components use square edges (`rounded-none`)
- Consistent spacing and typography
- Smooth animations with Framer Motion
- Custom scrollbars for modals

## 📱 Pages & Routes

### Public Pages
- `/` - Home page with hero, featured content, and sections
- `/about` - About page with mission, vision, values, and leadership
- `/projects` - All projects listing
- `/projects/[slug]` - Individual project page
- `/events` - Events listing (upcoming/past)
- `/events/[slug]` - Individual event page
- `/blog` - Blog posts listing
- `/blog/[slug]` - Individual blog post
- `/leadership` - Leadership team grid
- `/gallery` - Photo gallery with masonry layout
- `/contact` - Contact form and information

### API Routes
- `/api/revalidate` - Webhook endpoint for Sanity revalidation

## 🔄 Data Fetching

All pages use:
- `export const dynamic = 'force-dynamic'`
- `export const revalidate = 0`
- `cache: 'no-store'` in all Sanity fetches

This ensures **always fresh data** from Sanity CMS.

## 🧪 Type Safety

- All Sanity schemas have corresponding TypeScript types
- GROQ queries are fully typed
- Component props are strictly typed
- No `any` types used

## 📚 Documentation

- [CMS README](./cms/README.md) - Detailed CMS documentation
- [Website README](./official-website/README.md) - Detailed website documentation

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful component and variable names
- Add comments for complex logic
- Maintain consistent code formatting
- Test on multiple screen sizes

## 📝 License

This project is private and proprietary.

## 🆘 Support

For issues or questions:
1. Check the individual project READMEs
2. Review the Sanity documentation
3. Check Next.js documentation
4. Contact the development team

## 🎯 Roadmap

- [ ] Add more content types as needed
- [ ] Implement search functionality
- [ ] Add newsletter subscription
- [ ] Enhance gallery with filters
- [ ] Add multi-language support

---

**Built with ❤️ for Rotaract TC-25**

