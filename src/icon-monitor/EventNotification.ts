import { BigNumber } from 'ethers'

export default class EventNotification {
  readonly hash: string
  readonly height: BigNumber
  readonly index: BigNumber
  readonly events: BigNumber[]

  constructor(data) {
    this.hash = data.hash
    this.height = BigNumber.from(data.height)
    this.index = BigNumber.from(data.index)
    if (data.events) {
      this.events = []
      for (let i = 0; i < data.events; i++) this.events[i] = BigNumber.from(data.events[i])
    }
  }
}
