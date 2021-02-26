import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { getNestedValue } from '../utils/get-nested-value';
import Breadcrumbs from '../components/Breadcrumbs';
import InternalPageNav from '../components/InternalPageNav';
import RightColumn from '../components/RightColumn';
import TabSelectors from '../components/TabSelectors';
import Contents from '../components/Contents';
import MainColumn from '../components/MainColumn';

const Document = ({
  children,
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
      className="content"
      css={css`
        grid-area: contents;
        overflow-y: auto;
        margin: 0px;
      `}
    >
      <MainColumn>
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
      <RightColumn>
        <TabSelectors />
        <Contents />
      </RightColumn>
    </div>
  );
};

Document.propTypes = {
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
