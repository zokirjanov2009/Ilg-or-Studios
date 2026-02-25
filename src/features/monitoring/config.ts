const runtimeDefaultUrl = `${window.location.protocol}//${window.location.hostname}:4000`
export const MONITORING_SERVER_URL =
  import.meta.env.VITE_MONITORING_SERVER_URL ?? runtimeDefaultUrl
export const ADMIN_TOKEN_STORAGE_KEY = 'monitoring_admin_token'

export async function isMonitoringServerReachable(timeoutMs = 1200) {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${MONITORING_SERVER_URL}/api/health`, {
      method: 'GET',
      signal: controller.signal,
    })
    return res.ok
  } catch {
    return false
  } finally {
    window.clearTimeout(timer)
  }
}
