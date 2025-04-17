import React from 'react';
import styled from '@emotion/styled';
import Button, { Variant } from '@leafygreen-ui/button';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { displayNone } from '../../../utils/display-none';
import { useFeedbackContext } from './context';
import { FEEDBACK_BUTTON_TEXT } from './constants';

const darkModePrestyling = css`
  .dark-theme & {
    color: ${palette.white};
    border-color: ${palette.gray.base};
    background-color: ${palette.gray.dark2};

    svg {
      color: ${palette.white};
    }
  }
`;

const ButtonContainer = styled.div`
  align-items: center;
  display: flex;
`;

const FeedbackButton = () => {
  const { initializeFeedback, abandon, feedback } = useFeedbackContext();
  return (
    <ButtonContainer>
      <Button
        aria-label={'Submit Feedback'}
        className={cx(
          darkModePrestyling,
          css`
            ${displayNone.onMobileAndTablet}
            // For vertical languages (chinese, korean, japanese)
            text-wrap: nowrap;
          `
        )}
        onClick={() => (!feedback ? initializeFeedback() : abandon())}
        variant={Variant.Default}
        leftGlyph={<Icon glyph="Favorite" />}
      >
        {FEEDBACK_BUTTON_TEXT}
      </Button>
      <IconButton
        aria-label="Submit feedback"
        className={cx(
          css`
            ${displayNone.onLargerThanTablet}
          `
        )}
        onClick={() => (!feedback ? initializeFeedback() : abandon())}
      >
        <Icon glyph={'Megaphone'} />
      </IconButton>
    </ButtonContainer>
  );
};

export default FeedbackButton;
