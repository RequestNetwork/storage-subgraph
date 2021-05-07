# Request Network Storage Subgraph

A Subgraph to index Request transactions.


## Getting started

- Do the usual
```
git clone ...
cd ...
yarn
```

- Start a Graph Node and an IPFS node (connected to Request dedicated IPFS network)

```
docker-compose up -d
```

- Create the subgraph. Do this only once (or each time you clear the Graph node)
```
yarn create-local
```

- Deploy and start indexing. Do this if you modify the [indexer's code](./src/mapping.ts) or the [graphql schema](./schema.graphql)
```
yarn deploy-local
```


You can go to http://localhost:8000/ to see the GraphiQL ui.

## Example queries

- Get all transactions

```graphql
query AllTransactions {
  transactions {
    id
    hash
    channelId
    blockNumber
    blockTimestamp
    smartContractAddress
    topics
    data
    encryptedData
    encryptionMethod	
    publicKeys    
  }
}
```

- Get transactions by channelId
```graphql
 query ByChannelId($channelId:String!) {
  transactions(where:{ channelId: $channelId  }){
    id
    hash
    channelId
    blockNumber
    blockTimestamp
    smartContractAddress
    topics
    data
    encryptedData
    encryptionMethod	
    publicKeys    
  }
}
```

- Get transactions by topic
```graphql
query ByChannelId($topics:[String!]) {
  transactions(where:{ topics_contains: $topics }){
    id
    hash
    channelId
    blockNumber
    blockTimestamp
    smartContractAddress
    topics
    data
    encryptedData
    encryptionMethod	
    publicKeys    
  }
}
```

