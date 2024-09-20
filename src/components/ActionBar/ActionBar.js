import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { cx } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import { Overline } from '@leafygreen-ui/typography';
import { isBrowser } from '../../utils/is-browser';
import { getPlaintext } from '../../utils/get-plaintext';
import { getNestedValue } from '../../utils/get-nested-value';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { SidenavContext } from '../Sidenav';
import {
  FeedbackProvider,
  FeedbackForm,
  FeedbackButton,
  useFeedbackData,
  FeedbackContainer,
} from '../Widgets/FeedbackWidget';
import DarkModeDropdown from './DarkModeDropdown';
import SearchInput from './SearchInput';
import { ActionBarSearchContainer, ActionsBox, actionBarStyling, getContainerStyling, overlineStyling } from './styles';

const DEPRECATED_PROJECTS = ['atlas-app-services', 'datalake', 'realm'];

const ActionBar = ({ template, slug, sidenav, ...props }) => {
  const url = isBrowser ? window.location.href : null;
  const metadata = useSnootyMetadata();
  const feedbackData = useFeedbackData({
    slug,
    url,
    title:
      getPlaintext(getNestedValue(['slugToTitle', slug === '/' ? 'index' : slug], metadata)) || 'MongoDB Documentation',
  });

  const { fakeColumns, containerClassname, searchContainerClassname } = getContainerStyling(template);

  const { hideMobile, setHideMobile } = useContext(SidenavContext);

  return (
    <div className={cx(props.className, actionBarStyling, containerClassname)}>
      {fakeColumns && <div></div>}
      <ActionBarSearchContainer className={cx(searchContainerClassname)}>
        {sidenav && (
          <Overline className={cx(overlineStyling)} onClick={() => setHideMobile((state) => !state)}>
            <Icon glyph={hideMobile ? 'ChevronDown' : 'ChevronUp'} />
            Docs Menu
          </Overline>
        )}
        <SearchInput slug={slug} />
      </ActionBarSearchContainer>
      <ActionsBox>
        {template !== 'openapi' && <DarkModeDropdown />}
        {template !== 'errorpage' && !DEPRECATED_PROJECTS.includes(metadata.project) && (
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
  template: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  sidenav: PropTypes.bool.isRequired,
};

export default ActionBar;
