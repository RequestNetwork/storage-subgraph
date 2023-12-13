import { afterEach, assert, clearStore, describe, test } from "matchstick-as";
import { processIpfs } from "./utils";

const hash = "testIpfsHash";
const entityId = hash + "-0";
const entityType = "Transaction";
describe("Transaction Data", () => {
  afterEach(() => {
    clearStore();
  });

  test("should process clear transactions", () => {
    processIpfs("transaction-clear.json", hash);
    assert.entityCount(entityType, 1);
    assert.fieldEquals(entityType, entityId, "hash", hash);
    assert.fieldEquals(entityType, entityId, "channelId", "channel1");
    assert.fieldEquals(entityType, entityId, "topics", "[topic1, topic2]");
    assert.fieldEquals(
      entityType,
      entityId,
      "dataHash",
      "0x09c043a7cb846a048c2e665b832add72046fd9913e05f0c20e7f4f360ce62a8d",
    );

    processIpfs("transaction-clear-2.json", "secondTx");
    assert.entityCount(entityType, 2);
    assert.fieldEquals(entityType, "secondTx-0", "channelId", "channel1");
    assert.fieldEquals(entityType, "secondTx-0", "topics", "[topic1, topic3]");
    assert.entityCount("Channel", 1);
    assert.fieldEquals(
      "Channel",
      "channel1",
      "topics",
      "[topic1, topic2, topic3]",
    );
  });

  test("should process encrypted transactions", () => {
    processIpfs("transaction-encrypted.json", hash);
    assert.entityCount(entityType, 1);
    assert.fieldEquals(entityType, entityId, "hash", hash);
    assert.fieldEquals(
      entityType,
      entityId,
      "dataHash",
      "0x3e4bc69070baf9ed30ef58b87b454fd19841f18dd83f7dbe8b311bb32befc483",
    );
  });

  test("should ignore wrong transaction data", () => {
    processIpfs("transaction-data-invalid-object.json", hash);
    assert.entityCount(entityType, 0);
  });
});
