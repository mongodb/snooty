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

  // Create map to keep track of all headings and if they are currently seen within the viewport.
  const headingsMap = useMemo(() => {
    const map = new Map();
    headingNodes.forEach(({ id }) => {
      map.set(id, false);
    });
    return map;
  }, [headingNodes]);
  const targetRatio = intersectionRatio >= 0 ? intersectionRatio : 0;

  useEffect(() => {
    const options = {
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
  }, [headingNodes, headingsMap, targetRatio]);

  return activeHeadingId;
};

export default useActiveHeading;
