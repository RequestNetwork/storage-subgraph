import { afterEach, assert, clearStore, describe, test } from "matchstick-as";
import { processIpfs } from "./utils";

describe("Transaction Data", () => {
  afterEach(() => {
    clearStore();
  });

  test("should process clear transactions", () => {
    processIpfs("transaction-clear.json");
    assert.entityCount("Transaction", 1);
    assert.fieldEquals("Transaction", "testIpfsHash-0", "hash", "testIpfsHash");
    assert.fieldEquals(
      "Transaction",
      "testIpfsHash-0",
      "dataHash",
      "0x09c043a7cb846a048c2e665b832add72046fd9913e05f0c20e7f4f360ce62a8d",
    );
  });

  test("should process encrypted transactions", () => {
    processIpfs("transaction-encrypted.json");
    assert.entityCount("Transaction", 1);
    assert.fieldEquals("Transaction", "testIpfsHash-0", "hash", "testIpfsHash");
    assert.fieldEquals(
      "Transaction",
      "testIpfsHash-0",
      "dataHash",
      "0x3e4bc69070baf9ed30ef58b87b454fd19841f18dd83f7dbe8b311bb32befc483",
    );
  });

  test("should ignore wrong transaction data", () => {
    processIpfs("transaction-data-invalid-object.json");
    assert.entityCount("Transaction", 0);
  });
});
