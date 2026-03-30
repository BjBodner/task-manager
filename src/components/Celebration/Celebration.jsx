import { useEffect } from 'react'
import confetti from 'canvas-confetti'

function fireConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.7 },
    colors: ['#3b82f6', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6'],
  })
}

function fireLevelUp() {
  const duration = 2000
  const end = Date.now() + duration
  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#fbbf24', '#f59e0b', '#d97706'],
    })
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#fbbf24', '#f59e0b', '#d97706'],
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

function fireStreakMilestone() {
  const count = 200
  const defaults = { origin: { y: 0.7 }, colors: ['#ef4444', '#f97316', '#fbbf24'] }
  confetti({ ...defaults, particleCount: count, spread: 100 })
  setTimeout(() => confetti({ ...defaults, particleCount: count / 2, spread: 120 }), 300)
}

const MESSAGES = {
  task_complete: (data) => ({
    emoji: '🎉',
    title: 'כל הכבוד!',
    subtitle: `+${data.xp} XP`,
  }),
  level_up: (data) => ({
    emoji: '🏆',
    title: `עלית לרמה ${data.level}!`,
    subtitle: `+${data.xp} XP`,
  }),
  streak_milestone: (data) => ({
    emoji: '🔥',
    title: `${data.streak} ימים ברצף!`,
    subtitle: `+${data.xp} XP — אבן דרך מטורפת!`,
  }),
}

export default function Celebration({ celebration, onClose }) {
  useEffect(() => {
    if (!celebration) return

    if (celebration.type === 'level_up') {
      fireLevelUp()
    } else if (celebration.type === 'streak_milestone') {
      fireStreakMilestone()
    } else {
      fireConfetti()
    }

    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [celebration, onClose])

  if (!celebration) return null

  const msg = MESSAGES[celebration.type](celebration)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      onClick={onClose}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl px-10 py-8 text-center pointer-events-auto animate-bounce-in">
        <div className="text-6xl mb-3">{msg.emoji}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{msg.title}</h2>
        <p className="text-lg text-gray-500">{msg.subtitle}</p>
      </div>
    </div>
  )
}
