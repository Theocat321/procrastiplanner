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

  const intensityOptions = newTask.flexible
    ? ['Light', 'Medium']
    : ['Medium', 'Deep']

  useEffect(() => {
    if (!intensityOptions.includes(newTask.intensity)) {
      setNewTask(t => ({ ...t, intensity: intensityOptions[0] }))
    }
  }, [newTask.flexible])

  const change = (field, val) => {
    if (field === 'length') {
      const v = parseFloat(val)
      return setNewTask(t => ({
        ...t,
        length: isNaN(v) ? 0.1 : Math.max(0.1, v)
      }))
    }
    if (field === 'flexible') {
      return setNewTask(t => ({
        ...t,
        flexible: val,
        start: val ? '' : t.start,
      }))
    }
    setNewTask(t => ({ ...t, [field]: val }))
  }

  const add = e => {
    e.preventDefault()
    if (!newTask.name) return
    if (!newTask.flexible && !newTask.start) return  // require start if not flexible
    // length is always required (the input is always present and min=0.1)
    setTasks(ts => [...ts, newTask])
    setNewTask({
      name: '',
      start: '',
      length: 1.0,
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

        {/* Length (always shown) */}
        <div>
          <label className="block text-sm font-medium">
            Length (hours) <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <input
              type="number"
              step="0.1"
              min="0.1"
              required
              className="mt-1 w-24 border rounded-l px-3 py-2"
              value={newTask.length}
              onChange={e => change('length', e.target.value)}
            />
            <span className="border-t border-b border-r rounded-r px-2 py-1 bg-gray-100">
              h
            </span>
          </div>
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

        <button
          type="submit"
          className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded font-semibold"
        >
          + Add Task
        </button>
      </form>

      {/* Task List */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Your Tasks</h3>
        {tasks.length === 0 ? (
          <p className="text-gray-500 italic">No tasks added yet.</p>
        ) : (
          <ul className="space-y-2 mb-4">
            {tasks.map((t, i) => (
              <li
                key={i}
                className="flex justify-between items-center border rounded px-4 py-3 bg-white"
              >
                <div className="space-y-1">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-sm text-gray-600">
                    {!t.flexible && `${t.start} • `}
                    {t.length.toFixed(1)}h • {t.location} • {t.intensity}
                    {!t.flexible && (
                      <span className="ml-2 text-red-500 font-semibold">
                        Fixed
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => remove(i)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={schedule}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
        >
          Go
        </button>
      </div>
    </div>
  )
}
