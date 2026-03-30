import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError('שגיאה בטעינת המשימות')
      console.error(fetchError)
    } else {
      setTasks(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const addTask = async ({ title, category, priority }) => {
    // Optimistic update with temp ID
    const tempId = 'temp-' + Date.now()
    const tempTask = {
      id: tempId, title, category, priority,
      status: 'todo', xp_earned: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setTasks(prev => [tempTask, ...prev])

    const { data, error: insertError } = await supabase
      .from('tasks')
      .insert({ title, category, priority })
      .select()
      .single()

    if (insertError) {
      setError('שגיאה בהוספת משימה')
      console.error(insertError)
      setTasks(prev => prev.filter(t => t.id !== tempId))
      return null
    }
    // Replace temp task with real one
    setTasks(prev => prev.map(t => (t.id === tempId ? data : t)))
    return data
  }

  const updateTask = async (id, updates) => {
    // Optimistic update
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)))

    const { data, error: updateError } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      setError('שגיאה בעדכון משימה')
      console.error(updateError)
      // Revert on error
      await fetchTasks()
      return null
    }
    setTasks(prev => prev.map(t => (t.id === id ? data : t)))
    return data
  }

  const completeTask = async (id, xpEarned) => {
    const now = new Date().toISOString()
    // Optimistic update
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, status: 'done', completed_at: now, xp_earned: xpEarned } : t)))

    const { data, error: updateError } = await supabase
      .from('tasks')
      .update({
        status: 'done',
        completed_at: now,
        updated_at: now,
        xp_earned: xpEarned,
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      setError('שגיאה בעדכון משימה')
      console.error(updateError)
      await fetchTasks()
      return null
    }
    setTasks(prev => prev.map(t => (t.id === id ? data : t)))
    return data
  }

  const moveTask = async (id, newStatus) => {
    // Optimistic update for all moves
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, status: newStatus } : t)))

    if (newStatus === 'done') {
      const task = tasks.find(t => t.id === id)
      return { needsXP: true, task }
    }

    const { data, error: updateError } = await supabase
      .from('tasks')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      setError('שגיאה בעדכון משימה')
      await fetchTasks()
      return null
    }
    setTasks(prev => prev.map(t => (t.id === id ? data : t)))
    return data
  }

  const deleteTask = async (id) => {
    // Optimistic update
    const prevTasks = tasks
    setTasks(prev => prev.filter(t => t.id !== id))

    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError('שגיאה במחיקת משימה')
      console.error(deleteError)
      setTasks(prevTasks)
      return false
    }
    return true
  }

  const clearError = () => setError(null)

  return { tasks, loading, error, addTask, updateTask, completeTask, deleteTask, moveTask, clearError }
}
