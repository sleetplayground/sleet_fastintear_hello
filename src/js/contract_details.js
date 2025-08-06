import { getCurrentNetworkId, getHelloContract, getNearBlocksUrl } from './config';

function getNearBlocksPath(path) {
    const baseUrl = getNearBlocksUrl();
    return `${baseUrl}${path}`;
}

async function updateContractDetails() {
    const contractDetailsSection = document.getElementById('greeting_contract_details');
    const networkId = getCurrentNetworkId();
    const contractId = getHelloContract();
    
    // Create contract info elements
    const contractTitle = document.createElement('h3');
    contractTitle.textContent = 'Contract Details';
    
    const contractAddress = document.createElement('p');
    const contractLink = document.createElement('a');
    contractLink.href = getNearBlocksPath(`/address/${contractId}`);
    contractLink.textContent = contractId;
    contractLink.target = '_blank';
    contractAddress.appendChild(document.createTextNode('Contract Address: '));
    contractAddress.appendChild(contractLink);
    
    const txHistoryLink = document.createElement('a');
    txHistoryLink.href = getNearBlocksPath(`/address/${contractId}`);
    txHistoryLink.textContent = 'View Transaction History on NearBlocks';
    txHistoryLink.target = '_blank';
    txHistoryLink.className = 'tx-history-link';
    
    // Clear existing content
    contractDetailsSection.innerHTML = '';
    
    // Add elements to the section
    contractDetailsSection.appendChild(contractTitle);
    contractDetailsSection.appendChild(contractAddress);
    contractDetailsSection.appendChild(txHistoryLink);
}

// Update contract details when network changes
document.addEventListener('networkChanged', updateContractDetails);

// Initial update
updateContractDetails();