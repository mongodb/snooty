import { useEffect, useState } from 'react';

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

/**
 * Returns the id of the first (topmost) heading that is in the viewport.
 * @param {object[]} headingNodes An array of headings nodes to be observed. Headings are typically
 * expected to be AST nodes or objects with an id field.
 * @param {number} intersectionRatio The ratio to compare element intersection visibility with. If the element
 * is observed to be above this ratio, it will be eligible as active.
 */
const useActiveHeading = (headingNodes, intersectionRatio) => {
  const [activeHeadingId, setActiveHeadingId] = useState(headingNodes?.[0]?.id);

  useEffect(() => {
    // Map indexes/order of headings to their ids
    // to avoid having to find it for each active heading id later
    const headingsIndexMap = {};
    headingNodes.forEach(({ id }, index) => {
      headingsIndexMap[id] = index;
    });
    const targetRatio = intersectionRatio >= 0 ? intersectionRatio : 0;
    const headingsInViewport = new Set();

    const options = {
      // Check elements after every 25% of visibility, if possible
      threshold: [0, 0.25, 0.5, 0.75, 1.0],
    };

    const callback = (entries) => {
      for (const entry of entries) {
        if (entry.intersectionRatio > targetRatio) {
          headingsInViewport.add(entry.target.id);
        } else {
          headingsInViewport.delete(entry.target.id);
        }
      }

      // Track highest visible heading and its index
      let highestVisibleHeading = [null, Number.MAX_SAFE_INTEGER];
      // Find first/topmost heading that is in the viewport
      for (const headingId of headingsInViewport) {
        const currIdx = headingsIndexMap[headingId];
        const smallestIdxSoFar = highestVisibleHeading[1];
        if (currIdx < smallestIdxSoFar) {
          highestVisibleHeading = [headingId, currIdx];
        }
      }

      const [newActiveHeadingId] = highestVisibleHeading;
      if (newActiveHeadingId) {
        setActiveHeadingId(newActiveHeadingId);
      }
    };

    const observer = new IntersectionObserver(callback, options);
    const headings = observeHeadings(headingNodes, observer);
    return () => {
      unobserveHeadings(headings, observer);
    };
  }, [headingNodes, intersectionRatio]);

  return activeHeadingId;
};

export default useActiveHeading;
