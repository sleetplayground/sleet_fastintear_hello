import { getHelloContract, getCurrentNetworkId, getNearRpc } from "./config.js";

// Function to fetch the greeting from the contract
async function getGreeting() {
    try {
        const HelloContract = getHelloContract();
        const networkId = getCurrentNetworkId();
        const rpcUrl = getNearRpc();
        
        // Configure FastINTEAR if not already configured
        near.config({ 
            networkId: networkId,
            nodeUrl: rpcUrl
        });

        console.log("Fetching greeting from contract:", HelloContract);

        // Use FastINTEAR's view method
        const result = await near.view({
            contractId: HelloContract,
            methodName: "get_greeting",
            args: {}
        });

        console.log("Greeting result:", result);
        
        // The result should be a string directly
        const greeting = typeof result === 'string' ? result : JSON.stringify(result);
        document.getElementById("current_greeting").textContent = greeting;
    } catch (error) {
        console.error("Error fetching greeting:", error);
        document.getElementById("current_greeting").textContent = "Error fetching greeting";
    }
}

// Attach event listener to the button
document.getElementById("get_current_greeting").addEventListener("click", getGreeting);
