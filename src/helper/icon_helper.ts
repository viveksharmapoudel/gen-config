import { BigNumber } from 'ethers'
import { BigNumber as IconBigNumber } from 'bignumber.js'

import IconService from 'icon-sdk-js'
import { BSC_LINK, CHAIN_NAMES, ICON_CHAIN_BMC_CONTRACT, ICON_URL, MESSAGE_SIGNATURE, SNOW_LINK } from '../constants.js'
import { IIconGetStatus } from '../interfaces/IIcon.js'
import { IStatus } from '../interfaces/ISolidity.js'
import { base64, RLP } from 'ethers/lib/utils.js'
import EventMonitorSpec from '../icon-monitor/EventMonitorSpec.js'
import { getMonitor } from '../icon-monitor/monitorConnection.js'
import EventFilter from '../icon-monitor/EventFilter.js'
import EventNotification from '../icon-monitor/EventNotification.js'

const IconServiceDefault = IconService.default
const { HttpProvider, IconBuilder } = IconServiceDefault

const provider = new HttpProvider(ICON_URL)
const iconService = new IconServiceDefault(provider)

export const getStatusIcon = async (_link: string): Promise<IStatus> => {
  try {
    const callBuilder = new IconBuilder.CallBuilder()
    const call = callBuilder
      .method('getStatus')
      .to(ICON_CHAIN_BMC_CONTRACT)
      .params({
        _link,
      })
      .build()

    const op = (await iconService.call(call).execute()) as IIconGetStatus
    return {
      rxSeq: BigNumber.from(op.rx_seq),
      txSeq: BigNumber.from(op.tx_seq),
      rxHeight: BigNumber.from(op.rx_height),
      currentHeight: BigNumber.from(op.cur_height),
    }
  } catch (err) {
    console.log(err)
  }
}

export function getHeightForNthSeqInIcon(
  seq_number: number,
  height_to_start: number,
  dstChainName: CHAIN_NAMES,
): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      const dstLinkAddr = dstChainName === CHAIN_NAMES.bsc ? BSC_LINK : SNOW_LINK
      const spec = new EventMonitorSpec(
        BigNumber.from(height_to_start),
        new EventFilter(MESSAGE_SIGNATURE, ICON_CHAIN_BMC_CONTRACT, [dstLinkAddr], []),
      )
      const onEvent = (data: EventNotification) => {
        const height = data.height.toNumber()
        resolve(height)
        m.close()
      }
      const onError = (error: any) => {
        reject(error)
      }
      const m = getMonitor<EventNotification>(ICON_URL, spec, onEvent, onError)
    } catch (e) {
      reject(e)
    }
  })
}

export async function getValidatorHashByHeightIcon(height: number): Promise<string> {
  try {
    //@ts-ignore
    const rawData = (await iconService.getBlockHeaderByHeight(IconBigNumber(height)).execute()) as string

    const header: string[] = decodeRLP(rawData)

    if (!header) {
      throw new Error('invalid header')
    }

    const version = BigNumber.from(header[0]).toNumber()
    if (version != 2) {
      throw new Error('invalid header version')
    }

    if (header.length !== 11) {
      throw new Error('invalid header')
    }

    if (!header[6]) {
      throw new Error('ValidatorHash is not present')
    }

    return header[6]
  } catch (e) {
    console.log('error', e)
  }
}

export function decodeRLP(rawData: string): any {
  try {
    return RLP.decode(base64.decode(rawData))
  } catch (e) {
    console.log('error while decoding: ', e)
  }
}
