const PROPERTIES = ['realm', 'landing', 'manual', 'compass'];
const PERCY_USER = 'docsworker-xlarge';

exports.PROPERTIES = [...PROPERTIES];

exports.constructPercyPageIdQuery = () => {
  const pageIdPrefixes = PROPERTIES.map((property) => {
    const percyPropertyPrefix = `${property}/${PERCY_USER}/master`;
    return `${percyPropertyPrefix}(/|$)`;
  }).join('|');

  const prefixRegex = `^(${pageIdPrefixes})`;
  return { $regex: new RegExp(prefixRegex) };
};
