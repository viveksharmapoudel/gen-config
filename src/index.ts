import { CHAIN_NAMES } from './constants.js'
import updateConfig from './updateConfig.js'

async function __main__() {
  const whichConfig = process.argv[2]
  if (whichConfig != CHAIN_NAMES.bsc && whichConfig != CHAIN_NAMES.snow) {
    console.log('Select either bsc or snow chain ')
    return
  }
  updateConfig(whichConfig)
}

__main__()
