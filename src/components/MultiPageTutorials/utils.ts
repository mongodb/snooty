import { reportAnalytics } from '../../utils/report-analytics';
import { currentScrollPosition } from '../../utils/current-scroll-position';

export const reportMPTAnalytics = (targetSlug: string, variant: string) => {
  reportAnalytics('Click', {
    position: 'multi page tutorial',
    label: variant,
    scroll_position: currentScrollPosition(),
    tagbook: 'true',
  });
};
