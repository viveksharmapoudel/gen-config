var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ethers } from 'ethers';
import { BSC_CHAIN_BMC_CONTRACT, BSC_EPOCH, BSC_URL, CHAIN_NAMES, SNOW_CHAIN_BMC_CONTRACT, SNOW_URL, } from '../constants.js';
import bmc from '../configs/bmc_periphery.json' assert { type: 'json' };
function getProviderSolidity(chainName) {
    try {
        let url = '';
        if (chainName == CHAIN_NAMES.bsc) {
            url = BSC_URL;
        }
        else if (chainName == CHAIN_NAMES.snow) {
            url = SNOW_URL;
        }
        else {
            throw Error('Chain Name should be either bsc or snow');
        }
        return new ethers.providers.JsonRpcProvider(url);
    }
    catch (e) {
        console.log(e);
    }
}
function getContractSolidity(chainName) {
    let bmcPeripheryABI = bmc.abi;
    try {
        if (chainName != CHAIN_NAMES.bsc && chainName != CHAIN_NAMES.snow) {
            throw Error('Chain name should be either snow or bsc ');
        }
        let contractAddress = chainName == CHAIN_NAMES.bsc ? BSC_CHAIN_BMC_CONTRACT : SNOW_CHAIN_BMC_CONTRACT;
        let provider = getProviderSolidity(chainName);
        return new ethers.Contract(contractAddress, bmcPeripheryABI, provider);
    }
    catch (e) {
        console.log(e);
    }
}
export function getLastBlockNumber(chainName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const provider = getProviderSolidity(chainName);
            const op = yield provider.getBlockNumber();
            return op;
        }
        catch (e) {
            console.log(e);
        }
    });
}
export function getStatusSolidity(chainName, link) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const contractInstance = getContractSolidity(chainName);
            const op = (yield contractInstance.getStatus(link));
            return {
                rxSeq: op.rxSeq,
                txSeq: op.txSeq,
                rxHeight: op.rxHeight,
                currentHeight: op.currentHeight,
            };
        }
        catch (e) {
            console.log(e);
            return;
        }
    });
}
export function getHeightForNthSeqSolidity(chainName, seq_number, height_to_start) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const provider = getProviderSolidity(chainName);
            const contractInstance = getContractSolidity(chainName);
            const currentBlockNumber = yield provider.getBlockNumber();
            for (let i = height_to_start; i < currentBlockNumber; i += 5000) {
                const _startBlock = i;
                const _endBlock = Math.min(currentBlockNumber, i + 4999);
                const events = yield contractInstance.queryFilter('Message', _startBlock, _endBlock);
                if (events && events.length > 0) {
                    return events[0].blockNumber;
                }
            }
            return currentBlockNumber;
        }
        catch (e) {
            console.log(e);
        }
    });
}
export function getParentHashByheightSolidity(chainName, height) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const provider = getProviderSolidity(chainName);
            const op = yield provider.getBlock(height);
            return op.parentHash;
        }
        catch (e) {
            console.log(e);
        }
    });
}
export function getValidatorsDataByHashSolidity(chainName, height) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const provider = getProviderSolidity(chainName);
            // specific to bsc_epoch
            height = height - (height % BSC_EPOCH);
            const op = yield provider.getBlock(height);
            return op.extraData;
        }
        catch (e) {
            console.log(e);
        }
    });
}
//# sourceMappingURL=solidity_helper.js.map