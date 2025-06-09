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
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-purple-100 text-gray-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="py-24 text-center relative overflow-hidden">
        <motion.h1
          className="text-6xl font-black tracking-tight z-10 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 10 }}
        >
          Procrastiplanner
        </motion.h1>

        <motion.p
          className="text-xl max-w-2xl mx-auto text-gray-700 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          A beautifully structured way to get <em>everything</em> done — just not the things you should.
        </motion.p>
        {/* Floating emoji chaos */}
        <div className="absolute  inset-0 pointer-events-none z-0">
          {['🧠', '⏰', '💡', '📅', '🚀', '😅', '🎯'].map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random(),
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>
      </section>

      {/* App Interface */}
      <section className="bg-white rounded-t-3xl shadow-inner px-6 py-12 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          <motion.div
            className="flex-1 bg-white rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-3xl font-extrabold mb-6">Enter Your Tasks</h2>
            <TaskForm onSubmit={handleSubmit} />
          </motion.div>

          <AnimatePresence>
            {schedule.length > 0 && (
              <motion.div
                className="flex-1 bg-white rounded-2xl shadow-xl p-8 overflow-y-auto"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="text-3xl font-extrabold mb-6">
                  Your Least‐Optimal Schedule
                </h2>
                <ScheduleView schedule={schedule} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Expanded About Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Why */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-4">Why Procrastiplanner?</h3>
            <p className="text-gray-700 text-lg">
              Procrastiplanner turns structured procrastination into an art form.
              Instead of doing the one important thing, you’ll end up doing everything else 
              with perfect timing and smooth transitions. It’s not just a to-do list — 
              it’s a celebration of avoidance in style.
            </p>
          </motion.div>

          {/* How It Works */}
          <motion.div
            className="grid lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.2 } }
            }}
          >
            {[
              {
                title: '1️⃣ Submit Your Tasks',
                desc: 'Enter fixed and flexible tasks, set times or just lengths.'
              },
              {
                title: '2️⃣ Watch the Magic',
                desc: 'Our algorithm slices and dices your day into delightful detours.'
              },
              {
                title: '3️⃣ Embrace Avoidance',
                desc: 'Follow your “least-optimal” plan and avoid the real work!'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-white p-6 rounded-lg shadow-lg"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Key Features */}
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold">Key Features</h3>
            <ul className="flex flex-wrap justify-center gap-6">
              {['Animated UI', 'Infinite Emojis', 'Drag-to-Rearrange', 'API-First', 'Light & Dark Modes', 'Endless Fun']
                .map((feat, i) => (
                  <motion.li
                    key={i}
                    className="bg-purple-100 px-4 py-2 rounded-full font-medium"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    {feat}
                  </motion.li>
                ))
              }
            </ul>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            className="space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.3 } }
            }}
          >
            <h3 className="text-3xl font-bold text-center">What People Say</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { quote: '“I’ve never procrastinated so productively!”', author: '— Alex B.' },
                { quote: '“Best way to avoid deadlines ever.”', author: '— Casey L.' },
              ].map((t, i) => (
                <motion.blockquote
                  key={i}
                  className="bg-white p-6 rounded-lg shadow-md italic"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <p className="mb-4 text-gray-800">{t.quote}</p>
                  <footer className="text-sm text-gray-600">{t.author}</footer>
                </motion.blockquote>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="bg-white border-t py-6 text-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.p
          className="mb-2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        >
          Built with procrastination, powered by deadlines.
        </motion.p>
        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        >
          © {new Date().getFullYear()} Procrastiplanner. All rights squandered.
        </motion.p>
      </motion.footer>
    </div>
  )
}
