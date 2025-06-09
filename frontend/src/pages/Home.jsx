// src/pages/Home.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TaskForm from '../components/TaskForm'
import ScheduleView from '../components/ScheduleView'

export default function Home() {
  const [schedule, setSchedule] = useState([])

  const handleSubmit = async tasks => {
    try {
      const res = await fetch('http://localhost:8000/schedule/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks }),
      })
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data = await res.json()
      // backend returns { schedule: [...] }
      setSchedule(Array.isArray(data.schedule) ? data.schedule : [])
    } catch (err) {
      console.error('Failed to fetch schedule:', err)
      setSchedule([])
    }
  }

  const formWidth = schedule.length > 0 ? '50%' : '100%'

  return (
    <div className="min-h-screen flex">
      <motion.div
        className="p-6"
        initial={{ width: '100%' }}
        animate={{ width: formWidth }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{ overflow: 'hidden' }}
      >
        <h1 className="text-2xl font-semibold mb-4">Enter your tasks</h1>
        <TaskForm onSubmit={handleSubmit} />
      </motion.div>

      <AnimatePresence>
        {schedule.length > 0 && (
          <motion.div
            className="p-6 border-l"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ width: '50%' }}
          >
            <h1 className="text-2xl font-semibold mb-4">
              Your Least-Optimal Schedule
            </h1>
            <ScheduleView schedule={schedule} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
