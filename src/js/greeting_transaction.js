import { selector } from './near_wallet.js';
import { getCurrentNetworkId, getHelloContract } from './config';

// Get contract name from config
const getContractName = () => {
    return getHelloContract();
};

// Function to update greeting message
async function updateGreeting(message) {
    try {
        if (!selector) {
            throw new Error('Wallet not initialized');
        }

        const wallet = await selector.wallet();
        if (!wallet) {
            throw new Error('Please connect your wallet first');
        }

        // Get the contract name based on current network
        const contractName = getContractName();

        // Call the add_message method on the smart contract
        const result = await wallet.signAndSendTransaction({
            signerId: wallet.accountId,
            receiverId: contractName,
            actions: [{
                type: 'FunctionCall',
                params: {
                    methodName: 'set_greeting',
                    args: { greeting: message },
                    gas: '30000000000000', // 30 TGas
                    deposit: '0',  // No deposit needed for this call
                }
            }]
        });

        console.log('Transaction successful:', result);
        return result;
    } catch (error) {
        console.error('Failed to update greeting:', error);
        throw error;
    }
}

// Initialize greeting functionality
function initGreetingTransaction() {
    const updateButton = document.getElementById('update_greeting_button');
    const messageInput = document.getElementById('new_greeting_input');

    if (!updateButton || !messageInput) {
        console.log('Greeting elements not found');
        return;
    }

    updateButton.addEventListener('click', async () => {
        try {
            const message = messageInput.value.trim();
            if (!message) {
                alert('Please enter a message');
                return;
            }

            // Disable button during transaction
            updateButton.disabled = true;
            updateButton.textContent = 'Processing...';

            await updateGreeting(message);
            
            // Clear input and reset button after success
            messageInput.value = '';
            alert('Greeting updated successfully!');
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            // Re-enable button
            updateButton.disabled = false;
            updateButton.textContent = 'Update Greeting';
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initGreetingTransaction);

export { updateGreeting };