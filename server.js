import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import chokidar from 'chokidar'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TASKS_DIR = path.join(__dirname, 'tasks')
const PORT = 3001

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

if (!fs.existsSync(TASKS_DIR)) fs.mkdirSync(TASKS_DIR, { recursive: true })

const sseClients = new Set()

function readAllTasks() {
  return fs.readdirSync(TASKS_DIR)
    .filter(f => f.endsWith('.md'))
    .flatMap(file => {
      try {
        const raw = fs.readFileSync(path.join(TASKS_DIR, file), 'utf-8')
        const { data, content } = matter(raw)
        return [{ ...data, body: content.trim() }]
      } catch {
        return []
      }
    })
    .sort((a, b) => (a.id || '').localeCompare(b.id || ''))
}

function sanitizeId(id) {
  return /^TASK-\d+$/.test(id) ? id : null
}

function readTask(id) {
  const file = path.join(TASKS_DIR, `${id}.md`)
  if (!fs.existsSync(file)) return null
  const raw = fs.readFileSync(file, 'utf-8')
  const { data, content } = matter(raw)
  return { ...data, body: content.trim() }
}

function writeTask(id, frontmatter, body) {
  const file = path.join(TASKS_DIR, `${id}.md`)
  const meta = { ...frontmatter, updated: new Date().toISOString().split('T')[0] }
  fs.writeFileSync(file, matter.stringify(body || '', meta), 'utf-8')
}

function getNextId() {
  const files = fs.readdirSync(TASKS_DIR).filter(f => f.match(/^TASK-\d+\.md$/))
  if (files.length === 0) return 'TASK-001'
  const nums = files.map(f => parseInt(f.replace('TASK-', '').replace('.md', ''), 10))
  return `TASK-${String(Math.max(...nums) + 1).padStart(3, '0')}`
}

function broadcast(type, payload) {
  const msg = `data: ${JSON.stringify({ type, payload })}\n\n`
  for (const client of sseClients) client.write(msg)
}

// SSE endpoint for real-time sync
app.get('/api/tasks/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()
  sseClients.add(res)
  req.on('close', () => sseClients.delete(res))
})

app.get('/api/tasks', (_req, res) => {
  try { res.json(readAllTasks()) }
  catch (e) { res.status(500).json({ error: e.message }) }
})

app.post('/api/tasks', (req, res) => {
  try {
    const { title, priority, assignee, source } = req.body
    const id = getNextId()
    const today = new Date().toISOString().split('T')[0]
    const frontmatter = {
      id, title,
      status: 'pending',
      priority: priority || 'medium',
      assignee: assignee || 'Any',
      created: today,
      source: source || ''
    }
    const body = '\n## 概要\n\n\n## 完了条件\n\n- [ ] \n\n## コメント\n'
    writeTask(id, frontmatter, body)
    const task = readTask(id)
    broadcast('updated', task)
    res.json(task)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.patch('/api/tasks/:id', (req, res) => {
  try {
    const id = sanitizeId(req.params.id)
    if (!id) return res.status(400).json({ error: 'Invalid task ID' })
    const task = readTask(id)
    if (!task) return res.status(404).json({ error: 'Not found' })
    const { body: taskBody, ...taskData } = task
    const { body: reqBody, ...updates } = req.body
    writeTask(id, { ...taskData, ...updates }, reqBody !== undefined ? reqBody : taskBody)
    const result = readTask(id)
    broadcast('updated', result)
    res.json(result)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.post('/api/tasks/:id/comments', (req, res) => {
  try {
    const id = sanitizeId(req.params.id)
    if (!id) return res.status(400).json({ error: 'Invalid task ID' })
    const task = readTask(id)
    if (!task) return res.status(404).json({ error: 'Not found' })
    const { author, text } = req.body
    const date = new Date().toISOString().split('T')[0]
    const { body, ...data } = task
    const newBody = `${body || ''}\n\n### [${date} — ${author}]\n${text}`
    writeTask(id, data, newBody)
    const result = readTask(id)
    broadcast('updated', result)
    res.json(result)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// Watch for AI-side direct file edits → push live update to UI
const watcher = chokidar.watch(TASKS_DIR, { ignoreInitial: true })
watcher.on('change', file => {
  const id = path.basename(file, '.md')
  const task = readTask(id)
  if (task) broadcast('updated', task)
})
watcher.on('add', () => broadcast('refresh', {}))
watcher.on('unlink', () => broadcast('refresh', {}))

app.listen(PORT, () => {
  console.log(`✓ Task Board API  →  http://localhost:${PORT}`)
  console.log(`✓ Tasks directory →  ${TASKS_DIR}`)
})
