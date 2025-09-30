import { useEffect, useRef } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';
import { reportAnalytics } from '../utils/report-analytics';

export const usePageDuration = () => {
  const startTimeRef = useRef<number | null>(null);
  const { pathname } = useLocation();
  const pageSlugRef = useRef<string>('');

  useEffect(() => {
    startTimeRef.current = Date.now();
    pageSlugRef.current = pathname;

    const sendPageDurationAnalytics = () => {
      if (startTimeRef.current) {
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);

        reportAnalytics('Time on Page', {
          properties: {
            position: 'page',
            position_context: `time spent on page: ${duration} seconds`,
            label: pathname,
            label_text_displayed: pathname,
          },
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched away from the page
        sendPageDurationAnalytics();
      } else {
        startTimeRef.current = Date.now();
      }
    };

    const handleBeforeUnload = () => {
      sendPageDurationAnalytics();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      sendPageDurationAnalytics();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);
};
