import { getCurrentNetworkId } from './config.js';

document.addEventListener('DOMContentLoaded', initNetworkToggle);

function initNetworkToggle() {
  const button = document.getElementById('network_toggle_button');

  if (!button) return; // Avoid errors if the button isn't found

  let currentNetworkId = getCurrentNetworkId();

  button.textContent = currentNetworkId.toUpperCase();

  button.addEventListener('click', toggleNetwork);
}

function toggleNetwork() {
  let currentNetworkId = getCurrentNetworkId();

  currentNetworkId = currentNetworkId === 'mainnet' ? 'testnet' : 'mainnet';
  localStorage.setItem('networkId', currentNetworkId);

  const button = document.getElementById('network_toggle_button');
  if (button) {
    button.textContent = currentNetworkId.toUpperCase();
  }

  console.log(`Network switched to: ${currentNetworkId}`);

  // Dispatch a custom event to update the header
  document.dispatchEvent(new CustomEvent('networkChanged'));
  
  // Reload the page to ensure proper wallet initialization
  window.location.reload();
}
