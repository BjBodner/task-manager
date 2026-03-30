import { useMemo } from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'

const CATEGORY_COLORS = {
  work: { color: '#3b82f6', label: 'עבודה' },
  home: { color: '#22c55e', label: 'בית' },
  relationships: { color: '#ec4899', label: 'מערכות יחסים' },
  learning: { color: '#8b5cf6', label: 'לימודים' },
}

function getWeekDates() {
  const dates = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

function getDayLabel(dateStr) {
  const days = ['יום א׳', 'יום ב׳', 'יום ג׳', 'יום ד׳', 'יום ה׳', 'יום ו׳', 'שבת']
  return days[new Date(dateStr).getDay()]
}

export default function Stats({ tasks, stats, levelInfo, onClose }) {
  const completedTasks = useMemo(
    () => tasks.filter((t) => t.status === 'done'),
    [tasks]
  )

  // Tasks completed this week
  const weekDates = useMemo(() => getWeekDates(), [])
  const weekStart = weekDates[0]

  const completedThisWeek = useMemo(
    () => completedTasks.filter((t) => t.completed_at && t.completed_at.split('T')[0] >= weekStart),
    [completedTasks, weekStart]
  )

  // Tasks completed this month
  const monthStart = useMemo(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
  }, [])

  const completedThisMonth = useMemo(
    () => completedTasks.filter((t) => t.completed_at && t.completed_at.split('T')[0] >= monthStart),
    [completedTasks, monthStart]
  )

  // Weekly chart data
  const weeklyData = useMemo(() => {
    return weekDates.map((date) => ({
      name: getDayLabel(date),
      completed: completedTasks.filter(
        (t) => t.completed_at && t.completed_at.split('T')[0] === date
      ).length,
      xp: completedTasks
        .filter((t) => t.completed_at && t.completed_at.split('T')[0] === date)
        .reduce((sum, t) => sum + (t.xp_earned || 0), 0),
    }))
  }, [weekDates, completedTasks])

  // Category pie data
  const categoryData = useMemo(() => {
    const counts = {}
    completedTasks.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1
    })
    return Object.entries(counts).map(([key, value]) => ({
      name: CATEGORY_COLORS[key]?.label || key,
      value,
      color: CATEGORY_COLORS[key]?.color || '#999',
    }))
  }, [completedTasks])

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📊 סטטיסטיקות</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          <SummaryCard emoji="⭐" label="סה״כ XP" value={stats?.total_xp || 0} color="bg-amber-50 text-amber-700" />
          <SummaryCard emoji="🏆" label="רמה" value={levelInfo?.level || 1} color="bg-purple-50 text-purple-700" />
          <SummaryCard emoji="🔥" label="סטריק נוכחי" value={`${stats?.current_streak || 0} ימים`} color="bg-orange-50 text-orange-700" />
          <SummaryCard emoji="👑" label="סטריק שיא" value={`${stats?.longest_streak || 0} ימים`} color="bg-pink-50 text-pink-700" />
        </div>

        {/* Completion stats */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-blue-50 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{completedThisWeek.length}</p>
            <p className="text-sm text-blue-500 mt-1">הושלמו השבוע</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{completedThisMonth.length}</p>
            <p className="text-sm text-green-500 mt-1">הושלמו החודש</p>
          </div>
        </div>

        {/* Weekly XP Chart */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">XP שבועי</h3>
          <div className="bg-gray-50 rounded-2xl p-4" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value} XP`, 'XP']}
                />
                <Line
                  type="monotone"
                  dataKey="xp"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#3b82f6' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie */}
        {categoryData.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">לפי קטגוריות</h3>
            <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-6">
              <div style={{ width: 180, height: 180 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} משימות`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm text-gray-600">{cat.name}</span>
                    <span className="text-sm font-semibold text-gray-800">{cat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {categoryData.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p className="text-4xl mb-2">📝</p>
            <p>סיים משימות כדי לראות סטטיסטיקות לפי קטגוריות</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryCard({ emoji, label, value, color }) {
  return (
    <div className={`${color} rounded-2xl p-3 text-center`}>
      <div className="text-xl mb-1">{emoji}</div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs mt-0.5">{label}</p>
    </div>
  )
}
