import { useNavigate } from 'react-router-dom'
import TaskForm from '../components/TaskForm'

export default function Home({ setSchedule }) {
  const navigate = useNavigate()

  const handleSubmit = async (tasks) => {
    const res = await fetch('http://localhost:8000/api/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks }),
    })
    const data = await res.json()
    setSchedule(data.schedule)
    navigate('/schedule')
  }

  return (
    <div className="w-1/3 p-6">
      <h1 className="text-2xl font-semibold mb-4">Enter your tasks</h1>
      <TaskForm onSubmit={handleSubmit} />
    </div>
  )
}
