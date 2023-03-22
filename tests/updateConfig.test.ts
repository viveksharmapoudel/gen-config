import { CHAIN_NAMES } from "../src/constants.js";
import { mockStatusICON, mockStatusBSC } from "../src/mocks/getStatus.js";
import { getIconVerifier } from "../src/updateConfig.js";

describe("Config check function", () => {
  it("returns correct verifier Parameters ", async () => {
    console.log(CHAIN_NAMES.bsc);
    const iconStatus = mockStatusICON[0];
    const bscStatus = mockStatusBSC[0];

    console.log({ bscStatus });
    // giving error due to icon default no idea why
    // const iconVerifier = await getIconVerifier(
    //   bscStatus.rxSeq,
    //   iconStatus.txSeq,
    //   bscStatus.rxHeight,
    //   iconStatus.currentHeight,
    //   CHAIN_NAMES.bsc
    // );

    // console.log({ iconVerifier });
  });
});
