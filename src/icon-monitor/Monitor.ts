import MonitorSpec from './MonitorSpec.js'
import WebSocket from 'ws'

enum State {
  INIT = 0,
  CONNECT,
  START,
}

export default class Monitor<T> {
  private ws: WebSocket
  private readonly url: string
  private spec: MonitorSpec
  private state = State.INIT

  constructor(url: string, spec: MonitorSpec, ondata: (data: T) => void, onerror: (error) => void) {
    this.url = url
    this.spec = spec
    this.ws = new WebSocket(`${this.url}/${this.spec.getPath()}`)
    this.ws.on('open', () => {
      this.ws.send(JSON.stringify(this.spec.getParam()))
      this.state = State.CONNECT
    })
    this.ws.on('message', event => {
      if (this.state === State.CONNECT) {
        const res = JSON.parse(event?.toString())
        if (res.code != 0) {
          throw new Error(event).toString()
        } else {
          this.state = State.START
        }
      } else if (this.state === State.START) {
        const converter = spec.getConverter()
        const data: T = converter(JSON.parse(event?.toString()))
        ondata(data)
      }
    })
    this.ws.on('close', event => {
      this.ws.close(event.code)
    })

    this.ws.on('error', onerror)
  }

  close() {
    this.ws.close(1000)
  }
}
