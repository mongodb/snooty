import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import { SideNav as LeafygreenSideNav, SideNavItem } from '@leafygreen-ui/side-nav';
import { uiColors } from '@leafygreen-ui/palette';
import IA from './IA';
import IATransition from './IATransition';
import { NavigationContext } from './navigation-context.js';
import ProductsList from './ProductsList';
import SidebarBack from './SidebarBack';
import { theme } from '../theme/docsTheme';
import { formatText } from '../utils/format-text';

const StyledLeafygreenSideNav = styled(LeafygreenSideNav)`
  grid-area: sidebar;
  z-index: 1;

  // Allows Spaceholder element to flex grow for AdditionalLinks
  & > div > nav > div > ul {
    display: flex;
    flex-direction: column;
  }

  a,
  p {
    letter-spacing: unset;
  }

  // TODO: Remove when mongodb-docs.css is removed
  a:hover {
    color: ${uiColors.gray.dark2};
  }
`;

const titleStyle = css`
  color: ${uiColors.gray.dark3};
  text-transform: capitalize;
`;

// Allows AdditionalLinks to always be at the bottom of the SideNav
const Spaceholder = styled('div')`
  flex-grow: 1;
`;

const Border = styled('hr')`
  border: unset;
  border-bottom: 1px solid ${uiColors.gray.light2};
  margin: ${theme.size.default} 0;
  width: 100%;
`;

const additionalLinks = [
  { glyph: 'Support', title: 'Contact Support', url: 'https://support.mongodb.com/welcome' },
  { glyph: 'Person', title: 'Join our community', url: 'https://developer.mongodb.com/' },
  { glyph: 'University', title: 'Register for Courses', url: 'https://university.mongodb.com/' },
];

const Sidenav = ({ page, slug }) => {
  const showAllProducts = page?.options?.['nav-show-all-products'];
  const ia = page?.options?.ia;
  const { pageTitle } = useContext(NavigationContext);
  const [back, setBack] = React.useState(null);

  return (
    <StyledLeafygreenSideNav aria-label="Side navigation">
      <IATransition back={back} hasIA={!!ia} slug={slug}>
        <SidebarBack
          border={<Border />}
          handleClick={() => {
            setBack(true);
          }}
          slug={slug}
        />
        {ia && (
          <IA
            header={<span css={titleStyle}>{formatText(pageTitle)}</span>}
            handleClick={() => {
              setBack(false);
            }}
            ia={ia}
          />
        )}
      </IATransition>
      {showAllProducts && <ProductsList />}
      <Spaceholder />
      {additionalLinks.map(({ glyph, title, url }) => (
        <SideNavItem key={url} glyph={<Icon glyph={glyph} />} href={url}>
          {title}
        </SideNavItem>
      ))}
    </StyledLeafygreenSideNav>
  );
};

Sidenav.propTypes = {
  page: PropTypes.shape({
    options: PropTypes.object,
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

export default Sidenav;
