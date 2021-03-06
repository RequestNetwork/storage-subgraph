import { Bytes, ipfs, json, JSONValueKind, log } from "@graphprotocol/graph-ts";
import { NewHash } from "../generated/Contract/Contract";
import { Transaction } from "../generated/schema";

/**
 * Handle a NewHash event
 */
export function handleNewHash(event: NewHash): void {
  let ipfsHash = event.params.hash;

  log.info("Handling doc {}", [ipfsHash]);

  let data = ipfs.cat(ipfsHash);
  if (!data) {
    log.warning("Could not retrieve IPFS hash {}", [ipfsHash]);
    return;
  }
  let jsonValue = json.try_fromBytes(data as Bytes);

  if (!jsonValue.isOk) {
    log.warning("Parsing failed for IPFS document {}", [ipfsHash]);
    return;
  }

  if (jsonValue.value.kind !== JSONValueKind.OBJECT) {
    log.warning("IPFS document is not a valid json", [ipfsHash]);
    return;
  }

  let doc = jsonValue.value.toObject();
  let blockNumber = event.block.number.toI32();
  let blockTimestamp = event.block.timestamp.toI32();
  let address = event.address;
  let txHash = event.transaction.hash;
  let feesParameters = event.params.feesParameters;

  if (!doc.isSet("header") || !doc.isSet("transactions")) {
    log.warning("IPFS document {} has a no header or transactions field", [
      ipfsHash
    ]);
    return;
  }

  let header = doc.get("header")!.toObject();
  if (!header.isSet("channelIds") || !header.isSet("topics")) {
    log.warning(
      "IPFS document {} has a no header.channelIds or header.topics",
      [ipfsHash]
    );
    return;
  }
  let channelIds = header.get("channelIds")!.toObject().entries;
  let topics = header.get("topics")!.toObject();
  let transactions = doc.get("transactions")!.toArray();

  for (let txIndex = 0; txIndex < channelIds.length; ++txIndex) {
    let channelId = channelIds[txIndex].key;
    let index = channelIds[txIndex].value
      .toArray()[0]
      .toBigInt()
      .toI32();
    log.info("parsing channelId {} for ipfsId {}", [channelId, ipfsHash]);
    let entity = new Transaction(ipfsHash + "-" + index.toString());
    let transaction = transactions[index].toObject();

    let topicList: string[] = [];
    if (topics.isSet(channelId)) {
      let topicsJsonVal = topics.get(channelId)!.toArray();
      for (let i = 0; i < topicsJsonVal.length; ++i) {
        topicList.push(topicsJsonVal[i].toString());
      }
    }

    entity.hash = ipfsHash;
    entity.channelId = channelId;
    entity.blockNumber = blockNumber;
    entity.blockTimestamp = blockTimestamp;
    entity.smartContractAddress = address.toHex();
    entity.transactionHash = txHash.toHex();
    entity.topics = topicList;
    entity.size = feesParameters.toHex();

    if (transaction.isSet("encryptedData")) {
      let encData = transaction.getEntry("encryptedData")!.value;
      entity.encryptedData = encData.toString();
      // only the create action contains encryption information
      if (transaction.isSet("encryptionMethod")) {
        entity.encryptionMethod = transaction
          .get("encryptionMethod")!
          .toString();
      }
      if (transaction.isSet("keys")) {
        let keys = transaction.get("keys")!.toObject().entries;

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
    } else if (transaction.isSet("data")) {
      let data = transaction.getEntry("data")!.value;
      entity.data = data.toString();
    } else {
      log.warning(
        "IPFS document {} has a neither data or encryptedData field",
        [ipfsHash]
      );
    }
    entity.save();
  }
}
