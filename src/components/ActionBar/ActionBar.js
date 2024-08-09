import React, { lazy } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
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
// import { SuspenseHelper } from '../SuspenseHelper';

const SearchBar = lazy(() => import('./SearchInput'));
const Chatbot = lazy(() => import('mongodb-chatbot-ui'));

const ActionBarContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  padding-top: ${theme.size.small};
  padding-bottom: ${theme.size.small};
  padding-right: ${theme.size.large};
  width: 100%;
  position: sticky;
  top: 0;
  flex-wrap: wrap;
  z-index: ${theme.zIndexes.actionBar};
  background-color: var(--background-color-primary);
  border-bottom: 1px solid var(--border-color);

  --border-color: ${palette.gray.light2};

  .dark-theme & {
    --border-color: ${palette.gray.dark2};
  }

  @media ${theme.screenSize.mediumAndUp} {
    & > div {
      flex: 0 1 auto;
    }
  }

  @media ${theme.screenSize.upToMedium} {
    justify-content: space-between;
    padding-right: 0;
  }
`;

const ActionBarSearchContainer = styled.div`
  align-items: center;
  display: flex;
  width: 80%;
  margin-left: ${theme.size.xlarge};

  @media ${theme.screenSize.upToMedium} {
    width: 100%;
  }

  @media ${theme.screenSize.upToSmall} {
    & > div {
      padding: ${theme.size.default} 32px;
    }
  }
`;

const ActionsBox = styled('div')`
  display: flex;
  align-items: center;
  column-gap: ${theme.size.default};

  @media ${theme.screenSize.upToMedium} {
    padding-left: 3rem;
  }

  @media ${theme.screenSize.upToSmall} {
    padding-left: 2rem;
  }
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
  return (
    <ActionBarContainer className={props.className}>
      <ActionBarSearchContainer>
        <Chatbot serverBaseUrl={'https://knowledge.staging.corp.mongodb.com/api/v1'}>
          <SearchBar />
        </Chatbot>
      </ActionBarSearchContainer>
      <ActionsBox>
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
    </ActionBarContainer>
  );
};

ActionBar.propTypes = {
  template: PropTypes.string,
  slug: PropTypes.string,
};

export default ActionBar;
