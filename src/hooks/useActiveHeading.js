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

const useActiveHeading = (headingNodes) => {
  const [activeHeadingId, setActiveHeadingId] = useState(headingNodes?.[0]?.id);

  useEffect(() => {
    const options = {
      root: document.querySelector('.content'),
      rootMargin: '0px',
      threshold: 1.0,
    };

    const callback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveHeadingId(entry.target.id);
          return;
        }
      }
    };

    const observer = new IntersectionObserver(callback, options);
    const headings = observeHeadings(headingNodes, observer);
    return () => {
      unobserveHeadings(headings, observer);
    };
  }, [headingNodes]);

  return activeHeadingId;
};

export default useActiveHeading;
