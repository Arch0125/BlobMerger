import { MicroRollup, MicroRollupResponse } from "@stackr/sdk";
import { StateMachine } from "@stackr/sdk/machine";
import { expect } from "chai";
import { Wallet } from "ethers";
import genesisState from "../genesis-state.json";
import { schemas } from "../src/actions.ts";
import { ERC20Machine } from "../src/erc20.ts";
import { ERC20 } from "../src/state.ts";
import { transitions } from "../src/transitions.ts";
import { stackrConfig } from "../stackr.config.ts";
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

async function main() {
  const actionName = "create";
  const schema = schemas[actionName];
  const msgSender = bobWallet.address;
  const inputs = {
    address: msgSender,
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

async function sendBlob() {
  const actionName = "submitblob";
  const schema = schemas[actionName];
  const msgSender = bobWallet.address;
  const inputs = {
    address: msgSender,
    txHash: "0xabc",
    startIndex: 2,
    endIndex: 21,
    attestation:"abc",
    commitment:"abc"
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

sendBlob();

// const sleep = (timeInMs: number) =>
//   new Promise((resolve) => setTimeout(resolve, timeInMs));

// describe("ERC20 MRU", async () => {
//   const { domain } = stackrConfig;
//   let mru: MicroRollupResponse;

//   const ALICE_ADDRESS =
//     "0x0123456789012345678901234567890123456789012345678901234567890124";
//   const BOB_ADDRESS =
//     "0x0123456789012345678901234567890123456789012345678901234567890123";
//   const CHARLIE_ADDRESS =
//     "0x0123456789012345678901234567890123456789012345678901234567890125";

//   const aliceWallet = new Wallet(ALICE_ADDRESS);
//   const bobWallet = new Wallet(BOB_ADDRESS);
//   const charlieWallet = new Wallet(CHARLIE_ADDRESS);

//   const STATE_MACHINES = {
//     ERC20: "erc-20",
//   };

//   const machine = new StateMachine({
//     id: STATE_MACHINES.ERC20,
//     stateClass: ERC20,
//     initialState: genesisState.state,
//     on: transitions,
//   });

//   beforeEach(async () => {
//     mru = await MicroRollup({
//       isSandbox: true,
//       config: {
//         ...stackrConfig,
//         sequencer: {
//           batchSize: 1,
//           batchTime: 1,
//         },
//         logLevel: "error",
//       },
//       actionSchemas: [...Object.values(schemas)],
//       stateMachines: [machine],
//     });
//     await mru.init();
//   });

//   describe("Create and Mint", async () => {
//     it("should create an account", async () => {
//       const actionName = "create";
//       const schema = schemas[actionName];
//       const msgSender = bobWallet.address;
//       const inputs = {
//         address: msgSender,
//       };

//       const signature = await bobWallet.signTypedData(
//         domain,
//         schemas.create.EIP712TypedData.types,
//         inputs,
//       );

//       const action = schema.actionFrom({ msgSender, signature, inputs });
//       const ack = await mru.submitAction(actionName, action);

//       expect(action.hash).to.equal(ack.actionHash);

//       await sleep(100);

//       const erc20Machine = mru.stateMachines.get<ERC20Machine>(
//         STATE_MACHINES.ERC20,
//       );

//       if (!erc20Machine) {
//         throw new Error("ERC20 machine not found");
//       }

//       const accounts = erc20Machine.state;
//       expect(accounts.length).to.equal(1);
//     });

//     it("should submit blob", async () => {
//       const actionName = "submitblob";
//       const schema = schemas[actionName];
//       const msgSender = bobWallet.address;
//       const inputs = {
//         address: msgSender,
//         txHash: "0xabc",
//         startIndex: 2,
//         endIndex: 21,
//       };

//       const signature = await bobWallet.signTypedData(
//         domain,
//         schemas.submitblob.EIP712TypedData.types,
//         inputs,
//       );

//       const action = schema.actionFrom({ msgSender, signature, inputs });
//       const ack = await mru.submitAction(actionName, action);

//       expect(action.hash).to.equal(ack.actionHash);

//       await sleep(100);

//       const erc20Machine = mru.stateMachines.get<ERC20Machine>(
//         STATE_MACHINES.ERC20,
//       );

//       if (!erc20Machine) {
//         throw new Error("ERC20 machine not found");
//       }

//       const accounts = erc20Machine.state;
//       const bobsAccount = accounts.find(
//         (account) => account.address === bobWallet.address,
//       );

//       if (!bobsAccount) {
//         throw new Error("Bob's account not found");
//       }
//     });
//   });

//   afterEach(async () => {
//     await mru.shutdown();
//   });
// });
