import { CHAIN_NAMES, ICON_LINK } from "../src/constants.js";
import { getStatusSolidity } from "../src/helper/solidity_helper.js";

describe(" Testing solidity helper", () => {
  it("should give me correct status", async () => {
    const bsc_status = await getStatusSolidity(CHAIN_NAMES.bsc, ICON_LINK);
  });
});
