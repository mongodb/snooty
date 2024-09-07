import { usePageContext } from '../../../context/page-context';
import { PAGE_OPTION_NAME } from '../constants';

export const useMptPageOptions = () => {
  const { options } = usePageContext();
  if (!options || Object.keys(options).length === 0) {
    return;
  }
  return options[PAGE_OPTION_NAME];
};
