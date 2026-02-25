import cors from 'cors'
import express from 'express'
import multer from 'multer'
import { createServer } from 'node:http'
import { createHmac, randomUUID } from 'node:crypto'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { Server as SocketServer } from 'socket.io'

const app = express()
const server = createServer(app)
const io = new SocketServer(server, {
  cors: { origin: '*' },
  maxHttpBufferSize: 1e7,
})

const PORT = Number(process.env.PORT ?? 4000)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin123'
const TOKEN_SECRET = process.env.TOKEN_SECRET ?? 'replace-this-secret'
const uploadsDir = join(process.cwd(), 'server', 'uploads')

if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true })
}

app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use('/uploads', express.static(uploadsDir))

app.get('/api/health', (_req, res) => {
  return res.json({ ok: true })
})

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, callback) => {
    const mimeToExt = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/webp': 'webp',
    }
    const ext = mimeToExt[file.mimetype] ?? 'bin'
    callback(null, `${Date.now()}-${randomUUID()}.${ext}`)
  },
})
const upload = multer({ storage })

const visitors = new Map()
const latestFrames = new Map()

function createAdminToken() {
  const payload = `${Date.now()}:${randomUUID()}`
  const signature = createHmac('sha256', TOKEN_SECRET).update(payload).digest('hex')
  return Buffer.from(`${payload}:${signature}`).toString('base64')
}

function verifyAdminToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const [issuedAt, nonce, signature] = decoded.split(':')
    if (!issuedAt || !nonce || !signature) return false
    const payload = `${issuedAt}:${nonce}`
    const expected = createHmac('sha256', TOKEN_SECRET).update(payload).digest('hex')
    return expected === signature
  } catch {
    return false
  }
}

function emitVisitorsState() {
  const allVisitors = Array.from(visitors.values()).sort((a, b) => b.lastSeen - a.lastSeen)
  io.to('admins').emit('admin:visitors', allVisitors)
}

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body ?? {}
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Parol xato' })
  }

  return res.json({ token: createAdminToken() })
})

app.post('/api/visitor/photo', upload.single('photo'), (req, res) => {
  const { sessionId } = req.body ?? {}
  if (!sessionId) {
    return res.status(400).json({ message: 'sessionId yuborilmagan' })
  }
  if (!req.file) {
    return res.status(400).json({ message: 'photo yuborilmagan' })
  }

  const existing = visitors.get(sessionId) ?? {
    id: sessionId,
    userAgent: 'Unknown',
    createdAt: Date.now(),
  }
  const photoUrl = `/uploads/${req.file.filename}`
  const updated = {
    ...existing,
    photoUrl,
    lastSeen: Date.now(),
  }
  visitors.set(sessionId, updated)
  emitVisitorsState()

  return res.json({ ok: true, photoUrl })
})

io.on('connection', (socket) => {
  socket.on('visitor:register', (payload = {}) => {
    const sessionId = payload.sessionId
    if (!sessionId) return

    const visitor = {
      ...(visitors.get(sessionId) ?? {
        id: sessionId,
        createdAt: Date.now(),
      }),
      userAgent: payload.userAgent ?? 'Unknown',
      isScreenSharing: false,
      lastSeen: Date.now(),
      socketId: socket.id,
    }

    visitors.set(sessionId, visitor)
    socket.data.sessionId = sessionId
    emitVisitorsState()
  })

  socket.on('visitor:screen-sharing', (payload = {}) => {
    const sessionId = socket.data.sessionId ?? payload.sessionId
    if (!sessionId) return
    const existing = visitors.get(sessionId)
    if (!existing) return

    visitors.set(sessionId, {
      ...existing,
      isScreenSharing: Boolean(payload.active),
      lastSeen: Date.now(),
    })
    if (!payload.active) {
      latestFrames.delete(sessionId)
    }
    emitVisitorsState()
  })

  socket.on('visitor:screen-frame', (payload = {}) => {
    const sessionId = socket.data.sessionId ?? payload.sessionId
    if (!sessionId || !payload.frame) return

    latestFrames.set(sessionId, payload.frame)
    const existing = visitors.get(sessionId)
    if (existing) {
      visitors.set(sessionId, { ...existing, lastSeen: Date.now() })
    }

    io.to('admins').emit('admin:screen-frame', {
      sessionId,
      frame: payload.frame,
      sentAt: Date.now(),
    })
  })

  socket.on('admin:join', (payload = {}) => {
    if (!verifyAdminToken(payload.token)) {
      socket.emit('admin:error', { message: 'Admin token yaroqsiz' })
      return
    }

    socket.join('admins')
    socket.emit('admin:visitors', Array.from(visitors.values()))
    socket.emit('admin:frames', Object.fromEntries(latestFrames))
  })

  socket.on('disconnect', () => {
    const sessionId = socket.data.sessionId
    if (!sessionId) return
    const existing = visitors.get(sessionId)
    if (!existing) return

    visitors.set(sessionId, {
      ...existing,
      isScreenSharing: false,
      lastSeen: Date.now(),
    })
    latestFrames.delete(sessionId)
    emitVisitorsState()
  })
})

server.listen(PORT, () => {
  console.log(`Monitoring server running on http://localhost:${PORT}`)
})
