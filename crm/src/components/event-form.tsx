"use client"

import { format } from "date-fns"
import { CalendarIcon, Clock, MapPin, QrCode, Tag, Type } from "lucide-react"
import { useEffect, useState } from "react"

import { MultiSelect } from "@/components/multi-select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { type CalendarEvent } from "../routes/meetings/types"
import { QRCodeDialog } from "./qr-code-dialog"

interface EventFormProps {
  event?: CalendarEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (event: Partial<CalendarEvent>) => void
  onDelete?: (eventId: string) => void
}

// Event types: currently only Club Meetings are supported for now
const eventTypes = [
  { value: "club_meeting", label: "Club Meetings", color: "bg-blue-500" }
]

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM"
]

const durationOptions = [
  "15 min", "30 min", "45 min", "1 hour", "1.5 hours", "2 hours", "3 hours", "All day"
]

export function EventForm({ event, open, onOpenChange, onSave, onDelete }: EventFormProps) {
  const [formData, setFormData] = useState<Partial<CalendarEvent>>({
    id: undefined,
    title: "",
    date: undefined,
    time: "9:00 AM",
    duration: "1 hour",
    type: "club_meeting",
    location: "",
    description: "",
    customDays: [],
    repeat: "none",
  })

  // Repeat settings
  const [repeat, setRepeat] = useState<CalendarEvent["repeat"]>("none")
  const [customDays, setCustomDays] = useState<string[]>([])
  const [showCalendar, setShowCalendar] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)

  // Sync form state when dialog opens or event changes
  useEffect(() => {
    if (open) {
      // Only update state when dialog is actually open
      if (event) {
        console.log("EventForm event:", event)
        // Editing existing event - use nullish coalescing to preserve empty strings
        // Extract values with proper defaults
        const eventRepeat = event.repeat ?? "none"
        const eventCustomDays = Array.isArray(event.customDays) ? event.customDays : []
        const eventTime = (event.time && typeof event.time === "string" && event.time.trim() !== "") ? event.time : "9:00 AM"
        const eventDuration = (event.duration && typeof event.duration === "string" && event.duration.trim() !== "") ? event.duration : "1 hour"

        console.log("Setting customDays:", eventCustomDays)

        // Update repeat state first
        setRepeat(eventRepeat)
        setCustomDays(eventCustomDays)

        // Update form data
        setFormData({
          id: event.id,
          title: event.title ?? "",
          date: eventRepeat === "none" ? (event.date ? new Date(event.date) : new Date()) : undefined,
          time: eventTime,
          duration: eventDuration,
          type: event.type ?? "club_meeting",
          location: event.location ?? "",
          description: event.description ?? "",
          customDays: eventCustomDays,
          repeat: eventRepeat,
        })
      } else {
        // Creating new event - reset to defaults
        setFormData({
          id: undefined,
          title: "",
          date: new Date(),
          time: "9:00 AM",
          duration: "1 hour",
          type: "club_meeting",
          location: "",
          description: "",
          customDays: [],
          repeat: "none",
        })
        setRepeat("none")
        setCustomDays([])
      }
      setShowCalendar(false)
    }
  }, [open, event])

  const handleSave = () => {
    const eventData: Partial<CalendarEvent> = {
      ...formData,
      type: formData.type as CalendarEvent["type"],
      id: event?.id,
      color: eventTypes.find(t => t.value === formData.type)?.color || "bg-blue-500",
      repeat: repeat as CalendarEvent["repeat"],
      customDays: repeat === "custom" ? customDays : undefined
    }
    onSave(eventData)
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (event?.id && onDelete) {
      onDelete(event.id)
      onOpenChange(false)
    }
  }

  const selectedEventType = eventTypes.find(t => t.value === formData.type)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", selectedEventType?.color)} />
            {event ? "Edit Event" : "Create New Event"}
          </DialogTitle>
          <DialogDescription>
            {event ? "Make changes to this event" : "Add a new event to your calendar"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Event Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Event Title
            </Label>
            <Input
              id="title"
              placeholder="Enter event title..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="text-lg font-medium"
            />
          </div>

          {/* Event Type and Repeat (horizontal) */}
          <div className="flex flex-wrap items-start gap-6">
            <div className="flex-1">
              <Label className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Event Type
              </Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as CalendarEvent["type"] }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", type.color)} />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Repeat
              </Label>
              <Select
                value={repeat}
                onValueChange={(value) => setRepeat(value as CalendarEvent["repeat"])}
              >
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="everyday">Everyday</SelectItem>
                  <SelectItem value="weekdays">Weekdays</SelectItem>
                  <SelectItem value="weekends">Weekends</SelectItem>
                  <SelectItem value="custom">Custom days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Repeat options (moved to horizontal row above) */}
          {repeat === "custom" && (
            <div className="space-y-2">
              <Label>Custom Days</Label>
              <MultiSelect
                key={`custom-days-${event?.id || 'new'}`}
                variant="default"
                onValueChange={(value) => setCustomDays(value)}
                placeholder="Select days..."
                options={[
                  { value: "Mon", label: "Monday" },
                  { value: "Tue", label: "Tuesday" },
                  { value: "Wed", label: "Wednesday" },
                  { value: "Thu", label: "Thursday" },
                  { value: "Fri", label: "Friday" },
                  { value: "Sat", label: "Saturday" },
                  { value: "Sun", label: "Sunday" }
                ]}
                value={Array.isArray(customDays) ? customDays : []}
                defaultValue={Array.isArray(customDays) ? customDays : []}
                resetOnDefaultValueChange={true}
              />
            </div>
          )}

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            { /* determine if date should be disabled due to recurrence */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Date
              </Label>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={repeat !== "none"}
                  >
                    {repeat !== "none" ? "Recurring" : (formData.date ? format(formData.date, "PPP") : "Select date")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => {
                      if (date) {
                        setFormData(prev => ({ ...prev, date }))
                        setShowCalendar(false)
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time
              </Label>
              <Select value={formData.time} onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration and All Day */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map(duration => (
                    <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </Label>
            <Input
              id="location"
              placeholder="Add location..."
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          {/* Attendees removed per request */}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add description..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6">
            <Button onClick={handleSave} className="flex-1 cursor-pointer">
              {event ? "Update Event" : "Create Event"}
            </Button>
            {event && onDelete && (
              <Button onClick={handleDelete} variant="destructive" className="cursor-pointer">
                Delete
              </Button>
            )}
            {event && event.qrCodeImage && (
              <Button
                onClick={() => setShowQRCode(true)}
                variant="outline"
                className="cursor-pointer"
              >
                <QrCode className="w-4 h-4 mr-2" />
                QR Code
              </Button>
            )}
            <Button onClick={() => onOpenChange(false)} variant="outline" className="cursor-pointer">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* QR Code Dialog */}
      <QRCodeDialog
        event={event || null}
        open={showQRCode}
        onOpenChange={setShowQRCode}
      />
    </Dialog>
  )
}
