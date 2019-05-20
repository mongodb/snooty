import { isBrowser } from './util';

export const setLocalValue = (key, value) => {
  if (isBrowser()) {
    const prevState = JSON.parse(window.localStorage.getItem('mongodb-docs'));
    localStorage.setItem('mongodb-docs', JSON.stringify({ ...prevState, [key]: value }));
  }
};

export const getLocalValue = key => {
  if (isBrowser() && JSON.parse(window.localStorage.getItem('mongodb-docs'))) {
    const docsObj = JSON.parse(window.localStorage.getItem('mongodb-docs'));
    if (docsObj) {
      return docsObj[key];
    }
  }
  return undefined;
};

export const setSessionValue = (key, value) => {
  if (isBrowser()) {
    const prevState = JSON.parse(window.sessionStorage.getItem('mongodb-docs'));
    sessionStorage.setItem('mongodb-docs', JSON.stringify({ ...prevState, [key]: value }));
  }
};

export const getSessionValue = key => {
  if (isBrowser() && JSON.parse(window.sessionStorage.getItem('mongodb-docs'))) {
    const docsObj = JSON.parse(window.sessionStorage.getItem('mongodb-docs'));
    if (docsObj) {
      return docsObj[key];
    }
  }
  return undefined;
};
