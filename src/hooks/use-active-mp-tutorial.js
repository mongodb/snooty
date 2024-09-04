import { usePageContext } from '../context/page-context';
import useSnootyMetadata from '../utils/use-snooty-metadata';

/**
 * @returns {object | null} Metadata about a multi page tutorial, if the current page is part of one. Otherwise, null is returned.
 */
export const useActiveMPTutorial = () => {
  const { slug } = usePageContext();
  const { multiPageTutorials = {} } = useSnootyMetadata();

  const activeTutorial = Object.keys(multiPageTutorials).reduce((result, key) => {
    if (multiPageTutorials[key].slugs.includes(slug)) {
      result = multiPageTutorials[key];
    }

    return result;
  }, null);

  return activeTutorial;
};
