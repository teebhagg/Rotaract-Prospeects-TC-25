import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Calendar } from '../components/calendar'
import { getCalendarData } from './meetings/data'
import { type CalendarEvent } from './meetings/types'

export const Route = createFileRoute('/meetings')({
  component: Meetings,
})

function Meetings() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [eventDates, setEventDates] = useState<{ date: Date; count: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCalendarData().then((result: { events: CalendarEvent[]; eventDates: { date: Date; count: number }[] }) => {
      console.log("events", result.events)
      setEvents(result.events)
      setEventDates(result.eventDates)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    )
  }

  return <Calendar events={events} eventDates={eventDates} />
}
