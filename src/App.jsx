import { useState, useCallback } from 'react'
import Header from './components/Header/Header'
import Board from './components/Board/Board'
import Stats from './components/Stats/Stats'
import Celebration from './components/Celebration/Celebration'
import { useTasks } from './hooks/useTasks'
import { useUserStats } from './hooks/useUserStats'

function App() {
  const { tasks, loading, error, addTask, updateTask, completeTask, deleteTask, moveTask, clearError } = useTasks()
  const { stats, levelInfo, celebration, awardXP, clearCelebration } = useUserStats()
  const [showStats, setShowStats] = useState(false)

  const handleMove = useCallback(async (id, newStatus) => {
    const result = await moveTask(id, newStatus)
    if (result?.needsXP) {
      const task = result.task
      const xpResult = await awardXP(task.priority, stats?.current_streak || 0)
      if (xpResult) {
        await completeTask(id, xpResult.xpEarned)
      }
    }
  }, [moveTask, awardXP, completeTask, stats?.current_streak])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header stats={stats} levelInfo={levelInfo} onStatsClick={() => setShowStats(true)} />

      {error && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex justify-between items-center">
            <span className="text-sm">{error}</span>
            <button onClick={clearError} className="text-red-400 hover:text-red-600 cursor-pointer">✕</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-400 text-sm">טוען משימות...</p>
          </div>
        </div>
      ) : (
        <Board
          tasks={tasks}
          onMove={handleMove}
          onAdd={addTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      )}

      {showStats && (
        <Stats
          tasks={tasks}
          stats={stats}
          levelInfo={levelInfo}
          onClose={() => setShowStats(false)}
        />
      )}

      <Celebration celebration={celebration} onClose={clearCelebration} />
    </div>
  )
}

export default App
