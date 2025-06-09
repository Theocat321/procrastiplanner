// src/components/ScheduleView.jsx
import React from 'react'

export default function ScheduleView({ schedule }) {
  const DAY_START = 6      // start at 6am
  const DAY_END = 22       // end at 10pm
  const HOUR_HEIGHT = 60   // px per hour
  const VISIBLE_HOURS = DAY_END - DAY_START
  const CONTAINER_HEIGHT = VISIBLE_HOURS * HOUR_HEIGHT

  const parseTime = timeStr => {
    const [h, m] = timeStr.split(':').map(Number)
    return h * 60 + m
  }

  return (
    <div className="relative w-full overflow-hidden bg-white text-black border rounded-lg">
      <div className="relative" style={{ height: CONTAINER_HEIGHT }}>
        {/* hour grid lines and labels */}
        {Array.from({ length: VISIBLE_HOURS + 1 }).map((_, i) => {
          const hour = DAY_START + i
          return (
            <div
              key={hour}
              className="absolute inset-x-0 border-t border-gray-300"
              style={{ top: i * HOUR_HEIGHT }}
            >
              <span className="absolute -left-12 text-xs text-gray-600">
                {String(hour).padStart(2, '0')}:00
              </span>
            </div>
          )
        })}

        {/* events */}
        {schedule.map((item, idx) => {
          const startMin = parseTime(item.start)
          const endMin   = parseTime(item.end)
          const topPx    = ((startMin - DAY_START * 60) / 60) * HOUR_HEIGHT
          const heightPx = ((endMin - startMin) / 60) * HOUR_HEIGHT

          return (
            <div
              key={idx}
              className="absolute left-16 right-4 rounded-lg bg-blue-300 p-2 shadow"
              style={{ top: topPx, height: heightPx }}
            >
              {/* start-time indicator (offset further left) */}
              <span
                className="absolute -left-14 top-1 text-xs font-mono text-gray-700"
              >
                {item.start}
              </span>

              <div className="text-sm font-semibold">{item.name}</div>
              <div className="text-xs text-gray-700">
                {item.start} – {item.end}
              </div>
              { item.flexible && (
              <div className="text-xs text-gray-500">
                {item.length.toFixed(1)}h • {item.intensity}
              </div>
              )}
              {!item.flexible && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs">
                  Fixed
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
