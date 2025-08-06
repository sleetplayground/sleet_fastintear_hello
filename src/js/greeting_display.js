import { getHelloContract, getNearRpc } from "./config.js";

// Function to fetch the greeting from the contract
async function getGreeting() {
    const NearRpc = getNearRpc();
    const HelloContract = getHelloContract();

    const response = await fetch(NearRpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: "dontcare",
            method: "query",
            params: {
                request_type: "call_function",
                account_id: HelloContract,
                method_name: "get_greeting",
                args_base64: "",
                finality: "final"
            }
        })
    });

    const data = await response.json();
    console.log("Full response:", data); // Debugging

    if (data.result && data.result.result) {
        const greeting = new TextDecoder().decode(new Uint8Array(data.result.result));
        document.getElementById("current_greeting").textContent = greeting;
    } else {
        document.getElementById("current_greeting").textContent = "Error fetching greeting";
    }
}

// Attach event listener to the button
document.getElementById("get_current_greeting").addEventListener("click", getGreeting);
