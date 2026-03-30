export default function Header({ stats, levelInfo, onStatsClick }) {
  const xpPercent = levelInfo ? (levelInfo.xpInLevel / levelInfo.xpForNext) * 100 : 0

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold bg-gradient-to-l from-blue-500 to-purple-600 bg-clip-text text-transparent">
            TaskFlow
          </h1>
        </div>

        <div className="flex items-center gap-5">
          {/* XP Bar */}
          <div className="flex items-center gap-2">
            <span className="text-sm">⭐</span>
            <div className="w-32 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-yellow-400 to-amber-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 font-medium min-w-[60px]">
              {stats ? `${levelInfo.xpInLevel}/${levelInfo.xpForNext}` : '---'}
            </span>
          </div>

          {/* Level */}
          <div className="flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-full">
            <span className="text-sm">🏆</span>
            <span className="text-sm font-semibold text-purple-700">
              {stats ? `רמה ${levelInfo.level}` : '---'}
            </span>
          </div>

          {/* Streak */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
            stats?.current_streak > 0 ? 'bg-orange-50' : 'bg-gray-50'
          }`}>
            <span className={`text-sm ${stats?.current_streak > 0 ? 'animate-pulse' : ''}`}>🔥</span>
            <span className={`text-sm font-semibold ${
              stats?.current_streak > 0 ? 'text-orange-600' : 'text-gray-400'
            }`}>
              {stats ? `${stats.current_streak} ימים` : '---'}
            </span>
          </div>

          {/* Stats Button */}
          <button
            onClick={onStatsClick}
            className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <span className="text-sm">📊</span>
            <span className="text-sm font-medium text-blue-600">סטטיסטיקות</span>
          </button>
        </div>
      </div>
    </header>
  )
}
