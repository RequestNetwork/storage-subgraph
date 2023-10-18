# Request Network Storage Subgraph

A Subgraph to index Request transactions.

## Getting started

- Do the usual

```
git clone ...
cd ...
yarn
```

- Prepare your environment

```
cp .env.example .env
```

- Start a Graph Node and an IPFS node (connected to Request dedicated IPFS network)

```
docker-compose up -d
```

- Create the subgraph. Do this only once (or each time you clear the Graph node)

```
yarn create-local
```

- Generate types for the subgraph. Do this again if you modify the [indexer's code](./src/mapping.ts) or the [graphql schema](./schema.graphql)

```
yarn codegen ./subgraph-private.yaml
```

- Test the subgraph with [matchstick-as](https://thegraph.com/docs/en/developing/unit-testing-framework/#calling-a-mapping-function-with-an-event)

```
yarn test
```

- Build the subgraph. Do this again if you modify the [indexer's code](./src/mapping.ts) or the [graphql schema](./schema.graphql),
  or if you want to deploy on another chain.

```
yarn build ./subgraph-private.yaml
```

- Deploy and start indexing. Do this again if you modify the [indexer's code](./src/mapping.ts) or the [graphql schema](./schema.graphql)

```
yarn deploy-local ./subgraph-private.yaml
```

- Monitor the deployment of your new subgraph

```
yarn monitor-deployment-local
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
query ByChannelId($channelId: String!) {
  transactions(where: { channelId: $channelId }) {
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
query ByChannelId($topics: [String!]) {
  transactions(where: { topics_contains: $topics }) {
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

## Run on another network

To test this on another network than your local Ganache:

- change the .env values to your own
- run `docker-compose down`
- run `docker-compose up -d`
- re-create & deploy the subgraph, with the right subgraph manifest (xdai, rinkeby...)

## Troubleshooting

The admin API is available at http://localhost:8030/graphql

```graphql
fragment status on SubgraphIndexingStatus {
  subgraph
  synced
  health
  entityCount
  chains {
    network
    earliestBlock {
      number
    }
    chainHeadBlock {
      number
    }
    latestBlock {
      number
    }
    latestBlock {
      number
    }
  }
  fatalError {
    message
  }
  nonFatalErrors {
    message
  }
}

query {
  indexingStatusForCurrentVersion(
    subgraphName: "RequestNetwork/request-storage"
  ) {
    ...status
  }

  indexingStatusForPendingVersion(
    subgraphName: "RequestNetwork/request-storage"
  ) {
    ...status
  }
}
```
