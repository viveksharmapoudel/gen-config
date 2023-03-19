import { BigNumber } from 'ethers'
import EventFilter from './EventFilter.js'
import EventNotification from './EventNotification.js'
import MonitorSpec from './MonitorSpec.js'

export default class EventMonitorSpec implements MonitorSpec {
  readonly height: BigNumber
  readonly eventFilter: EventFilter
  readonly logs: boolean

  constructor(height: BigNumber, eventFilter?: EventFilter, logs?: boolean) {
    this.height = height
    this.eventFilter = eventFilter
    this.logs = logs
  }

  getPath(): string {
    return 'event'
  }

  getParam(): object {
    let ret = {}
    if (this.eventFilter) ret = this.eventFilter.toObject()
    if (this.logs) ret['logs'] = '0x1'
    ret['height'] = BigNumber.from(this.height).toHexString()
    return ret
  }

  getConverter(): (data) => EventNotification {
    return data => new EventNotification(data)
  }
}
