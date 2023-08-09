import { afterEach, assert, clearStore, describe, test } from "matchstick-as";
import { processIpfs } from "./utils";

describe("Transaction Data", () => {
  afterEach(() => {
    clearStore();
  });

  test("should process transactions", () => {
    processIpfs("transaction-data-string.json");
    assert.entityCount("Transaction", 1);
  });

  test("should ignore wrong transaction data", () => {
    processIpfs("transaction-data-object.json");
    assert.entityCount("Transaction", 0);
  });
});
