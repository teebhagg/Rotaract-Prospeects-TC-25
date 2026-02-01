import { createFileRoute } from '@tanstack/react-router'
import { getMeetingById } from '@/server-fns/meetings'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export const Route = createFileRoute('/_authenticated/meetings/$meetingId')({
  loader: async ({ params }) => {
    const meeting = await getMeetingById({ data: { id: params.meetingId } })
    if (!meeting) {
      throw new Error('Meeting not found')
    }
    return { meeting }
  },
  component: MeetingDetailsPage,
})

function MeetingDetailsPage() {
  const { meeting } = Route.useLoaderData()
  const date = meeting.date ? new Date(meeting.date) : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{meeting.title || 'Meeting'}</h1>
        <p className="text-muted-foreground">
          {date ? format(date, 'PP') : 'No date set'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meeting Information</CardTitle>
          <CardDescription>Details for this meeting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Location</p>
            <p>{meeting.location || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Notes</p>
            <p>{meeting.notes || 'No notes'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Repeat</p>
            <Badge variant="secondary">
              {meeting.repeat && meeting.repeat !== 'NONE' ? meeting.repeat : 'NONE'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

