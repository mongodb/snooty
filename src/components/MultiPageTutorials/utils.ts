import { reportAnalytics } from '../../utils/report-analytics';

export const reportMPTAnalytics = (targetSlug: string, variant: string) => {
  reportAnalytics('Click', {
    properties: {
      position: 'multi page tutorial',
      position_context: `variant: ${variant}`,
      label: `target slug: ${targetSlug}`,
      label_text_displayed: `target slug: ${targetSlug}`,
    },
  });
};
