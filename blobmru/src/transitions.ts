import { Transitions, STF } from "@stackr/sdk/machine";
import { ERC20, BetterMerkleTree as StateWrapper } from "./state";

// --------- Utilities ---------
const findIndexOfAccount = (state: StateWrapper, address: string) => {
  return state.leaves.findIndex((leaf) => leaf.address === address);
};

type CreateInput = {
  address: string;
};

type BaseActionInput = {
  address: string;
  txHash: string;
  startIndex: number;
  endIndex: number;
};

// --------- State Transition Handlers ---------
const create: STF<ERC20, CreateInput> = {
  handler: ({ inputs, state }) => {
    const { address } = inputs;
    if (state.leaves.find((leaf) => leaf.address === address)) {
      throw new Error("Account already exists");
    }
    state.leaves.push({
      address,
      blobSubmissions: [],
    });
    return state;
  },
};

const submitblob: STF<ERC20, BaseActionInput> = {
  handler: ({ inputs, state, msgSender }) => {
    const { address, txHash, startIndex, endIndex } = inputs;

    const index = findIndexOfAccount(state, address);
    if (state.leaves[index].address !== msgSender) {
      throw new Error("Unauthorized");
    }
    state.leaves[index].blobSubmissions.push({ txHash, startIndex, endIndex });
    return state;
  },
};

export const transitions: Transitions<ERC20> = {
  create,
  submitblob,
};
