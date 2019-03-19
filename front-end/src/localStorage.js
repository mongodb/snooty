export const setLocalValue = (key, value) => {
  const prevState = JSON.parse(localStorage.getItem('mongodb-docs'));
  localStorage.setItem('mongodb-docs', JSON.stringify({ ...prevState, [key]: value }));
};

export const getLocalValue = key => {
  const docsObj = JSON.parse(localStorage.getItem('mongodb-docs'));
  if (docsObj) {
    return docsObj[key];
  }
  return undefined;
};
