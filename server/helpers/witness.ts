import { WitnessClient } from "@witnessco/client";

const witness = new WitnessClient();

export async function commitUsingWitness(attestation: `0x${string}`) {
  const leaf = await witness.postLeaf(attestation);
  return leaf.leafHash
}
