import { useEffect, useState, useMemo } from 'react';

const observeHeadings = (headingNodes, observer) =>
  headingNodes.flatMap((heading) => {
    const el = document.getElementById(heading.id);
    if (el) {
      observer.observe(el);
      return [el];
    }
    return [];
  });

const unobserveHeadings = (headings, observer) => {
  headings.forEach((el) => {
    observer.unobserve(el);
  });
};

// Returns the id of the first (topmost) heading that is in the viewport.
const useActiveHeading = (headingNodes, intersectionRatio) => {
  const [activeHeadingId, setActiveHeadingId] = useState(headingNodes?.[0]?.id);

  // Create array to keep track of all headings and if they are currently seen within the viewport.
  // The order of the headings matter.
  const headingsMemo = useMemo(() => headingNodes.map(({ id }) => ({ id, isInViewport: false })), [headingNodes]);
  const targetRatio = intersectionRatio >= 0 ? intersectionRatio : 0;

  useEffect(() => {
    const options = {
      threshold: [0, 0.25, 0.5, 0.75, 1.0],
    };

    const callback = (entries) => {
      for (const entry of entries) {
        const heading = headingsMemo.find(({ id }) => id === entry.target.id);
        if (!heading) {
          continue;
        }
        heading.isInViewport = entry.intersectionRatio > targetRatio;
      }

      // Find first heading that is in the viewport
      const headingInViewport = headingsMemo.find(({ isInViewport }) => isInViewport);
      if (headingInViewport?.isInViewport) {
        setActiveHeadingId(headingInViewport.id);
      }
    };

    const observer = new IntersectionObserver(callback, options);
    const headings = observeHeadings(headingNodes, observer);
    return () => {
      unobserveHeadings(headings, observer);
    };
  }, [headingNodes, headingsMemo, targetRatio]);

  return activeHeadingId;
};

export default useActiveHeading;
