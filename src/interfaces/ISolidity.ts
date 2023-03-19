import { BigNumber } from 'ethers'

export interface IStatus {
  rxSeq: BigNumber
  txSeq: BigNumber
  rxHeight: BigNumber
  currentHeight: BigNumber
}

export interface IVerifierSolidity {
  blockHeight: number
  parentHash: string
  validatorData?: string
}
