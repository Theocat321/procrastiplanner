// src/components/TaskForm.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TaskForm({ onSubmit }) {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({
    name: '',
    start: '',
    length: '1.0',
    location: '',
    intensity: 'Medium',
    flexible: false,
  })

  const intensityOptions = newTask.flexible
    ? ['Light', 'Medium']
    : ['Medium', 'Deep']

  useEffect(() => {
    if (!intensityOptions.includes(newTask.intensity)) {
      setNewTask(t => ({ ...t, intensity: intensityOptions[0] }))
    }
  }, [newTask.flexible])

  const change = (field, val) => {
    setNewTask(t => ({ ...t, [field]: val }))
  }

  const add = e => {
    e.preventDefault()
    if (!newTask.name) return
    if (!newTask.flexible && !newTask.start) return

    const decPattern = /^\d+(\.\d+)?$/
    if (!decPattern.test(newTask.length)) {
      alert('Please enter a valid decimal number for length.')
      return
    }
    const lengthVal = parseFloat(newTask.length)
    if (isNaN(lengthVal) || lengthVal < 0.1) {
      alert('Length must be at least 0.1 hours.')
      return
    }

    const taskToAdd = { ...newTask, length: lengthVal }
    setTasks(ts => [...ts, taskToAdd])
    setNewTask({
      name: '',
      start: '',
      length: '1.0',
      location: '',
      intensity: 'Medium',
      flexible: false,
    })
  }

  const remove = i => setTasks(ts => ts.filter((_, idx) => idx !== i))
  const schedule = () => tasks.length && onSubmit(tasks)

  return (
    <div className="space-y-8">
      <form onSubmit={add} className="space-y-4">
         {/* Task Name */}
         <div>
          <label className="block text-sm font-medium">Task</label>
          <input
            type="text"
            required
            className="mt-1 w-full border rounded px-3 py-2"
            value={newTask.name}
            onChange={e => change('name', e.target.value)}
            placeholder="Task name"
          />
        </div>

        {/* Flexible Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            id="flexible"
            type="checkbox"
            checked={newTask.flexible}
            onChange={e => change('flexible', e.target.checked)}
            className="h-4 w-4 text-blue-600"
          />
          <label htmlFor="flexible" className="text-sm">
            Flexible?
          </label>
        </div>

        {/* Start Time (only if not flexible) */}
        {!newTask.flexible && (
          <div>
            <label className="block text-sm font-medium">
              Start <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              required
              className="mt-1 w-full border rounded px-3 py-2"
              value={newTask.start}
              onChange={e => change('start', e.target.value)}
            />
          </div>
        )}

        {/* Length (free-form decimal) */}
        <div>
          <label className="block text-sm font-medium">
            Length (hours) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            className="mt-1 w-full border rounded px-3 py-2"
            value={newTask.length}
            onChange={e => change('length', e.target.value)}
            placeholder="e.g. 1.5"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            className="mt-1 w-full border rounded px-3 py-2"
            value={newTask.location}
            onChange={e => change('location', e.target.value)}
            placeholder="e.g. Home"
          />
        </div>

        {/* Intensity */}
        {newTask.flexible && (
          <div>
            <label className="block text-sm font-medium">Intensity</label>
            <select
              className="mt-1 w-full border rounded px-3 py-2"
              value={newTask.intensity}
              onChange={e => change('intensity', e.target.value)}
            >
              {intensityOptions.map(opt => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}
        
        <motion.button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded font-semibold"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          + Add Task
        </motion.button>
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-3">Your Tasks</h3>
        <AnimatePresence>
          {tasks.length === 0 ? (
            <motion.p
              className="text-gray-500 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              No tasks added yet.
            </motion.p>
          ) : (
            <motion.ul
              className="space-y-2 mb-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              {tasks.map((t, i) => (
                <motion.li
                  key={i}
                  className="flex justify-between items-center border rounded px-4 py-3 bg-white"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  exit={{ opacity: 0, x: 20 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="space-y-1">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-sm text-gray-600">
                      {!t.flexible && `${t.start} • `}
                      {t.length.toFixed(1)}h • {t.location}
                      {t.flexible && ` • ${t.intensity}`}
                      {!t.flexible && (
                        <span className="ml-2 text-red-500 font-semibold">
                          Fixed
                        </span>
                      )}
                    </div>
                  </div>
                  <motion.button
                    onClick={() => remove(i)}
                    className="text-red-500 hover:underline text-sm"
                    whileTap={{ scale: 0.9 }}
                  >
                    Remove
                  </motion.button>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <motion.button
          onClick={schedule}
          className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded font-semibold"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Go
        </motion.button>
      </div>
    </div>
  )
}
