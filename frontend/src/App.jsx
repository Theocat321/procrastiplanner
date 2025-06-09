import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
// import Schedule from './pages/Schedule'
import './index.css'

export default function App() {
  const [schedule, setSchedule] = useState([])

  return (
    <BrowserRouter>
      <div className="min-h-screen flex">
        <Routes>
          <Route
            path="/"
            element={<Home setSchedule={setSchedule} />}
          />
          {/* <Route
            path="/schedule"
            element={<Schedule schedule={schedule} />}
          /> */}
        </Routes>
      </div>
    </BrowserRouter>
  )
}
