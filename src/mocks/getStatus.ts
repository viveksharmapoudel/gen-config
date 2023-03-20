import { BigNumber } from 'ethers'
import { IStatus } from '../interfaces/ISolidity.js'

export const mockStatusICON: IStatus[] = [
  {
    rxSeq: BigNumber.from('0x0202'),
    txSeq: BigNumber.from('0x02b1'),
    rxHeight: BigNumber.from('0x0192b2d3'),
    currentHeight: BigNumber.from('0x03c64dd2'),
  },
]

export const mockStatusBSC: IStatus[] = [
  {
    rxSeq: BigNumber.from('0x0297'),
    txSeq: BigNumber.from('0x0216'),
    rxHeight: BigNumber.from('0x01955384'),
    currentHeight: BigNumber.from('0x01931096'),
  },
]

// export const
