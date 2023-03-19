import { BigNumber } from 'ethers'

export default class BlockNotification {
  readonly hash: string
  readonly height: BigNumber
  readonly indexes: BigNumber[][]
  readonly events: BigNumber[][][]

  constructor(data) {
    this.hash = data.hash
    this.height = BigNumber.from(data.height)
    if (data.indexes) {
      this.indexes = []
      for (let i = 0; i < data.indexes.length; i++) {
        this.indexes[i] = []
        for (let j = 0; j < data.indexes[i].length; j++) this.indexes[i][j] = BigNumber.from(data.indexes[i][j])
      }
    }
    if (data.events) {
      this.events = []
      for (let i = 0; i < data.events.length; i++) {
        this.events[i] = []
        for (let j = 0; j < data.events[i].length; j++) {
          this.events[i][j] = []
          for (let k = 0; k < data.events[i][j].length; k++) this.events[i][j][k] = BigNumber.from(data.events[i][j][k])
        }
      }
    }
  }
}
