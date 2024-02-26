import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import { palette } from '@leafygreen-ui/palette';
import { SideNavItem } from '@leafygreen-ui/side-nav';
import Link from '../Link';
import { useNavigationParents } from '../../hooks/use-navigation-parents';
import { baseUrl } from '../../utils/base-url';
import { theme } from '../../theme/docsTheme';
import { formatText } from '../../utils/format-text';
import { sideNavItemBasePadding } from './styles/sideNavItem';

const backButtonStyling = css`
  font-size: ${theme.fontSize.small};
  margin-bottom: 16px;
  font-weight: 400;
  line-height: 20px;
  > span {
    color: ${palette.gray.dark1};
  }
`;

const htmlBackIcon = css`
  margin-right: ${theme.size.small};
`;

const SidenavBackButton = ({
  border,
  currentSlug,
  enableGlyph = true,
  handleClick,
  project,
  target,
  titleOverride,
  eol,
  ...props
}) => {
  const parents = useNavigationParents(project);
  const glyph = enableGlyph ? <Icon glyph="ArrowLeft" size="small" /> : null;
  let title = titleOverride;
  let url = target;

  // Fetch page to navigate to using parent category page(s)
  if (!titleOverride) {
    if (project === 'landing') {
      const landingExceptions = ['/', 'search'];

      if (landingExceptions.includes(currentSlug)) {
        // At homepage; nothing to link back to
        return null;
      }

      title = 'home';
      url = '/';
    } else if (parents.length) {
      [{ title, url }] = parents.slice(-1);
    } else {
      title = 'docs home';
      url = baseUrl();
    }
  }

  if (!title || !title.length || !url) {
    return null;
  }

  let textShown = 'Back to ';
  if (eol) {
    url = 'https://docs.mongodb.com/legacy/';
    textShown = 'Return to Documentation';
  }

  return (
    <>
      <SideNavItem
        as={Link}
        className={cx([sideNavItemBasePadding, backButtonStyling])}
        to={url}
        glyph={glyph}
        onClick={handleClick}
        {...props}
      >
        {/*
         * Uses HTML/text-based arrow instead of LG icon as a workaround for a bug where the
         * icon can be rendered twice (see: OpenAPI component)
         */}
        {!enableGlyph && <span className={cx(htmlBackIcon)}>&#8592;</span>}
        {textShown} {!eol && formatText(title)}
      </SideNavItem>
      {border}
    </>
  );
};

SidenavBackButton.propTypes = {
  border: PropTypes.element,
  currentSlug: PropTypes.string,
  handleClick: PropTypes.func,
  project: PropTypes.string,
  target: PropTypes.string,
  titleOverride: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.string]),
  eol: PropTypes.bool,
};

export default SidenavBackButton;
