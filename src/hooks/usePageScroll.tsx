import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';
import { reportAnalytics } from '../utils/report-analytics';

export const usePageScroll = () => {
  const { pathname } = useLocation();
  const hasTrackedBelowFoldRef = useRef(false);
  const viewportHeightRef = useRef(0);
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Throttled scroll handler to avoid excessive calls
  const throttledScrollHandler = useCallback(() => {
    if (throttleTimeoutRef.current) return;

    throttleTimeoutRef.current = setTimeout(() => {
      const scrollY = window.scrollY || window.pageYOffset;

      if (!hasTrackedBelowFoldRef.current && scrollY > viewportHeightRef.current) {
        hasTrackedBelowFoldRef.current = true;

        reportAnalytics('Page Scroll', {
          properties: {
            position: 'page',
            position_context: `scroll position: ${Math.round(scrollY)}`,
            label: pathname,
            label_text_displayed: pathname,
          },
        });
      }

      throttleTimeoutRef.current = null;
    }, 100);
  }, [pathname]);

  useEffect(() => {
    hasTrackedBelowFoldRef.current = false;
    viewportHeightRef.current = window.innerHeight || document.documentElement.clientHeight;

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
        throttleTimeoutRef.current = null;
      }
    };
  }, [pathname, throttledScrollHandler]);
};
