import { usePageContext } from '../context/page-context';
import useSnootyMetadata from '../utils/use-snooty-metadata';

const addNextTutorial = (slugTitleMapping, slug, activeTutorial) => {
  if (!activeTutorial || Object.keys(activeTutorial).length === 0) {
    return;
  }

  const key = 'next';
  activeTutorial[key] = null;
  const nextPageIdx = activeTutorial.slugs.indexOf(slug) + 1;
  if (nextPageIdx >= activeTutorial.total_steps) {
    return;
  }

  const targetSlug = activeTutorial.slugs[nextPageIdx];
  const pageTitle = slugTitleMapping[targetSlug];
  activeTutorial[key] = {
    targetSlug,
    pageTitle,
  };
};

/**
 * @returns {object | null} Metadata about a multi page tutorial, if the current page is part of one. Otherwise, null is returned.
 */
export const useActiveMPTutorial = () => {
  const { slug } = usePageContext();
  const { multiPageTutorials = {}, slugToBreadcrumbLabel } = useSnootyMetadata();

  const activeTutorial = Object.keys(multiPageTutorials).reduce((result, key) => {
    if (multiPageTutorials[key].slugs.includes(slug)) {
      result = multiPageTutorials[key];
    }

    return result;
  }, null);

  addNextTutorial(slugToBreadcrumbLabel, slug, activeTutorial);

  return activeTutorial;
};
