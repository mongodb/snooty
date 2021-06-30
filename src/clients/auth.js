import { OktaAuth } from '@okta/okta-auth-js';
import { isBrowser } from '../utils/is-browser';

let authClient;
if (isBrowser) {
  authClient = new OktaAuth({
    url: process.env.AUTH_BASE_URL,
    clientId: process.env.AUTH_CLIENT_ID,
    redirectUri: process.env.REDIRECT_URI,
    issuer: process.env.AUTH_BASE_URL,
    tokenManager: {
      storage: 'cookie',
    },
  });
}

export const signupWithRedirect = () => {
  const signupUrl = `${process.env.AUTH_BASE_URL}/account/login?fromURI=https%3A%2F%2Fdocs.mongodb.com`;
  window.location = signupUrl;
};

export const loginWithRedirect = () => {
  const loginUrl = `${process.env.AUTH_BASE_URL}/account/login?fromURI=https%3A%2F%2Fdocs.mongodb.com`;
  window.location = loginUrl;
};

export const logoutWithRedirect = () => {
  const logoutUrl = `${process.env.AUTH_BASE_URL}/account/login?signedOut=true`;
  window.location = logoutUrl;
};

const initializeOktaApplicationSession = async () => {
  return;
};

// Handles parsing and storage of idTokens after auth'ing via redirectUri pattern
// If or when access tokens are needed, highly consider adding them
// to the token manager within this function
const authorize = async () => {
  return authClient.token.parseFromUrl().then((data) => {
    const { idToken } = data.tokens;
    authClient.tokenManager.add('idToken', idToken);
    authClient.handleLoginRedirect();
  });
};

export const checkOktaSession = async () => {
  if (isBrowser && authClient) {
    authClient.session.exists().then(function (exists) {
      if (exists) {
        console.log('logged in');
        initializeOktaApplicationSession();
      } else {
        console.log('logged out');
      }
    });
  }
};

export const getUserProfileFromJWT = async () => {
  if (isBrowser && authClient) {
    if (authClient.isLoginRedirect()) {
      return authorize();
    } else {
      return authClient.tokenManager.get('idToken').then((idToken) => idToken);
    }
  }
};
