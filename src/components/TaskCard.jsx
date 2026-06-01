const PRIORITY_COLOR = { high: '#ff6b6b', medium: '#ffd93d', low: '#6bcb77' }

export default function TaskCard({ task, onClick }) {
  return (
    <div className={`task-card${task.status === 'blocked' ? ' card-blocked' : ''}`} onClick={onClick}>
      <div className="card-top">
        <span className="task-id">{task.id}</span>
        <span
          className="priority-badge"
          style={{ background: PRIORITY_COLOR[task.priority] ?? '#888' }}
        >
          {task.priority}
        </span>
      </div>
      <p className="task-title">{task.title}</p>
      <div className="card-bottom">
        <span className="assignee">@ {task.assignee || 'Unassigned'}</span>
        <span className="task-date">{task.updated}</span>
      </div>
    </div>
  )
}
