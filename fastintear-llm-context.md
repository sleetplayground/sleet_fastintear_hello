# FastINTEAR - NEAR Protocol JavaScript SDK

## Project Overview
FastINTEAR is an experimental fork of the @fastnear/js-monorepo that provides a simplified JavaScript SDK for interacting with the NEAR Protocol blockchain. The project focuses on browser-first development with Node.js decoupling and exclusively uses the INTEAR Wallet for authentication and transaction signing.

## Key Features
- **Browser-First Design**: Surgically removed Node.js dependencies, replaced with modern browser APIs
- **Global `near` Object**: Creates a global `near` object for easy access in browser environments
- **INTEAR Wallet Integration**: Exclusively uses INTEAR Wallet for authentication and signing
- **Static HTML Support**: Enables web3 projects with pure static HTML files
- **TypeScript Support**: Full TypeScript support with proper type definitions
- **Monorepo Structure**: Organized as a yarn workspace with multiple packages

## Project Structure

### Root Level
- `package.json` - Main workspace configuration
- `tsconfig.base.json` - Base TypeScript configuration
- `yarn.lock` / `bun.lock` - Package manager lock files
- `README.md` - Project documentation
- `examples/` - Example implementations (static and dynamic)
- `packages/` - Core packages
- `types/` - TypeScript type definitions

### Core Packages

#### packages/api (Main Package - "fastintear")
The primary package that creates the global `near` object and provides the main API.

**Key Files:**
- `src/index.ts` - Main export file
- `src/near.ts` - Core NEAR Protocol functionality
- `src/intear.ts` - INTEAR Wallet adapter implementation
- `src/state.ts` - State management
- `dist/` - Compiled output (ESM, CJS, UMD/IIFE)

**Build Targets:**
- ESM: `dist/esm/index.js`
- CommonJS: `dist/cjs/index.cjs`
- Browser Global: `dist/umd/browser.global.js` (IIFE format)

#### packages/utils
Utility functions for cryptography, encoding, and NEAR Protocol operations.

#### packages/repl
REPL environment for testing and development.

#### packages/borsh-schema
Borsh serialization schema utilities.

#### packages/wallet-adapter & packages/wallet-adapter-widget
Wallet adapter components and widgets.

## Core API

### Configuration
```typescript
import * as near from "fastintear";

// Configure network
near.config({ networkId: "mainnet" });
```

### Authentication
```typescript
// Sign in with INTEAR Wallet
await near.requestSignIn({ contractId: "example.near" });

// Check authentication status
const status = near.authStatus(); // "SignedIn" | "SignedOut"

// Get current account
const accountId = near.accountId();

// Sign out
near.signOut();
```

### Transactions
```typescript
// Send transaction
await near.sendTx({
  receiverId: "contract.near",
  actions: [
    near.actions.functionCall({
      methodName: "method_name",
      args: { key: "value" },
      gas: "30000000000000",
      deposit: "0"
    })
  ]
});
```

### Message Signing
```typescript
// Sign a message
const signature = await near.signMessage({
  message: "Hello, NEAR!",
  recipient: "recipient.near"
});
```

### Contract Interaction
```typescript
// View method call
const result = await near.view({
  contractId: "contract.near",
  methodName: "get_data",
  args: { account_id: "user.near" }
});

// Query account information
const account = await near.queryAccount({
  accountId: "user.near"
});
```

### Action Helpers
```typescript
// Function call action
// Arguments can be passed as an object (`args`) or as a base64-encoded JSON string (`argsBase64`).
near.actions.functionCall({
  methodName: "transfer",
  args: { receiver_id: "alice.near", amount: "1000" },
  gas: "30000000000000",
  deposit: "1"
});

// Transfer action
near.actions.transfer("1000000000000000000000000"); // 1 NEAR in yoctoNEAR

// Stake action
near.actions.stake({
  amount: "1000000000000000000000000",
  publicKey: "ed25519:..."
});

// Key management actions

// To add a key, you need to send a transaction to your own account
// with an `AddKey` action.

// You'll need a new key pair first. The `@fastnear/utils` package,
// which is exposed as `near.utils`, provides functions for this.
// For example:
// const newPrivateKey = near.utils.privateKeyFromRandom();
// const newPublicKey = near.utils.publicKeyFromPrivate(newPrivateKey);

// Add a full access key
// This gives the new key full control over the account.
await near.sendTx({
  receiverId: near.accountId(),
  actions: [
    near.actions.addFullAccessKey({
      publicKey: "ed25519:...", // The new public key
    }),
  ],
});

// Add a limited access (function call) key
// This key can only call specific methods on a specific contract.
await near.sendTx({
  receiverId: near.accountId(),
  actions: [
    near.actions.addLimitedAccessKey({
      publicKey: "ed25519:...", // The new public key
      allowance: "1000000000000000000000000", // in yoctoNEAR
      accountId: "contract.near", // The contract the key is allowed to call
      methodNames: ["method_one", "method_two"], // Optional: specific methods
    }),
  ],
});

// Delete a key
// This revokes the key's access.
await near.sendTx({
  receiverId: near.accountId(),
  actions: [
    near.actions.deleteKey({
      publicKey: "ed25519:...", // The public key to delete
    }),
  ],
});

// Account management
near.actions.createAccount();
near.actions.deleteAccount({ beneficiaryId: "beneficiary.near" });

// Contract deployment
// The `deployContract` action requires the contract code as a byte array.

// Example of getting contract bytes in a browser from a WASM file:
// const response = await fetch('path/to/your.wasm');
// const wasmBytes = new Uint8Array(await response.arrayBuffer());

// Example of getting contract bytes from a comma-separated string (e.g., from a textarea):
// const codeString = "0,97,115,109,...";
// const codeBytes = new Uint8Array(codeString.split(',').map(s => parseInt(s.trim())));

// To deploy a contract, you send a transaction with a `DeployContract` action.
// The contract code should be passed as an array of numbers derived from a Uint8Array
// to ensure correct serialization.
near.sendTx({
  receiverId: "your-account.near", // The account to deploy the contract to
  actions: [
    {
      type: "DeployContract",
      params: {
        code: Array.from(wasmBytes) // or Array.from(codeBytes)
      }
    }
  ]
});
```

## INTEAR Wallet Integration

### Wallet Adapter Features
- **Popup-based Authentication**: Uses popup windows for secure authentication
- **Real-time Logout Detection**: WebSocket connection for instant logout notifications
- **Session Verification**: Automatic session validation with bridge service
- **Signature Verification**: Cryptographic verification of all operations

### Wallet Adapter Configuration
```typescript
const adapter = new WalletAdapter({
  walletUrl: "https://wallet.intear.tech",
  logoutBridgeService: "https://logout-bridge-service.intear.tech",
  onStateUpdate: (state) => {
    // Handle state updates
  }
});
```

### Authentication Flow
1. User calls `near.requestSignIn()`
2. Popup opens to INTEAR Wallet
3. User authenticates in wallet
4. Wallet returns account info and keys
5. Session established with logout monitoring

## Technical Architecture

### Node.js Decoupling
- Replaced `Buffer` with `Uint8Array` and `TextEncoder`
- Uses browser-native crypto APIs
- Removed Node.js-specific dependencies
- Maintains compatibility with modern browsers

### State Management
- Local storage for persistence
- In-memory state for active session
- Transaction history tracking
- Automatic state synchronization

### Build System
- **tsup**: TypeScript bundler with esbuild
- **Multiple Targets**: ESM, CommonJS, IIFE
- **Banner/Footer Injection**: Custom JavaScript injection for global object
- **Type Generation**: Automatic TypeScript declaration files

### Security Features
- **Ed25519 Signatures**: Cryptographic signing with Noble curves
- **Nonce-based Authentication**: Prevents replay attacks
- **Origin Validation**: Validates message origins
- **Session Verification**: Regular session status checks

## Development Workflow

### Building
```bash
yarn build          # Build all packages
yarn type-check     # Type checking
yarn clean          # Clean build artifacts
```

### REPL
```bash
yarn repl          # Start interactive REPL
```

### Package Management
```bash
yarn install-all   # Install dependencies for all packages
yarn pack-all      # Pack all packages
```

## Network Configuration

### Supported Networks
- **Mainnet**: Production NEAR network
- **Testnet**: NEAR testnet for development

### Network Endpoints
- Node URL: RPC endpoint for blockchain interaction
- Wallet URL: INTEAR Wallet service URL
- Helper URL: NEAR helper service
- Explorer URL: NEAR Explorer for transaction viewing

## Error Handling

### Common Error Types
- `IntearAdapterError`: Wallet-specific errors
- RPC errors from NEAR network
- Authentication failures
- Transaction failures

### Error Recovery
- Automatic retry mechanisms
- Graceful degradation
- User-friendly error messages
- State cleanup on errors

## Browser Compatibility
- Modern browsers with ES2020+ support
- WebSocket support for real-time features
- Crypto API support for signatures
- Local storage for persistence

## Usage Examples

### Static HTML Integration
```html
<script src="https://cdn.jsdelivr.net/npm/fastintear/dist/umd/browser.global.js"></script>
<script>
  near.config({ networkId: "testnet" });
  
  async function connectWallet() {
    await near.requestSignIn();
    console.log("Connected:", near.accountId());
  }
</script>
```

### React Integration
```typescript
import * as near from "fastintear";

function App() {
  useEffect(() => {
    near.config({ networkId: "mainnet" });
  }, []);

  const handleConnect = async () => {
    await near.requestSignIn();
  };

  return (
    <button onClick={handleConnect}>
      Connect Wallet
    </button>
  );
}
```

## Dependencies

### Core Dependencies
- `@noble/curves`: Cryptographic curve operations
- `@noble/hashes`: Cryptographic hashing
- `borsh`: Binary serialization
- `big.js`: Arbitrary precision arithmetic
- `base58-js`: Base58 encoding/decoding

### Development Dependencies
- `typescript`: TypeScript compiler
- `tsup`: Build tool
- `rimraf`: File system utilities

## Version Information
- Current Version: 0.1.16 (fastintear package)
- Monorepo Version: 0.9.7
- License: MIT
- Author: FastNEAR+Intear

## Links
- Homepage: https://js.fastnear.com
- Repository: https://github.com/fastnear/js-monorepo
- INTEAR Wallet: https://github.com/INTEARnear/wallet

This project represents a significant step toward making NEAR Protocol development more accessible through browser-first design and simplified APIs while maintaining security and functionality.


---

copyright 2025 by sleet.near