import {
  assert,
  beforeAll,
  clearStore,
  describe,
  mockIpfsFile,
  newMockEvent,
  test,
} from "matchstick-as";
import { Address, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { NewHash } from "../generated/Contract/Contract";
import { handleNewHash } from "../src/mapping";

describe("Edge case tests", () => {
  beforeAll(() => {
    clearStore();
  });

  test("Can handle wrong transaction data", () => {
    const ipfsHash = "testIpfsHash";
    mockIpfsFile(ipfsHash, "tests/ipfs/wrong-data.json");

    // @ts-ignore
    const event = changetype<NewHash>(newMockEvent());
    const hashParam = new ethereum.EventParam(
      "hash",
      ethereum.Value.fromString(ipfsHash),
    );
    const contractParam = new ethereum.EventParam(
      "hashSubmitter",
      ethereum.Value.fromAddress(
        Address.fromString("0x345ca3e014aaf5dca488057592ee47305d9b3e10"),
      ),
    );
    const feesParam = new ethereum.EventParam(
      "feesParameters",
      ethereum.Value.fromBytes(
        Bytes.fromUTF8(
          "0x00000000000000000000000000000000000000000000000000000000000001fd",
        ),
      ),
    );
    event.parameters = new Array();
    event.parameters.push(hashParam);
    event.parameters.push(contractParam);
    event.parameters.push(feesParam);

    handleNewHash(event);

    assert.entityCount("Transaction", 0);
  });
});
