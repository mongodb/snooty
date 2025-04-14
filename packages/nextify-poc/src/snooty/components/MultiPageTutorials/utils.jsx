import { reportAnalytics } from '../../utils/report-analytics';

export const reportMPTAnalytics = (targetSlug, variant) => {
  reportAnalytics('MultiPageTutorialNextClicked', {
    targetSlug,
    variant,
  });
};
