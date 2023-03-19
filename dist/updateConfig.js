var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getStatusSolidity, getHeightForNthSeqSolidity, getParentHashByheightSolidity, getValidatorsDataByHashSolidity, } from './helper/solidity_helper.js';
import { getHeightForNthSeqInIcon, getValidatorHashByHeightIcon, getStatusIcon } from './helper/icon_helper.js';
import { BSC_LINK, CHAIN_NAMES, DUMP_BSC_CONFIG_NAME, DUMP_SNOW_CONFIG_NAME, ICON_LINK, SNOW_LINK, } from './constants.js';
import bscConfig from '../src/configs/bmr_bsc_config.json' assert { type: 'json' };
import snowConfig from '../src/configs/bmr_snow_config.json' assert { type: 'json' };
import { writeToFile } from './helper/utils.js';
function createNewConfig(chainName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('******** Create New Config  *************');
            // const status = await getValidatorHashByHeightIcon(5000)
            // return
            let { solVerifier, iconVerifier } = yield getVerifierParameters(chainName);
            if (chainName == CHAIN_NAMES.bsc) {
                newBSCConfig(solVerifier, iconVerifier);
                return;
            }
            newSNOWConfig(solVerifier, iconVerifier);
        }
        catch (e) {
            console.log(e);
        }
    });
}
function getVerifierParameters(chainName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('*************** getVerifierParameters *************');
            const sol_link = chainName == CHAIN_NAMES.bsc ? BSC_LINK : chainName == CHAIN_NAMES.snow ? SNOW_LINK : '';
            const solStatus = yield getStatusSolidity(chainName, ICON_LINK);
            const iconStatus = yield getStatusIcon(sol_link);
            // icon -> sol
            const iconVerifier = yield getIconVerifier(solStatus.rxSeq, iconStatus.txSeq, solStatus.rxHeight, iconStatus.currentHeight);
            const solVerifier = yield getSolidityVerifier(iconStatus.rxSeq, solStatus.txSeq, iconStatus.rxHeight, solStatus.currentHeight, chainName);
            return {
                solVerifier,
                iconVerifier,
            };
        }
        catch (e) {
            console.log('error in updatesolConfig', e);
        }
    });
}
function getIconVerifier(sol_rx_seq, icon_tx_seq, sol_rx_height, icon_latest_height) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('************ getIconVerifier **************');
        try {
            let height = icon_latest_height.toNumber();
            if (sol_rx_seq > icon_tx_seq) {
                throw Error('rx_seq cannot be greater than tx_seq');
            }
            if (sol_rx_seq < icon_tx_seq) {
                const h = yield getHeightForNthSeqInIcon(sol_rx_seq.toNumber() + 1, sol_rx_height.toNumber());
                height = h - 1;
            }
            // fetching height h gives next_validator_hash so validator_hash should be h-1
            const validatorHash = yield getValidatorHashByHeightIcon(height - 1);
            return {
                blockHeight: height,
                validatorHash,
            };
        }
        catch (e) {
            console.log(e);
        }
    });
}
function getSolidityVerifier(icon_rx_seq, sol_tx_seq, icon_rx_height, sol_latest_height, chainName) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('************ getSolidityVerifier **************');
        try {
            let height = sol_latest_height.toNumber();
            if (icon_rx_seq > sol_tx_seq) {
                throw Error('rx_seq cannot be greater than tx_seq');
            }
            if (icon_rx_seq.lt(sol_tx_seq)) {
                const h = yield getHeightForNthSeqSolidity(chainName, icon_rx_seq.toNumber() + 1, icon_rx_height.toNumber());
                height = h - 1;
            }
            // should get parentHash for h-1
            const parentHash = yield getParentHashByheightSolidity(chainName, height - 1);
            if (chainName === CHAIN_NAMES.bsc) {
                const validatorData = yield getValidatorsDataByHashSolidity(chainName, height);
                return {
                    blockHeight: height,
                    parentHash,
                    validatorData,
                };
            }
            return {
                blockHeight: height,
                parentHash,
            };
        }
        catch (e) {
            console.log(e);
        }
    });
}
function newBSCConfig(bscVerifier, iconVerifier) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('********* Creating New BSC Config **********');
            console.log({ bscVerifier, iconVerifier });
            // update bscConfig file
            //   b2i
            bscConfig.relays[0].src.options.verifier.blockHeight = bscVerifier.blockHeight;
            bscConfig.relays[0].src.options.verifier.parentHash = bscVerifier.parentHash;
            bscConfig.relays[0].src.options.verifier.validatorData = bscVerifier.validatorData;
            bscConfig.relays[0].src.offset = bscVerifier.blockHeight;
            // i2b
            bscConfig.relays[1].src.options.verifier.blockHeight = iconVerifier.blockHeight;
            bscConfig.relays[1].src.options.verifier.validatorsHash = iconVerifier.validatorHash;
            writeToFile(bscConfig, DUMP_BSC_CONFIG_NAME);
            console.log('Config File is successfully created  please find name ' + DUMP_BSC_CONFIG_NAME);
        }
        catch (e) {
            console.log(e);
        }
    });
}
function newSNOWConfig(snowVerifier, iconVerifier) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('********* Creating New Snow Config **********');
            console.log({ snowVerifier, iconVerifier });
            // TODO:
            // s2i
            snowConfig.relays[0].src.options.verifier.blockHeight = snowVerifier.blockHeight;
            snowConfig.relays[0].src.options.verifier.parentHash = snowVerifier.parentHash;
            snowConfig.relays[0].src.offset = snowVerifier.blockHeight;
            // i2s
            snowConfig.relays[1].src.options.verifier.blockHeight = iconVerifier.blockHeight;
            snowConfig.relays[1].src.options.verifier.validatorsHash = iconVerifier.validatorHash;
            writeToFile(snowConfig, DUMP_SNOW_CONFIG_NAME);
            console.log('Config File is successfully created  please find name' + DUMP_SNOW_CONFIG_NAME);
        }
        catch (e) {
            console.log(e);
        }
    });
}
export default createNewConfig;
//# sourceMappingURL=updateConfig.js.map