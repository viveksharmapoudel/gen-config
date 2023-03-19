var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CHAIN_NAMES } from './constants.js';
import createNewConfig from './updateConfig.js';
function __main__() {
    return __awaiter(this, void 0, void 0, function* () {
        const whichConfig = process.argv[2];
        if (whichConfig != CHAIN_NAMES.bsc && whichConfig != CHAIN_NAMES.snow) {
            console.log('Select either bsc or snow chain ');
            return;
        }
        createNewConfig(whichConfig);
    });
}
__main__();
//# sourceMappingURL=index.js.map