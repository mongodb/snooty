import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import Breadcrumbs from '../components/Breadcrumbs';
import Contents from '../components/Contents';
import InternalPageNav from '../components/InternalPageNav';
import MainColumn from '../components/MainColumn';
import RightColumn from '../components/RightColumn';
import TabSelectors from '../components/TabSelectors';
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
    <div className={['content', className].join(' ')}>
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
