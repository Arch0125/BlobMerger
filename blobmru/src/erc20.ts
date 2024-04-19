import { MicroRollup } from "@stackr/sdk";
import { stackrConfig } from "../stackr.config.ts";

import { schemas } from "./actions.ts";
import { erc20StateMachine } from "./machines.stackr.ts";

type ERC20Machine = typeof erc20StateMachine;

const mru = await MicroRollup({
  config: stackrConfig,
  actionSchemas: [schemas.create, schemas.submitblob],
  stateMachines: [erc20StateMachine],
  stfSchemaMap: {
    create: schemas.create,
    submitblob: schemas.submitblob,
  },
});

await mru.init();

export { ERC20Machine, mru };
