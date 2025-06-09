// src/components/ScheduleView.jsx
import React, { useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'

function EventBlock({
  item, idx, start, end, assignment,
  topPx, heightPx, DAY_START, DAY_END,
  ROW_HEIGHT, ROWS, formatTime,
  onEventUpdate, activeId, setActiveId
}) {
  const duration = end - start
  const { col, cols } = assignment
  const leftPct  = (col / cols) * 100
  const widthPct = (1   / cols) * 100

  // motion value for live snapping
  const y = useMotionValue(0)
  const handleDrag = (_, info) => {
    const snapped = Math.round(info.offset.y / ROW_HEIGHT) * ROW_HEIGHT
    y.set(snapped)
  }
  const handleDragEnd = () => {
    const snappedPx = y.get()
    const deltaRows = snappedPx / ROW_HEIGHT
    const movedMins = deltaRows * 15
    const dayMin = DAY_START * 60
    const dayMax = DAY_END   * 60 - duration
    let newStart = start + movedMins
    newStart = Math.max(dayMin, Math.min(newStart, dayMax))
    const newEnd = newStart + duration
    y.set(0)
    onEventUpdate(idx, formatTime(newStart), formatTime(newEnd))
  }

  return (
    <motion.div
      drag="y"
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{
        top:    -topPx,
        bottom: ROWS * ROW_HEIGHT - topPx - heightPx
      }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onClick={() => setActiveId(activeId === idx ? null : idx)}
      style={{
        position: 'absolute',
        top:      topPx,
        left:     `${leftPct}%`,
        width:    `${widthPct}%`,
        height:   heightPx,
        y,
        zIndex:   activeId === idx ? 10 : 1
      }}
      className="rounded-lg bg-gradient-to-r from-blue-300 to-blue-400 p-2 shadow-lg cursor-pointer overflow-visible"
    >
      <div className="text-sm font-semibold">{item.name}</div>
      <div className="text-xs text-gray-700">
        {item.start} – {item.end}
      </div>

      {activeId === idx && (
        <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border rounded-lg shadow-lg p-3 text-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">
              {item.name}{!item.flexible && ' 📌'}
            </span>
            <button
              onClick={e => { e.stopPropagation(); setActiveId(null) }}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="text-gray-600 mb-1">
            {item.start} – {item.end}
          </div>
          <div className="text-gray-600">
            {item.location || <em>No location</em>}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function ScheduleView({ schedule, onEventUpdate }) {
  const [activeId, setActiveId] = useState(null)
  const DAY_START  = 8
  const DAY_END    = 22
  const ROW_HEIGHT = 15
  const ROWS       = (DAY_END - DAY_START) * 4

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
    const now = new Date()
    const pad = n => String(n).padStart(2,'0')
    const datePrefix = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}`
    schedule.forEach(item => {
      const start = `${datePrefix}T${item.start.replace(':','')}00`
      const end   = `${datePrefix}T${item.end.replace(':','')}00`
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

  // compute minute ranges
  const events = schedule.map((it, i) => ({
    idx:   i,
    start: parseTime(it.start),
    end:   parseTime(it.end),
  }))

  // build overlap clusters & column assignments
  const clusters = []
  const seen = new Set()
  for (let ev of events) {
    if (seen.has(ev.idx)) continue
    const group = [ev]
    seen.add(ev.idx)
    for (let i = 0; i < group.length; i++) {
      for (let other of events) {
        if (!seen.has(other.idx)
         && other.start < group[i].end
         && other.end   > group[i].start) {
          group.push(other)
          seen.add(other.idx)
        }
      }
    }
    clusters.push(group)
  }
  const assignments = {}
  clusters.forEach(cluster => {
    cluster.sort((a,b) => a.start - b.start)
    let active = []
    let totalCols = 0
    cluster.forEach(ev => {
      active = active.filter(a => a.end > ev.start)
      const usedCols = active.map(a => a.col)
      let col = 0
      while (usedCols.includes(col)) col++
      totalCols = Math.max(totalCols, col + 1)
      assignments[ev.idx] = { col, cols: totalCols }
      active.push({ end: ev.end, col })
    })
  })

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

      {/* grid + events */}
      <div
        className="grid relative"
        style={{
          gridTemplateColumns: '4rem 1fr',
          gridTemplateRows:   `repeat(${ROWS}, ${ROW_HEIGHT}px)`
        }}
      >
        {/* hour labels */}
        {Array.from({ length: DAY_END - DAY_START + 1 }).map((_, i) => {
          const hour = DAY_START + i
          const row  = i * 4 + 1
          return (
            <div
              key={hour}
              className="text-xs text-gray-500"
              style={{
                gridColumn: 1,
                gridRow:    row,
                alignSelf:  'start',
                paddingLeft:'0.5rem'
              }}
            >
              {`${String(hour).padStart(2,'0')}:00`}
            </div>
          )
        })}

        {/* events container */}
        <div
          style={{
            gridColumn: 2,
            gridRow:    `1 / ${ROWS+1}`,
            position:   'relative',
            width:      '100%',
            height:     '100%'
          }}
        >
          {schedule.map((item, idx) => {
            const ev = events.find(e => e.idx === idx)
            const topPx    = ((ev.start - DAY_START*60) / 15) * ROW_HEIGHT
            const heightPx = ((ev.end - ev.start) / 15) * ROW_HEIGHT
            const assignment = assignments[idx] || { col: 0, cols: 1 }
            return (
              <EventBlock
                key={idx}
                item={item}
                idx={idx}
                start={ev.start}
                end={ev.end}
                assignment={assignment}
                topPx={topPx}
                heightPx={heightPx}
                DAY_START={DAY_START}
                DAY_END={DAY_END}
                ROW_HEIGHT={ROW_HEIGHT}
                ROWS={ROWS}
                formatTime={formatTime}
                onEventUpdate={onEventUpdate}
                activeId={activeId}
                setActiveId={setActiveId}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
