import { request, gql } from "graphql-request";

type GraphNodeError = {
  message: string;
};

type GraphNodeChain = {
  network: string;
  earliestBlock: {
    number: string;
  };
  chainHeadBlock: {
    number: string;
  };
  latestBlock: {
    number: string;
  };
};

type GraphNodeStatus = {
  subgraph: string;
  synced: boolean;
  health: string;
  entityCount: string;
  chains: GraphNodeChain[];
  fatalError: GraphNodeError;
  nonFatalErrors: GraphNodeError[];
};

const statusQuery = gql`
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
`;

const monitor = async () => {
  const { indexingStatusForCurrentVersion, indexingStatusForPendingVersion } =
    await request<{
      indexingStatusForCurrentVersion: GraphNodeStatus;
      indexingStatusForPendingVersion: GraphNodeStatus;
    }>("http://localhost:8030/graphql", statusQuery);

  if (!indexingStatusForPendingVersion) {
    console.warn("No deployment in progress");
    return;
  }

  const chainHeadBlock = parseInt(
    indexingStatusForPendingVersion.chains[0].chainHeadBlock.number,
  );
  const earliestBlock = parseInt(
    indexingStatusForPendingVersion.chains[0].earliestBlock.number,
  );
  const latestBlock = parseInt(
    indexingStatusForPendingVersion.chains[0].latestBlock.number,
  );

  const totalBlocks = chainHeadBlock - earliestBlock;
  const syncedBlocks = latestBlock - earliestBlock;
  const remainingBlocks = totalBlocks - syncedBlocks;
  const indexingStatus = syncedBlocks / totalBlocks;

  console.info(
    `[Pending deployment] ${indexingStatusForPendingVersion.health}`,
  );
  console.info(
    `[Pending deployment] entities synced: ${indexingStatusForPendingVersion.entityCount} / ${indexingStatusForCurrentVersion.entityCount}`,
  );
  console.info(
    `[Pending deployment] blocks synced: ${syncedBlocks} / ${totalBlocks}`,
  );
  console.info(`[Pending deployment] remaining blocks: ${remainingBlocks}`);
  console.info(
    `[Pending deployment] sync progress: ${
      Math.round(indexingStatus * 10000) / 100
    }%`,
  );

  if (indexingStatusForPendingVersion.fatalError) {
    console.warn(
      `[Pending deployment] ERROR: ${indexingStatusForPendingVersion.fatalError}`,
    );
  }
};

void monitor();
