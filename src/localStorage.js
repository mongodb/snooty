const isBrowser = () => typeof window !== 'undefined';

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
