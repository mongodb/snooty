import { usePageContext } from '../../../context/page-context';
import useSnootyMetadata from '../../../utils/use-snooty-metadata';

interface TutorialPage {
  targetSlug: string;
  pageTitle: string;
}

export interface MultiPageTutorial {
  slugs: string[];
  total_steps: number;
  next: TutorialPage | null;
  prev: TutorialPage | null;
}

const addPrevNextTutorials = (
  slugTitleMapping: Record<string, string>,
  slug: string,
  activeTutorial: MultiPageTutorial | null
) => {
  if (!activeTutorial || Object.keys(activeTutorial).length === 0) {
    return;
  }

  const currPageIdx = activeTutorial.slugs.indexOf(slug);
  const keyNext = 'next';
  const keyPrev = 'prev';
  activeTutorial[keyNext] = null;
  activeTutorial[keyPrev] = null;

  const nextPageIdx = currPageIdx + 1;
  if (nextPageIdx < activeTutorial.total_steps) {
    const targetSlug = activeTutorial.slugs[nextPageIdx];
    const pageTitle = slugTitleMapping[targetSlug];
    activeTutorial[keyNext] = {
      targetSlug,
      pageTitle,
    };
  }

  const prevPageIdx = currPageIdx - 1;
  if (prevPageIdx >= 0) {
    const targetSlug = activeTutorial.slugs[prevPageIdx];
    const pageTitle = slugTitleMapping[targetSlug];
    activeTutorial[keyPrev] = {
      targetSlug,
      pageTitle,
    };
  }
};

/**
 * @returns {object | null} Metadata about a multi-page tutorial, if the current page is part of one. Otherwise, null is returned.
 */
export const useActiveMpTutorial = () => {
  const { slug } = usePageContext();
  const { multiPageTutorials = {}, slugToBreadcrumbLabel = {} } = useSnootyMetadata();

  const activeTutorial = Object.values(multiPageTutorials).find((tutorial) => tutorial.slugs?.includes(slug)) ?? null;
  addPrevNextTutorials(slugToBreadcrumbLabel, slug, activeTutorial);

  return activeTutorial;
};
