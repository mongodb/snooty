import React from 'react';
import { glyphs } from '@leafygreen-ui/icon';
import { css } from '@leafygreen-ui/emotion';
import { useActiveMPTutorial } from '../../hooks/use-active-mp-tutorial';
import { NextPrevLink } from '../InternalPageNav';
import { theme } from '../../theme/docsTheme';
import { usePageContext } from '../../context/page-context';
import { shouldShowNext } from './utils';
import { LINK_TITLE } from './constants';

const baseStyle = css`
  display: none;
  float: right;
  margin-left: ${theme.size.medium};

  @media ${theme.screenSize.mediumAndUp} {
    display: initial;
  }
`;

const MPTNextLinkFull = () => {
  const { options } = usePageContext();
  const activeTutorial = useActiveMPTutorial();

  if (!shouldShowNext(activeTutorial, options)) {
    return null;
  }

  return (
    <NextPrevLink
      className={baseStyle}
      icon={glyphs.ArrowRight.displayName}
      direction={'Next'}
      pageTitle={activeTutorial.next.pageTitle}
      targetSlug={activeTutorial.next.targetSlug}
      title={LINK_TITLE}
    />
  );
};

export default MPTNextLinkFull;
