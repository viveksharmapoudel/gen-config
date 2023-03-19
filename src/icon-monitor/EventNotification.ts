import { BigNumber } from 'ethers'

export default class EventNotification {
  readonly hash: string
  readonly height: BigNumber
  readonly index: BigNumber
  readonly events: any

  constructor(data) {
    this.hash = data.hash
    this.height = BigNumber.from(data.height)
    this.index = BigNumber.from(data.index)
    this.events = data.events
  }
}
