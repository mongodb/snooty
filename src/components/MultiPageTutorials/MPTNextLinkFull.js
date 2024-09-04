import React from 'react';
import { glyphs } from '@leafygreen-ui/icon';
import { css } from '@leafygreen-ui/emotion';
import { useActiveMPTutorial } from '../../hooks/use-active-mp-tutorial';
import { NextPrevLink } from '../InternalPageNav';
import { theme } from '../../theme/docsTheme';

const baseStyle = css`
  display: none;
  float: right;
  margin-left: ${theme.size.medium};
  // Add negative margin in an attempt to align float from bottom of element instead of its top
  margin-top: -10px;

  @media ${theme.screenSize.mediumAndUp} {
    display: initial;
  }
`;

const MPTNextLinkFull = () => {
  const activeTutorial = useActiveMPTutorial();
  if (!activeTutorial || !activeTutorial.next) {
    return null;
  }

  return (
    <NextPrevLink
      className={baseStyle}
      icon={glyphs.ArrowRight.displayName}
      direction={'Next'}
      pageTitle={activeTutorial.next.pageTitle}
      targetSlug={activeTutorial.next.targetSlug}
      title={'Next Step'}
    />
  );
};

export default MPTNextLinkFull;
