import TaskCard from './TaskCard'

const COLUMNS = [
  { id: 'pending',     label: 'New / Pending', accent: '#4a90d9' },
  { id: 'in-progress', label: 'In Progress',   accent: '#4cc9f0' },
  { id: 'blocked',     label: '🔴 Blocked',    accent: '#ff4444' },
  { id: 'done',        label: '✓ Done',         accent: '#4caf50' },
]

export default function KanbanBoard({ tasks, onTaskClick }) {
  return (
    <div className="kanban-board">
      {COLUMNS.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id)
        return (
          <div key={col.id} className={`kanban-column${col.id === 'blocked' ? ' col-blocked' : ''}`}>
            <div className="column-header" style={{ borderTopColor: col.accent }}>
              <span className="column-title" style={{ color: col.accent }}>{col.label}</span>
              <span className="column-count" style={{ background: col.accent }}>{colTasks.length}</span>
            </div>
            <div className="column-body">
              {colTasks.map(task => (
                <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
              ))}
              {colTasks.length === 0 && <div className="empty-column">— empty —</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
