import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupIntearWallet } from "@near-wallet-selector/intear-wallet";
import { getCurrentNetworkId } from './config';
import "@near-wallet-selector/modal-ui/styles.css"

let selector;
let modal;
let accountId;
const METEOR_WALLET_ID = "intear-wallet";

// Initialize wallet selector
async function initWalletSelector() {
  try {
    console.log('Initializing wallet selector...');
    const networkId = getCurrentNetworkId();
    console.log('Current network ID:', networkId);
    if (!networkId) {
      throw new Error('Network ID not found');
    }

    selector = await setupWalletSelector({
      network: networkId,
      modules: [setupIntearWallet()],
      defaultWalletId: METEOR_WALLET_ID,
      autoConnect: true
    });
    console.log('Wallet selector setup complete');

    modal = setupModal(selector, {
      onComplete: async () => {
        try {
          console.log('Modal complete callback triggered');
          const wallet = await selector.wallet();
          const accounts = await wallet.getAccounts();
          accountId = accounts[0]?.accountId;
          console.log('Account ID after login:', accountId);
          if (accountId) {
            console.log('Updating UI after successful login');
            updateLoginButton();
            updateNetworkToggleState();
            modal.hide();
          }
        } catch (err) {
          console.error('Error during wallet connection:', err);
          updateLoginButton();
        }
      },
      onHide: () => {
        console.log('Modal hidden');
        updateLoginButton();
      }
    });

    // Get existing accountId if already signed in
    const wallet = await selector.wallet(METEOR_WALLET_ID);
    accountId = (await wallet.getAccounts())[0]?.accountId;
    console.log('Initial account ID:', accountId);
    updateLoginButton();

    // Subscribe to changes
    selector.on("accountsChanged", (e) => {
      console.log('Accounts changed event:', e);
      accountId = e.accounts[0]?.accountId;
      updateLoginButton();
      updateNetworkToggleState();
    });

    selector.on("signedIn", async () => {
      console.log('Signed in event triggered');
      const wallet = await selector.wallet();
      const accounts = await wallet.getAccounts();
      accountId = accounts[0]?.accountId;
      console.log('Account ID after sign in:', accountId);
      updateLoginButton();
      updateNetworkToggleState();
    });
    selector.on("signedOut", () => {
      console.log('Signed out event triggered');
      accountId = null;
      updateLoginButton();
      updateNetworkToggleState();
    });

    // Disable network toggle when logged in
    updateNetworkToggleState();
  } catch (err) {
    console.error('Failed to initialize wallet selector:', err);
    updateLoginButton();
  }
}

// Update login button text based on connection status
function updateLoginButton() {
  const loginButton = document.getElementById('near_login_button');
  if (!loginButton) {
    console.log('Login button not found');
    return;
  }
  console.log('Updating login button text. Account ID:', accountId);
  loginButton.textContent = accountId ? `${accountId}` : 'LOGIN';
}

// Update network toggle button state
function updateNetworkToggleState() {
  const networkToggleButton = document.getElementById('network_toggle_button');
  if (networkToggleButton) {
    console.log('Updating network toggle state. Is logged in:', !!accountId);
    networkToggleButton.disabled = !!accountId;
  }
}

// Handle login/logout
async function handleWalletConnection() {
  console.log('Handle wallet connection clicked. Current account ID:', accountId);
  if (accountId) {
    console.log('Signing out...');
    const wallet = await selector.wallet();
    await wallet.signOut();
    accountId = null;
    updateNetworkToggleState();
    updateLoginButton();
  } else {
    console.log('Opening login modal...');
    modal.show();
  }
}

// Initialize wallet selector when the page loads
document.addEventListener('DOMContentLoaded', () => {
  initWalletSelector();

  // Add click handler to login button
  const loginButton = document.getElementById('near_login_button');
  if (loginButton) {
    loginButton.addEventListener('click', handleWalletConnection);
  }

  // Listen for network changes
  document.addEventListener('networkChanged', async () => {
    console.log('Network changed, signing out if needed...');
    if (selector && accountId) {
      try {
        const wallet = await selector.wallet();
        await wallet.signOut();
      } catch (err) {
        console.error('Error during sign out:', err);
      }
    }
    // Page will reload automatically after this event
  });
});

// Export wallet selector instance for other modules
export { selector, accountId };