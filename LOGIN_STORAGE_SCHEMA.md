# FastINTear Login Information Storage Schema

This document describes how FastINTear stores authentication and login information in localStorage.

## Storage Keys Used

FastINTear uses several keys in localStorage to persist authentication state:

1. `_intear_wallet_connected_account` - Main wallet connection data
2. `state` - Application state including account information
3. `config` - Network configuration
4. `nonce` - Transaction nonce for the account
5. `block` - Last known block information
6. `txHistory` - Transaction history
7. `lastSignedInAccount` - Last signed in account ID for reconnection detection

## Detailed Schema

### 1. Wallet Connection Data (`_intear_wallet_connected_account`)

This is the primary storage key for wallet connection information used by the INTEAR Wallet adapter.

```json
{
  "accounts": [
    {
      "accountId": "string",
      "publicKey": "string", // Optional
      "active": "boolean"    // Optional
    }
  ],
  "key": "string",           // Private key for Limited Access Key (LAK)
  "contractId": "string",    // Contract ID for which LAK was created
  "methodNames": ["string"], // Method names allowed for LAK
  "logoutKey": "string",     // User's main logout public key from wallet
  "networkId": "string",     // Network ID (mainnet/testnet)
  "walletUrl": "string",     // Wallet URL (optional)
  "useBridge": "boolean"     // Whether to use bridge service (optional)
}
```

### 2. Application State (`state`)

Stored in localStorage as a JSON object:

```json
{
  "accountId": "string | null",          // Currently signed-in account ID
  "privateKey": "string | null",         // Private key for LAK
  "lastWalletId": "string | null",       // Last wallet ID used
  "accessKeyContractId": "string | null" // Contract ID for LAK
}
```

The `publicKey` is derived from the `privateKey` at runtime and not directly stored.

### 3. Network Configuration (`config`)

```json
{
  "networkId": "string",      // mainnet or testnet
  "nodeUrl": "string",        // RPC endpoint URL
  "walletUrl": "string",      // Wallet URL (optional)
  "helperUrl": "string",      // Helper URL (optional)
  "explorerUrl": "string"     // Explorer URL (optional)
}
```

### 4. Transaction Nonce (`nonce`)

Stored as a simple numeric value representing the last used nonce for the account's access key.

```
123456789
```

### 5. Last Known Block (`block`)

```json
{
  "header": {
    "hash": "string",              // Block hash
    "timestamp_nanosec": "string"  // Block timestamp in nanoseconds
  }
}
```

### 6. Transaction History (`txHistory`)

Stored as an object with transaction IDs as keys:

```json
{
  "tx-1642678901234-abc123": {
    "txId": "string",              // Transaction ID
    "updateTimestamp": 123456789,  // Last update timestamp
    "status": "string",            // Transaction status
    "tx": {},                      // Transaction object
    "txHash": "string",            // Transaction hash (optional)
    "result": {},                  // Transaction result (optional)
    "error": "string | object",    // Error information (optional)
    "successValue": {},            // Success value (optional)
    "finalState": "boolean",       // Whether transaction is in final state
    "signature": "string",         // Transaction signature (optional)
    "signedTxBase64": "string"     // Signed transaction in base64 (optional)
  }
}
```

### 7. Last Signed In Account (`lastSignedInAccount`)

Stored as a simple string:

```
"account.near"
```

## Security Considerations

1. **Private Keys**: The Limited Access Key (LAK) private key is stored in localStorage, which is accessible to JavaScript on the same domain. This is a security trade-off for convenience.

2. **Sensitive Data**: No full-access keys or sensitive user information is stored directly. Only LAK keys with limited permissions are persisted.

3. **Domain Isolation**: Data is isolated to the domain where the application is running.

## Data Flow

1. When a user signs in via INTEAR Wallet, the connection data is stored in `_intear_wallet_connected_account`.
2. Account information is also stored in the `state` object.
3. Network configuration is stored in `config`.
4. As transactions are made, nonce and block information are updated.
5. Transaction history is maintained in `txHistory`.
6. When signing out, these localStorage entries are cleared.

## Example Storage Entry

After successful login, you might see entries like:

```javascript
// _intear_wallet_connected_account
{
  "accounts": [{"accountId": "user.testnet"}],
  "key": "ed25519:4YJh3...",
  "contractId": "contract.testnet",
  "methodNames": [],
  "logoutKey": "ed25519:7XKf9...",
  "networkId": "testnet"
}

// state
{
  "accountId": "user.testnet",
  "privateKey": "ed25519:4YJh3...",
  "lastWalletId": null,
  "accessKeyContractId": "contract.testnet"
}

// config
{
  "networkId": "testnet",
  "nodeUrl": "https://rpc.testnet.fastnear.com/"
}
```