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

  const formFlex = schedule.length ? 'basis-1/2' : 'basis-full'

  return (
    <div className="min-h-screen flex bg-gray-50">
      <motion.div
        className={`${formFlex} p-8 bg-white shadow-lg`}
        initial={{ flexBasis: '100%' }}
        animate={{ flexBasis: formFlex === 'basis-full' ? '100%' : '50%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <h2 className="text-3xl font-extrabold mb-6">Enter Your Tasks</h2>
        <TaskForm onSubmit={handleSubmit} />
      </motion.div>

      <AnimatePresence>
        {schedule.length > 0 && (
          <motion.div
            className="basis-1/2 p-8 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-3xl font-extrabold mb-6">
              Your Least‐Optimal Schedule
            </h2>
            <ScheduleView schedule={schedule} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
