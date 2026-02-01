"use client"

import { updateMeeting } from "@/services/crm"
import { useCallback, useState } from "react"
import { toast } from "sonner"
import { type CalendarEvent } from "./types"

export interface UseCalendarState {
  selectedDate: Date
  showEventForm: boolean
  editingEvent: CalendarEvent | null
  showCalendarSheet: boolean
  events: CalendarEvent[]
}

export interface UseCalendarActions {
  setSelectedDate: (date: Date) => void
  setShowEventForm: (show: boolean) => void
  setEditingEvent: (event: CalendarEvent | null) => void
  setShowCalendarSheet: (show: boolean) => void
  handleDateSelect: (date: Date) => void
  handleNewEvent: () => void
  handleNewCalendar: () => void
  handleSaveEvent: (eventData: Partial<CalendarEvent>) => void
  handleDeleteEvent: (eventId: string) => void
  handleEditEvent: (event: CalendarEvent) => void
  setEvents: (events: CalendarEvent[]) => void
}

export interface UseCalendarReturn extends UseCalendarState, UseCalendarActions {}

export function useCalendar(initialEvents: CalendarEvent[] = []): UseCalendarReturn {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showEventForm, setShowEventForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [showCalendarSheet, setShowCalendarSheet] = useState(false)
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date)
    // Auto-close mobile sheet when date is selected
    setShowCalendarSheet(false)
  }, [])

  const handleNewEvent = useCallback(() => {
    setEditingEvent(null)
    setShowEventForm(true)
  }, [])

  const handleNewCalendar = useCallback(() => {
    console.log("Creating new calendar")
    // In a real app, this would open a new calendar form
  }, [])

  const updateExistingMeeting = async (payload: Partial<CalendarEvent>) => {
    try {
      // Must have id to update - extract meeting ID from event ID
      if (!payload.id) {
        throw new Error("Event ID is required for update")
      }

      // Extract meeting ID from event ID (for recurring events, format is "meetingId-index")
      const meetingId = typeof payload.id === 'string' 
        ? payload.id.split('-')[0] // Get the base meeting ID before the dash
        : String(payload.id)

      // Map CalendarEvent to the format expected by updateMeeting
      const repeat = (payload.repeat ?? "none").toLowerCase()
      const isRecurring = repeat !== "none"
      
      const meetingData = {
        id: meetingId,
        date: isRecurring ? null : (payload.date ? new Date(payload.date) : new Date()),
        title: payload.title ?? null,
        notes: payload.description ?? null,
        location: payload.location ?? null,
        type: payload.type?.toUpperCase() ?? "CLUB_MEETING",
        repeat: payload.repeat?.toUpperCase() ?? "NONE",
        customDays: payload.customDays ?? null,
        exceptions: (payload as any).exceptions ?? null,
        color: payload.color ?? null,
        time: payload.time ?? null,
        duration: payload.duration ?? null,
      }
      
      const updated = await updateMeeting({ data: meetingData })
      return { ok: true, id: updated?.id ?? null }
    } catch (error) {
      console.error("Error updating meeting:", error)
      throw error // Re-throw to handle in calling function
    }
  }

  const handleSaveEvent = useCallback(async (eventData: Partial<CalendarEvent>) => {
    // Check if this is an update (has id) or a new event
    const isUpdate = !!eventData.id

    if (isUpdate) {
      // Only update existing events - do not create new ones
      try {
        // Update the existing event in the UI optimistically
        const updatedEvent: CalendarEvent = {
          id: (eventData.id as string) ?? String(Date.now()),
          title: (eventData.title as string) ?? "",
          date: eventData.date ? new Date(eventData.date) : new Date(),
          time: (eventData.time as string) ?? "9:00 AM",
          duration: (eventData.duration as string) ?? "1 hour",
          type: (eventData.type as any) ?? "club_meeting",
          location: (eventData.location as string) ?? "",
          color: (eventData.color as string) ?? "bg-blue-500",
          description: (eventData.description as string) ?? "",
          repeat: (eventData.repeat as any) ?? "none",
          customDays: (eventData as any).customDays ?? []
        }

        // Optimistically update UI
        setEvents(prev => prev.map(e => 
          e.id === eventData.id ? updatedEvent : e
        ))
        setShowEventForm(false)
        setEditingEvent(null)

        // Persist to DB (server). If it fails, roll back the optimistic update
        try {
          await updateExistingMeeting(eventData)
          toast.success("Event updated successfully")
        } catch (error) {
          // Rollback optimistic update
          setEvents(prev => prev.map(e => 
            e.id === eventData.id ? editingEvent! : e
          ))
          
          const errorMessage = error instanceof Error ? error.message : "Failed to update event"
          if (errorMessage.includes("not found") || errorMessage.includes("does not exist")) {
            toast.error("Event does not exist")
          } else {
            toast.error(errorMessage)
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to update event"
        toast.error(errorMessage)
      }
    } else {
      // No id means this is a new event, but we should not create it
      // Only updates are allowed
      toast.error("Event does not exist. Cannot create new events from the update form.")
    }
  }, [editingEvent])

  const handleDeleteEvent = useCallback((eventId: string) => {
    console.log("Deleting event:", eventId)
    // In a real app, this would delete from backend
    setShowEventForm(false)
    setEditingEvent(null)
  }, [])

  const handleEditEvent = useCallback((event: CalendarEvent) => {
    setEditingEvent(event)
    setShowEventForm(true)
  }, [])

  return {
    // State
    selectedDate,
    showEventForm,
    editingEvent,
    showCalendarSheet,
    events,
    setEvents,
    // Actions
    setSelectedDate,
    setShowEventForm,
    setEditingEvent,
    setShowCalendarSheet,
    handleDateSelect,
    handleNewEvent,
    handleNewCalendar,
    handleSaveEvent,
    handleDeleteEvent,
    handleEditEvent,
  }
}
