// src/components/TaskForm.jsx
import { useState } from 'react'

export default function TaskForm({ onSubmit }) {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({
    name: '',
    time: 1.0,
    location: '',
    intensity: 'Medium'
  })

  const handleChange = (field, value) => {
    if (field === 'time') {
      const v = parseFloat(value)
      setNewTask(prev => ({
        ...prev,
        time: isNaN(v) ? 0.1 : Math.max(0.1, v)
      }))
    } else {
      setNewTask(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleAdd = e => {
    e.preventDefault()
    if (!newTask.name) return
    setTasks(prev => [...prev, newTask])
    setNewTask({ name: '', time: 1.0, location: '', intensity: 'Medium' })
  }

  const handleRemove = idx => {
    setTasks(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSchedule = () => {
    if (tasks.length === 0) return
    onSubmit(tasks)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="space-y-4">
        {/* Task Name */}
        <div>
          <label className="block text-sm mb-1">Task</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={newTask.name}
            onChange={e => handleChange('name', e.target.value)}
            placeholder="What to do?"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm mb-1">Duration (hours)</label>
          <div className="flex items-center">
            <input
              type="number"
              className="w-24 border rounded-l px-2 py-1"
              value={newTask.time}
              min="0.1"
              step="0.1"
              onChange={e => handleChange('time', e.target.value)}
            />
            <span className="border-t border-b border-r rounded-r px-2 py-1 bg-gray-100">
              h
            </span>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm mb-1">Location</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={newTask.location}
            onChange={e => handleChange('location', e.target.value)}
            placeholder="e.g. Home"
          />
        </div>

        {/* Intensity */}
        <div>
          <label className="block text-sm mb-1">Intensity</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={newTask.intensity}
            onChange={e => handleChange('intensity', e.target.value)}
          >
            <option>Light</option>
            <option>Medium</option>
            <option>Deep</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
        >
          + Add Task
        </button>
      </form>

      <div>
        <h2 className="text-lg font-semibold mb-2">Your Tasks</h2>
        {tasks.length === 0 && (
          <p className="text-gray-500 italic">No tasks added yet.</p>
        )}
        <ul className="space-y-2 mb-4">
          {tasks.map((t, i) => (
            <li
              key={i}
              className="flex justify-between items-center border rounded p-2"
            >
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-sm text-gray-600">
                  {t.time.toFixed(1)}h · {t.location} · {t.intensity}
                </div>
              </div>
              <button
                onClick={() => handleRemove(i)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={handleSchedule}
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded"
        >
          Go
        </button>
      </div>
    </div>
  )
}
