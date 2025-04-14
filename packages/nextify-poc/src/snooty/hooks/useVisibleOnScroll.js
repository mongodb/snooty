import { useState, useEffect } from 'react';
import { theme } from '../theme/docsTheme';
import { isBrowser } from '../utils/is-browser';
import useStickyTopValues from './useStickyTopValues';

// Have a component become visible as the page is scrolled down on large screen sizes
const useVisibleOnScroll = (selector) => {
  const [isVisible, setVisible] = useState(false);
  const { topLarge } = useStickyTopValues();

  useEffect(() => {
    let sentinel;
    let observer;
    if (isBrowser) {
      sentinel = document.querySelector(selector);
      if (sentinel) {
        const { height } = sentinel.getBoundingClientRect();
        const offsetFromHeader = theme.size.stripUnit(topLarge);
        const thresholdRatio = offsetFromHeader / height;
        // Added 0.8 as an additional threshold as a safety net
        const options = {
          threshold: [thresholdRatio, 0.8],
        };

        const callback = (entries) => {
          // There should only be one entry
          const entry = entries[0];
          // The component should be visible if the Header component goes over the sentinel
          if (entry.intersectionRatio <= thresholdRatio) {
            setVisible(true);
          } else {
            setVisible(false);
          }
        };

        let observer = new IntersectionObserver(callback, options);
        observer.observe(sentinel);
      }
    }

    return () => {
      if (sentinel && observer) {
        observer.unobserve(sentinel);
      }
    };
  }, [selector, topLarge]);

  return isVisible;
};

export default useVisibleOnScroll;
