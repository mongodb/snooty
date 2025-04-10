import { getPlaintext } from '../../utils/get-plaintext';

export const makeChoices = ({ name, iconMapping, options }) =>
  Object.entries(options).map(([tabId, title]) => ({
    text: getPlaintext(title),
    value: tabId,
    ...(name === 'drivers' && { tabSelectorIcon: iconMapping[tabId] }),
  }));
