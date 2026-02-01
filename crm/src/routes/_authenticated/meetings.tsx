import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { authClient } from '@/lib/auth-client'
import { getMeetings } from '@/server-fns/meetings'
import { getUserById } from '@/server-fns/users'
import { createFileRoute, Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import { Calendar, Plus } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/meetings')({
  loader: async () => {
    const meetings = await getMeetings()
    const session = await authClient.getSession()
    const userId = session.data?.user?.id
    const role = userId ? (await getUserById({ data: { id: userId } }))?.role : null
    return { meetings, canCreate: role === 'MAIN_ADMIN' || role === 'ASSISTANT' }
  },
  component: MeetingsPage,
})

function MeetingsPage() {
  const { meetings, canCreate } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meetings</h1>
          <p className="text-muted-foreground">
            Manage meetings and track attendance
          </p>
        </div>
        {canCreate && (
          <Link to="/meetings/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Meeting
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Meetings</CardTitle>
          <CardDescription>A list of all meetings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No meetings found
                  </TableCell>
                </TableRow>
              ) : (
                meetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell className="font-medium">{meeting.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {meeting.date ? format(new Date(meeting.date), 'MMM d, yyyy') : 'No date'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{meeting.location || 'Not specified'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {meeting.repeat && meeting.repeat !== 'NONE' ? 'Recurring' : 'One-time'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link to="/meetings/$meetingId" params={{ meetingId: meeting.id }}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

