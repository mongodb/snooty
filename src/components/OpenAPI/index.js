import React from 'react';
import PropTypes from 'prop-types';
import { Global } from '@emotion/react';
import OpenAPIClientSide from './OpenAPIClientSide';
import OpenAPIStatic from './OpenAPIStatic';
import { getGlobalCss } from './styles';
import useStickyTopValues from '../../hooks/useStickyTopValues';

const OpenAPI = ({ metadata, nodeData, ...rest }) => {
  const { options } = nodeData;
  const renderClientSide = !!options['preview'];
  const topValues = useStickyTopValues();

  const componentToRender = renderClientSide ? (
    <OpenAPIClientSide metadata={metadata} nodeData={nodeData} {...rest} />
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
