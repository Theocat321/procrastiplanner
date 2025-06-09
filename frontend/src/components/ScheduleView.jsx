// src/components/ScheduleView.jsx
import React from 'react'
import { motion, useMotionValue } from 'framer-motion'

export default function ScheduleView({ schedule, onEventUpdate }) {
  const DAY_START = 8    // 08:00
  const DAY_END = 22     // 22:00
  const ROW_HEIGHT = 15  // px per 15 minutes
  const ROWS = (DAY_END - DAY_START) * 4

  const parseTime = timeStr => {
    const [h, m] = timeStr.split(':').map(Number)
    return h * 60 + m
  }
  const formatTime = minutes => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
  }

  const addAllToGoogle = () => {
    // build a local YYYYMMDD prefix in Europe/Madrid
    const now = new Date()
    const pad = n => String(n).padStart(2, '0')
    const datePrefix = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`

    schedule.forEach(item => {
      // drop the trailing 'Z' so it's treated as local time
      const start = `${datePrefix}T${item.start.replace(':', '')}00`
      const end   = `${datePrefix}T${item.end.replace(':',   '')}00`

      const params = new URLSearchParams({
        action:  'TEMPLATE',
        text:    item.name,
        dates:   `${start}/${end}`,
        details: item.flexible ? `${item.length.toFixed(1)}h • ${item.intensity}` : '',
        location:item.location || '',
        ctz:     'Europe/Madrid'
      })

      window.open(
        `https://calendar.google.com/calendar/render?${params.toString()}`,
        '_blank'
      )
    })
  }

  return (
    <div className="relative w-full bg-white text-black border rounded-lg overflow-hidden">
      {/* Google Calendar Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={addAllToGoogle}
          className="px-4 py-2 bg-primary-color text-white rounded hover:bg-blue-700 transition"
        >
          Add All to Google Calendar
        </button>
      </div>

      {/* Time grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: '4rem 1fr',
          gridTemplateRows: `repeat(${ROWS}, ${ROW_HEIGHT}px)`
        }}
      >
        {/* Hour labels */}
        {Array.from({ length: DAY_END - DAY_START + 1 }).map((_, i) => {
          const hour = DAY_START + i
          const row = i * 4 + 1
          return (
            <div
              key={hour}
              className="text-xs text-gray-500"
              style={{
                gridColumn: 1,
                gridRow: row,
                alignSelf: 'start',
                paddingLeft: '0.5rem'
              }}
            >
              {`${String(hour).padStart(2,'0')}:00`}
            </div>
          )
        })}

        {/* Events with live-snapping */}
        {schedule.map((item, idx) => {
          const origStart = parseTime(item.start)
          const duration  = parseTime(item.end) - origStart
          const startRow  = Math.round((origStart - DAY_START * 60) / 15) + 1
          const endRow    = startRow + Math.round(duration / 15)
          const maxUp     = -((origStart - DAY_START * 60) / 15) * ROW_HEIGHT
          const maxDown   = ((DAY_END * 60 - duration - origStart) / 15) * ROW_HEIGHT

          // MotionValue for snapping
          const y = useMotionValue(0)
          const handleDrag = (_, info) => {
            const snapped = Math.round(info.offset.y / ROW_HEIGHT) * ROW_HEIGHT
            y.set(snapped)
          }

          return (
            <motion.div
              key={idx}
              drag="y"
              dragMomentum={false}
              dragElastic={0}
              dragConstraints={{ top: maxUp, bottom: maxDown }}
              onDrag={handleDrag}
              onDragEnd={() => {
                const snappedPx = y.get()
                const deltaRows = snappedPx / ROW_HEIGHT
                const movedMins = deltaRows * 15

                const dayMin = DAY_START * 60
                const dayMax = DAY_END * 60 - duration
                let newStart = origStart + movedMins
                newStart = Math.max(dayMin, Math.min(newStart, dayMax))
                const newEnd = newStart + duration

                // reset visual offset
                y.set(0)

                onEventUpdate(
                  idx,
                  formatTime(newStart),
                  formatTime(newEnd)
                )
              }}
              style={{
                gridColumn: 2,
                gridRow:    `${startRow} / ${endRow}`,
                y
              }}
              className="relative rounded-lg bg-gradient-to-r from-blue-300 to-blue-400 p-2 shadow-lg cursor-grab"
            >
              <div className="text-sm font-semibold">{item.name}</div>
              <div className="text-xs text-gray-700">
                {item.start} – {item.end}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
