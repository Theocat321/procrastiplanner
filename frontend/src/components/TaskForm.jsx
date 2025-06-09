// src/components/TaskForm.jsx
import { useState, useEffect } from 'react'

export default function TaskForm({ onSubmit }) {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({
    name: '',
    start: '',
    length: 1.0,
    location: '',
    intensity: 'Medium',
    flexible: false,
  })

  // derive intensity options based on flexible flag
  const intensityOptions = newTask.flexible
    ? ['Light', 'Medium']
    : ['Medium', 'Deep']

  // ensure current intensity is valid when flexible toggles
  useEffect(() => {
    if (!intensityOptions.includes(newTask.intensity)) {
      setNewTask(prev => ({ ...prev, intensity: intensityOptions[0] }))
    }
  }, [newTask.flexible])

  const handleChange = (field, value) => {
    if (field === 'length') {
      const v = parseFloat(value)
      setNewTask(prev => ({
        ...prev,
        length: isNaN(v) ? 0.1 : Math.max(0.1, v)
      }))
    } else if (field === 'flexible') {
      setNewTask(prev => ({
        ...prev,
        flexible: value,
        start: value ? '' : prev.start
      }))
    } else {
      setNewTask(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleAdd = e => {
    e.preventDefault()
    if (!newTask.name) return
    setTasks(prev => [...prev, newTask])
    setNewTask({
      name: '',
      start: '',
      length: 1.0,
      location: '',
      intensity: 'Medium',
      flexible: false,
    })
  }

  const handleRemove = idx => {
    setTasks(prev => prev.filter((_, i) => i !== idx))
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

        {/* Flexible Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            id="flexible"
            type="checkbox"
            checked={newTask.flexible}
            onChange={e => handleChange('flexible', e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="flexible" className="text-sm">
            Flexible?
          </label>
        </div>

        {/* Start Time (only if not flexible) */}
        {!newTask.flexible && (
          <div>
            <label className="block text-sm mb-1">Start</label>
            <input
              type="time"
              className="w-full border rounded px-2 py-1"
              value={newTask.start}
              onChange={e => handleChange('start', e.target.value)}
            />
          </div>
        )}

        {/* Intensity (options depend on flexible) */}
        {!newTask.flexible && (
          <div>
            <label className="block text-sm mb-1">Intensity</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={newTask.intensity}
              onChange={e => handleChange('intensity', e.target.value)}
            >
              {intensityOptions.map(opt => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}

        {/* Length */}
        <div>
          <label className="block text-sm mb-1">Length (hours)</label>
          <div className="flex items-center">
            <input
              type="number"
              className="w-24 border rounded-l px-2 py-1"
              value={newTask.length}
              min="0.1"
              step="0.1"
              onChange={e => handleChange('length', e.target.value)}
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

        <button
          type="submit"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
        >
          + Add Task
        </button>
      </form>

      {/* Task List */}
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
                  {!t.flexible && <span>{t.start} • </span>}
                  {t.length.toFixed(1)}h • {t.location} • {t.intensity}
                  {!t.flexible && (
                    <span className="ml-2 text-red-500 font-semibold">Fixed</span>
                  )}
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
          onClick={() => onSubmit(tasks)}
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded"
        >
          Go
        </button>
      </div>
    </div>
  )
}
