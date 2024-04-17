import * as cKzg from "c-kzg";
import { setupKzg } from "viem";

import path from "path";

const mainnetSetupPath = path.resolve(
  "./node_modules/viem/trusted-setups/mainnet.json",
);

export const kzg = setupKzg(cKzg, mainnetSetupPath);
