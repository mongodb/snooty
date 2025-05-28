import { reportAnalytics } from '../../utils/report-analytics';

export const reportMPTAnalytics = (targetSlug: string, variant: string) => {
  reportAnalytics('MultiPageTutorialNextClicked', {
    targetSlug,
    variant,
  });
};
