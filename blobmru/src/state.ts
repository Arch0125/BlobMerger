import { State } from "@stackr/sdk/machine";
import { ZeroHash, solidityPackedKeccak256 } from "ethers";
import { MerkleTree } from "merkletreejs";

export type Leaves = {
  address: string;
  blobSubmissions: {
    txHash: string;
    startIndex: number;
    endIndex: number;
  }[];
}[];

export class BetterMerkleTree {
  public merkleTree: MerkleTree;
  public leaves: Leaves;

  constructor(leaves: Leaves) {
    this.merkleTree = this.createTree(leaves);
    this.leaves = leaves;
  }

  createTree(leaves: Leaves) {
    const hashedLeaves = leaves.map((leaf) => {
      return solidityPackedKeccak256(["address"], [leaf.address]);
    });
    return new MerkleTree(hashedLeaves);
  }
}

export class ERC20 extends State<Leaves, BetterMerkleTree> {
  constructor(state: Leaves) {
    super(state);
  }

  transformer() {
    return {
      wrap: () => {
        return new BetterMerkleTree(this.state);
      },
      unwrap: (wrappedState: BetterMerkleTree) => {
        return wrappedState.leaves;
      },
    };
  }

  getRootHash(): string {
    if (this.state.length === 0) {
      return ZeroHash;
    }
    return this.transformer().wrap().merkleTree.getHexRoot();
  }
}
