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
 * @param headingNodes An array of headings nodes to be observed. Headings are typically
 * expected to be AST nodes or objects with an id field.
 * @param intersectionRatio The ratio to compare element intersection visibility with. If the element
 * is observed to be above this ratio, it will be eligible as active.
 */
const useActiveHeading = (headingNodes, intersectionRatio) => {
  const [activeHeadingId, setActiveHeadingId] = useState(headingNodes?.[0]?.id);

  useEffect(() => {
    // Create map to keep track of all headings and if they are currently seen within the viewport.
    const headingsMap = new Map();
    headingNodes.forEach(({ id }) => {
      headingsMap.set(id, false);
    });
    const targetRatio = intersectionRatio >= 0 ? intersectionRatio : 0;

    const options = {
      // Check elements after every 25% of visibility, if possible
      threshold: [0, 0.25, 0.5, 0.75, 1.0],
    };

    const callback = (entries) => {
      for (const entry of entries) {
        if (!headingsMap.has(entry.target.id)) {
          continue;
        }
        headingsMap.set(entry.target.id, entry.intersectionRatio > targetRatio);
      }

      // Find first heading that is in the viewport
      for (const entry of headingsMap) {
        const [id, isInViewport] = entry;
        if (isInViewport) {
          setActiveHeadingId(id);
          break;
        }
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
