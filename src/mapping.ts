import { ipfs, JSONValue, log, Value } from "@graphprotocol/graph-ts";
import { NewHash } from "../generated/Contract/Contract";
import { Transaction } from "../generated/schema";

/**
 * Handle a NewHash event
 */
export function handleNewHash(event: NewHash): void {
  let ipfsHash = event.params.hash;

  let blockInfo = Value.fromArray([
    Value.fromString(ipfsHash),
    Value.fromAddress(event.address),
    Value.fromI32(event.block.number.toI32()),
    Value.fromI32(event.block.timestamp.toI32()),
    Value.fromBytes(event.transaction.hash)
  ]);

  // fetch the IPFS document and call processDocument
  ipfs.mapJSON(ipfsHash, "processDocument", blockInfo);
}

/**
 * Parse the IPFS document and saves the entity
 * @param value
 * @param txDataValue
 */
export function processDocument(value: JSONValue, txDataValue: Value): void {
  let doc = value.toObject();

  let txData = txDataValue.toArray();
  let ipfsHash = txData[0].toString();
  let address = txData[1].toAddress();
  let blockNumber = txData[2].toI32();
  let blockTimestamp = txData[3].toI32();
  let txHash = txData[4].toBytes();

  let header = doc.get("header").toObject();
  let channelIds = header.get("channelIds").toObject().entries;
  let transactions = doc.get("transactions").toArray();

  for (let txIndex = 0; txIndex < channelIds.length; ++txIndex) {
    let channelId = channelIds[txIndex].key;
    log.info("parsing channelId {} for ipfsId {}", [channelId, ipfsHash]);
    let entity = new Transaction(ipfsHash + "-" + txIndex.toString());
    let transaction = transactions[txIndex].toObject();

    let topicsJsonVal = header
      .get("topics")
      .toObject()
      .get(channelId)
      .toArray();
    let topics: string[] = [];
    for (let i = 0; i < topicsJsonVal.length; ++i) {
      topics.push(topicsJsonVal[i].toString());
    }

    entity.hash = ipfsHash;
    entity.channelId = channelId;
    entity.blockNumber = blockNumber;
    entity.blockTimestamp = blockTimestamp;
    entity.smartContractAddress = address.toHex();
    entity.transactionHash = txHash.toHex();
    entity.topics = topics;

    let data = transaction.getEntry("data").value;
    let encData = transaction.getEntry("encryptedData").value;
    if (!encData.isNull()) {
      entity.encryptedData = encData.toString();
      // only the create action contains encryption information
      let encryptionMethod = transaction.get("encryptionMethod");
      if (!encryptionMethod.isNull()) {
        entity.encryptionMethod = encryptionMethod.toString();
        let keys = transaction.get("keys").toObject().entries;

        // keys are stored in 2 arrays for simplicity of DB model
        let publicKeys: string[] = [];
        let encryptedKeys: string[] = [];
        for (let i = 0; i < keys.length; ++i) {
          publicKeys.push(keys[i].key);
          encryptedKeys.push(keys[i].value.toString());
        }
        entity.publicKeys = publicKeys;
        entity.encryptedKeys = encryptedKeys;
      }
    } else if (!data.isNull()) {
      entity.data = data.toString();
    }
    entity.save();
  }
}
