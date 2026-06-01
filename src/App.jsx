import { useState, useEffect, useCallback } from 'react'
import KanbanBoard from './components/KanbanBoard'
import TaskModal from './components/TaskModal'
import NewTaskForm from './components/NewTaskForm'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks')
      if (!res.ok) throw new Error('Failed to fetch tasks')
      setTasks(await res.json())
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
    const es = new EventSource('/api/tasks/events')
    es.onmessage = (e) => {
      const { type, payload } = JSON.parse(e.data)
      if (type === 'updated') {
        setTasks(prev => {
          const idx = prev.findIndex(t => t.id === payload.id)
          if (idx === -1) return [...prev, payload]
          const next = [...prev]
          next[idx] = payload
          return next
        })
        setSelectedTask(prev => prev?.id === payload.id ? payload : prev)
      } else if (type === 'refresh') {
        fetchTasks()
      }
    }
    es.onopen = () => setError(null)
    es.onerror = () => setError('サーバーとの接続が切断されました')
    return () => es.close()
  }, [fetchTasks])

  const blockedCount = tasks.filter(t => t.status === 'blocked').length

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>Task Board</h1>
          <span className="header-sub">ERG × AI Agent Organization</span>
        </div>
        <div className="header-right">
          {blockedCount > 0 && (
            <span className="blocked-badge">🔴 Blocked: {blockedCount}</span>
          )}
          <button className="btn-primary" onClick={() => setShowNewForm(true)}>
            + New Task
          </button>
        </div>
      </header>

      {error && <div className="error-bar">⚠ {error} — サーバーが起動しているか確認してください</div>}

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <KanbanBoard tasks={tasks} onTaskClick={setSelectedTask} />
      )}

      {selectedTask && (
        <TaskModal
          key={selectedTask.id}
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={setSelectedTask}
        />
      )}

      {showNewForm && (
        <NewTaskForm
          onClose={() => setShowNewForm(false)}
          onCreate={(task) => {
            setTasks(prev => [...prev, task])
            setShowNewForm(false)
          }}
        />
      )}
    </div>
  )
}
