export const endsWith = (baseString, testSuffix) => {
  if (!baseString || !testSuffix) return false;
  const stringLength = baseString.length;
  const searchLen = testSuffix.length;
  if (stringLength < searchLen) return false;
  return baseString.substring(stringLength - searchLen, stringLength) === testSuffix;
};
