import { MicroRollup, type MicroRollupResponse } from "@stackr/sdk";
import { StateMachine } from "@stackr/sdk/machine";
import { expect } from "chai";
import { Wallet } from "ethers";
import genesisState from "../../blobmru/genesis-state.json";
import { schemas } from "../../blobmru/src/actions.ts";
import type { ERC20Machine } from "../../blobmru/src/erc20.ts";
import { ERC20 } from "../../blobmru/src/state.ts";
import { transitions } from "../../blobmru/src/transitions.ts";
import { stackrConfig } from "../../blobmru/stackr.config.ts";
import { describe } from "mocha";

import axios from "axios";

const ALICE_ADDRESS =
  "0x0123456789012345678901234567890123456789012345678901234567890124";
const BOB_ADDRESS =
  "0x0123456789012345678901234567890123456789012345678901234567890123";
const CHARLIE_ADDRESS =
  "0x0123456789012345678901234567890123456789012345678901234567890125";

const aliceWallet = new Wallet(ALICE_ADDRESS);
const bobWallet = new Wallet(BOB_ADDRESS);
const charlieWallet = new Wallet(CHARLIE_ADDRESS);

const { domain } = stackrConfig;

export async function register(address: string) {
  const actionName = "create";
  const schema = schemas[actionName];
  const msgSender = bobWallet.address;
  const inputs = {
    address: address,
  };

  const signature = await bobWallet.signTypedData(
    domain,
    schemas.create.EIP712TypedData.types,
    inputs,
  );

  const body = {
    msgSender: msgSender,
    signature: signature,
    inputs: inputs,
  };

  console.log(body);

  console.log(await axios.post("http://localhost:3000/create", body));
}

export async function sendBlob(
  address: string,
  txHash: string,
  startIndex: number,
  endIndex: number,
  attestation: string,
  commitment: string,
) {
  const actionName = "submitblob";
  const schema = schemas[actionName];
  const msgSender = bobWallet.address;
  const inputs = {
    address: address,
    txHash: txHash,
    startIndex: startIndex,
    endIndex: endIndex,
    attestation: attestation,
    commitment: commitment,
  };

  const signature = await bobWallet.signTypedData(
    domain,
    schemas.submitblob.EIP712TypedData.types,
    inputs,
  );

  const body = {
    msgSender: msgSender,
    signature: signature,
    inputs: inputs,
  };

  console.log(body);

  console.log(await axios.post("http://localhost:3000/submitblob", body));
}
