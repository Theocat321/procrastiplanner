// src/components/ScheduleView.jsx
import React from 'react'
import { motion } from 'framer-motion'

export default function ScheduleView({ schedule }) {
  const DAY_START = 6
  const DAY_END = 22
  const HOUR_HEIGHT = 60
  const VISIBLE_HOURS = DAY_END - DAY_START
  const CONTAINER_HEIGHT = VISIBLE_HOURS * HOUR_HEIGHT

  const parseTime = timeStr => {
    const [h, m] = timeStr.split(':').map(Number)
    return h * 60 + m
  }

  return (
    <motion.div
      className="relative w-full overflow-hidden bg-white text-black border rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative" style={{ height: CONTAINER_HEIGHT }}>
        {Array.from({ length: VISIBLE_HOURS + 1 }).map((_, i) => {
          const hour = DAY_START + i
          return (
            <div
              key={hour}
              className="absolute inset-x-0 border-t border-gray-200"
              style={{ top: i * HOUR_HEIGHT }}
            >
              <span className="absolute -left-16 text-xs text-gray-500">
                {String(hour).padStart(2, '0')}:00
              </span>
            </div>
          )
        })}

        {schedule.map((item, idx) => {
          const startMin = parseTime(item.start)
          const endMin = parseTime(item.end)
          const topPx = ((startMin - DAY_START * 60) / 60) * HOUR_HEIGHT
          const heightPx = ((endMin - startMin) / 60) * HOUR_HEIGHT

          return (
            <motion.div
              key={idx}
              className="absolute left-20 right-6 rounded-lg bg-gradient-to-r from-blue-300 to-blue-400 p-3 shadow-lg cursor-grab"
              style={{ top: topPx, height: heightPx }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }}
              drag="y"
              dragConstraints={{ top: 0, bottom: CONTAINER_HEIGHT - heightPx }}
              dragElastic={0.1}
            >
              <span className="absolute -left-20 top-1 text-xs font-mono text-gray-600">
                {item.start}
              </span>
              <div className="text-sm font-semibold">{item.name}</div>
              <div className="text-xs text-gray-700">
                {item.start} – {item.end}
              </div>
              {item.flexible && (
                <div className="text-xs text-gray-600">
                  {item.length.toFixed(1)}h • {item.intensity}
                </div>
              )}
              {!item.flexible && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs">
                  Fixed
                </span>
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
