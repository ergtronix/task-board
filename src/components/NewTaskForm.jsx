import { useState } from 'react'

export default function NewTaskForm({ onClose, onCreate }) {
  const [form, setForm] = useState({ title: '', priority: 'medium', assignee: 'Claude', source: '' })
  const [saving, setSaving] = useState(false)

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const task = await res.json()
    onCreate(task)
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-sm">
        <div className="modal-header">
          <h2>New Task</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit} className="new-task-form">
          <div className="form-group">
            <label>Title *</label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="タスク名"
              autoFocus
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select value={form.priority} onChange={e => set('priority', e.target.value)}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="form-group">
              <label>Assignee</label>
              <input
                value={form.assignee}
                onChange={e => set('assignee', e.target.value)}
                placeholder="担当者"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Source <span className="optional">(optional)</span></label>
            <input
              value={form.source}
              onChange={e => set('source', e.target.value)}
              placeholder="元ファイルのパス"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
