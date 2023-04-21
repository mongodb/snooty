// My need to update if aliases change
export const setAliasesKeys = {
  'manual-upcoming': 'manual-v6.0',
  'manual-manual': 'manual-v6.2',
  'manual-master': 'manual-v6.3',
};

export const tempKey = (manifest) => {
  return setAliasesKeys[manifest] ? setAliasesKeys[manifest] : manifest;
};
