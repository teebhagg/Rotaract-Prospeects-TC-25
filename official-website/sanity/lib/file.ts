import {client} from './client'

export function urlForFile(assetRef: string): string {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id'
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  
  // Remove the 'file-' prefix if present
  const assetId = assetRef.replace(/^file-/, '')
  
  // Construct the CDN URL for the file
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${assetId}`
}

