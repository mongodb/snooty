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

    // Callback is first performed upon page load. Ignore checking entries on first load to allow
    // headings[0] to be counted first when headings[0] and headings[1] are both intersecting
    let firstLoad = true;
    let defaultActiveHeadingId = window.location.hash.slice(1) || headingNodes?.[0]?.id;
    const callback = (entries) => {
      if (firstLoad) {
        firstLoad = false;
        setActiveHeadingId(defaultActiveHeadingId);
        return;
      }

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveHeadingId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    const headings = observeHeadings(headingNodes, observer);
    return () => {
      unobserveHeadings(headings, observer);
      setActiveHeadingId(defaultActiveHeadingId);
    };
  }, [headingNodes]);

  return activeHeadingId;
};

export default useActiveHeading;
