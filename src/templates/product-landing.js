import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../components/Sidebar';
import style from '../styles/navigation.module.css';
import styled from '@emotion/styled';
import useScreenSize from '../hooks/useScreenSize.js';
import { Global, css } from '@emotion/core';
import { Helmet } from 'react-helmet';
import { isBrowser } from '../utils/is-browser.js';
import { uiColors } from '@leafygreen-ui/palette';
import { useTheme } from 'emotion-theming';

const Wrapper = styled('main')`
  margin: ${({ theme }) => `calc(${theme.navbar.height} + ${theme.size.large}) auto ${theme.size.xlarge} auto`};
  max-width: 1150px;
  padding: 0 ${({ theme }) => `${theme.size.medium}`};
  @media ${({ theme }) => theme.screenSize.upToLarge} {
    max-width: 748px;
  }
  @media ${({ theme }) => theme.screenSize.upToMedium} {
    padding: 0;
  }
  & > section,
  & > section > section {
    display: grid;
    grid-template-columns: repeat(12, [col-span] 1fr);
    grid-column: 1/-1;
    @media ${({ theme }) => theme.screenSize.upToMedium} {
      grid-template-columns: ${({ theme }) => `${theme.size.medium} 1fr ${theme.size.medium}`};
    }
  }
`;

const ProductLanding = ({
  children,
  pageContext: {
    slug,
    metadata: { parentPaths, publishedBranches, slugToTitle: slugTitleMapping, toctree, toctreeOrder },
  },
}) => {
  const { fontSize, screenSize, size } = useTheme();
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
    <>
      <Helmet>
        <title>MongoDB Documentation</title>
      </Helmet>
      <div>
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
      </div>
      {(!isBrowser || !showLeftColumn) && (
        <span className={`showNav ${style.showNav} ${renderStatus}`} id="showNav" onClick={toggleLeftColumn}>
          Navigation
        </span>
      )}
      <Wrapper id="main-column" className="main-column">
        {children}
      </Wrapper>
      <Global
        styles={css`
          h1,
          h2,
          h3,
          h4,
          h6 {
            color: ${uiColors.black};
            font-weight: bold;
          }
          h1 {
            font-size: ${fontSize.h2};
          }
          h2 {
            font-size: 21px;
            margin-top: ${size.small};
            margin-bottom: ${size.default};
          }
          .kicker {
            color: ${uiColors.gray.dark1};
            padding-top: 80px;
            font-size: 14px;
          }
          p {
            color: ${uiColors.black};
            font-size: ${fontSize.default};
            letter-spacing: 0.5px;
            margin-bottom: ${size.default};
          }
          a {
            color: ${uiColors.blue.base};
            font-size: ${fontSize.default};
            letter-spacing: 0.5px;
          }
          a:hover {
            text-decoration: none;
          }
          h1 {
            align-self: end;
          }
          .span-columns {
            grid-column: 2 / 11 !important;
            margin: ${size.xlarge} 0;
          }
          section > * {
            grid-column-start: 1;
            grid-column-end: 7;
            @media ${screenSize.upToMedium} {
              grid-column: 2/-2;
            }
          }
          @media ${screenSize.upToLarge} {
            .footer {
              padding: ${size.medium};
            }
          }
          @media ${screenSize.mediumAndUp} {
            .right-column {
              grid-column: 7 / -1 !important;
              grid-row-start: 1 !important;
              grid-row-end: 3 !important;
            }
          }
          @media ${screenSize.largeAndUp} {
            .right-column {
              grid-column: 9 / -1 !important;
            }
          }
        `}
      />
    </>
  );
};

ProductLanding.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default ProductLanding;
