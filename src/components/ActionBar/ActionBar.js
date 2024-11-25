import React, { lazy, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Button from '@leafygreen-ui/button';
import { cx } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import { Overline } from '@leafygreen-ui/typography';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { isBrowser } from '../../utils/is-browser';
import { getPlaintext } from '../../utils/get-plaintext';
import { getNestedValue } from '../../utils/get-nested-value';
import { isOfflineDocsBuild } from '../../utils/is-offline-docs-build';
import { getCurrLocale } from '../../utils/locale';
import { reportAnalytics } from '../../utils/report-analytics';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { SidenavContext } from '../Sidenav';
import {
  FeedbackProvider,
  FeedbackForm,
  FeedbackButton,
  useFeedbackData,
  FeedbackContainer,
} from '../Widgets/FeedbackWidget';
import { SuspenseHelper } from '../SuspenseHelper';
import DarkModeDropdown from './DarkModeDropdown';
import SearchInput from './SearchInput';
import {
  ActionBarSearchContainer,
  ActionsBox,
  actionBarStyling,
  getContainerStyling,
  offlineStyling,
  overlineStyling,
  buttonStyling,
} from './styles';

const Chatbot = lazy(() => import('mongodb-chatbot-ui'));
const LazyChatbot = lazy(() => import('./LazyChatbot'));

export const DEPRECATED_PROJECTS = ['atlas-app-services', 'datalake', 'realm'];

const ActionBar = ({ template, slug, sidenav, ...props }) => {
  const url = isBrowser ? window.location.href : null;
  const metadata = useSnootyMetadata();
  const [chatbotClicked, setChatbotClicked] = useState(false);
  const locale = getCurrLocale();
  const feedbackData = useFeedbackData({
    slug,
    url,
    title:
      getPlaintext(getNestedValue(['slugToTitle', slug === '/' ? 'index' : slug], metadata)) || 'MongoDB Documentation',
  });

  const { fakeColumns, containerClassname, searchContainerClassname } = getContainerStyling(template);

  const { hideMobile, setHideMobile } = useContext(SidenavContext);

  const onClick = () => {
    reportAnalytics('Chatbot button clicked');
    setChatbotClicked((currVal) => !currVal);
  };
  const { snootyEnv } = useSiteMetadata();
  const { darkMode } = useDarkMode();
  const CHATBOT_SERVER_BASE_URL = ['dotcomprd', 'production'].includes(snootyEnv)
    ? 'https://knowledge.mongodb.com/api/v1'
    : 'https://knowledge.staging.corp.mongodb.com/api/v1';

  return (
    <div
      className={cx(props.className, actionBarStyling, containerClassname, isOfflineDocsBuild ? offlineStyling : '')}
    >
      {fakeColumns && <div></div>}
      <ActionBarSearchContainer className={cx(searchContainerClassname)}>
        {sidenav && (
          <Overline className={cx(overlineStyling)} onClick={() => setHideMobile((state) => !state)}>
            <Icon glyph={hideMobile ? 'ChevronDown' : 'ChevronUp'} />
            Docs Menu
          </Overline>
        )}
        {!isOfflineDocsBuild && <SearchInput slug={slug} />}
      </ActionBarSearchContainer>
      {!isOfflineDocsBuild && (
        <ActionsBox>
          {template !== 'openapi' && <DarkModeDropdown />}
          {locale === 'en-us' && (
            <Button
              className={cx(buttonStyling)}
              leftGlyph={<Icon glyph="Sparkle" />}
              aria-label={'Ask MongoDB AI'}
              variant={'primaryOutline'}
              onClick={onClick}
            >
              Ask Mongodb AI
            </Button>
          )}
          {locale === 'en-us' && (
            <SuspenseHelper>
              <Chatbot serverBaseUrl={CHATBOT_SERVER_BASE_URL} darkMode={darkMode}>
                <LazyChatbot chatbotClicked={chatbotClicked} setChatbotClicked={setChatbotClicked} />
              </Chatbot>
            </SuspenseHelper>
          )}

          {template !== 'errorpage' && !DEPRECATED_PROJECTS.includes(metadata.project) && (
            <FeedbackProvider page={feedbackData}>
              <FeedbackContainer>
                <FeedbackButton />
                <FeedbackForm />
              </FeedbackContainer>
            </FeedbackProvider>
          )}
        </ActionsBox>
      )}
    </div>
  );
};

ActionBar.propTypes = {
  template: PropTypes.string,
  slug: PropTypes.string.isRequired,
  sidenav: PropTypes.bool.isRequired,
};

export default ActionBar;
