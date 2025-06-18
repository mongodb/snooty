import { getPlaintext } from '../../utils/get-plaintext';
import { Node } from '../../types/ast';
import { DriverMap } from '../icons/DriverIconMap';

export const makeChoices = ({
  name,
  iconMapping,
  options,
}: {
  name: string;
  options: string | Record<string, Node[]>;
  iconMapping?: DriverMap;
}) =>
  Object.entries(options).map(([tabId, title]) => ({
    text: getPlaintext(title),
    value: tabId,
    ...(name === 'drivers' && iconMapping && { tabSelectorIcon: iconMapping[tabId] }),
  }));
