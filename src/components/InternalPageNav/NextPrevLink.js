import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import Button from '@leafygreen-ui/button';
import { Body } from '@leafygreen-ui/typography';
import Icon from '@leafygreen-ui/icon';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';

const commonTextStyles = css`
  font-size: ${theme.fontSize.small};
  line-height: 20px;
`;

const nextPrevTextStyling = css`
  ${commonTextStyles}
  font-weight: 500;
`;

const nextTextStyling = css`
  text-align: end;
`;

const prevTextStyling = css`
  text-align: start;
`;

const nextPrevTitleTextStyling = css`
  ${commonTextStyles}
  color: ${palette.gray.base};
`;

const commonLinkContentContainerStyling = css`
  align-items: center;
  display: flex;
  column-gap: 14px;
`;

const nextLinkContainerStyling = css`
  ${commonLinkContentContainerStyling}
  flex-direction: row-reverse;
`;

const prevLinkContainerStyling = css`
  ${commonLinkContentContainerStyling}
  flex-direction: row;
`;

const NextPrevLink = ({ icon, direction, pageTitle }) => {
  const isNext = direction?.toLowerCase() === 'next';
  const isPrev = direction?.toLowerCase() === 'back';

  return (
    <div className={cx({ [nextLinkContainerStyling]: isNext, [prevLinkContainerStyling]: isPrev })}>
      <Button size="large">
        <Icon glyph={icon} />
      </Button>
      <div className={cx({ [nextTextStyling]: isNext }, { [prevTextStyling]: isPrev })}>
        <Body className={cx(nextPrevTextStyling)}>{direction}</Body>
        <Body className={cx(nextPrevTitleTextStyling)}>{pageTitle}</Body>
      </div>
    </div>
  );
};

export default NextPrevLink;
