import { createFileRoute } from '@tanstack/react-router'
import { createMemberAndAttendance } from '../../../services/attendance'

export const Route = createFileRoute('/api/attendance/create-member')({
  server: {
    handlers: {
      OPTIONS: async () => {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        })
      },
      POST: async ({ request }) => {
        try {
          const data = await request.json()
          const result = await createMemberAndAttendance({ data })

          return new Response(JSON.stringify(result), {
            status: 201,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          })
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          return new Response(JSON.stringify({ error: errorMessage }), {
            status: 400,
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