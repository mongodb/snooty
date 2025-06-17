import { usePageContext } from '../../../context/page-context';
import { MultiPageTutorial, SlugToBreadcrumbLabel } from '../../../types/data';
import useSnootyMetadata from '../../../utils/use-snooty-metadata';

export type ActiveTutorial = MultiPageTutorial & {
  prev: { targetSlug: string; pageTitle: string } | null;
  next: { targetSlug: string; pageTitle: string } | null;
};

const addPrevNextTutorials = (
  slugTitleMapping: SlugToBreadcrumbLabel | undefined,
  slug: string,
  currentTutorial: MultiPageTutorial | null
) => {
  if (!slugTitleMapping || !currentTutorial || Object.keys(currentTutorial).length === 0) {
    return;
  }

  const currPageIdx = currentTutorial.slugs.indexOf(slug);
  const keyNext = 'next';
  const keyPrev = 'prev';
  const activeTutorial: ActiveTutorial = {
    // Deep clone
    ...JSON.parse(JSON.stringify(currentTutorial)),
    [keyNext]: null,
    [keyPrev]: null,
  };

  const nextPageIdx = currPageIdx + 1;
  if (nextPageIdx < currentTutorial.total_steps) {
    const targetSlug = currentTutorial.slugs[nextPageIdx];
    const pageTitle = slugTitleMapping[targetSlug];
    activeTutorial[keyNext] = {
      targetSlug,
      pageTitle,
    };
  }

  const prevPageIdx = currPageIdx - 1;
  if (prevPageIdx >= 0) {
    const targetSlug = currentTutorial.slugs[prevPageIdx];
    const pageTitle = slugTitleMapping[targetSlug];
    activeTutorial[keyPrev] = {
      targetSlug,
      pageTitle,
    };
  }

  return activeTutorial;
};

/**
 * returns Metadata about a multi-page tutorial, if the current page is part of one. Otherwise, null is returned.
 */
export const useActiveMpTutorial = () => {
  const { slug } = usePageContext();
  const { multiPageTutorials = {}, slugToBreadcrumbLabel } = useSnootyMetadata();

  const currentTutorial = Object.values(multiPageTutorials).find((tutorial) => tutorial.slugs?.includes(slug)) ?? null;
  const activeTutorialWithNextAndPrev = addPrevNextTutorials(slugToBreadcrumbLabel, slug, currentTutorial);

  return activeTutorialWithNextAndPrev;
};
