import { createFileRoute } from '@tanstack/react-router'
import { markAttendanceByQrCode } from '@/lib/server/attendance'
import { getMeetingDayByQrCode } from '@/lib/server/meetings'

export const Route = createFileRoute('/api/attendance/qr')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const code = url.searchParams.get('code')

        if (!code) {
          return new Response(
            JSON.stringify({ error: 'QR code is required' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }

        try {
          const meetingDay = await getMeetingDayByQrCode(code)
          if (!meetingDay) {
            return new Response(
              JSON.stringify({ error: 'Invalid QR code' }),
              {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          // Return meeting day info (for the separate web page to display)
          return new Response(
            JSON.stringify({
              meetingId: meetingDay.meetingId,
              date: meetingDay.date,
              isCancelled: meetingDay.isCancelled,
              expired: new Date() > meetingDay.qrCodeExpiresAt,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          return new Response(
            JSON.stringify({ error: 'Failed to validate QR code' }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }
      },
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const { code, memberName } = body

          if (!code || !memberName) {
            return new Response(
              JSON.stringify({ error: 'QR code and member name are required' }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const attendance = await markAttendanceByQrCode(code, memberName)

          return new Response(
            JSON.stringify({
              success: true,
              message: 'Attendance marked successfully',
              attendance: {
                id: attendance.id,
                status: attendance.status,
              },
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          return new Response(
            JSON.stringify({
              error: error instanceof Error ? error.message : 'Failed to mark attendance',
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }
      },
    },
  },
})

