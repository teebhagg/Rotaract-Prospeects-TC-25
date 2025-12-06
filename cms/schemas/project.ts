import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline',
      type: 'object',
      fields: [
        defineField({
          name: 'startDate',
          title: 'Start Date',
          type: 'date',
        }),
        defineField({
          name: 'endDate',
          title: 'End Date',
          type: 'date',
        }),
        defineField({
          name: 'status',
          title: 'Status',
          type: 'string',
          options: {
            list: [
              {title: 'Planning', value: 'planning'},
              {title: 'Active', value: 'active'},
              {title: 'Completed', value: 'completed'},
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'donationCTA',
      title: 'Donation Call to Action',
      type: 'object',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Enable Donation CTA',
          type: 'boolean',
        }),
        defineField({
          name: 'text',
          title: 'CTA Text',
          type: 'string',
        }),
        defineField({
          name: 'link',
          title: 'Donation Link',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this project on the homepage',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Order for sorting (lower numbers appear first)',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
        }),
        defineField({
          name: 'ogImage',
          title: 'OG Image',
          type: 'image',
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      featured: 'featured',
    },
    prepare({title, media, featured}) {
      return {
        title,
        subtitle: featured ? 'Featured' : '',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Title',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
})

