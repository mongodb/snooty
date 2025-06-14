import React from 'react';
import { glyphs } from '@leafygreen-ui/icon';
import { css } from '@leafygreen-ui/emotion';
import { NextPrevLink } from '../InternalPageNav';
import { theme } from '../../theme/docsTheme';
import { LINK_TITLE } from './constants';
import { useShouldShowNext } from './hooks/use-should-show-next';
import { useActiveMpTutorial } from './hooks/use-active-mp-tutorial';
import { reportMPTAnalytics } from './utils';

const baseStyle = css`
  display: none;
  float: right;
  margin-left: ${theme.size.medium};
  // Top margin to help align title of next page with the middle of heading
  margin-top: 6px;

  @media ${theme.screenSize.mediumAndUp} {
    display: initial;
  }
`;

export const MPTNextLinkFull = () => {
  const activeTutorial = useActiveMpTutorial();
  const showNext = useShouldShowNext();

  if (!showNext) {
    return null;
  }

  return (
    <NextPrevLink
      className={baseStyle}
      icon={glyphs.ArrowRight.displayName}
      direction={'Next'}
      pageTitle={activeTutorial?.next?.pageTitle}
      targetSlug={activeTutorial?.next?.targetSlug}
      title={LINK_TITLE}
      onClick={() => reportMPTAnalytics(activeTutorial?.next?.targetSlug ?? '', 'full')}
    />
  );
};
