import Monitor from './Monitor.js'
import MonitorSpec from './MonitorSpec.js'

export function getMonitor<T>(
  url: string,
  request: MonitorSpec,
  ondata: (data: T) => Promise<void>,
  onerror: (error) => void,
): Monitor<T> {
  url = url.replace('http', 'ws')
  return new Monitor<T>(url, request, ondata, onerror)
}
