import { usePageContext } from '../../../context/page-context';

export const useMptPageOptions = () => {
  const { options } = usePageContext();
  if (!options || Object.keys(options).length === 0) {
    return;
  }
  return options['multi_page_tutorial_settings'];
};
