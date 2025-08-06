import { getCurrentNetworkId, getNearRpc } from './config.js';

let accountId;

// Initialize FastINTEAR
async function initFastIntear() {
  try {
    console.log('Initializing FastINTEAR...');
    const networkId = getCurrentNetworkId();
    const rpcUrl = getNearRpc();
    
    console.log('Current network ID:', networkId);
    console.log('RPC URL:', rpcUrl);
    
    if (!networkId) {
      throw new Error('Network ID not found');
    }

    // Configure FastINTEAR
    near.config({ 
      networkId: networkId,
      nodeUrl: rpcUrl
    });
    
    console.log('FastINTEAR setup complete');

    // Check if already signed in
    const status = near.authStatus();
    if (status === 'SignedIn') {
      accountId = near.accountId();
      console.log('Already signed in with account:', accountId);
    } else {
      accountId = null;
      console.log('Not signed in');
    }
    
    updateLoginButton();
    updateNetworkToggleState();
  } catch (err) {
    console.error('Failed to initialize FastINTEAR:', err);
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
    await near.signOut();
    accountId = null;
    updateNetworkToggleState();
    updateLoginButton();
  } else {
    try {
      console.log('Requesting sign in...');
      await near.requestSignIn({
        contractId: getCurrentNetworkId() === 'mainnet' ? 'hello.sleet.near' : 'hello.sleet.testnet'
      });
      
      // Check auth status after sign in attempt
      const status = near.authStatus();
      if (status === 'SignedIn') {
        accountId = near.accountId();
        console.log('Successfully signed in with account:', accountId);
        updateLoginButton();
        updateNetworkToggleState();
      }
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  }
}

// Initialize FastINTEAR when the page loads
document.addEventListener('DOMContentLoaded', () => {
  initFastIntear();

  // Add click handler to login button
  const loginButton = document.getElementById('near_login_button');
  if (loginButton) {
    loginButton.addEventListener('click', handleWalletConnection);
  }

  // Listen for network changes
  document.addEventListener('networkChanged', async () => {
    console.log('Network changed, signing out if needed...');
    if (accountId) {
      try {
        await near.signOut();
        accountId = null;
      } catch (err) {
        console.error('Error during sign out:', err);
      }
    }
    // Page will reload automatically after this event
  });
});

// Export account ID for other modules
export { accountId };