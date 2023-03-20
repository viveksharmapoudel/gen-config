import { BigNumber, Contract, ethers } from 'ethers'
import {
  BSC_CHAIN_BMC_CONTRACT,
  BSC_EPOCH,
  BSC_URL,
  CHAIN_NAMES,
  SNOW_CHAIN_BMC_CONTRACT,
  SNOW_URL,
} from '../constants.js'
import bmc from '../configs/bmc_periphery.json' assert { type: 'json' }

import { IStatus } from '../interfaces/ISolidity.js'

function getProviderSolidity(chainName: CHAIN_NAMES): ethers.providers.JsonRpcProvider {
  try {
    let url = ''
    if (chainName == CHAIN_NAMES.bsc) {
      url = BSC_URL
    } else if (chainName == CHAIN_NAMES.snow) {
      url = SNOW_URL
    } else {
      throw Error('Chain Name should be either bsc or snow')
    }
    return new ethers.providers.JsonRpcProvider(url)
  } catch (e) {
    console.log(e)
  }
}

function getContractSolidity(chainName: CHAIN_NAMES): Contract {
  let bmcPeripheryABI = bmc.abi
  try {
    if (chainName != CHAIN_NAMES.bsc && chainName != CHAIN_NAMES.snow) {
      throw Error('Chain name should be either snow or bsc ')
    }
    let contractAddress = chainName == CHAIN_NAMES.bsc ? BSC_CHAIN_BMC_CONTRACT : SNOW_CHAIN_BMC_CONTRACT

    let provider = getProviderSolidity(chainName)
    return new ethers.Contract(contractAddress, bmcPeripheryABI, provider)
  } catch (e) {
    console.log(e)
  }
}

export async function getLastBlockNumber(chainName: CHAIN_NAMES): Promise<number> {
  try {
    const provider = getProviderSolidity(chainName)
    const op = await provider.getBlockNumber()
    return op
  } catch (e) {
    console.log(e)
  }
}

export async function getTransactionResult(
  chainName: CHAIN_NAMES,
  hash: string,
): Promise<ethers.providers.TransactionReceipt> {
  try {
    const provider = getProviderSolidity(chainName)
    const op = await provider.getTransactionReceipt(hash)
    console.log(op.logs)
    return op
  } catch (e) {
    console.log(e)
  }
}

export async function getStatusSolidity(chainName: CHAIN_NAMES, link: string): Promise<IStatus> {
  try {
    const contractInstance = getContractSolidity(chainName)
    const op = (await contractInstance.getStatus(link)) as IStatus
    return {
      rxSeq: op.rxSeq,
      txSeq: op.txSeq,
      rxHeight: op.rxHeight,
      currentHeight: op.currentHeight,
    }
  } catch (e) {
    console.log(e)
    return
  }
}

export async function getHeightForNthSeqSolidity(
  chainName: CHAIN_NAMES,
  seq_number: number,
  height_to_start: number,
): Promise<number> {
  try {
    const provider = getProviderSolidity(chainName)
    const contractInstance = getContractSolidity(chainName)

    const currentBlockNumber = await provider.getBlockNumber()
    for (let i = height_to_start; i < currentBlockNumber; i += 5000) {
      const _startBlock = i
      const _endBlock = Math.min(currentBlockNumber, i + 4999)
      const events = await contractInstance.queryFilter('Message', _startBlock, _endBlock)
      for (i = 0; i < events.length; i++) {
        const event = events[i]
        const seq1 = event.args['_seq']
        if (seq1.number() === seq_number) {
          return event.blockNumber
        }
      }
    }
    return currentBlockNumber
  } catch (e) {
    console.log(e)
  }
}

export async function getParentHashByheightSolidity(chainName: CHAIN_NAMES, height: number): Promise<string> {
  try {
    const provider = getProviderSolidity(chainName)
    const op = await provider.getBlock(height)
    return op.parentHash
  } catch (e) {
    console.log(e)
  }
}

export async function getValidatorsDataByHashSolidity(chainName: CHAIN_NAMES, height: number): Promise<string> {
  try {
    const provider = getProviderSolidity(chainName)

    // specific to bsc_epoch
    height = height - (height % BSC_EPOCH)
    const op = await provider.getBlock(height)
    return op.extraData
  } catch (e) {
    console.log(e)
  }
}
