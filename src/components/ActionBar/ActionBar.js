import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { cx } from '@leafygreen-ui/emotion';
import { theme } from '../../theme/docsTheme';
import { isBrowser } from '../../utils/is-browser';
import { getPlaintext } from '../../utils/get-plaintext';
import { getNestedValue } from '../../utils/get-nested-value';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import {
  FeedbackProvider,
  FeedbackForm,
  FeedbackButton,
  useFeedbackData,
  FeedbackContainer,
} from '../Widgets/FeedbackWidget';
import DarkModeDropdown from './DarkModeDropdown';
import SearchInput from './SearchInput';
import { actionsBoxStyling, actionBarStyling, getContainerStyling } from './styles';

const ActionBarSearchContainer = styled.div`
  align-items: center;
  display: flex;
  width: 80%;

  @media ${theme.screenSize.upToLarge} {
    max-width: 340px;
  }

  @media ${theme.screenSize.upToMedium} {
    width: 100%;
  }

  @media ${theme.screenSize.upToSmall} {
    & > div {
      padding: ${theme.size.default} ${theme.size.large};
    }
  }
`;

const ActionsBox = styled('div')`
  display: flex;
  align-items: center;
  column-gap: ${theme.size.default};
`;

// Note: When working on this component further, please check with design on how it should look in the errorpage template (404) as well!
const ActionBar = ({ template, slug, ...props }) => {
  const url = isBrowser ? window.location.href : null;
  const metadata = useSnootyMetadata();
  const feedbackData = useFeedbackData({
    slug,
    url,
    title:
      getPlaintext(getNestedValue(['slugToTitle', slug === '/' ? 'index' : slug], metadata)) || 'MongoDB Documentation',
  });

  const { fakeColumns, containerClassname, searchContainerClassname } = getContainerStyling(template);

  return (
    <div className={cx(props.className, actionBarStyling, containerClassname)}>
      {fakeColumns && <div></div>}
      <ActionBarSearchContainer className={cx(searchContainerClassname)}>
        <SearchInput />
      </ActionBarSearchContainer>
      <ActionsBox className={cx(actionsBoxStyling)}>
        <DarkModeDropdown></DarkModeDropdown>
        {template !== 'errorpage' && (
          <FeedbackProvider page={feedbackData}>
            <FeedbackContainer>
              <FeedbackButton />
              <FeedbackForm />
            </FeedbackContainer>
          </FeedbackProvider>
        )}
      </ActionsBox>
    </div>
  );
};

ActionBar.propTypes = {
  template: PropTypes.string,
  slug: PropTypes.string,
};

export default ActionBar;
