"use client"

import React from "react"

// Very lightweight multi-select placeholder.
// This is intended as a drop-in for the shadcn-multi-select-component
// and can be replaced by the real component later.

export function MultiSelect({ options, value, onChange }: {
  options: { value: string; label: string }[]
  value: string[]
  onChange: (values: string[]) => void
}) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, opt => opt.value)
    onChange(selected)
  }

  return (
    <div className="border rounded-md p-2 bg-background">
      <select multiple className="w-full h-32 bg-transparent" value={value} onChange={handleChange}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
