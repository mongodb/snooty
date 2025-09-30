import React, { useContext, lazy } from 'react';
import Button from '@leafygreen-ui/button';
import { cx } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import { Overline } from '@leafygreen-ui/typography';
import IconButton from '@leafygreen-ui/icon-button';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { isOfflineDocsBuild } from '../../utils/is-offline-docs-build';
import { getCurrLocale } from '../../utils/locale';
import { reportAnalytics } from '../../utils/report-analytics';
import { PageTemplateType } from '../../context/page-context';
import { SidenavContext } from '../Sidenav';
import { SuspenseHelper } from '../SuspenseHelper';
import { useChatbotModal } from '../../context/chatbot-context';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import DarkModeDropdown from './DarkModeDropdown';
import SearchInput from './SearchInput';
import {
  ActionBarSearchContainer,
  ActionsBox,
  actionBarStyling,
  getContainerStyling,
  offlineStyling,
  overlineStyling,
  chatbotButtonStyling,
  chatbotMobileButtonStyling,
} from './styles';

const Chatbot = lazy(() => import('mongodb-chatbot-ui'));
const ChatbotModal = lazy(() => import('./ChatbotModal'));

const CHATBOT_TEXT = 'Ask MongoDB AI';

interface ActionBarProps {
  template: PageTemplateType;
  slug: string;
  sidenav: boolean;
  className?: string;
}

const ActionBar = ({ template, slug, sidenav, className }: ActionBarProps) => {
  const { setChatbotClicked } = useChatbotModal();
  const locale = getCurrLocale();
  const { snootyEnv } = useSiteMetadata();
  const CHATBOT_SERVER_BASE_URL = ['dotcomprd', 'production'].includes(snootyEnv)
    ? 'https://knowledge.mongodb.com/api/v1'
    : 'https://knowledge.staging.corp.mongodb.com/api/v1';
  const { fakeColumns, containerClassname, searchContainerClassname } = getContainerStyling(template);
  const { darkMode } = useDarkMode();
  const { hideMobile, setHideMobile } = useContext(SidenavContext);

  const openChatbot = () => {
    reportAnalytics('CTA Click', {
      properties: {
        position: 'secondary nav',
        position_context: '',
        label: 'Ask MongoDB AI',
        label_text_displayed: 'Ask MongoDB AI',
      },
    });
    setChatbotClicked(true);
  };

  return (
    <div className={cx(className, actionBarStyling, containerClassname, isOfflineDocsBuild ? offlineStyling : '')}>
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
          {locale === 'en-us' && (
            <>
              <Button
                className={cx(chatbotButtonStyling)}
                leftGlyph={<Icon glyph="Sparkle" />}
                aria-label={CHATBOT_TEXT}
                variant={'primaryOutline'}
                onClick={openChatbot}
              >
                {CHATBOT_TEXT}
              </Button>
              <IconButton className={chatbotMobileButtonStyling} aria-label={CHATBOT_TEXT} onClick={openChatbot}>
                <Icon glyph={'Sparkle'} />
              </IconButton>
              <SuspenseHelper fallback={null}>
                <Chatbot serverBaseUrl={CHATBOT_SERVER_BASE_URL} darkMode={darkMode}>
                  <ChatbotModal />
                </Chatbot>
              </SuspenseHelper>
            </>
          )}
          {template !== 'openapi' && <DarkModeDropdown />}
        </ActionsBox>
      )}
    </div>
  );
};

export default ActionBar;
