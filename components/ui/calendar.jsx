"use client"

import React, { useState } from "react"

export function Calendar({ value, onChange, className = "", ...props }) {
  const [selectedDate, setSelectedDate] = useState(value || "")

  const handleChange = (e) => {
    setSelectedDate(e.target.value)
    if (onChange) onChange(e.target.value)
  }

  return (
    <input
      type="date"
      value={selectedDate}
      onChange={handleChange}
      className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
      {...props}
    />
  )
}
