# Sending Multiple Transactions with Different Receivers in FastINTear

In FastINTear, you can send multiple transactions with different receivers in a single wallet interaction using the underlying wallet adapter's `sendTransactions` method. This is different from bundling multiple actions into a single transaction - instead, you're sending multiple distinct transactions at once.

## Sending Multiple Transactions

To send multiple transactions with different receivers, you need to use the wallet adapter directly. The adapter is accessible through the global `near` object's state:

```javascript
import * as near from "fastintear";

// Configure network
near.config({ networkId: "mainnet" });

// Ensure user is signed in
if (!near.accountId()) {
  await near.requestSignIn({ contractId: "example.near" });
}

// Send multiple transactions with different receivers using the wallet adapter
const result = await near.state._adapter.sendTransactions({
  transactions: [
    {
      signerId: near.accountId(),
      receiverId: "contract1.near",
      actions: [
        near.actions.functionCall({
          methodName: "method1",
          args: { param1: "value1" },
          gas: "30000000000000",
          deposit: "0"
        })
      ]
    },
    {
      signerId: near.accountId(),
      receiverId: "contract2.near",
      actions: [
        near.actions.functionCall({
          methodName: "method2",
          args: { param2: "value2" },
          gas: "30000000000000",
          deposit: "0"
        })
      ]
    },
    {
      signerId: near.accountId(),
      receiverId: "another-account.near",
      actions: [
        near.actions.transfer("1000000000000000000000000") // 1 NEAR
      ]
    }
  ]
});

console.log("Transactions sent:", result);
```

## Client-Based Usage

If you're using the client-based approach, you'll need to access the adapter differently since client instances don't expose it directly. You can use the global adapter:

```javascript
import { createNearClient } from "fastintear";
import * as near from "fastintear";

// Create client instance
const nearClient = createNearClient({ networkId: "mainnet" });

// Ensure user is signed in
if (!nearClient.accountId()) {
  await nearClient.requestSignIn({ contractId: "example.near" });
}

// Send multiple transactions with different receivers using the global wallet adapter
const result = await near.state._adapter.sendTransactions({
  transactions: [
    {
      signerId: nearClient.accountId(),
      receiverId: "contract1.near",
      actions: [
        nearClient.actions.functionCall({
          methodName: "method1",
          args: { param1: "value1" },
          gas: "30000000000000",
          deposit: "0"
        })
      ]
    },
    {
      signerId: nearClient.accountId(),
      receiverId: "contract2.near",
      actions: [
        nearClient.actions.functionCall({
          methodName: "method2",
          args: { param2: "value2" },
          gas: "30000000000000",
          deposit: "0"
        })
      ]
    }
  ]
});

console.log("Transactions sent:", result);
```

## Important Considerations

1. **Wallet Interaction**: 
   - All transactions will be approved in a single wallet popup
   - Users see all transactions at once and can approve or reject the entire batch

2. **Atomicity**: 
   - Unlike actions within a single transaction, these are separate transactions
   - They may succeed or fail independently

3. **Signing Method**: 
   - All transactions will require wallet signing since they involve multiple receivers
   - Local LAK signing is not possible for this batch

4. **Receiver IDs**: 
   - Each transaction object can have its own `receiverId`
   - This is the key advantage over using `sendTx` which only allows one receiver per call

## Transaction Structure

Each transaction in the batch follows this structure:
- `signerId`: The account initiating the transaction (usually the signed-in user)
- `receiverId`: The account the transaction is targeting
- `actions`: An array of actions to perform on the receiver

## Available Action Types

You can use any action type in each transaction:
- `functionCall`: Call a smart contract method
- `transfer`: Transfer NEAR tokens
- `stake`: Stake tokens for validation
- `addFullAccessKey`: Add a full access key to an account
- `addLimitedAccessKey`: Add a limited access key
- `deleteKey`: Remove an access key
- `deleteAccount`: Delete an account
- `createAccount`: Create a new account
- `deployContract`: Deploy a smart contract

This approach allows you to efficiently execute multiple operations on different contracts or accounts in a single wallet interaction.