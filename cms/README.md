# Rotaract TC-25 CMS

Sanity CMS v3 project for managing content for the Rotaract TC-25 official website.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root of the `cms` directory:
```env
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
```

3. Get your Sanity project ID:
   - Go to [sanity.io/manage](https://sanity.io/manage)
   - Create a new project or use an existing one
   - Copy the project ID to your `.env` file

4. Run the development server:
```bash
npm run dev
```

The Sanity Studio will be available at `http://localhost:3333/studio`

## Deployment

Deploy your Sanity Studio to Sanity's hosting:

```bash
npm run deploy
```

## Schemas

This CMS includes the following schemas:

- **homePage**: Home page content and sections
- **aboutPage**: About page with mission, vision, values, and timeline
- **project**: Project listings with descriptions and donation CTAs
- **event**: Events (upcoming and past) with dates and locations
- **blog**: Blog posts with rich text content
- **leadership**: Leadership team members with bios
- **testimonial**: Testimonials from community members
- **galleryImage**: Gallery images with categories
- **partner**: Partner/sponsor information
- **settings**: Site-wide settings (title, logo, SEO, social links)

## Desk Structure

The CMS is organized into four main groups:

1. **Pages**: Home page, About page, Settings
2. **Content**: Projects, Events, Blog posts
3. **People**: Leadership, Testimonials
4. **Media**: Gallery Images, Partners

## Webhook Configuration

To enable automatic revalidation of the Next.js website when content changes:

1. Go to your Sanity project settings
2. Navigate to API → Webhooks
3. Create a new webhook pointing to: `https://your-website.com/api/revalidate`
4. Set the trigger to "Document created/updated/deleted"
5. Add your revalidation secret token

## API Access

The CMS is configured to allow CORS requests from your Next.js website. Make sure to:

1. Set up API tokens in Sanity project settings
2. Use the token in your Next.js environment variables
3. Configure CORS settings if needed for production

## Image Optimization

All image fields support hotspot and crop functionality. Images are automatically optimized through Sanity's CDN.

