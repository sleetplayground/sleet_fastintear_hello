const contractPerNetwork = {
  mainnet: 'hello.sleet.near',
  testnet: 'hello.sleet.testnet',
};

// /address/ 
const nearBlocksPerNetwork = {
  mainnet: 'https://nearblocks.io',
  testnet: 'https://testnet.nearblocks.io',
};

const rpcPerNetwork = {
  mainnet: 'https://free.rpc.fastnear.com',
  testnet: 'https://test.rpc.fastnear.com',
};

// Function to get the current network ID from localStorage
export function getCurrentNetworkId() {
  return localStorage.getItem('networkId') || 'testnet';
}

// Functions to get the current configuration based on the network ID
export function getHelloContract() {
  const networkId = getCurrentNetworkId();
  return contractPerNetwork[networkId];
}

export function getNearBlocksUrl() {
  const networkId = getCurrentNetworkId();
  return nearBlocksPerNetwork[networkId];
}

export function getNearRpc() {
  const networkId = getCurrentNetworkId();
  return rpcPerNetwork[networkId];
}