import { getCurrentNetworkId } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');

  if (!header) return; // Avoid errors if the header isn't found

  updateHeaderText();

  // Listen for the custom event to update the header
  document.addEventListener('networkChanged', updateHeaderText);
});

export function updateHeaderText() {
  const header = document.getElementById('header');
  if (!header) return;

  const currentNetworkId = getCurrentNetworkId();
  header.textContent = currentNetworkId === 'mainnet' ? 'hello.sleet.near' : 'hello.sleet.testnet';
}