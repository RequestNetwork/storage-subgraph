import { Bytes, ipfs, json, JSONValueKind, log } from "@graphprotocol/graph-ts";
import { NewHash } from "../generated/Contract/Contract";
import { Channel, Transaction } from "../generated/schema";
import { computeHash, serializeTransaction } from "./hash-utils";
/**
 * Handle a NewHash event
 */
export function handleNewHash(event: NewHash): void {
  let ipfsHash = event.params.hash;
  let transactionId = event.transaction.hash.toHex();
  let blockNumberString = event.block.number.toString();

  log.info(
    "Retrieving and parsing IPFS hash {}, transaction ID {}, block {}",
    [ipfsHash, transactionId, blockNumberString],
  );

  let data = ipfs.cat(ipfsHash);
  if (!data) {
    log.warning(
      "Could not retrieve IPFS hash {} from transaction ID {}, block {}",
      [ipfsHash, transactionId, blockNumberString],
    );
    return;
  }
  let jsonValue = json.try_fromBytes(data as Bytes);

  if (!jsonValue.isOk) {
    log.warning(
      "Parsing failed for IPFS hash {} from transaction ID {}, block {}",
      [ipfsHash, transactionId, blockNumberString],
    );
    return;
  }

  if (jsonValue.value.kind !== JSONValueKind.OBJECT) {
    log.warning(
      "Invalid JSON in IPFS hash {} from transaction ID {}, block {}",
      [ipfsHash, transactionId, blockNumberString],
    );
    return;
  }

  let doc = jsonValue.value.toObject();
  let blockNumber = event.block.number.toI32();
  let blockTimestamp = event.block.timestamp.toI32();
  let address = event.address;
  let feesParameters = event.params.feesParameters;

  if (!doc.isSet("header") || !doc.isSet("transactions")) {
    log.warning(
      "No header or transactions field in IPFS hash {} from transaction ID {}, block {}",
      [ipfsHash, transactionId, blockNumberString],
    );
    return;
  }

  let header = doc.get("header")!.toObject();
  if (!header.isSet("channelIds") || !header.isSet("topics")) {
    log.warning(
      "No header.channelIds or header.topics in IPFS hash {} from transaction ID {}, block {}",
      [ipfsHash, transactionId, blockNumberString],
    );
    return;
  }
  let channelIds = header.get("channelIds")!.toObject().entries;
  let topics = header.get("topics")!.toObject();
  let transactions = doc.get("transactions")!.toArray();

  for (let txIndex = 0; txIndex < channelIds.length; ++txIndex) {
    let channelId = channelIds[txIndex].key;
    let index = channelIds[txIndex].value.toArray()[0].toBigInt().toI32();
    log.info(
      "Parsing channelId {} for IPFS hash {} from transaction ID {}, block {}",
      [channelId, ipfsHash, transactionId, blockNumberString],
    );
    let entityId = ipfsHash + "-" + index.toString();
    let entity = new Transaction(entityId);
    let channel = Channel.load(channelId);
    if (!channel) {
      log.debug("new channel {}", [channelId]);
      channel = new Channel(channelId);
      channel.topics = [];
    }
    let transaction = transactions[index].toObject();
    entity.channel = channelId;

    let topicList: string[] = [];
    let channelTopicList = channel.topics;
    if (topics.isSet(channelId)) {
      let topicsJsonVal = topics.get(channelId)!.toArray();
      for (let i = 0; i < topicsJsonVal.length; ++i) {
        let topic = topicsJsonVal[i].toString();
        topicList.push(topic);
        if (!channel.topics.includes(topic)) {
          channelTopicList.push(topic);
        }
      }
    }
    channelTopicList.sort();
    channel.topics = channelTopicList;

    entity.hash = ipfsHash;
    entity.channelId = channelId;
    entity.blockNumber = blockNumber;
    entity.blockTimestamp = blockTimestamp;
    entity.smartContractAddress = address.toHex();
    entity.transactionHash = transactionId;
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
      if (data.kind !== JSONValueKind.STRING) {
        log.warning(
          "Invalid data field in IPFS hash {} from transaction ID {}, block {}",
          [ipfsHash, transactionId, blockNumberString],
        );
        return;
      }
      entity.data = data.toString();
    } else {
      log.warning(
        "Neither data or encryptedData found in IPFS hash {} from transaction ID {}, block {}",
        [ipfsHash, transactionId, blockNumberString],
      );
    }
    entity.dataHash = computeHash(serializeTransaction(entity));
    entity.save();
    channel.save();
  }
}
