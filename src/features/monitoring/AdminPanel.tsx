import { useEffect, useMemo, useRef, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import { ADMIN_TOKEN_STORAGE_KEY, MONITORING_SERVER_URL } from './config'

type Visitor = {
  id: string
  userAgent: string
  photoUrl?: string
  isScreenSharing?: boolean
  lastSeen?: number
}

export function AdminPanel() {
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? '')
  const [error, setError] = useState('')
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [frames, setFrames] = useState<Record<string, string>>({})
  const socketRef = useRef<Socket | null>(null)

  const isAuthed = useMemo(() => Boolean(token), [token])

  useEffect(() => {
    if (!token) return
    const socket = io(MONITORING_SERVER_URL, { transports: ['websocket'] })
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('admin:join', { token })
    })
    socket.on('admin:visitors', (data: Visitor[]) => setVisitors(data))
    socket.on('admin:frames', (data: Record<string, string>) => setFrames(data))
    socket.on('admin:screen-frame', (payload: { sessionId: string; frame: string }) => {
      setFrames((prev) => ({ ...prev, [payload.sessionId]: payload.frame }))
    })
    socket.on('admin:error', (payload: { message: string }) => {
      setError(payload.message || 'Admin auth error')
      localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
      setToken('')
    })

    return () => {
      socket.disconnect()
    }
  }, [token])

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${MONITORING_SERVER_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) throw new Error('wrong password')
      const data = await res.json()
      localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, data.token)
      setToken(data.token)
      setPassword('')
    } catch {
      setError('Parol xato yoki server ishlamayapti')
    }
  }

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
    setToken('')
    setVisitors([])
    setFrames({})
    socketRef.current?.disconnect()
  }

  if (!isAuthed) {
    return (
      <main className="mx-auto max-w-md p-6 text-slate-100">
        <h1 className="text-xl font-semibold">Admin panel login</h1>
        <form onSubmit={login} className="mt-4 grid gap-3">
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-white/20 bg-slate-900/70 px-3 py-2"
          />
          <button type="submit" className="rounded-lg bg-indigo-500 px-3 py-2 font-semibold">
            Login
          </button>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
        </form>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl p-6 text-slate-100">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin monitoring</h1>
        <button onClick={logout} className="rounded-lg bg-white/10 px-3 py-2 text-sm">
          Logout
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visitors.map((v) => (
          <article key={v.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
            <p className="text-xs text-slate-300">ID: {v.id}</p>
            <p className="mt-1 text-xs text-slate-300">Last seen: {v.lastSeen ? new Date(v.lastSeen).toLocaleString() : '-'}</p>
            <p className="mt-1 text-xs">Screen: {v.isScreenSharing ? 'ON' : 'OFF'}</p>
            <p className="mt-2 text-xs text-slate-300">Device: {v.userAgent}</p>
            {v.photoUrl ? (
              <img
                src={`${MONITORING_SERVER_URL}${v.photoUrl}`}
                alt="camera"
                className="mt-2 h-44 w-full rounded bg-black/40 object-contain"
              />
            ) : (
              <div className="mt-2 rounded bg-slate-800 p-2 text-xs text-slate-400">No camera photo</div>
            )}
            {frames[v.id] ? (
              <img
                src={frames[v.id]}
                alt="screen frame"
                className="mt-2 h-56 w-full rounded bg-black/40 object-contain"
              />
            ) : (
              <div className="mt-2 rounded bg-slate-800 p-2 text-xs text-slate-400">No live screen frame</div>
            )}
          </article>
        ))}
      </div>
    </main>
  )
}
