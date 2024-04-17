import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { holesky, mainnet } from "viem/chains";

export const account = privateKeyToAccount(
  "0x5b1c32040fad747da544476076de2997bbb06c39353d96a4d72b1db3e60bcc82",
);

export const client = createWalletClient({
  account,
  chain: holesky,
  transport: http(),
});
