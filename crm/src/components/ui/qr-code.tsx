import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

type QRCodeDisplayProps = {
  value: string
  size?: number
  className?: string
}

export function QRCodeDisplay({ value, size = 200, className }: QRCodeDisplayProps) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setSrc(null)

    ;(async () => {
      const QRCode = await import("qrcode")
      const url = await QRCode.toDataURL(value, {
        width: size,
        margin: 2,
        errorCorrectionLevel: "M",
      })
      if (!cancelled) setSrc(url)
    })().catch(() => {
      if (!cancelled) setSrc(null)
    })

    return () => {
      cancelled = true
    }
  }, [value, size])

  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground",
          className
        )}
        style={{ width: size, height: size }}
      >
        Generating QR…
      </div>
    )
  }

  return (
    <img
      className={cn("rounded-md border bg-white p-2", className)}
      src={src}
      alt="QR code"
      width={size}
      height={size}
    />
  )
}



