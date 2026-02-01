import { createFileRoute } from '@tanstack/react-router';

// @ts-expect-error - Route path not yet in FileRoutesByPath
export const Route = createFileRoute('/api/attendance/members')({
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
      GET: async () => {
        try {
          const { prisma } = await import("@/db");
          const members = await prisma.member.findMany({
            orderBy: {
              name: 'asc'
            }
          });

          return new Response(JSON.stringify(members), {
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
