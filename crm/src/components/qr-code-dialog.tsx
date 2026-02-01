"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { QrCode } from "lucide-react"
import { type CalendarEvent } from "../routes/meetings/types"

interface QRCodeDialogProps {
  event: CalendarEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QRCodeDialog({ event, open, onOpenChange }: QRCodeDialogProps) {
  if (!event) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Meeting QR Code
          </DialogTitle>
          <DialogDescription>
            Scan this QR code to check in to the meeting
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          {event.qrCodeImage ? (
            <>
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <img
                  src={event.qrCodeImage}
                  alt="Meeting QR Code"
                  className="w-64 h-64"
                />
              </div>
              {event.qrCodeUrl && (
                <div className="text-sm text-muted-foreground text-center max-w-xs break-all">
                  <p className="font-medium mb-1">Check-in URL:</p>
                  <p className="text-xs">{event.qrCodeUrl}</p>
                </div>
              )}
              <div className="text-sm text-muted-foreground text-center">
                <p className="font-medium">{event.title}</p>
                {event.date && (
                  <p className="text-xs mt-1">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                QR code not available for this meeting.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                QR codes are only generated for meetings with a specific date.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Close
          </Button>
          {event.qrCodeImage && (
            <Button
              onClick={() => {
                // Create a temporary link to download the QR code
                const link = document.createElement("a")
                link.href = event.qrCodeImage!
                link.download = `qr-code-${event.id}.png`
                link.click()
              }}
            >
              Download
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}


