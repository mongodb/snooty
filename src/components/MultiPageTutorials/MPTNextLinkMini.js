import React from 'react';
import Icon, { glyphs } from '@leafygreen-ui/icon';
import { css } from '@leafygreen-ui/emotion';
import Button from '@leafygreen-ui/button';
import { useActiveMPTutorial } from '../../hooks/use-active-mp-tutorial';
import { theme } from '../../theme/docsTheme';
import Link from '../Link';
import { usePageContext } from '../../context/page-context';
import { shouldShowNext } from './utils';
import { LINK_TITLE } from './constants';

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

const MPTNextLinkMini = () => {
  const { options } = usePageContext();
  const activeTutorial = useActiveMPTutorial();

  if (!shouldShowNext(activeTutorial, options)) {
    return null;
  }

  return (
    <div className={baseStyle}>
      <Button
        className={buttonStyle}
        as={Link}
        to={activeTutorial.next.targetSlug}
        title={LINK_TITLE}
        leftGlyph={<Icon glyph={glyphs.ArrowRight.displayName} />}
        size="xsmall"
      >
        {LINK_TITLE}
      </Button>
    </div>
  );
};

export default MPTNextLinkMini;
