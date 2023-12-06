import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import Icon from '@leafygreen-ui/icon';
import { theme } from '../../../../src/theme/docsTheme';
import { useFeedbackContext } from './context';
import { text } from './constants';

const containerStyle = css`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 12px ${theme.size.default};
  background-color: ${palette.white};
  border: 1px solid ${palette.blue.light1};
  border-radius: 40px;
  box-shadow: 0px 4px 10px -4px ${palette.gray.light2};
  position: fixed;
  z-index: 9;
  bottom: ${theme.size.large};
  right: ${theme.size.large};
  color: ${palette.blue.dark1};
  font-weight: 600;
  font-size: 13px;
  line-height: 20px;

  :hover {
    box-shadow: 0px 0px 0px 3px ${palette.blue.light2};
  }

  @media ${theme.screenSize.upToSmall} {
    bottom: ${theme.size.medium};
    right: ${theme.size.medium};
  }
`;

const starIconStyle = css`
  color: ${palette.blue.light1};
`;

const FeedbackTab = () => {
  const { feedback, initializeFeedback } = useFeedbackContext();
  return (
    !feedback && (
      <div className={cx(containerStyle)} onClick={() => initializeFeedback()}>
        <Icon className={starIconStyle} glyph="Favorite" />
        {text.feedbackButton}
      </div>
    )
  );
};

export default FeedbackTab;
