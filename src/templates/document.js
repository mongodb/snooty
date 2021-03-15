import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import Breadcrumbs from '../components/Breadcrumbs';
import Contents from '../components/Contents';
import InternalPageNav from '../components/InternalPageNav';
import MainColumn from '../components/MainColumn';
import RightColumn from '../components/RightColumn';
import TabSelectors from '../components/TabSelectors';
import { TEMPLATE_CLASSNAME } from '../constants';
import { getNestedValue } from '../utils/get-nested-value';

const Document = ({
  children,
  className,
  pageContext: {
    slug,
    page,
    metadata: { parentPaths, slugToTitle: slugTitleMapping, toctreeOrder },
  },
}) => {
  const pageOptions = page?.options;
  const showPrevNext = !(pageOptions && pageOptions.noprevnext === '');

  return (
    <div
      className={`${TEMPLATE_CLASSNAME} ${className}`}
      css={css`
        display: grid;
        grid-template-areas: 'main right';
        grid-template-columns: minmax(0px, 830px) auto;
      `}
    >
      <MainColumn
        css={css`
          grid-area: main;
        `}
      >
        <div
          className="body"
          css={css`
            margin-left: 25px;
          `}
        >
          <Breadcrumbs parentPaths={getNestedValue([slug], parentPaths)} slugTitleMapping={slugTitleMapping} />
          {children}
          {showPrevNext && (
            <InternalPageNav slug={slug} slugTitleMapping={slugTitleMapping} toctreeOrder={toctreeOrder} />
          )}
        </div>
      </MainColumn>
      <RightColumn
        css={css`
          grid-area: right;
        `}
      >
        <TabSelectors />
        <Contents />
      </RightColumn>
    </div>
  );
};

Document.propTypes = {
  className: PropTypes.string,
  pageContext: PropTypes.shape({
    page: PropTypes.shape({
      children: PropTypes.array,
      options: PropTypes.object,
    }).isRequired,
    parentPaths: PropTypes.arrayOf(PropTypes.string),
    slug: PropTypes.string.isRequired,
    slugTitleMapping: PropTypes.shape({
      [PropTypes.string]: PropTypes.string,
    }),
    toctree: PropTypes.object,
    toctreeOrder: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default Document;
