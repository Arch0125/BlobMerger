import { parseGwei, stringToHex, toBlobs } from "viem";
import { account, client } from "./client";
import { kzg } from "../kzg";

export async function blobSubmit(
  blobData: `0x${string}`,
): Promise<`0x${string}`> {
  const blobs = toBlobs({ data: blobData });

  const hash = await client.sendTransaction({
    blobs,
    kzg,
    maxFeePerBlobGas: parseGwei("30"),
    to: "0x0000000000000000000000000000000000000000",
  });

  return hash;
}
