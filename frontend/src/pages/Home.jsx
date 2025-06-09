// src/pages/Home.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TaskForm from '../components/TaskForm'
import ScheduleView from '../components/ScheduleView'

export default function Home() {
  const [schedule, setSchedule] = useState([])

  const handleSubmit = async tasks => {
    const res = await fetch('http://localhost:8000/schedule/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks }),
    })
    const data = await res.json()
    setSchedule(Array.isArray(data.schedule) ? data.schedule : [])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br w-full from-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <motion.div
          className="flex-1 bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.01 }}
        >
          <h2 className="text-3xl font-extrabold mb-6">Enter Your Tasks</h2>
          <TaskForm onSubmit={handleSubmit} />
        </motion.div>

        <AnimatePresence>
          {schedule.length > 0 && (
            <motion.div
              className="flex-1 bg-white rounded-2xl shadow-xl p-8 overflow-y-auto"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ scale: 1.01 }}
            >
              <h2 className="text-3xl font-extrabold mb-6">
                Your Least‐Optimal Schedule
              </h2>
              <ScheduleView schedule={schedule} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
