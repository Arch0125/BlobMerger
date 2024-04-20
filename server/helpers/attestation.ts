import {
  SignProtocolClient,
  SpMode,
  EvmChains,
  OffChainSignType,
} from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";
const privateKey =
  "0x5b1c32040fad747da544476076de2997bbb06c39353d96a4d72b1db3e60bcc82"; 
const client = new SignProtocolClient(SpMode.OffChain, {
  signType: OffChainSignType.EvmEip712,
  account: privateKeyToAccount(privateKey), 
});

export async function submitAttestation(
  address: string,
  txHash: string,
  startIndex: number,
  endIndex: number,
  blobData: string
) {
  const attestationInfo = await client.createAttestation({
    schemaId: "SPS_jTZr9Rp0DxGOxRE4vSI84",
    data: {
      address: address,
      txHash: txHash,
      startIndex: startIndex,
      endIndex: endIndex,
      blobData: blobData,
    },
    indexingValue: "1",
  });
  return attestationInfo.attestationId;
}
