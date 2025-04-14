import { isBrowser } from './is-browser';
/**
 * @param {object} storage
 * @returns The prefix for the storage key used by Realm for localStorage access
 */
const parseStorageKey = (storage) => {
  if (!storage.keyPart) {
    return '';
  }
  const prefix = parseStorageKey(storage.storage);
  return prefix + storage.keyPart + ':';
};

export const removeAllRealmUsersFromLocalStorage = (allUsers) => {
  // The accessToken and refreshToken are automatically removed if invalid, but not the following keys
  const keysToDelete = ['profile', 'providerType'];

  Object.values(allUsers).forEach((user) => {
    const storageKeyPrefix = parseStorageKey(user.storage);
    keysToDelete.forEach((key) => {
      localStorage.removeItem(storageKeyPrefix + key);
    });
  });
};

export const currentRealmUsersCleanup = (app, maxUsersAllowed = 1) => {
  const { allUsers } = app;

  const allUsersSize = Object.keys(allUsers).length;
  if (allUsersSize > maxUsersAllowed) {
    // Delete local storage for the app, removing all logged in users creds
    // local store will restore new values on page navigation or refresh
    if (isBrowser) {
      removeAllRealmUsersFromLocalStorage(allUsers);
    }
  }
};
