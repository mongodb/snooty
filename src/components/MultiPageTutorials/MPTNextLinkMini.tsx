import React from 'react';
import Icon, { glyphs } from '@leafygreen-ui/icon';
import { css, cx } from '@leafygreen-ui/emotion';
import Button from '@leafygreen-ui/button';
import { theme } from '../../theme/docsTheme';
import Link from '../Link';
import { navLinkButtonStyle } from '../InternalPageNav';
import { LINK_TITLE } from './constants';
import { useShouldShowNext } from './hooks/use-should-show-next';
import { useActiveMpTutorial } from './hooks/use-active-mp-tutorial';
import { reportMPTAnalytics } from './utils';

const baseStyle = css`
  float: right;
  margin-left: ${theme.size.medium};
  // Add top margin to align bottom of container to bottom of overline
  margin-top: -38px;
  width: 103px;
  height: 22px;

  @media ${theme.screenSize.mediumAndUp} {
    display: none;
  }
`;

const buttonStyle = css`
  width: 100%;
`;

export const MPTNextLinkMini = () => {
  const activeTutorial = useActiveMpTutorial();
  const showNext = useShouldShowNext();

  if (!showNext) {
    return null;
  }

  return (
    <div className={baseStyle} onClick={() => reportMPTAnalytics(activeTutorial?.next?.targetSlug ?? '', 'mini')}>
      <Button
        className={cx(buttonStyle, navLinkButtonStyle)}
        as={Link}
        href={activeTutorial?.next?.targetSlug}
        title={LINK_TITLE}
        leftGlyph={<Icon glyph={glyphs.ArrowRight.displayName ?? 'ArrowRight'} />}
        size="xsmall"
      >
        {LINK_TITLE}
      </Button>
    </div>
  );
};
