import { mockIpfsFile, newMockEvent } from "matchstick-as";
import { NewHash } from "../generated/Contract/Contract";
import { Address, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { handleNewHash } from "../src/mapping";

export const processIpfs = (fileName: string): void => {
  const ipfsHash = "testIpfsHash";
  mockIpfsFile(ipfsHash, `tests/ipfs/${fileName}`);

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
  event.parameters = [];
  event.parameters.push(hashParam);
  event.parameters.push(contractParam);
  event.parameters.push(feesParam);

  handleNewHash(event);
};
