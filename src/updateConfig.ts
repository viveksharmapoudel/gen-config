import {
  getStatusSolidity,
  getHeightForNthSeqSolidity,
  getParentHashByheightSolidity,
  getValidatorsDataByHashSolidity,
  getTransactionResult,
} from './helper/solidity_helper.js'
import { getHeightForNthSeqInIcon, getValidatorHashByHeightIcon, getStatusIcon } from './helper/icon_helper.js'
import {
  BSC_LINK,
  CHAIN_NAMES,
  DUMP_BSC_CONFIG_NAME,
  DUMP_SNOW_CONFIG_NAME,
  ICON_LINK,
  SNOW_LINK,
} from './constants.js'
import { BigNumber } from 'ethers'
import { IVerifierSolidity } from './interfaces/ISolidity.js'
import { IVerifierIcon } from './interfaces/IIcon.js'

import bscConfig from '../src/configs/bmr_bsc_config.json' assert { type: 'json' }
import snowConfig from '../src/configs/bmr_snow_config.json' assert { type: 'json' }
import { writeToFile } from './helper/utils.js'

async function createNewConfig(chainName: CHAIN_NAMES) {
  try {
    console.log('******** Create New Config  *************')

    let { solVerifier, iconVerifier } = await getVerifierParameters(chainName)

    if (chainName == CHAIN_NAMES.bsc) {
      newBSCConfig(solVerifier, iconVerifier)
      return
    }

    newSNOWConfig(solVerifier, iconVerifier)
  } catch (e) {
    console.log(e)
  }
}

async function getVerifierParameters(chainName: CHAIN_NAMES): Promise<{
  solVerifier: IVerifierSolidity
  iconVerifier: IVerifierIcon
}> {
  try {
    console.log('*************** getVerifierParameters *************')

    const sol_link = chainName == CHAIN_NAMES.bsc ? BSC_LINK : chainName == CHAIN_NAMES.snow ? SNOW_LINK : ''

    const solStatus = await getStatusSolidity(chainName, ICON_LINK)
    const iconStatus = await getStatusIcon(sol_link)

    // icon -> sol
    const iconVerifier = await getIconVerifier(
      solStatus.rxSeq,
      iconStatus.txSeq,
      solStatus.rxHeight,
      iconStatus.currentHeight,
      chainName,
    )

    const solVerifier = await getSolidityVerifier(
      iconStatus.rxSeq,
      solStatus.txSeq,
      iconStatus.rxHeight,
      solStatus.currentHeight,
      chainName,
    )

    return {
      solVerifier,
      iconVerifier,
    }
  } catch (e) {
    console.log('error in updatesolConfig', e)
  }
}

async function getIconVerifier(
  sol_rx_seq: BigNumber,
  icon_tx_seq: BigNumber,
  sol_rx_height: BigNumber,
  icon_latest_height: BigNumber,
  dstChainName: CHAIN_NAMES,
): Promise<IVerifierIcon> {
  console.log('************ getIconVerifier **************')
  try {
    let height = icon_latest_height.toNumber()
    if (sol_rx_seq > icon_tx_seq) {
      throw Error('rx_seq cannot be greater than tx_seq')
    }

    if (sol_rx_seq < icon_tx_seq) {
      // fetching height for next sequence data
      const h = await getHeightForNthSeqInIcon(sol_rx_seq.add(1), sol_rx_height, dstChainName)
      // setting parameter one block behind
      height = h.toNumber() - 1
    }

    // fetching height h gives next_validator_hash so validator_hash should be h-1
    const validatorHash = await getValidatorHashByHeightIcon(height - 1)
    return {
      blockHeight: height,
      validatorHash,
    }
  } catch (e) {
    console.log(e)
  }
}

async function getSolidityVerifier(
  icon_rx_seq: BigNumber,
  sol_tx_seq: BigNumber,
  icon_rx_height: BigNumber,
  sol_latest_height: BigNumber,
  chainName: CHAIN_NAMES,
): Promise<IVerifierSolidity> {
  console.log('************ getSolidityVerifier **************')

  try {
    let height = sol_latest_height.toNumber()
    if (icon_rx_seq > sol_tx_seq) {
      throw Error('rx_seq cannot be greater than tx_seq')
    }
    if (icon_rx_seq.lt(sol_tx_seq)) {
      const h = await getHeightForNthSeqSolidity(chainName, icon_rx_seq.toNumber() + 1, icon_rx_height.toNumber())
      // setting height 1 height behind height
      height = h - 1
    }

    // should get parentHash for h-1
    const parentHash = await getParentHashByheightSolidity(chainName, height)

    if (chainName === CHAIN_NAMES.bsc) {
      const validatorData = await getValidatorsDataByHashSolidity(chainName, height)
      return {
        blockHeight: height,
        parentHash,
        validatorData,
      }
    }
    return {
      blockHeight: height,
      parentHash,
    }
  } catch (e) {
    console.log(e)
  }
}

async function newBSCConfig(bscVerifier: IVerifierSolidity, iconVerifier: IVerifierIcon) {
  try {
    console.log('********* Creating New BSC Config **********')
    console.log({ bscVerifier, iconVerifier })
    // update bscConfig file
    //   b2i
    bscConfig.relays[0].src.options.verifier.blockHeight = bscVerifier.blockHeight
    bscConfig.relays[0].src.options.verifier.parentHash = bscVerifier.parentHash
    bscConfig.relays[0].src.options.verifier.validatorData = bscVerifier.validatorData
    bscConfig.relays[0].src.offset = bscVerifier.blockHeight

    // i2b
    bscConfig.relays[1].src.options.verifier.blockHeight = iconVerifier.blockHeight
    bscConfig.relays[1].src.options.verifier.validatorsHash = iconVerifier.validatorHash
    writeToFile(bscConfig, DUMP_BSC_CONFIG_NAME)

    console.log('Config File is successfully created  please find name ' + DUMP_BSC_CONFIG_NAME)
  } catch (e) {
    console.log(e)
  }
}

async function newSNOWConfig(snowVerifier: IVerifierSolidity, iconVerifier: IVerifierIcon) {
  try {
    console.log('********* Creating New Snow Config **********')
    console.log({ snowVerifier, iconVerifier })
    // TODO:
    // s2i
    snowConfig.relays[0].src.options.verifier.blockHeight = snowVerifier.blockHeight
    snowConfig.relays[0].src.options.verifier.parentHash = snowVerifier.parentHash
    snowConfig.relays[0].src.offset = snowVerifier.blockHeight

    // i2s
    snowConfig.relays[1].src.options.verifier.blockHeight = iconVerifier.blockHeight
    snowConfig.relays[1].src.options.verifier.validatorsHash = iconVerifier.validatorHash
    writeToFile(snowConfig, DUMP_SNOW_CONFIG_NAME)

    console.log('Config File is successfully created  please find name' + DUMP_SNOW_CONFIG_NAME)
  } catch (e) {
    console.log(e)
  }
}

export default createNewConfig
