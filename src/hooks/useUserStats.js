import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const XP_BY_PRIORITY = { low: 10, medium: 20, high: 30 }
const STREAK_BONUS = 5

function calcLevel(totalXp) {
  const xpPerLevel = 100
  const level = Math.floor(totalXp / xpPerLevel) + 1
  const xpInLevel = totalXp % xpPerLevel
  return { level, xpInLevel, xpForNext: xpPerLevel }
}

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function getYesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

export function useUserStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [celebration, setCelebration] = useState(null)

  const fetchStats = useCallback(async () => {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('id', 1)
      .single()

    if (error || !data) return

    // Check if streak should be broken (last completion was before yesterday)
    const today = getToday()
    const yesterday = getYesterday()
    if (
      data.last_completed_date &&
      data.last_completed_date !== today &&
      data.last_completed_date !== yesterday &&
      data.current_streak > 0
    ) {
      const { data: updated } = await supabase
        .from('user_stats')
        .update({ current_streak: 0 })
        .eq('id', 1)
        .select()
        .single()
      setStats(updated || data)
    } else {
      setStats(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const awardXP = async (priority, currentStreak) => {
    if (!stats) return null

    const baseXp = XP_BY_PRIORITY[priority] || 20
    const streakBonus = currentStreak > 0 ? STREAK_BONUS : 0
    const totalXpEarned = baseXp + streakBonus

    const today = getToday()
    const yesterday = getYesterday()

    let newStreak = stats.current_streak
    if (stats.last_completed_date !== today) {
      if (stats.last_completed_date === yesterday || stats.current_streak === 0) {
        newStreak = stats.current_streak + 1
      } else {
        newStreak = 1
      }
    }

    const newTotalXp = stats.total_xp + totalXpEarned
    const newCompletedTotal = stats.tasks_completed_total + 1
    const newLongestStreak = Math.max(stats.longest_streak, newStreak)

    const oldLevel = calcLevel(stats.total_xp).level
    const newLevel = calcLevel(newTotalXp).level

    const { data, error } = await supabase
      .from('user_stats')
      .update({
        total_xp: newTotalXp,
        level: newLevel,
        current_streak: newStreak,
        longest_streak: newLongestStreak,
        last_completed_date: today,
        tasks_completed_total: newCompletedTotal,
      })
      .eq('id', 1)
      .select()
      .single()

    if (error) {
      console.error('Error updating stats:', error)
      return null
    }

    setStats(data)

    // Determine celebration type
    if (newLevel > oldLevel) {
      setCelebration({ type: 'level_up', level: newLevel, xp: totalXpEarned })
    } else if ([7, 30, 100].includes(newStreak) && stats.last_completed_date !== today) {
      setCelebration({ type: 'streak_milestone', streak: newStreak, xp: totalXpEarned })
    } else {
      setCelebration({ type: 'task_complete', xp: totalXpEarned })
    }

    return { xpEarned: totalXpEarned, newStreak }
  }

  const clearCelebration = () => setCelebration(null)

  const levelInfo = stats ? calcLevel(stats.total_xp) : { level: 1, xpInLevel: 0, xpForNext: 100 }

  return { stats, loading, levelInfo, celebration, awardXP, clearCelebration, fetchStats }
}
