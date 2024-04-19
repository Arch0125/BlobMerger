import { ActionSchema, SolidityType } from "@stackr/sdk";

// utility function to create a transfer schema
function generateSchemaFromBase(name: string) {
  return new ActionSchema(name, {
    address: SolidityType.ADDRESS,
    txHash: SolidityType.STRING,
    startIndex: SolidityType.UINT,
    endIndex: SolidityType.UINT,
  });
}

// createAccountSchema is a schema for creating an account
const createAccountSchema = new ActionSchema("createAccount", {
  address: SolidityType.ADDRESS,
});

// collection of all the transfer actions
// that can be performed on the rollup
export const schemas = {
  create: createAccountSchema,
  submitblob: generateSchemaFromBase("submitblob"),
};
