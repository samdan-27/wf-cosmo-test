export const RPC_ENDPOINTS = {
  // Standard Tendermint RPC endpoint (for queries and transactions)
  TENDERMINT_RPC: "http://localhost:26657",

  // P2P communication endpoint (for node connections)
  P2P_ENDPOINT: "tcp://localhost:26656",

  // gRPC endpoint (if applicable)
  GRPC_ENDPOINT: "http://localhost:9090",

  // REST API endpoint (often on port 1317)
  REST_ENDPOINT: "http://localhost:1317",
};

// Chain configuration
export const CHAIN_CONFIG = {
  CHAIN_ID: "tokenfactory-1",
  PREFIX: "wf",
  DENOM: "uwfUSD",
  GAS_PRICE: "0.05stake", // Using stake as gas token based on your TXFLAG
};
