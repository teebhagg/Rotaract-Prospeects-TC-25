"use client"

import { addDays, addMonths, addWeeks, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, setHours, startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from "date-fns"
import {
    CalendarDays,
    Calendar as CalendarIcon,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock,
    Grid3X3,
    List,
    MapPin,
    Menu,
    MoreHorizontal,
    Search
} from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { type CalendarEvent } from "../routes/meetings/types"

// Import data
import eventsData from "../routes/meetings/data/events.json"

interface CalendarMainProps {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  onMenuClick?: () => void
  events?: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
}

export function CalendarMain({ selectedDate, onDateSelect, onMenuClick, events, onEventClick }: CalendarMainProps) {
  // Convert JSON events to CalendarEvent objects with proper Date objects, fallback to imported data
  const sampleEvents: CalendarEvent[] = events || eventsData.map(event => ({
    ...event,
    date: new Date(event.date),
    type: event.type as "club_meeting" | "meeting" | "event" | "personal" | "task" | "reminder"
  }))

  const [currentDate, setCurrentDate] = useState(selectedDate || new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "list">("month")
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  // Extend to show full weeks (including previous/next month days)
  const calendarStart = new Date(monthStart)
  calendarStart.setDate(calendarStart.getDate() - monthStart.getDay())

  const calendarEnd = new Date(monthEnd)
  calendarEnd.setDate(calendarEnd.getDate() + (6 - monthEnd.getDay()))

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getEventsForDay = (date: Date) => {
    return sampleEvents.filter(event => isSameDay(event.date, date))
  }

  const getEventsForHour = (date: Date, hour: number) => {
    const hourStart = setHours(startOfDay(date), hour)
    const hourEnd = setHours(startOfDay(date), hour + 1)
    return sampleEvents.filter(event => {
      const eventDate = event.date
      return eventDate >= hourStart && eventDate < hourEnd
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(direction === "prev" ? subMonths(currentDate, 1) : addMonths(currentDate, 1))
  }

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate(direction === "prev" ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1))
  }

  const navigateDay = (direction: "prev" | "next") => {
    setCurrentDate(direction === "prev" ? subDays(currentDate, 1) : addDays(currentDate, 1))
  }

  const navigate = (direction: "prev" | "next") => {
    if (viewMode === "month") {
      navigateMonth(direction)
    } else if (viewMode === "week") {
      navigateWeek(direction)
    } else if (viewMode === "day") {
      navigateDay(direction)
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleEventClick = (event: CalendarEvent) => {
    if (onEventClick) {
      onEventClick(event)
    } else {
      setSelectedEvent(event)
      setShowEventDialog(true)
    }
  }

  const renderCalendarGrid = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
      <div className="flex-1 bg-background">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 border-b">
          {weekDays.map(day => (
            <div key={day} className="p-4 text-center font-medium text-sm text-muted-foreground border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="grid grid-cols-7 flex-1">
          {calendarDays.map(day => {
            const dayEvents = getEventsForDay(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isDayToday = isToday(day)
            const isSelected = selectedDate && isSameDay(day, selectedDate)

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "min-h-[120px] border-r border-b last:border-r-0 p-2 cursor-pointer transition-colors",
                  isCurrentMonth ? "bg-background hover:bg-accent/50" : "bg-muted/30 text-muted-foreground",
                  isSelected && "ring-2 ring-primary ring-inset",
                  isDayToday && "bg-accent/20"
                )}
                onClick={() => onDateSelect?.(day)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={cn(
                    "text-sm font-medium",
                    isDayToday && "bg-primary text-primary-foreground rounded-md w-6 h-6 flex items-center justify-center text-xs"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {dayEvents.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{dayEvents.length - 2}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className={cn(
                        "text-xs p-1 rounded-sm text-white cursor-pointer truncate",
                        event.color
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEventClick(event)
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="truncate">{event.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 })
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
    const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
      <div className="flex-1 bg-background overflow-auto">
        {/* Week Header */}
        <div className="grid grid-cols-8 border-b sticky top-0 bg-background z-10">
          <div className="p-4 border-r font-medium text-sm text-muted-foreground">
            Time
          </div>
          {weekDays.map((day, index) => {
            const isDayToday = isToday(day)
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "p-4 text-center border-r last:border-r-0 cursor-pointer transition-colors",
                  isDayToday && "bg-accent/20",
                  isSelected && "ring-2 ring-primary ring-inset"
                )}
                onClick={() => onDateSelect?.(day)}
              >
                <div className="text-xs text-muted-foreground mb-1">{weekDayNames[index]}</div>
                <div className={cn(
                  "text-lg font-semibold",
                  isDayToday && "bg-primary text-primary-foreground rounded-md w-8 h-8 flex items-center justify-center mx-auto"
                )}>
                  {format(day, 'd')}
                </div>
              </div>
            )
          })}
        </div>

        {/* Week Body - Hourly Grid */}
        <div className="grid grid-cols-8">
          {/* Time Column */}
          <div className="border-r">
            {Array.from({ length: 24 }, (_, i) => i).map(hour => (
              <div
                key={hour}
                className="h-16 border-b p-2 text-xs text-muted-foreground"
              >
                {format(setHours(startOfDay(currentDate), hour), 'h:mm a')}
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDays.map(day => {
            const dayEvents = getEventsForDay(day)
            const isDayToday = isToday(day)
            const isSelected = selectedDate && isSameDay(day, selectedDate)

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "border-r last:border-r-0 relative",
                  isDayToday && "bg-accent/10",
                  isSelected && "ring-2 ring-primary ring-inset"
                )}
              >
                {Array.from({ length: 24 }, (_, i) => i).map(hour => {
                  const hourEvents = getEventsForHour(day, hour)
                  return (
                    <div
                      key={hour}
                      className={cn(
                        "h-16 border-b p-1 relative",
                        isDayToday && "bg-accent/5"
                      )}
                      onClick={() => {
                        const clickedDate = setHours(startOfDay(day), hour)
                        onDateSelect?.(clickedDate)
                      }}
                    >
                      {hourEvents.map((event, idx) => {
                        const eventHour = event.date.getHours()
                        const eventMinutes = event.date.getMinutes()
                        const topOffset = (eventMinutes / 60) * 64 // 64px = h-16
                        const height = 48 // Approximate height for event block

                        return (
                          <div
                            key={event.id}
                            className={cn(
                              "absolute left-1 right-1 rounded-sm text-white text-xs p-1 cursor-pointer z-10 overflow-hidden",
                              event.color
                            )}
                            style={{
                              top: `${topOffset}px`,
                              height: `${height}px`,
                              zIndex: 10 + idx
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEventClick(event)
                            }}
                          >
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate font-medium">{event.title}</span>
                            </div>
                            <div className="text-xs opacity-90 truncate">{format(event.date, 'h:mm a')}</div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const dayStart = startOfDay(currentDate)
    const isDayToday = isToday(currentDate)
    const dayEvents = getEventsForDay(currentDate)

    // Generate hours from 6 AM to 11 PM
    const hours = Array.from({ length: 18 }, (_, i) => i + 6) // 6 AM to 11 PM

    return (
      <div className="flex-1 bg-background overflow-auto">
        {/* Day Header */}
        <div className="border-b sticky top-0 bg-background z-10 p-4">
          <div className={cn(
            "flex items-center justify-between",
            isDayToday && "bg-accent/20 rounded-lg p-2"
          )}>
            <div>
              <h2 className="text-2xl font-semibold">{format(currentDate, 'EEEE, MMMM d, yyyy')}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
              </p>
            </div>
          </div>
        </div>

        {/* Day Body - Hourly Timeline */}
        <div className="grid grid-cols-12">
          {/* Time Column */}
          <div className="col-span-2 border-r">
            {hours.map(hour => (
              <div
                key={hour}
                className="h-24 border-b p-2"
              >
                <div className="text-sm font-medium">
                  {format(setHours(dayStart, hour), 'h:mm a')}
                </div>
              </div>
            ))}
          </div>

          {/* Events Column */}
          <div className="col-span-10 relative">
            {hours.map(hour => {
              const hourStart = setHours(dayStart, hour)
              const hourEnd = setHours(dayStart, hour + 1)
              const hourEvents = sampleEvents.filter(event => {
                const eventDate = event.date
                return eventDate >= hourStart && eventDate < hourEnd
              })

              return (
                <div
                  key={hour}
                  className="h-24 border-b p-2 relative"
                  onClick={() => {
                    const clickedDate = setHours(dayStart, hour)
                    onDateSelect?.(clickedDate)
                  }}
                >
                  {hourEvents.map((event, idx) => {
                    const eventHour = event.date.getHours()
                    const eventMinutes = event.date.getMinutes()
                    const topOffset = (eventMinutes / 60) * 96 // 96px = h-24
                    const duration = event.duration || "1 hour"
                    const durationHours = duration.includes("hour") 
                      ? parseFloat(duration) || 1 
                      : 0.5 // Default to 30 min if not specified
                    const height = Math.max(durationHours * 96, 48) // Minimum 48px height

                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute left-2 right-2 rounded-md text-white p-2 cursor-pointer shadow-sm",
                          event.color
                        )}
                        style={{
                          top: `${topOffset}px`,
                          height: `${height}px`,
                          zIndex: 10 + idx
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEventClick(event)
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{event.title}</div>
                            <div className="text-xs opacity-90 mt-1">
                              {format(event.date, 'h:mm a')} - {duration}
                            </div>
                            {event.location && (
                              <div className="text-xs opacity-75 mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const renderListView = () => {
    const upcomingEvents = sampleEvents
      .filter(event => event.date >= new Date())
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    return (
      <div className="flex-1 p-6">
        <div className="space-y-4">
          {upcomingEvents.map(event => (
            <Card key={event.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleEventClick(event)}>
              <CardContent className="px-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn("w-3 h-3 rounded-full mt-1.5", event.color)} />
                    <div className="flex-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center flex-wrap gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {format(event.date, 'MMM d, yyyy')}
                        </div>
                        <div className="flex items-center flex-wrap gap-1">
                          <Clock className="w-4 h-4" />
                          {format(event.date, 'h:mm a')}
                        </div>
                        <div className="flex items-center flex-wrap gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="cursor-pointer">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col flex-wrap gap-4 p-6 border-b md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="sm"
            className="xl:hidden cursor-pointer"
            onClick={onMenuClick}
          >
            <Menu className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("prev")} className="cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("next")} className="cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday} className="cursor-pointer">
              Today
            </Button>
          </div>

          <h1 className="text-2xl font-semibold">
            {viewMode === "month" && format(currentDate, 'MMMM yyyy')}
            {viewMode === "week" && (() => {
              const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
              const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 })
              return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
            })()}
            {viewMode === "day" && format(currentDate, 'MMMM d, yyyy')}
            {viewMode === "list" && "Upcoming Events"}
          </h1>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search events..." className="pl-10 w-64" />
          </div>

          {/* View Mode Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="cursor-pointer">
                {viewMode === "month" && <Grid3X3 className="w-4 h-4 mr-2" />}
                {viewMode === "week" && <CalendarDays className="w-4 h-4 mr-2" />}
                {viewMode === "day" && <CalendarIcon className="w-4 h-4 mr-2" />}
                {viewMode === "list" && <List className="w-4 h-4 mr-2" />}
                {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setViewMode("month")} className="cursor-pointer">
                <Grid3X3 className="w-4 h-4 mr-2" />
                Month
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("week")} className="cursor-pointer">
                <CalendarDays className="w-4 h-4 mr-2" />
                Week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("day")} className="cursor-pointer">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Day
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("list")} className="cursor-pointer">
                <List className="w-4 h-4 mr-2" />
                List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Calendar Content */}
      {viewMode === "month" && renderCalendarGrid()}
      {viewMode === "week" && renderWeekView()}
      {viewMode === "day" && renderDayView()}
      {viewMode === "list" && renderListView()}

      {/* Event Detail Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title || "Event Details"}</DialogTitle>
            <DialogDescription>
              View and manage this calendar event
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                <span>{format(selectedEvent.date, 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{format(selectedEvent.date, 'h:mm a')} ({selectedEvent.duration})</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{selectedEvent.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={cn("text-white", selectedEvent.color)}>
                  {selectedEvent.type}
                </Badge>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1 cursor-pointer" onClick={() => {
                  setShowEventDialog(false)
                }}>Edit</Button>
                <Button variant="destructive" className="flex-1 cursor-pointer" onClick={() => {
                  setShowEventDialog(false)
                }}>Delete</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
