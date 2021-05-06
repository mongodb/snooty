import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import { isBrowser } from '../utils/is-browser.js';
import { theme } from '../theme/docsTheme.js';
import Sidebar from '../components/Sidebar';
import style from '../styles/navigation.module.css';
import useScreenSize from '../hooks/useScreenSize.js';

const Wrapper = styled('main')`
  color: ${uiColors.black};
  margin: calc(${theme.navbar.height} + ${theme.size.large}) auto ${theme.size.xlarge} auto;
  max-width: 1200px;
  width: 100%;
  overflow-x: scroll;
  padding: 0 ${theme.size.large} 0 ${theme.size.xlarge};

  @media ${theme.screenSize.upToMedium} {
    padding: 0 ${theme.size.medium} 0 48px;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
  }

  h1 {
    font-size: ${theme.fontSize.h2};
    margin-bottom: ${theme.size.default};
  }

  h2 {
    font-size: 21px;
    margin-top: 0px;
    margin-bottom: ${theme.size.default};
  }

  section {
    max-width: 100%;
  }

  section p {
    font-size: ${theme.fontSize.default};
    letter-spacing: 0.5px;
    margin-bottom: ${theme.size.small};
    max-width: 500px;
  }

  section p > a {
    color: ${uiColors.blue.base};
    font-size: ${theme.fontSize.default};
    letter-spacing: 0.5px;
    :hover {
      text-decoration: none;
    }
  }

  & > section {
    h1 {
      align-self: end;
    }

    & > img {
      display: block;
      margin: auto;
      max-width: 600px;
      width: 100%;
    }

    ${'' /* Split the content into two columns on large screens. */}
    @media ${theme.screenSize.largeAndUp} {
      display: grid;
      grid-template-columns: 1fr 1fr;

      & > h1,
      & > .introduction {
        grid-column: 1;
      }

      & > img {
        grid-column: 2;
        grid-row: 1 / span 2;
      }

      ${'' /* Sub-sections should take up the full width of the main section */}
      & > section {
        grid-column: 1 / -1;
      }
    }
  }
`;

const ProductLanding = ({
  children,
  pageContext: {
    slug,
    metadata: { publishedBranches, toctree },
  },
}) => {
  const { isTabletOrMobile } = useScreenSize();
  const [showLeftColumn, setShowLeftColumn] = useState(!isTabletOrMobile);
  /* Add the postRender CSS class without disturbing pre-render functionality */
  const renderStatus = isBrowser ? style.postRender : '';

  const toggleLeftColumn = () => {
    setShowLeftColumn(!showLeftColumn);
  };

  useEffect(() => {
    setShowLeftColumn(!isTabletOrMobile);
  }, [isTabletOrMobile]);

  return (
    <div className="content">
      {(!isBrowser || showLeftColumn) && (
        <div className={`left-column ${style.leftColumn} ${renderStatus}`} id="left-column">
          <Sidebar
            slug={slug}
            publishedBranches={publishedBranches}
            toctreeData={toctree}
            toggleLeftColumn={toggleLeftColumn}
          />
        </div>
      )}
      <>
        {(!isBrowser || !showLeftColumn) && (
          <div className={`showNav ${style.showNav} ${renderStatus}`} id="showNav" onClick={toggleLeftColumn}>
            Navigation
          </div>
        )}
        <Wrapper>{children}</Wrapper>
      </>
    </div>
  );
};

ProductLanding.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  pageContext: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    toctree: PropTypes.object,
  }).isRequired,
};

export default ProductLanding;
