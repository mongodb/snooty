import React, { lazy } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { cx } from '@leafygreen-ui/emotion';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
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
import { SuspenseHelper } from '../SuspenseHelper';
import DarkModeDropdown from './DarkModeDropdown';
import { actionsBoxStyling, actionBarStyling, getContainerStyling } from './styles';

const SearchBar = lazy(() => import('./SearchInput'));
const Chatbot = lazy(() => import('mongodb-chatbot-ui'));

const ActionBarSearchContainer = styled.div`
  align-items: center;
  display: flex;
  width: 80%;

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

  const { darkMode } = useDarkMode();

  const { fakeColumns, containerClassname, searchContainerClassname } = getContainerStyling(template);

  const CHATBOT_SERVER_BASE_URL =
    metadata?.snootyEnv === 'dotcomprd'
      ? 'https://knowledge.mongodb.com/api/v1'
      : 'https://knowledge.staging.corp.mongodb.com/api/v1';

  return (
    <div className={cx(props.className, actionBarStyling, containerClassname)}>
      {fakeColumns && <div></div>}
      <ActionBarSearchContainer className={cx(searchContainerClassname)}>
        <SuspenseHelper>
          <Chatbot serverBaseUrl={CHATBOT_SERVER_BASE_URL} darkMode={darkMode}>
            <SearchBar />
          </Chatbot>
        </SuspenseHelper>
      </ActionBarSearchContainer>
      <ActionsBox className={cx(actionsBoxStyling({ fakeColumns }))}>
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
