import { createFileRoute } from '@tanstack/react-router'
import { recordAttendance } from '../../../services/attendance'

export const Route = createFileRoute('/api/attendance/record')({
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
          const { memberId, meetingId, date } = await request.json()

          console.log('memberId', memberId);
          console.log('meetingId', meetingId);
          console.log('date', date);

          if (!memberId) {
            return new Response(JSON.stringify({ error: 'memberId is required' }), {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              }
            })
          }

          const result = await recordAttendance({ data: { memberId, meetingId, date } })

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