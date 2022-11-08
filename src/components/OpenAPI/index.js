import React from 'react';
import PropTypes from 'prop-types';
import { Global } from '@emotion/react';
import OpenAPIPreview from './OpenAPIPreview';
import OpenAPIStatic from './OpenAPIStatic';
import { getGlobalCss } from './styles';
import useStickyTopValues from '../../hooks/useStickyTopValues';

// Important notes:
// The contents of this file are (unfortunately) a hacky and brittle way of getting Redoc's React component to
// look like our docs while maintaining the same workflow and processes for delivering docs.
// CSS selectors were declared as specific as possible while also being flexible enough for reusable components.
// Upgrading our version of Redoc may result in broken css rules, so please double-check afterwards.

const OpenAPI = ({ metadata, nodeData, ...rest }) => {
  const { options } = nodeData;
  const isPreview = options['preview'];
  const topValues = useStickyTopValues();

  const componentToRender = isPreview ? (
    <OpenAPIPreview metadata={metadata} nodeData={nodeData} {...rest} />
  ) : (
    <OpenAPIStatic metadata={metadata} />
  );

  return (
    <>
      <Global styles={getGlobalCss(topValues)} />
      {componentToRender}
    </>
  );
};

OpenAPI.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.object,
  }).isRequired,
};

export default OpenAPI;
