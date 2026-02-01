import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createMeeting } from '@/server-fns/meetings'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { useState } from 'react'
import { format } from 'date-fns'
import { Alert, AlertDescription } from '@/components/ui/alert'

export const Route = createFileRoute('/_authenticated/meetings/new')({
  component: NewMeetingPage,
})

function NewMeetingPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [cancelledDays, setCancelledDays] = useState<Date[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title || !startDate || !endDate) {
      setError('Please fill in all required fields')
      return
    }

    if (startDate > endDate) {
      setError('End date must be after start date')
      return
    }

    setIsLoading(true)

    try {
      await createMeeting({
        data: {
          title,
          description: description || undefined,
          location: location || undefined,
          startDate,
          endDate,
          cancelledDays: cancelledDays.map((d) => format(d, 'yyyy-MM-dd')),
        },
      } as any)
      navigate({ to: '/meetings' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create meeting')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Meeting</h1>
          <p className="text-muted-foreground">Set up a new meeting with date range</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Meeting Details</CardTitle>
            <CardDescription>Enter meeting information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => setStartDate(date)}
                    disabled={isLoading}
                  />
                  {startDate && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {format(startDate, 'PP')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => setEndDate(date)}
                    disabled={(date) => {
                      if (isLoading) return true
                      if (startDate) return date < startDate
                      return false
                    }}
                  />
                  {endDate && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {format(endDate, 'PP')}
                    </p>
                  )}
                </div>
              </div>

              {startDate && endDate && (
                <div className="space-y-2">
                  <Label>Cancelled Days (Optional)</Label>
                  <Calendar
                    mode="multiple"
                    selected={cancelledDays}
                    onSelect={(dates) => setCancelledDays(dates || [])}
                    disabled={(date) => {
                      if (!startDate || !endDate) return true
                      return date < startDate || date > endDate
                    }}
                  />
                  {cancelledDays.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {cancelledDays.length} day(s) cancelled
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Meeting'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: '/meetings' })}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
  )
}

