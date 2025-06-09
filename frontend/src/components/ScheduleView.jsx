// src/components/ScheduleView.jsx
import { motion, AnimatePresence } from 'framer-motion'

export default function ScheduleView({ schedule }) {
  if (!schedule?.length) {
    return (
      <p className="text-gray-500 italic">
        No schedule to show — add some tasks!
      </p>
    )
  }

  return (
    <AnimatePresence>
      <motion.ul
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        className="space-y-4"
      >
        {schedule.map((item, idx) => (
          <motion.li
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center"
          >
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-lg font-semibold">{item.name}</span>
                <span className="text-sm text-gray-500">
                  {item.start}–{item.end}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {item.time.toFixed(1)}h · {item.location} · {item.intensity}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-300">{item.order}</div>
          </motion.li>
        ))}
      </motion.ul>
    </AnimatePresence>
  )
}
