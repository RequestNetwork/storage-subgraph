export type IpfsDocument = {
  header: {
    channelIds: Record<string, number[]>;
    topics: Record<string, string[]>;
    version: string;
  };
  transactions: { encryptedData?: string; data?: string }[];
};
