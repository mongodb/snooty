import { getPlaintext } from '../../utils/get-plaintext';
import { ASTNode } from '../../types/ast';
import { DriverMap } from '../icons/DriverIconMap';

export const makeChoices = ({
  name,
  iconMapping,
  options,
}: {
  name: string;
  options: string | Record<string, ASTNode[]>;
  iconMapping?: DriverMap;
}) =>
  Object.entries(options).map(([tabId, title]) => ({
    text: getPlaintext(title),
    value: tabId,
    ...(name === 'drivers' && iconMapping && { tabSelectorIcon: iconMapping[tabId] }),
  }));
