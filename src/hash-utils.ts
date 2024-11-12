import { ByteArray, crypto } from "@graphprotocol/graph-ts";
import { Transaction } from "../generated/schema";

// Returns the keccak256 hash of a strings
export function computeHash(data: string): string {
  return crypto.keccak256(ByteArray.fromUTF8(data)).toHexString();
}

// Returns a stringified conversion, as would be done by JSON.stringify in JS.
export function serializeTransaction(tx: Transaction): string {
  let data = tx.data;
  if (data !== null) {
    return serializeClearTxData(data);
  }
  let encryptedData = tx.encryptedData;
  if (encryptedData !== null) {
    return serializeEncryptedTxData(
      encryptedData,
      tx.encryptionMethod,
      tx.publicKeys,
      tx.encryptedKeys,
    );
  }
  return "";
}

export function serializeClearTxData(data: string): string {
  const cleanData = data.replaceAll('"', '\\"');
  return `{"data":${addQuotes(cleanData)}}`.toLowerCase();
}

export function serializeEncryptedTxData(
  data: string,
  encryptionMethod: string | null,
  publicKeys: string[] | null,
  encryptedKeys: string[] | null,
): string {
  let str = `{"encryptedData":${addQuotes(data)}`;
  if (encryptionMethod !== null) {
    str += `,"encryptionMethod":${addQuotes(encryptionMethod)}`;
  }
  if (encryptedKeys && publicKeys) {
    str += ',"keys":';
    str += objectToJsonString(publicKeys, encryptedKeys);
  }

  str += "}";
  return str.toLowerCase();
}

// given two arrays keys and values representing the object, returns a stringified JSON object, with sorted keys.
export function objectToJsonString(keys: string[], values: string[]): string {
  let result = new Array<string>(keys.length);

  for (let i = 0; i < keys.length; ++i) {
    result[i] = `${addQuotes(keys[i])}:${addQuotes(
      values[i].replaceAll('"', '\\"'),
    )}`;
  }

  return "{" + result.sort().join(",") + "}";
}

function addQuotes(str: string): string {
  return `"${str}"`;
}
