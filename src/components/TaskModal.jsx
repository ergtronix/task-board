import { useState } from 'react'

const STATUSES = [
  { value: 'pending',     label: 'New / Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'blocked',     label: '🔴 Blocked' },
  { value: 'done',        label: '✓ Done' },
]

function blockedTemplate() {
  const date = new Date().toISOString().split('T')[0]
  return `## Blocked 報告
報告日時: ${date}
報告エージェント:

### Blockした理由


### ERGに求める判断・承認


### 判断しないと何が止まるか
`
}

export default function TaskModal({ task, onClose, onUpdate }) {
  const [commentText, setCommentText] = useState('')
  const [commentAuthor, setCommentAuthor] = useState('Claude')
  const [saving, setSaving] = useState(false)

  async function updateField(updates) {
    setSaving(true)
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    const updated = await res.json()
    onUpdate(updated)
    setSaving(false)
  }

  async function addComment() {
    if (!commentText.trim()) return
    setSaving(true)
    const res = await fetch(`/api/tasks/${task.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: commentAuthor, text: commentText }),
    })
    const updated = await res.json()
    onUpdate(updated)
    setCommentText('')
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal${task.status === 'blocked' ? ' modal-blocked' : ''}`}>
        <div className="modal-header">
          <div>
            <span className="task-id">{task.id}</span>
            <h2 className="modal-title">{task.title}</h2>
          </div>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-meta">
          <div className="meta-row">
            <label>Status</label>
            <select
              value={task.status}
              onChange={e => updateField({ status: e.target.value })}
              className={task.status === 'blocked' ? 'select-blocked' : ''}
              disabled={saving}
            >
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="meta-row">
            <label>Assignee</label>
            <input
              defaultValue={task.assignee}
              onBlur={e => {
                if (e.target.value !== task.assignee) updateField({ assignee: e.target.value })
              }}
              className="meta-input"
            />
          </div>
          <div className="meta-row">
            <label>Priority</label>
            <span className="meta-value">{task.priority}</span>
          </div>
          <div className="meta-row">
            <label>Created</label>
            <span className="meta-value">{task.created}</span>
          </div>
          {task.source && (
            <div className="meta-row">
              <label>Source</label>
              <span className="meta-value meta-source">{task.source}</span>
            </div>
          )}
        </div>

        <div className="modal-body">
          <pre className="task-body">{task.body}</pre>
        </div>

        <div className="comment-section">
          <h3>コメントを追加</h3>
          <button
            className="btn-template"
            onClick={() => setCommentText(blockedTemplate())}
          >
            🔴 Blocked 報告テンプレート
          </button>
          <div className="comment-form">
            <input
              value={commentAuthor}
              onChange={e => setCommentAuthor(e.target.value)}
              className="author-input"
              placeholder="Author"
            />
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              className="comment-textarea"
              placeholder="コメントを入力..."
              rows={5}
            />
            <button
              className="btn-primary"
              onClick={addComment}
              disabled={saving || !commentText.trim()}
            >
              {saving ? 'Saving...' : 'Add Comment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
