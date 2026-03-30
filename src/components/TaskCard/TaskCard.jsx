import { useState } from 'react'

const CATEGORY_STYLES = {
  work: { label: 'עבודה', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  home: { label: 'בית', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  relationships: { label: 'מערכות יחסים', bg: 'bg-pink-100', text: 'text-pink-700', dot: 'bg-pink-500' },
  learning: { label: 'לימודים', bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
}

const PRIORITY_ICONS = { high: '🔴', medium: '🟡', low: '🟢' }

const CATEGORIES = [
  { value: 'work', label: 'עבודה' },
  { value: 'home', label: 'בית' },
  { value: 'relationships', label: 'מערכות יחסים' },
  { value: 'learning', label: 'לימודים' },
]

const PRIORITIES = [
  { value: 'high', label: 'גבוהה' },
  { value: 'medium', label: 'בינונית' },
  { value: 'low', label: 'נמוכה' },
]

export default function TaskCard({ task, onUpdate, onDelete, dragHandleProps }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editCategory, setEditCategory] = useState(task.category)
  const [editPriority, setEditPriority] = useState(task.priority)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const cat = CATEGORY_STYLES[task.category]

  const handleSave = async () => {
    if (!editTitle.trim()) return
    await onUpdate(task.id, {
      title: editTitle.trim(),
      category: editCategory,
      priority: editPriority,
    })
    setIsEditing(false)
  }

  const handleDelete = async () => {
    await onDelete(task.id)
    setShowDeleteConfirm(false)
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-3 space-y-2">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          autoFocus
          className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-right"
        />
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setEditCategory(c.value)}
              className={`px-2 py-0.5 rounded-full text-xs cursor-pointer ${
                editCategory === c.value
                  ? `${CATEGORY_STYLES[c.value].bg} ${CATEGORY_STYLES[c.value].text} font-medium`
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setEditPriority(p.value)}
              className={`px-2 py-0.5 rounded-full text-xs cursor-pointer ${
                editPriority === p.value ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {PRIORITY_ICONS[p.value]} {p.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setIsEditing(false)}
            className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            ביטול
          </button>
          <button
            onClick={handleSave}
            className="text-xs text-blue-500 hover:text-blue-700 font-medium cursor-pointer"
          >
            שמור
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      {...dragHandleProps}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow group ${
        task.status === 'done' ? 'done-task' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 leading-snug">{task.title}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${cat.bg} ${cat.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
              {cat.label}
            </span>
            <span className="text-xs">{PRIORITY_ICONS[task.priority]}</span>
            {task.xp_earned > 0 && (
              <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">
                +{task.xp_earned} XP
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-400 hover:text-blue-500 rounded cursor-pointer"
            title="ערוך"
          >
            ✏️
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-1 text-gray-400 hover:text-red-500 rounded cursor-pointer"
            title="מחק"
          >
            🗑️
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
          <p className="text-xs text-red-600 mb-2">למחוק את המשימה?</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              ביטול
            </button>
            <button
              onClick={handleDelete}
              className="text-xs text-red-600 hover:text-red-800 font-medium cursor-pointer"
            >
              מחק
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
