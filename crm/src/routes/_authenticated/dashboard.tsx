import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAttendanceStats } from '@/server-fns/attendance'
import { getMeetings } from '@/server-fns/meetings'
import { createFileRoute } from '@tanstack/react-router'
import { endOfMonth, startOfMonth } from 'date-fns'

export const Route = createFileRoute('/_authenticated/dashboard')({
  loader: async () => {
    const stats = await getAttendanceStats()
    const meetings = await getMeetings()
    
    // Calculate meetings this month
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)
    const meetingsThisMonth = meetings.filter((m) => {
      const meetingDate = new Date((m as any).date ?? (m as any).createdAt ?? now)
      return meetingDate >= monthStart && meetingDate <= monthEnd
    }).length

    return { stats, meetingsThisMonth }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { stats, meetingsThisMonth } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of attendance and meetings
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMeetings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalMeetings === 1 ? 'Meeting scheduled' : 'Meetings scheduled'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalMembers === 1 ? 'Member' : 'Members'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.presentCount} present / {stats.totalAttendance} total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meetingsThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              {meetingsThisMonth === 1 ? 'Meeting this month' : 'Meetings this month'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

