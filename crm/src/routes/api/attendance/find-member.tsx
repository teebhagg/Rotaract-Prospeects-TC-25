import { createFileRoute } from '@tanstack/react-router'
import { findMemberByName } from '../../../services/attendance'

export const Route = createFileRoute('/api/attendance/find-member')({
  server: {
    handlers: {
      OPTIONS: async () => {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        })
      },
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const name = url.searchParams.get('name')

        if (!name) {
          return new Response(JSON.stringify({ error: 'Name parameter required' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          })
        }

        try {
          // @ts-expect-error - Server function typing
          const member = await findMemberByName({ name })
          return new Response(JSON.stringify(member), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          })
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          })
        }
      }
    }
  }
})