import { reportAnalytics } from '../../utils/report-analytics';

export const reportMPTAnalytics = (targetSlug: string, variant: string) => {
  reportAnalytics('Click', {
    properties: {
      position: 'multi page tutorial',
      label: variant,
    },
  });
};
