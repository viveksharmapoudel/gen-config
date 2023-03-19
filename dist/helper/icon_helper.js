var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BigNumber } from 'ethers';
import { BigNumber as IconBigNumber } from 'bignumber.js';
import IconService from '@icon-project/icon-sdk-js';
import { ICON_CHAIN_BMC_CONTRACT, ICON_URL } from '../constants.js';
import { base64, RLP } from 'ethers/lib/utils.js';
const IconServiceDefault = IconService.default;
const { HttpProvider, IconBuilder } = IconServiceDefault;
const provider = new HttpProvider(ICON_URL);
const iconService = new IconServiceDefault(provider);
export const getStatusIcon = (_link) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const callBuilder = new IconBuilder.CallBuilder();
        const call = callBuilder
            .method('getStatus')
            .to(ICON_CHAIN_BMC_CONTRACT)
            .params({
            _link,
        })
            .build();
        const op = (yield iconService.call(call).execute());
        return {
            rxSeq: BigNumber.from(op.rx_seq),
            txSeq: BigNumber.from(op.tx_seq),
            rxHeight: BigNumber.from(op.rx_height),
            currentHeight: BigNumber.from(op.cur_height),
        };
    }
    catch (err) {
        console.log(err);
    }
});
export function getHeightForNthSeqInIcon(seq_number, height_to_start) {
    return __awaiter(this, void 0, void 0, function* () {
        // await iconService
        // seq_number => x + 1
        //
        // TODO:
        return 0;
    });
}
export function getValidatorHashByHeightIcon(height) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //@ts-ignore
            const rawData = (yield iconService.getBlockHeaderByHeight(IconBigNumber(height)).execute());
            const header = decodeRLP(rawData);
            if (!header) {
                throw new Error('invalid header');
            }
            const version = BigNumber.from(header[0]).toNumber();
            if (version != 2) {
                throw new Error('invalid header version');
            }
            if (header.length !== 11) {
                throw new Error('invalid header');
            }
            if (!header[6]) {
                throw new Error('ValidatorHash is not present');
            }
            return header[6];
        }
        catch (e) {
            console.log('error', e);
        }
    });
}
export function decodeRLP(rawData) {
    try {
        return RLP.decode(base64.decode(rawData));
    }
    catch (e) {
        console.log('error while decoding: ', e);
    }
}
//# sourceMappingURL=icon_helper.js.map