import { useState } from 'react'

const CATEGORIES = [
  { value: 'work', label: 'עבודה', color: 'bg-blue-500' },
  { value: 'home', label: 'בית', color: 'bg-green-500' },
  { value: 'relationships', label: 'מערכות יחסים', color: 'bg-pink-500' },
  { value: 'learning', label: 'לימודים', color: 'bg-purple-500' },
]

const PRIORITIES = [
  { value: 'high', label: 'גבוהה', icon: '🔴' },
  { value: 'medium', label: 'בינונית', icon: '🟡' },
  { value: 'low', label: 'נמוכה', icon: '🟢' },
]

export default function AddTask({ onAdd }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('work')
  const [priority, setPriority] = useState('medium')
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    await onAdd({ title: title.trim(), category, priority })
    setTitle('')
    setCategory('work')
    setPriority('medium')
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors font-medium cursor-pointer"
      >
        + הוסף משימה חדשה
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-4 space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="מה צריך לעשות?"
        autoFocus
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-right"
      />

      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setCategory(cat.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              category === cat.value
                ? `${cat.color} text-white shadow-sm`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {PRIORITIES.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setPriority(p.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              priority === p.value
                ? 'bg-gray-800 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {p.icon} {p.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-100 text-sm cursor-pointer"
        >
          ביטול
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium cursor-pointer"
        >
          הוסף
        </button>
      </div>
    </form>
  )
}
