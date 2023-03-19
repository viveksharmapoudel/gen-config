import { BigNumber } from 'ethers'
import BlockNotification from './BlockNotification.js'
import EventFilter from './EventFilter.js'
import MonitorSpec from './MonitorSpec.js'

export default class BlockMonitorSpec implements MonitorSpec {
  readonly height: BigNumber
  readonly eventFilters?: EventFilter[]

  constructor(height: BigNumber, eventFilters?: EventFilter[]) {
    this.height = height
    this.eventFilters = eventFilters
  }

  getPath(): string {
    return 'block'
  }

  getParam(): object {
    const height = BigNumber.from(this.height).toHexString()
    if (!this.eventFilters || this.eventFilters.length === 0) {
      return { height }
    }
    return {
      height: height,
      eventFilters: this.eventFilters.map(v => v.toObject()),
    }
  }

  getConverter(): (data) => BlockNotification {
    return data => new BlockNotification(data)
  }
}
