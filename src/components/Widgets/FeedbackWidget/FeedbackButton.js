import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import Icon from '@leafygreen-ui/icon';
import { Theme } from '@leafygreen-ui/lib';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { theme } from '../../../../src/theme/docsTheme';
import { useFeedbackContext } from './context';
import { FEEDBACK_BUTTON_TEXT } from './constants';

const FEEDBACK_FAB_COLORS = {
  [Theme.Light]: {
    color: palette.blue.dark1,
    bgColor: palette.white,
    boxShadow: `0px 4px 10px -4px ${palette.gray.light2}`,
    boxShadowOnHover: `0px 0px 0px 3px ${palette.blue.light2}`,
  },
  [Theme.Dark]: {
    color: palette.blue.light1,
    bgColor: palette.gray.dark4,
    boxShadow: 'none',
    boxShadowOnHover: `0px 0px 0px 3px ${palette.blue.dark2}`,
  },
};

const containerStyle = (darkTheme) => css`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 12px ${theme.size.default};
  background-color: ${FEEDBACK_FAB_COLORS[darkTheme].bgColor};
  border: 1px solid ${palette.blue.light1};
  border-radius: 40px;
  box-shadow: ${FEEDBACK_FAB_COLORS[darkTheme].boxShadow};
  z-index: 9;
  color: ${FEEDBACK_FAB_COLORS[darkTheme].color};
  font-weight: 600;
  font-size: 13px;
  line-height: 20px;

  :hover {
    box-shadow: ${FEEDBACK_FAB_COLORS[darkTheme].boxShadowOnHover};
  }

  @media ${theme.screenSize.upToSmall} {
    bottom: ${theme.size.medium};
    right: ${theme.size.medium};
  }
`;

const starIconStyle = css`
  color: ${palette.blue.light1};
`;

const FeedbackButton = () => {
  const { theme } = useDarkMode();
  const { feedback, initializeFeedback } = useFeedbackContext();
  return (
    !feedback && (
      <button className={cx(containerStyle(theme))} onClick={() => initializeFeedback()}>
        <Icon className={starIconStyle} glyph="Favorite" />
        {FEEDBACK_BUTTON_TEXT}
      </button>
    )
  );
};

export default FeedbackButton;
